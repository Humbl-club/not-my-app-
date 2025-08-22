import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useTranslation } from 'react-i18next'

// Enhanced email validation regex
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

interface EmailInputProps extends React.ComponentProps<"input"> {
  onValidation?: (isValid: boolean, errorMessage?: string) => void
  showRealTimeErrors?: boolean
}

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ className, onValidation, showRealTimeErrors = true, onChange, onBlur, ...props }, ref) => {
    const { t } = useTranslation()
    const [error, setError] = React.useState<string | null>(null)
    const [touched, setTouched] = React.useState(false)

    const validateEmail = (value: string): { isValid: boolean; errorMessage?: string } => {
      if (!value) {
        return { isValid: false, errorMessage: t('validation.email.required') }
      }

      // Check for spaces
      if (value.includes(' ')) {
        return { isValid: false, errorMessage: t('validation.email.noSpaces') }
      }

      // Check for missing @ or multiple @
      const atCount = (value.match(/@/g) || []).length
      if (atCount === 0) {
        return { isValid: false, errorMessage: t('validation.email.missingAt') }
      }
      if (atCount > 1) {
        return { isValid: false, errorMessage: t('validation.email.multipleAt') }
      }

      // Check for consecutive dots
      if (value.includes('..')) {
        return { isValid: false, errorMessage: t('validation.email.consecutiveDots') }
      }

      // Check for invalid starting/ending characters
      if (value.startsWith('.') || value.startsWith('@') || value.endsWith('.') || value.endsWith('@')) {
        return { isValid: false, errorMessage: t('validation.email.invalidStartEnd') }
      }

      // Check basic format with enhanced regex
      if (!EMAIL_PATTERN.test(value)) {
        return { isValid: false, errorMessage: t('validation.email.invalidFormat') }
      }

      // Check for missing local part or domain
      const [localPart, domain] = value.split('@')
      if (!localPart || !domain) {
        return { isValid: false, errorMessage: t('validation.email.missingParts') }
      }

      // Check for valid TLD (at least 2 characters)
      const domainParts = domain.split('.')
      const tld = domainParts[domainParts.length - 1]
      if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
        return { isValid: false, errorMessage: t('validation.email.invalidTLD') }
      }

      return { isValid: true }
    }

    const handleValidation = (value: string) => {
      const validation = validateEmail(value)
      const errorMessage = validation.isValid ? null : validation.errorMessage
      
      if (showRealTimeErrors && touched) {
        setError(errorMessage)
      }
      
      onValidation?.(validation.isValid, validation.errorMessage)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      onChange?.(e)
      
      // Real-time validation with debouncing
      if (showRealTimeErrors && touched) {
        setTimeout(() => handleValidation(value), 300)
      } else {
        handleValidation(value)
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true)
      const value = e.target.value
      handleValidation(value)
      onBlur?.(e)
    }

    return (
      <div className="space-y-1">
        <Input
          {...props}
          ref={ref}
          type="email"
          autoComplete="email"
          placeholder={props.placeholder || t('application.personalInfo.email.placeholder')}
          className={cn(
            error && touched && showRealTimeErrors && "border-l-4 border-l-warning border-warning/30 bg-warning/5 focus-visible:ring-warning/50",
            className
          )}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!error && touched}
          aria-describedby={error && touched ? `${props.id}-error` : undefined}
        />
        {error && touched && showRealTimeErrors && (
          <p
            id={`${props.id}-error`}
            className="text-sm font-medium text-warning"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

EmailInput.displayName = "EmailInput"

export { EmailInput, EMAIL_PATTERN }