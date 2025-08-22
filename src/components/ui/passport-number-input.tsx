import * as React from "react";
import { cn } from "@/lib/utils";

// Enhanced passport number validation pattern (6-12 alphanumeric characters)
const PASSPORT_NUMBER_PATTERN = /^[A-Z0-9]{6,12}$/;

// Check for repeated characters (3+ consecutive identical characters)
const hasRepeatedCharacters = (value: string): boolean => {
  return /(.)\1{2,}/.test(value);
};

// Check for simple sequences (ascending/descending patterns)
const hasSimpleSequence = (value: string): boolean => {
  // Check for numeric sequences (123, 321, etc.)
  for (let i = 0; i <= value.length - 3; i++) {
    const substr = value.substring(i, i + 3);
    if (/^\d+$/.test(substr)) {
      const nums = substr.split('').map(Number);
      if ((nums[1] === nums[0] + 1 && nums[2] === nums[1] + 1) ||
          (nums[1] === nums[0] - 1 && nums[2] === nums[1] - 1)) {
        return true;
      }
    }
  }
  
  // Check for alphabetic sequences (ABC, CBA, etc.)
  for (let i = 0; i <= value.length - 3; i++) {
    const substr = value.substring(i, i + 3);
    if (/^[A-Z]+$/.test(substr)) {
      const chars = substr.split('').map(c => c.charCodeAt(0));
      if ((chars[1] === chars[0] + 1 && chars[2] === chars[1] + 1) ||
          (chars[1] === chars[0] - 1 && chars[2] === chars[1] - 1)) {
        return true;
      }
    }
  }
  
  return false;
};

interface PassportNumberInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

const PassportNumberInput = React.forwardRef<HTMLInputElement, PassportNumberInputProps>(
  ({ value = "", onChange, onBlur, error }, ref) => {
    const [internalError, setInternalError] = React.useState<string>("");
    const [displayValue, setDisplayValue] = React.useState(value);

    React.useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    const validateInput = (inputValue: string) => {
      if (!inputValue) {
        setInternalError("Passport number is required");
        return false;
      }

      if (inputValue.length < 6 || inputValue.length > 12) {
        setInternalError("Passport number must be 6-12 characters long");
        return false;
      }

      if (!PASSPORT_NUMBER_PATTERN.test(inputValue)) {
        setInternalError("Use only uppercase letters A-Z and numbers 0-9");
        return false;
      }

      if (hasRepeatedCharacters(inputValue)) {
        setInternalError("Cannot contain repeated characters (e.g., AAA, 111)");
        return false;
      }

      if (hasSimpleSequence(inputValue)) {
        setInternalError("Cannot be a simple sequence (e.g., 123456, ABCDEF)");
        return false;
      }

      setInternalError("");
      return true;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      
      // Convert to uppercase and filter out invalid characters
      const cleanedValue = rawValue
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "") // Remove all non-alphanumeric characters
        .slice(0, 12); // Limit to 12 characters

      setDisplayValue(cleanedValue);
      
      if (onChange) {
        onChange(cleanedValue);
      }

      // Validate if there's content
      if (cleanedValue) {
        validateInput(cleanedValue);
      } else {
        setInternalError("");
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const finalValue = displayValue.trim();
      validateInput(finalValue);
      
      if (onBlur) {
        onBlur(e);
      }
    };

    const displayError = error || internalError;
    const hasError = Boolean(displayError);
    const characterCount = displayValue.length;

    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your passport number"
            aria-invalid={hasError}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              hasError && "border-l-4 border-l-error-gentle border-error-gentle/30 bg-error-gentle-light focus-visible:ring-error-gentle/50"
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className={cn(
              "text-xs text-muted-foreground",
              characterCount >= 12 && "text-warning-foreground",
              hasError && "text-error-gentle"
            )}>
              {characterCount}/12
            </span>
          </div>
        </div>
        
        {hasError && (
          <p className="mt-1 text-sm text-error-gentle" role="alert">
            {displayError}
          </p>
        )}
        
        {!hasError && displayValue.length > 0 && displayValue.length < 6 && (
          <p className="mt-1 text-xs text-muted-foreground">
            Enter at least 6 characters
          </p>
        )}
        
        {!hasError && !displayValue && (
          <p className="mt-1 text-xs text-muted-foreground">
            6-12 characters, letters and numbers only
          </p>
        )}
      </div>
    );
  }
);

PassportNumberInput.displayName = "PassportNumberInput";

export { PassportNumberInput };