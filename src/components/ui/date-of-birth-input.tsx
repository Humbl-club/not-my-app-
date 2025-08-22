import * as React from "react";
import { format, isValid, differenceInYears, isFuture, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateOfBirthInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  "aria-invalid"?: boolean;
}

export const DateOfBirthInput = React.forwardRef<HTMLInputElement, DateOfBirthInputProps>(
  ({ className, value = "", onChange, onBlur, disabled, placeholder = "YYYY-MM-DD or YYYY/MM/DD", ...props }, ref) => {
    const [calendarOpen, setCalendarOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);
    const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(
      value && isValid(new Date(value)) ? new Date(value) : undefined
    );
    const [autoOpenTimer, setAutoOpenTimer] = React.useState<NodeJS.Timeout | null>(null);

    // Sync with external value changes
    React.useEffect(() => {
      setInputValue(value);
      if (value && isValid(new Date(value))) {
        setCalendarDate(new Date(value));
      } else {
        setCalendarDate(undefined);
      }
    }, [value]);

    const normalizeToYYYYMMDD = (input: string): string => {
      // Convert YYYY/MM/DD to YYYY-MM-DD
      return input.replace(/\//g, '-');
    };

    const parsePartialDate = (input: string) => {
      const normalized = normalizeToYYYYMMDD(input);
      const parts = normalized.split('-');
      
      if (parts.length >= 2 && parts[0].length === 4 && parts[1].length === 2) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Date uses 0-based months
        
        if (year >= 1900 && year <= new Date().getFullYear() && month >= 0 && month <= 11) {
          return new Date(year, month, 1);
        }
      }
      return null;
    };

    const formatDateInput = (input: string) => {
      // Allow both - and / separators during typing
      const cleanInput = input.replace(/[^\d\-\/]/g, '');
      
      // If user is typing with /, preserve it during typing, normalize later
      if (cleanInput.includes('/')) {
        const digits = cleanInput.replace(/[\/\-]/g, '');
        if (digits.length <= 4) {
          return digits;
        } else if (digits.length <= 6) {
          return `${digits.slice(0, 4)}/${digits.slice(4)}`;
        } else {
          return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6, 8)}`;
        }
      } else {
        // Default to - separator
        const digits = cleanInput.replace(/[\/\-]/g, '');
        if (digits.length <= 4) {
          return digits;
        } else if (digits.length <= 6) {
          return `${digits.slice(0, 4)}-${digits.slice(4)}`;
        } else {
          return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
        }
      }
    };

    const validateDate = (dateStr: string): string | null => {
      if (!dateStr) return null;
      
      // Normalize input to YYYY-MM-DD format
      const normalized = normalizeToYYYYMMDD(dateStr);
      
      // Check format (accept both YYYY-MM-DD and YYYY/MM/DD)
      const formatRegex = /^\d{4}[-\/]\d{2}[-\/]\d{2}$/;
      if (!formatRegex.test(dateStr)) {
        return "Please enter date in YYYY-MM-DD or YYYY/MM/DD format";
      }

      const date = new Date(normalized);
      
      // Check if valid calendar date
      if (!isValid(date)) {
        return "Please enter a valid date";
      }

      // Check if future date
      if (isFuture(startOfDay(date))) {
        return "Date of birth cannot be in the future";
      }

      // Check age limit (120 years)
      const age = differenceInYears(new Date(), date);
      if (age > 120) {
        return "Age cannot exceed 120 years";
      }

      return null;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawInput = e.target.value;
      const formatted = formatDateInput(rawInput);
      
      setInputValue(formatted);
      
      // Clear any existing timer
      if (autoOpenTimer) {
        clearTimeout(autoOpenTimer);
        setAutoOpenTimer(null);
      }
      
      // Check for partial date that should trigger calendar auto-open
      const partialDate = parsePartialDate(formatted);
      if (partialDate && (formatted.length === 6 || formatted.length === 7) && !calendarOpen) {
        // Set timer to auto-open calendar after user stops typing
        const timer = setTimeout(() => {
          setCalendarDate(partialDate);
          setCalendarOpen(true);
        }, 800); // 800ms delay to allow user to continue typing
        setAutoOpenTimer(timer);
      }
      
      // Only call onChange if we have a complete date or empty
      if (formatted === '' || formatted.length === 10) {
        // Normalize to YYYY-MM-DD before calling onChange
        const normalizedValue = formatted === '' ? '' : normalizeToYYYYMMDD(formatted);
        onChange?.(normalizedValue);
        
        // Update calendar date if valid
        if (normalizedValue.length === 10 && isValid(new Date(normalizedValue))) {
          setCalendarDate(new Date(normalizedValue));
        }
      }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
      if (date) {
        const dateStr = format(date, 'yyyy-MM-dd');
        setInputValue(dateStr);
        setCalendarDate(date);
        onChange?.(dateStr);
      }
      setCalendarOpen(false);
      
      // Clear any pending auto-open timer
      if (autoOpenTimer) {
        clearTimeout(autoOpenTimer);
        setAutoOpenTimer(null);
      }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 121 }, (_, i) => currentYear - i);
    
    return (
      <div className="relative">
        <div className="flex">
          <Input
            ref={ref}
            type="text"
            inputMode="numeric"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={onBlur}
            disabled={disabled}
            className={cn("pr-10", className)}
            maxLength={10}
            {...props}
          />
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                disabled={disabled}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex items-center justify-between p-3 border-b">
                <Select
                  value={calendarDate ? calendarDate.getFullYear().toString() : ""}
                  onValueChange={(year) => {
                    const newDate = new Date(parseInt(year), calendarDate?.getMonth() || 0, 1);
                    setCalendarDate(newDate);
                  }}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={calendarDate ? calendarDate.getMonth().toString() : ""}
                  onValueChange={(month) => {
                    const newDate = new Date(
                      calendarDate?.getFullYear() || currentYear, 
                      parseInt(month), 
                      1
                    );
                    setCalendarDate(newDate);
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {format(new Date(2023, i, 1), 'MMMM')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={handleCalendarSelect}
                month={calendarDate}
                onMonthChange={setCalendarDate}
                disabled={(date) => {
                  return (
                    isFuture(startOfDay(date)) || 
                    differenceInYears(new Date(), date) > 120
                  );
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }
);

DateOfBirthInput.displayName = "DateOfBirthInput";

// Helper function to validate date strings
export const validateDateOfBirth = (dateStr: string): string | null => {
  if (!dateStr) return "Date of birth is required";
  
  // Normalize input to YYYY-MM-DD format
  const normalized = dateStr.replace(/\//g, '-');
  
  // Check format (accept both YYYY-MM-DD and YYYY/MM/DD)
  const formatRegex = /^\d{4}[-\/]\d{2}[-\/]\d{2}$/;
  if (!formatRegex.test(dateStr)) {
    return "Please enter date in YYYY-MM-DD or YYYY/MM/DD format";
  }

  const date = new Date(normalized);
  
  // Check if valid calendar date
  if (!isValid(date)) {
    return "Please enter a valid date";
  }

  // Check if future date
  if (isFuture(startOfDay(date))) {
    return "Date of birth cannot be in the future";
  }

  // Check age limit (120 years)
  const age = differenceInYears(new Date(), date);
  if (age > 120) {
    return "Age cannot exceed 120 years";
  }

  return null;
};