import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Strict passport name validation pattern:
// - Only uppercase Latin letters A-Z
// - Allows spaces, hyphens (-), and apostrophes (')
// - 1-50 characters length
// - Cannot start with spaces or special characters
export const PASSPORT_NAME_PATTERN = /^[A-Z]([A-Z\s'-]*)?$/

interface PassportNameInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  value?: string
  onChange?: (value: string) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
}

const PassportNameInput = React.forwardRef<HTMLInputElement, PassportNameInputProps>(
  ({ className, value = "", onChange, onBlur, error, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(value)
    const [validationError, setValidationError] = useState<string | null>(null)

    useEffect(() => {
      setInternalValue(value)
    }, [value])

    const validateInput = (inputValue: string) => {
      if (!inputValue) {
        setValidationError("Name is required")
        return false
      }

      if (inputValue.length > 50) {
        setValidationError("Name must be 1-50 characters long")
        return false
      }

      // Check for invalid characters (anything other than A-Z, space, hyphen, apostrophe)
      if (!/^[A-Z\s'-]*$/.test(inputValue)) {
        setValidationError("Use only uppercase letters A-Z, spaces, hyphens, and apostrophes")
        return false
      }

      // Check for consecutive spaces or special characters
      if (/[\s'-]{2,}/.test(inputValue)) {
        setValidationError("Cannot have consecutive spaces or special characters")
        return false
      }

      // Check if starts with spaces or special characters
      if (/^[\s'-]/.test(inputValue)) {
        setValidationError("Name cannot start with spaces or special characters")
        return false
      }

      // Full pattern validation
      if (!PASSPORT_NAME_PATTERN.test(inputValue)) {
        setValidationError("Enter your passport name exactly as shown on your passport")
        return false
      }

      setValidationError(null)
      return true
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value

      // Filter out invalid characters immediately
      newValue = newValue.replace(/[^A-Za-z\s'-]/g, '')
      
      // Convert to uppercase
      newValue = newValue.toUpperCase()
      
      // Replace multiple consecutive spaces with single space
      newValue = newValue.replace(/\s+/g, ' ')

      setInternalValue(newValue)
      onChange?.(newValue)

      // Real-time validation feedback
      if (newValue.length > 0) {
        validateInput(newValue)
      } else {
        setValidationError(null)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Trim spaces on blur
      const trimmedValue = internalValue.trim()
      if (trimmedValue !== internalValue) {
        setInternalValue(trimmedValue)
        onChange?.(trimmedValue)
      }
      
      // Final validation
      validateInput(trimmedValue)
      
      onBlur?.(e)
    }

    const displayError = error || validationError
    const hasError = !!displayError

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          type="text"
          inputMode="text"
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={props.placeholder || "Enter your name as shown on passport"}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            hasError && "border-l-4 border-l-error-gentle border-error-gentle/30 bg-error-gentle-light focus-visible:ring-error-gentle/50",
            className
          )}
          aria-invalid={hasError}
          aria-describedby={displayError ? `${props.id}-error` : undefined}
        />
        {displayError && (
          <p 
            id={`${props.id}-error`}
            className="mt-1 text-sm text-error-gentle"
            role="alert"
            aria-live="polite"
          >
            {displayError}
          </p>
        )}
      </div>
    )
  }
)

PassportNameInput.displayName = "PassportNameInput"

export { PassportNameInput }