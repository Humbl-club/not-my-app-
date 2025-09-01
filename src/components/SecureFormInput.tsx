import React from 'react';
import { Input } from '@/components/ui/input';
import { SecurityService } from '@/services/securityService';
import { cn } from '@/lib/utils';

interface SecureFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSecureChange?: (value: string) => void; // For react-hook-form
  validatePattern?: RegExp;
  sanitizeOnBlur?: boolean;
  blockSQLInjection?: boolean;
  forceUppercase?: boolean;
}

export const SecureFormInput = React.forwardRef<HTMLInputElement, SecureFormInputProps>(
  ({ 
    className, 
    value = '', 
    onChange,
    onSecureChange,
    onBlur,
    validatePattern,
    sanitizeOnBlur = true,
    blockSQLInjection = true,
    forceUppercase = false,
    type = 'text',
    ...props 
  }, ref) => {
    const [error, setError] = React.useState<string | null>(null);
    const [internalValue, setInternalValue] = React.useState(value);

    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      // Block dangerous input patterns immediately
      if (blockSQLInjection && SecurityService.hasSQLInjectionPatterns(newValue)) {
        setError('Invalid characters detected');
        return; // Block the input entirely
      }

      // Check for XSS patterns
      if (SecurityService.hasXSSPatterns(newValue)) {
        setError('Invalid HTML/Script content detected');
        return; // Block the input entirely
      }

      // Force uppercase if required (for passport fields)
      if (forceUppercase) {
        newValue = newValue.toUpperCase();
      }

      // Validate against pattern if provided
      if (validatePattern && newValue && !validatePattern.test(newValue)) {
        setError('Invalid format');
        // Still allow typing but show error
      } else {
        setError(null);
      }

      setInternalValue(newValue);
      
      // Call the original onChange if provided
      if (onChange) {
        e.target.value = newValue;
        onChange(e);
      }
      
      // Call secure change handler for react-hook-form
      if (onSecureChange) {
        onSecureChange(newValue);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (sanitizeOnBlur) {
        // Sanitize on blur
        const sanitized = SecurityService.sanitizeInput(internalValue);
        
        if (sanitized !== internalValue) {
          setInternalValue(sanitized);
          
          if (onChange) {
            e.target.value = sanitized;
            onChange(e as any);
          }
          
          if (onSecureChange) {
            onSecureChange(sanitized);
          }
        }
      }

      // Call original onBlur if provided
      if (onBlur) {
        onBlur(e);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData('text');
      
      // Check for malicious patterns in pasted content
      if (SecurityService.hasSQLInjectionPatterns(pastedText) || 
          SecurityService.hasXSSPatterns(pastedText)) {
        e.preventDefault();
        setError('Pasted content contains invalid characters');
        return;
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={type}
          className={cn(
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
          {...props}
        />
        {error && (
          <p id="input-error" className="text-xs text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

SecureFormInput.displayName = 'SecureFormInput';