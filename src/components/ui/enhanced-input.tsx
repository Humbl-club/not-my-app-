import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, X, AlertCircle, Eye, EyeOff } from "lucide-react";

export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helper?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    success, 
    helper, 
    icon, 
    showPasswordToggle,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = props.value || props.defaultValue;

    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    return (
      <div className="relative group">
        {/* Floating Label */}
        {label && (
          <label
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none z-10",
              "text-sm font-medium",
              isFocused || hasValue
                ? "-top-2 text-xs px-1 bg-white"
                : "top-3 text-base",
              error
                ? "text-red-500"
                : success
                ? "text-green-600"
                : isFocused
                ? "text-blue-600"
                : "text-gray-500"
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          {/* Input Field */}
          <input
            type={inputType}
            className={cn(
              "flex h-12 w-full rounded-lg border-2 bg-white px-3 py-2 text-sm",
              "transition-all duration-200",
              "placeholder:text-gray-400",
              "focus:outline-none focus:ring-0",
              "field-focus",
              icon && "pl-10",
              showPasswordToggle && "pr-10",
              error && "border-red-300 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]",
              success && "border-green-300 focus:border-green-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]",
              !error && !success && "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Status Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Password Toggle */}
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}

            {/* Status Indicators */}
            {error && (
              <X className="w-4 h-4 text-red-500 field-error-shake" />
            )}
            {success && !error && (
              <Check className="w-4 h-4 text-green-500 success-check-slide" />
            )}
          </div>
        </div>

        {/* Helper/Error Text */}
        {(error || helper) && (
          <div className={cn(
            "mt-1.5 text-xs flex items-start gap-1",
            error ? "text-red-500" : "text-gray-500"
          )}>
            {error && <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />}
            <span>{error || helper}</span>
          </div>
        )}

        {/* Focus Ring Animation */}
        <div 
          className={cn(
            "absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-200",
            isFocused ? "opacity-100" : "opacity-0",
            error && "ring-2 ring-red-500/20",
            success && "ring-2 ring-green-500/20",
            !error && !success && "ring-2 ring-blue-500/20"
          )}
        />
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };