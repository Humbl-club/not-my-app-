// Security configuration for Vite - Production Ready
export const securityHeaders = {
  // Content Security Policy - Production optimized
  'Content-Security-Policy': process.env.NODE_ENV === 'production' ? [
    "default-src 'self'",
    "script-src 'self'", // Strict for production - no unsafe-inline/eval
    "style-src 'self' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://your-cdn.com https://supabase.co",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com https://js.stripe.com",
    "frame-src https://js.stripe.com https://www.google.com", // For reCAPTCHA and Stripe
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "media-src 'self'",
    "worker-src 'self'"
  ].join('; ') : [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Development only
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' http://localhost:3001 https://api.uk-eta.gov.uk wss://localhost:* ws://localhost:* ws://10.0.0.63:*",
    "frame-src https://js.stripe.com https://www.google.com", // For reCAPTCHA and Stripe
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'"
  ].join('; '),
  
  // Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS Protection (for older browsers)
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': [
    'camera=(self)',
    'microphone=()',
    'geolocation=()',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', ')
};

// Rate limiting configuration - Production Ready
export const rateLimitConfig = {
  // General rate limiting
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  // Strict rate limiting for sensitive endpoints
  sensitive: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Only 5 attempts for login/tracking
    message: 'Too many attempts. Please wait 15 minutes before trying again.',
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
  },
  // Payment endpoint rate limiting
  payment: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Max 10 payment attempts per hour
    message: 'Payment attempt limit exceeded. Please contact support.',
    standardHeaders: true,
    legacyHeaders: false,
  }
};

// CORS configuration - Production Ready
export const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://uketa.gov.uk', 'https://www.uketa.gov.uk', 'https://api.uketa.gov.uk']
    : ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-CSRF-Token', 
    'X-Device-Fingerprint',
    'X-Request-ID',
    'X-ReCaptcha-Token'
  ],
  exposedHeaders: ['X-Request-Id', 'X-RateLimit-Limit', 'X-RateLimit-Remaining']
};

// WAF-style security rules for application layer
export const securityRules = {
  // Suspicious patterns that should be blocked
  suspiciousPatterns: [
    /union.*select/i,
    /script.*>.*<\/script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload.*=/i,
    /onerror.*=/i,
    /'.*or.*1.*=.*1/i,
    /exec.*xp_cmdshell/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ],
  
  // File upload restrictions
  allowedFileTypes: [
    'image/jpeg',
    'image/png', 
    'image/webp',
    'application/pdf'
  ],
  
  maxFileSize: 5 * 1024 * 1024, // 5MB
  
  // Request size limits
  maxRequestSize: 10 * 1024 * 1024, // 10MB for form data with files
  maxJSONSize: 1024 * 1024, // 1MB for JSON payloads
  
  // IP-based rules (to be implemented at CDN level)
  blockedCountries: [], // Add country codes if needed
  allowedCountries: ['GB', 'US', 'CA', 'AU', 'IE'], // Primary markets
};

// Security middleware for development server
export function securityMiddleware() {
  return {
    name: 'security-headers',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        // Apply security headers
        Object.entries(securityHeaders).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        
        // Add CSRF token to response
        if (req.method === 'GET' && req.url === '/') {
          const csrfToken = generateCSRFToken();
          res.setHeader('X-CSRF-Token', csrfToken);
        }
        
        next();
      });
    }
  };
}

function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}