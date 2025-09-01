/**
 * Secure Application Tracking Service
 * Implements proper authentication and security for application tracking
 */

import { supabase } from '@/lib/supabase';
import * as crypto from 'crypto';

export interface TrackingCredentials {
  referenceNumber: string;
  securityCode: string;  // Additional security layer
  email?: string;        // Optional email verification
  dateOfBirth?: string;  // Optional DOB verification
}

export interface SecureTrackingToken {
  token: string;
  expiresAt: string;
  applicationId: string;
}

export interface TrackingAttempt {
  ip: string;
  timestamp: string;
  referenceNumber: string;
  success: boolean;
}

class SecureTrackingService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 900000; // 15 minutes
  private readonly TOKEN_DURATION = 1800000; // 30 minutes
  private attemptTracker = new Map<string, TrackingAttempt[]>();

  /**
   * Generate secure reference number with checksum
   * Format: UK-YYYY-XXXX-XXXX-CS
   * Where CS is a checksum to prevent tampering
   */
  generateSecureReference(): string {
    const year = new Date().getFullYear();
    const random1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const random2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const baseRef = `UK-${year}-${random1}-${random2}`;
    
    // Add checksum for validation
    const checksum = this.calculateChecksum(baseRef);
    return `${baseRef}-${checksum}`;
  }

  /**
   * Generate a 6-digit security code for additional verification
   */
  generateSecurityCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Calculate checksum for reference validation
   */
  private calculateChecksum(reference: string): string {
    let sum = 0;
    for (let i = 0; i < reference.length; i++) {
      sum += reference.charCodeAt(i) * (i + 1);
    }
    return (sum % 97).toString().padStart(2, '0');
  }

  /**
   * Validate reference number format and checksum
   */
  validateReferenceFormat(reference: string): boolean {
    // Check format: UK-YYYY-XXXX-XXXX-CS
    const pattern = /^UK-\d{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-\d{2}$/;
    if (!pattern.test(reference)) {
      return false;
    }

    // Validate checksum
    const parts = reference.split('-');
    const checksum = parts.pop();
    const baseRef = parts.join('-');
    const calculatedChecksum = this.calculateChecksum(baseRef);
    
    return checksum === calculatedChecksum;
  }

  /**
   * Check for rate limiting
   */
  private checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts?: number; lockoutUntil?: Date } {
    const now = Date.now();
    const attempts = this.attemptTracker.get(identifier) || [];
    
    // Clean old attempts
    const recentAttempts = attempts.filter(
      a => new Date(a.timestamp).getTime() > now - this.LOCKOUT_DURATION
    );
    
    // Check if locked out
    const failedAttempts = recentAttempts.filter(a => !a.success);
    if (failedAttempts.length >= this.MAX_ATTEMPTS) {
      const lockoutUntil = new Date(
        new Date(failedAttempts[0].timestamp).getTime() + this.LOCKOUT_DURATION
      );
      return { 
        allowed: false, 
        lockoutUntil 
      };
    }

    return { 
      allowed: true, 
      remainingAttempts: this.MAX_ATTEMPTS - failedAttempts.length 
    };
  }

  /**
   * Record tracking attempt
   */
  private recordAttempt(identifier: string, referenceNumber: string, success: boolean) {
    const attempts = this.attemptTracker.get(identifier) || [];
    attempts.push({
      ip: identifier,
      timestamp: new Date().toISOString(),
      referenceNumber,
      success
    });
    
    // Keep only recent attempts
    const now = Date.now();
    const recentAttempts = attempts.filter(
      a => new Date(a.timestamp).getTime() > now - this.LOCKOUT_DURATION
    );
    
    this.attemptTracker.set(identifier, recentAttempts);
  }

  /**
   * Verify tracking credentials and issue secure token
   */
  async verifyAndIssueToken(
    credentials: TrackingCredentials,
    ipAddress: string
  ): Promise<{
    success: boolean;
    token?: SecureTrackingToken;
    error?: string;
    remainingAttempts?: number;
    lockoutUntil?: Date;
  }> {
    // Check rate limiting
    const rateLimitCheck = this.checkRateLimit(ipAddress);
    if (!rateLimitCheck.allowed) {
      return {
        success: false,
        error: 'Too many failed attempts. Please try again later.',
        lockoutUntil: rateLimitCheck.lockoutUntil
      };
    }

    // Validate reference format
    if (!this.validateReferenceFormat(credentials.referenceNumber)) {
      this.recordAttempt(ipAddress, credentials.referenceNumber, false);
      return {
        success: false,
        error: 'Invalid reference number format.',
        remainingAttempts: rateLimitCheck.remainingAttempts! - 1
      };
    }

    try {
      // Query application with security verification
      const { data: application, error } = await supabase
        .from('applications')
        .select('id, user_email, security_code, applicants(date_of_birth)')
        .eq('reference_number', credentials.referenceNumber)
        .single();

      if (error || !application) {
        this.recordAttempt(ipAddress, credentials.referenceNumber, false);
        return {
          success: false,
          error: 'Application not found.',
          remainingAttempts: rateLimitCheck.remainingAttempts! - 1
        };
      }

      // Verify security code
      if (application.security_code !== credentials.securityCode) {
        this.recordAttempt(ipAddress, credentials.referenceNumber, false);
        return {
          success: false,
          error: 'Invalid security code.',
          remainingAttempts: rateLimitCheck.remainingAttempts! - 1
        };
      }

      // Additional verification if email provided
      if (credentials.email && application.user_email !== credentials.email) {
        this.recordAttempt(ipAddress, credentials.referenceNumber, false);
        return {
          success: false,
          error: 'Email does not match our records.',
          remainingAttempts: rateLimitCheck.remainingAttempts! - 1
        };
      }

      // Additional verification if DOB provided
      if (credentials.dateOfBirth) {
        const applicantDOB = application.applicants?.[0]?.date_of_birth;
        if (!applicantDOB || applicantDOB !== credentials.dateOfBirth) {
          this.recordAttempt(ipAddress, credentials.referenceNumber, false);
          return {
            success: false,
            error: 'Date of birth does not match our records.',
            remainingAttempts: rateLimitCheck.remainingAttempts! - 1
          };
        }
      }

      // Success - generate secure token
      this.recordAttempt(ipAddress, credentials.referenceNumber, true);
      
      const token = this.generateSecureToken();
      const expiresAt = new Date(Date.now() + this.TOKEN_DURATION).toISOString();
      
      // Store token in database for validation
      await supabase
        .from('tracking_tokens')
        .insert({
          token,
          application_id: application.id,
          expires_at: expiresAt,
          ip_address: ipAddress
        });

      return {
        success: true,
        token: {
          token,
          expiresAt,
          applicationId: application.id
        }
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        error: 'An error occurred. Please try again later.'
      };
    }
  }

  /**
   * Generate cryptographically secure token
   */
  private generateSecureToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Validate tracking token
   */
  async validateToken(token: string, ipAddress: string): Promise<{
    valid: boolean;
    applicationId?: string;
    error?: string;
  }> {
    try {
      const { data: tokenRecord, error } = await supabase
        .from('tracking_tokens')
        .select('*')
        .eq('token', token)
        .single();

      if (error || !tokenRecord) {
        return { valid: false, error: 'Invalid or expired token.' };
      }

      // Check expiration
      if (new Date(tokenRecord.expires_at) < new Date()) {
        // Clean up expired token
        await supabase
          .from('tracking_tokens')
          .delete()
          .eq('token', token);
        
        return { valid: false, error: 'Token has expired. Please verify again.' };
      }

      // Optional: Check IP address for additional security
      // Disabled for now as users might switch networks
      // if (tokenRecord.ip_address !== ipAddress) {
      //   return { valid: false, error: 'Security verification failed.' };
      // }

      return {
        valid: true,
        applicationId: tokenRecord.application_id
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false, error: 'Validation failed.' };
    }
  }

  /**
   * Get secure application data
   */
  async getSecureApplicationData(
    token: string,
    ipAddress: string
  ): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    const validation = await this.validateToken(token, ipAddress);
    
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    try {
      const { data: application, error } = await supabase
        .from('applications')
        .select(`
          reference_number,
          status,
          payment_status,
          created_at,
          submitted_at,
          application_type,
          applicants (
            first_name,
            last_name,
            status
          )
        `)
        .eq('id', validation.applicationId!)
        .single();

      if (error || !application) {
        return { success: false, error: 'Application not found.' };
      }

      // Log access for audit trail
      await this.logAccess(validation.applicationId!, ipAddress);

      // Mask sensitive data
      const maskedApplication = this.maskSensitiveData(application);

      return {
        success: true,
        data: maskedApplication
      };
    } catch (error) {
      console.error('Data retrieval error:', error);
      return { success: false, error: 'Failed to retrieve application data.' };
    }
  }

  /**
   * Mask sensitive data for display
   */
  private maskSensitiveData(application: any): any {
    const masked = { ...application };
    
    // Mask applicant names (show only first letter and length)
    if (masked.applicants) {
      masked.applicants = masked.applicants.map((applicant: any) => ({
        ...applicant,
        first_name: this.maskName(applicant.first_name),
        last_name: this.maskName(applicant.last_name)
      }));
    }

    return masked;
  }

  /**
   * Mask name for privacy
   */
  private maskName(name: string): string {
    if (!name || name.length <= 1) return name;
    return name[0] + '*'.repeat(name.length - 1);
  }

  /**
   * Log access for audit trail
   */
  private async logAccess(applicationId: string, ipAddress: string) {
    try {
      await supabase
        .from('application_access_logs')
        .insert({
          application_id: applicationId,
          ip_address: ipAddress,
          accessed_at: new Date().toISOString(),
          action: 'VIEW_STATUS'
        });
    } catch (error) {
      console.error('Failed to log access:', error);
      // Don't fail the request if logging fails
    }
  }

  /**
   * Clean up expired tokens (run periodically)
   */
  async cleanupExpiredTokens() {
    try {
      await supabase
        .from('tracking_tokens')
        .delete()
        .lt('expires_at', new Date().toISOString());
    } catch (error) {
      console.error('Token cleanup failed:', error);
    }
  }
}

// Export singleton instance
export const secureTrackingService = new SecureTrackingService();
export default secureTrackingService;