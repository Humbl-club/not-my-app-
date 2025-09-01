import DOMPurify from 'dompurify';

/**
 * Security Service for input sanitization and validation
 * Implements defense-in-depth security measures for government applications
 */
export class SecurityService {
  
  /**
   * Sanitize user input to prevent XSS attacks
   * Removes all HTML tags and potentially dangerous content
   */
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Remove all HTML tags and dangerous content
    const cleaned = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
    
    // Additional sanitization for common attack vectors
    return cleaned
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  /**
   * Validate and sanitize email addresses
   */
  static validateEmail(email: string): { isValid: boolean; sanitized: string } {
    const sanitized = this.sanitizeInput(email.toLowerCase().trim());
    
    // Strict email regex for government applications
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]{0,63}@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    
    // Additional checks
    const hasValidLength = sanitized.length <= 254; // RFC 5321
    const hasNoDangerousChars = !sanitized.includes('<') && !sanitized.includes('>');
    const matchesRegex = emailRegex.test(sanitized);
    
    return {
      isValid: hasValidLength && hasNoDangerousChars && matchesRegex,
      sanitized
    };
  }
  
  /**
   * Sanitize file names to prevent directory traversal attacks
   */
  static sanitizeFileName(fileName: string): string {
    if (!fileName) return '';
    
    // Remove path components and dangerous characters
    return fileName
      .replace(/^.*[\\\/]/, '') // Remove path
      .replace(/\.{2,}/g, '.') // Prevent directory traversal
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Allow only safe characters
      .substring(0, 255); // Limit length
  }
  
  /**
   * Validate passport names (strict uppercase validation)
   */
  static validatePassportName(name: string): { isValid: boolean; sanitized: string } {
    const sanitized = this.sanitizeInput(name.toUpperCase().trim());
    
    // Passport name regex - only uppercase letters, spaces, hyphens, apostrophes
    const nameRegex = /^[A-Z][A-Z\s'-]{0,49}$/;
    
    return {
      isValid: nameRegex.test(sanitized) && sanitized.length >= 1,
      sanitized
    };
  }
  
  /**
   * Validate passport numbers
   */
  static validatePassportNumber(number: string): { isValid: boolean; sanitized: string } {
    const sanitized = this.sanitizeInput(number.toUpperCase().trim());
    
    // Passport number: 6-10 alphanumeric characters
    const passportRegex = /^[A-Z0-9]{6,10}$/;
    
    return {
      isValid: passportRegex.test(sanitized),
      sanitized
    };
  }
  
  /**
   * Check for XSS patterns
   */
  static hasXSSPatterns(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<embed/gi,
      /<object/gi,
      /document\./gi,
      /window\./gi,
      /eval\(/gi,
      /alert\(/gi,
      /prompt\(/gi,
      /confirm\(/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }
  
  /**
   * Check for SQL injection attempts
   */
  static hasSQLInjectionPatterns(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|FROM|WHERE|ORDER BY|GROUP BY|HAVING)\b)/gi,
      /(-{2}|\/\*|\*\/|;|\||&&|\|\||\\x00|\\x1a)/g,
      /(\'|\"|\`|\\)/g
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }
  
  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  /**
   * Validate CSRF token
   */
  static validateCSRFToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) return false;
    
    // Constant-time comparison to prevent timing attacks
    if (token.length !== storedToken.length) return false;
    
    let result = 0;
    for (let i = 0; i < token.length; i++) {
      result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
    }
    
    return result === 0;
  }
  
  /**
   * Rate limiting check (client-side)
   */
  private static attempts = new Map<string, number[]>();
  
  static checkRateLimit(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 60000
  ): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the time window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
  
  /**
   * Validate file for upload (enhanced security)
   */
  static async validateFile(file: File): Promise<{ isValid: boolean; reason?: string }> {
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { isValid: false, reason: 'File size exceeds 5MB limit' };
    }
    
    // Check file extension
    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension || !allowedExtensions.includes(extension)) {
      return { isValid: false, reason: 'Invalid file type. Only JPG and PNG allowed' };
    }
    
    // Check MIME type
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.type)) {
      return { isValid: false, reason: 'Invalid MIME type' };
    }
    
    // Check magic bytes (file signature)
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // JPEG magic bytes: FF D8 FF
    const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
    
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && 
                  bytes[2] === 0x4E && bytes[3] === 0x47;
    
    if (!isJPEG && !isPNG) {
      return { isValid: false, reason: 'File content does not match expected format' };
    }
    
    return { isValid: true };
  }
  
  /**
   * Strip EXIF data from images for privacy
   */
  static async stripEXIFData(imageDataUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw image without EXIF
          ctx.drawImage(img, 0, 0);
        }
        
        // Convert back to data URL without EXIF
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      
      img.onerror = () => {
        // Return original if stripping fails
        resolve(imageDataUrl);
      };
      
      img.src = imageDataUrl;
    });
  }
  
  /**
   * Encrypt sensitive data for storage
   */
  static async encryptData(data: string, key?: CryptoKey): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
    // Use provided key or generate one
    const cryptoKey = key || await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoder.encode(data)
    );
    
    return { encrypted, iv };
  }
  
  /**
   * Generate secure session ID
   */
  static generateSessionId(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  /**
   * Validate UK phone number
   */
  static validateUKPhone(phone: string): { isValid: boolean; sanitized: string } {
    const sanitized = phone.replace(/\D/g, '');
    
    // UK phone number patterns
    const ukPhoneRegex = /^(44|0)?(7\d{9}|[1-9]\d{9})$/;
    
    return {
      isValid: ukPhoneRegex.test(sanitized),
      sanitized: sanitized.startsWith('44') ? sanitized : '44' + sanitized
    };
  }
  
  /**
   * Check password strength for future admin features
   */
  static checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;
    
    if (password.length >= 12) score += 20;
    else feedback.push('Password should be at least 12 characters');
    
    if (/[a-z]/.test(password)) score += 20;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 20;
    else feedback.push('Add uppercase letters');
    
    if (/\d/.test(password)) score += 20;
    else feedback.push('Add numbers');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    else feedback.push('Add special characters');
    
    // Check for common passwords
    const commonPasswords = ['password', '12345678', 'qwerty', 'admin'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score = Math.max(0, score - 40);
      feedback.push('Avoid common passwords');
    }
    
    return { score, feedback };
  }
  
  /**
   * Sanitize JSON data
   */
  static sanitizeJSON(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeInput(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeJSON(item));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        // Sanitize the key
        const sanitizedKey = this.sanitizeInput(key);
        // Recursively sanitize the value
        sanitized[sanitizedKey] = this.sanitizeJSON(value);
      }
      return sanitized;
    }
    
    return data;
  }
}

// Export for use in components
export default SecurityService;