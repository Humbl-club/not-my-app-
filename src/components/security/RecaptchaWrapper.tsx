/**
 * Production-Ready reCAPTCHA Integration
 * Provides CAPTCHA verification for sensitive forms
 */

import React, { useCallback, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface RecaptchaWrapperProps {
  onVerify: (token: string | null) => void;
  onError?: (error: Error) => void;
  size?: 'compact' | 'normal';
  theme?: 'light' | 'dark';
  className?: string;
  required?: boolean;
}

export const RecaptchaWrapper: React.FC<RecaptchaWrapperProps> = ({
  onVerify,
  onError,
  size = 'normal',
  theme = 'light',
  className = '',
  required = true
}) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const siteKey = process.env.VITE_RECAPTCHA_SITE_KEY;

  const handleVerify = useCallback((token: string | null) => {
    setError('');
    onVerify(token);
  }, [onVerify]);

  const handleError = useCallback((error: any) => {
    console.error('reCAPTCHA error:', error);
    setError('reCAPTCHA verification failed. Please try again.');
    onError?.(new Error('reCAPTCHA verification failed'));
  }, [onError]);

  const handleExpired = useCallback(() => {
    setError('reCAPTCHA expired. Please verify again.');
    onVerify(null);
  }, [onVerify]);

  const reset = useCallback(() => {
    recaptchaRef.current?.reset();
    setError('');
  }, []);

  // Don't render if no site key (development mode)
  if (!siteKey) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className={`${className} p-4 bg-yellow-50 border border-yellow-200 rounded-lg`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              reCAPTCHA disabled in development mode. 
              Set VITE_RECAPTCHA_SITE_KEY for production.
            </p>
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={className}>
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={handleVerify}
        onError={handleError}
        onExpired={handleExpired}
        size={size}
        theme={theme}
        hl="en" // Language
      />
      
      {required && (
        <p className="text-xs text-muted-foreground mt-2">
          Please complete the verification above to continue.
        </p>
      )}
    </div>
  );
};

// Hook for easy reCAPTCHA integration
export const useRecaptcha = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string>('');

  const handleVerify = useCallback((recaptchaToken: string | null) => {
    setToken(recaptchaToken);
    setIsVerified(!!recaptchaToken);
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification');
    } else {
      setError('');
    }
  }, []);

  const handleError = useCallback((error: Error) => {
    setToken(null);
    setIsVerified(false);
    setError(error.message);
  }, []);

  const reset = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setError('');
  }, []);

  return {
    token,
    isVerified,
    error,
    handleVerify,
    handleError,
    reset
  };
};

export default RecaptchaWrapper;