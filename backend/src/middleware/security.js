import crypto from 'crypto';

/**
 * Security middleware for all requests
 */
export const securityMiddleware = (req, res, next) => {
  // Generate request ID for tracking
  req.requestId = crypto.randomBytes(16).toString('hex');
  
  // Add security headers
  res.setHeader('X-Request-ID', req.requestId);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Log request for audit trail
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ID: ${req.requestId}`);
  
  next();
};