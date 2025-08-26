import React, { forwardRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { SecurityService } from '@/services/securityService';
import { AlertCircle, Shield, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSecureChange?: (value: string, isValid: boolean) => void;
  validationType?: 'email' | 'passport-name' | 'passport-number' | 'text';
  showSecurityIndicator?: boolean;
  preventSQLInjection?: boolean;
}

export const SecureInput = forwardRef<HTMLInputElement, SecureInputProps>(
  ({ 
    onSecureChange, 
    onChange,
    validationType = 'text',
    showSecurityIndicator = true,
    preventSQLInjection = true,
    className,
    value,
    ...props 
  }, ref) => {
    const [internalValue, setInternalValue] = useState(value || '');
    const [isSecure, setIsSecure] = useState(true);
    const [validationError, setValidationError] = useState<string | null>(null);
    
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      
      // Check for SQL injection patterns
      if (preventSQLInjection && SecurityService.hasSQLInjectionPatterns(rawValue)) {
        setIsSecure(false);
        setValidationError('Invalid characters detected');
        return; // Block the input
      }
      
      // Sanitize based on validation type
      let sanitizedValue = rawValue;
      let isValid = true;
      
      switch (validationType) {
        case 'email':
          const emailResult = SecurityService.validateEmail(rawValue);
          sanitizedValue = emailResult.sanitized;
          isValid = emailResult.isValid;
          if (!isValid && rawValue.length > 0) {
            setValidationError('Invalid email format');
          } else {
            setValidationError(null);
          }
          break;
          
        case 'passport-name':
          const nameResult = SecurityService.validatePassportName(rawValue);
          sanitizedValue = nameResult.sanitized;
          isValid = nameResult.isValid;
          if (!isValid && rawValue.length > 0) {
            setValidationError('Only uppercase letters, spaces, hyphens, and apostrophes allowed');
          } else {
            setValidationError(null);
          }
          break;
          
        case 'passport-number':
          const passportResult = SecurityService.validatePassportNumber(rawValue);
          sanitizedValue = passportResult.sanitized;
          isValid = passportResult.isValid;
          if (!isValid && rawValue.length > 0) {
            setValidationError('6-10 alphanumeric characters only');
          } else {
            setValidationError(null);
          }
          break;
          
        default:
          sanitizedValue = SecurityService.sanitizeInput(rawValue);
          break;
      }
      
      setIsSecure(isValid);
      setInternalValue(sanitizedValue);
      
      // Create modified event
      const modifiedEvent = {
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue
        }
      };
      
      // Call original onChange if provided
      if (onChange) {
        onChange(modifiedEvent as React.ChangeEvent<HTMLInputElement>);
      }
      
      // Call secure change handler
      if (onSecureChange) {
        onSecureChange(sanitizedValue, isValid);
      }
    };
    
    const getSecurityIcon = () => {
      if (!showSecurityIndicator) return null;
      
      if (validationError) {
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      }
      
      if (internalValue && isSecure) {
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      }
      
      return <Shield className="h-4 w-4 text-muted-foreground" />;
    };
    
    return (
      <div className="relative">
        <Input
          ref={ref}
          value={internalValue}
          onChange={handleChange}
          className={cn(
            'pr-10',
            validationError && 'border-red-500',
            isSecure && internalValue && 'border-green-500',
            className
          )}
          {...props}
        />
        {showSecurityIndicator && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {getSecurityIcon()}
          </div>
        )}
        {validationError && (
          <p className="text-xs text-red-500 mt-1">{validationError}</p>
        )}
      </div>
    );
  }
);

SecureInput.displayName = 'SecureInput';