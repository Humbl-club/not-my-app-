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
  ({ className, value = "", onChange, onBlur, disabled, placeholder = "YYYY-MM-DD", ...props }, ref) => {
    const [calendarOpen, setCalendarOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);
    const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(
      value && isValid(new Date(value)) ? new Date(value) : undefined
    );

    // Sync with external value changes
    React.useEffect(() => {
      setInputValue(value);
      if (value && isValid(new Date(value))) {
        setCalendarDate(new Date(value));
      } else {
        setCalendarDate(undefined);
      }
    }, [value]);

    const formatDateInput = (input: string) => {
      // Remove all non-digits
      const digits = input.replace(/\D/g, '');
      
      // Apply formatting
      if (digits.length <= 4) {
        return digits;
      } else if (digits.length <= 6) {
        return `${digits.slice(0, 4)}-${digits.slice(4)}`;
      } else {
        return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
      }
    };

    const validateDate = (dateStr: string): string | null => {
      if (!dateStr) return null;
      
      // Check format
      const formatRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!formatRegex.test(dateStr)) {
        return "Please enter date in YYYY-MM-DD format";
      }

      const date = new Date(dateStr);
      
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
      
      // Only call onChange if we have a complete date or empty
      if (formatted === '' || formatted.length === 10) {
        onChange?.(formatted);
        
        // Update calendar date if valid
        if (formatted.length === 10 && isValid(new Date(formatted))) {
          setCalendarDate(new Date(formatted));
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
  
  // Check format
  const formatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!formatRegex.test(dateStr)) {
    return "Please enter date in YYYY-MM-DD format";
  }

  const date = new Date(dateStr);
  
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