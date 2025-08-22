import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';
import { 
  translateJobTitle as translateJobTitleUtil, 
  validateJobTitle as validateJobTitleUtil, 
  capitalizeJobTitle as capitalizeJobTitleUtil
} from '@/utils/job-translation';

interface JobTitleInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string, translatedValue?: string) => void;
  onTranslationChange?: (original: string, translated: string) => void;
}


const JobTitleInput = React.forwardRef<HTMLInputElement, JobTitleInputProps>(
  ({ className, value = "", onChange, onTranslationChange, ...props }, ref) => {
    const { t } = useTranslation();
    const [internalValue, setInternalValue] = React.useState(value);
    const [translatedValue, setTranslatedValue] = React.useState<string>("");
    const [isTranslating, setIsTranslating] = React.useState(false);
    const [translationFailed, setTranslationFailed] = React.useState(false);
    const [manualTranslation, setManualTranslation] = React.useState("");
    const [internalError, setInternalError] = React.useState<string>("");

    // Update internal value when prop changes
    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

  const validateJobTitle = (inputValue: string): boolean => {
    const error = validateJobTitleUtil(inputValue);
    if (error) {
      setInternalError(error);
      return false;
    }
    setInternalError('');
    return true;
  };

    const handleInputChange = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const capitalizedValue = capitalizeJobTitleUtil(rawValue);
      
      setInternalValue(capitalizedValue);
      
      if (validateJobTitle(capitalizedValue)) {
        if (capitalizedValue.trim().length >= 2) {
          // Attempt translation
          setIsTranslating(true);
          setTranslationFailed(false);
          
          const translation = await translateJobTitleUtil(capitalizedValue);
          
          setIsTranslating(false);
          
          if (translation) {
            setTranslatedValue(translation);
            setTranslationFailed(false);
            onTranslationChange?.(capitalizedValue, translation);
          } else {
            setTranslationFailed(true);
            setTranslatedValue("");
          }
        } else {
          setTranslatedValue("");
          setTranslationFailed(false);
        }
        
        onChange?.(capitalizedValue, translatedValue);
      } else {
        onChange?.(capitalizedValue);
      }
    }, [onChange, onTranslationChange, translatedValue]);

    const handleManualTranslationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const manualValue = capitalizeJobTitleUtil(e.target.value);
      setManualTranslation(manualValue);
      
      if (manualValue.trim()) {
        setTranslatedValue(manualValue);
        onTranslationChange?.(internalValue, manualValue);
        onChange?.(internalValue, manualValue);
      }
    };

    return (
      <div className="space-y-2">
        <Input
          ref={ref}
          value={internalValue}
          onChange={handleInputChange}
          placeholder="Enter your job title"
          className={cn(
            className,
            internalError && "border-destructive focus-visible:ring-destructive"
          )}
          {...props}
        />
        
        {internalError && (
          <p className="text-sm text-destructive">{internalError}</p>
        )}
        
        {isTranslating && (
          <p className="text-sm text-muted-foreground">Translating...</p>
        )}
        
        {translatedValue && !translationFailed && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">English Translation:</span> {translatedValue} ({internalValue})
          </div>
        )}
        
        {translationFailed && internalValue.length >= 2 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please also enter your job title in English:
            </p>
            <Input
              value={manualTranslation}
              onChange={handleManualTranslationChange}
              placeholder="Enter job title in English"
              className="text-sm"
            />
          </div>
        )}
      </div>
    );
  }
);

JobTitleInput.displayName = "JobTitleInput";


export { JobTitleInput };