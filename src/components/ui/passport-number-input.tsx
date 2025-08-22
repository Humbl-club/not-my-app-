import * as React from "react";
import { cn } from "@/lib/utils";

// Enhanced passport number validation pattern (6-10 alphanumeric characters)
const PASSPORT_NUMBER_PATTERN = /^[A-Z0-9]{6,10}$/;

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

      if (inputValue.length < 6 || inputValue.length > 10) {
        setInternalError("Passport number must be 6-10 characters long");
        return false;
      }

      if (!PASSPORT_NUMBER_PATTERN.test(inputValue)) {
        setInternalError("Use only letters and numbers (A-Z, 0-9)");
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
        .slice(0, 10); // Limit to 10 characters

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
              characterCount >= 10 && "text-warning-foreground",
              hasError && "text-error-gentle"
            )}>
              {characterCount}/10
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
            6-10 characters, letters and numbers only
          </p>
        )}
      </div>
    );
  }
);

PassportNumberInput.displayName = "PassportNumberInput";

export { PassportNumberInput };