import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

interface JobTitleInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string, translatedValue?: string) => void;
  onTranslationChange?: (original: string, translated: string) => void;
}

// Validation patterns
const JOB_TITLE_PATTERN = /^[\p{L}\s]{2,100}$/u; // Unicode letters and spaces, 2-100 chars
const NUMBERS_ONLY_PATTERN = /^[0-9\s]*$/;
const SYMBOLS_ONLY_PATTERN = /^[^\p{L}0-9\s]*$/u;
// More precise emoji pattern - focuses on actual emoji ranges, avoiding accented characters  
const EMOJI_PATTERN = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/u;

// Check for gibberish patterns
const isGibberish = (value: string): boolean => {
  const cleanValue = value.trim().toLowerCase();
  
  // Check for repeated characters (more than 50% repeated)
  const charCount: Record<string, number> = {};
  for (const char of cleanValue.replace(/\s/g, '')) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  const totalChars = cleanValue.replace(/\s/g, '').length;
  const maxRepeated = Math.max(...Object.values(charCount));
  
  if (totalChars > 0 && maxRepeated / totalChars > 0.5) {
    return true;
  }
  
  // Check for simple sequences
  const sequences = ['abcd', 'efgh', 'ijkl', 'mnop', 'qrst', 'uvwx', 'yzab', '1234', '5678', '9012'];
  return sequences.some(seq => cleanValue.includes(seq));
};

// Capitalize job title properly
const capitalizeJobTitle = (value: string): string => {
  return value.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Enhanced translation service with comprehensive language support
const translateJobTitle = async (jobTitle: string): Promise<string | null> => {
  try {
    const words = jobTitle.toLowerCase().trim();
    
    // Check if input is already in English (common English job titles)
    const englishJobTitles = [
      'doctor', 'nurse', 'teacher', 'engineer', 'lawyer', 'accountant', 'manager', 'director',
      'developer', 'programmer', 'designer', 'consultant', 'analyst', 'specialist', 'coordinator',
      'supervisor', 'administrator', 'executive', 'technician', 'assistant', 'secretary',
      'salesperson', 'chef', 'mechanic', 'electrician', 'plumber', 'driver', 'pilot',
      'artist', 'musician', 'writer', 'journalist', 'photographer', 'architect'
    ];
    
    if (englishJobTitles.some(title => words.includes(title))) {
      return capitalizeJobTitle(jobTitle);
    }
    
    // Comprehensive translation mappings
    const translations = {
      // French translations
      'médecin': 'Doctor',
      'docteur': 'Doctor', 
      'infirmier': 'Nurse',
      'infirmière': 'Nurse',
      'professeur': 'Teacher',
      'enseignant': 'Teacher',
      'formateur': 'Trainer',
      'ingénieur': 'Engineer',
      'avocat': 'Lawyer',
      'comptable': 'Accountant',
      'vendeur': 'Salesperson',
      'vendeuse': 'Salesperson',
      'cuisinier': 'Chef',
      'cuisinière': 'Chef',
      'mécanicien': 'Mechanic',
      'électricien': 'Electrician',
      'plombier': 'Plumber',
      'jardinier': 'Gardener',
      'chauffeur': 'Driver',
      'pilote': 'Pilot',
      'artiste français': 'Artist',
      'musicien': 'Musician',
      'écrivain': 'Writer',
      'journaliste': 'Journalist',
      'photographe': 'Photographer',
      'architecte': 'Architect',
      'développeur': 'Developer',
      'programmeur': 'Programmer',
      'designer': 'Designer',
      'graphiste': 'Graphic Designer',
      'gestionnaire': 'Manager',
      'directeur': 'Director',
      'directrice': 'Director',
      'responsable': 'Supervisor',
      'consultant': 'Consultant',
      'analyste': 'Analyst',
      'spécialiste': 'Specialist',
      'coordinateur': 'Coordinator',
      'coordinatrice': 'Coordinator',
      'administrateur': 'Administrator',
      'administratrice': 'Administrator',
      'secrétaire': 'Secretary',
      'assistant': 'Assistant',
      'assistante': 'Assistant',
      'réceptionniste': 'Receptionist',
      'serveur': 'Server',
      'serveuse': 'Server',
      'coiffeur': 'Hairdresser',
      'coiffeuse': 'Hairdresser',
      'boulanger': 'Baker',
      'boulangère': 'Baker',
      'pharmacien': 'Pharmacist',
      'pharmacienne': 'Pharmacist',
      
      // Spanish translations
      'médico': 'Doctor',
      'doctora': 'Doctor',
      'enfermero': 'Nurse',
      'enfermera': 'Nurse',
      'profesor': 'Teacher',
      'profesora': 'Teacher',
      'maestro': 'Teacher',
      'maestra': 'Teacher',
      'ingeniero': 'Engineer',
      'ingeniera': 'Engineer',
      'abogado': 'Lawyer',
      'abogada': 'Lawyer',
      'contador': 'Accountant',
      'contadora': 'Accountant',
      'vendedor español': 'Salesperson',
      'vendedora': 'Salesperson',
      'cocinero': 'Chef',
      'cocinera': 'Chef',
      'mecánico': 'Mechanic',
      'mecánica': 'Mechanic',
      'electricista': 'Electrician',
      'fontanero': 'Plumber',
      'jardinero': 'Gardener',
      'jardinera': 'Gardener',
      'conductor': 'Driver',
      'conductora': 'Driver',
      'artista español': 'Artist',
      'músico': 'Musician',
      'escritor': 'Writer',
      'escritora': 'Writer',
      'periodista': 'Journalist',
      'fotógrafo': 'Photographer',
      'fotógrafa': 'Photographer',
      'arquitecto': 'Architect',
      'arquitecta': 'Architect',
      
      // Italian translations
      'medico': 'Doctor',
      'dottore': 'Doctor',
      'dottoressa': 'Doctor',
      'infermiere': 'Nurse',
      'infermiera': 'Nurse',
      'insegnante': 'Teacher',
      'professore italiano': 'Teacher',
      'professoressa': 'Teacher',
      'ingegnere': 'Engineer',
      'avvocato': 'Lawyer',
      'avvocatessa': 'Lawyer',
      'contabile': 'Accountant',
      'venditore': 'Salesperson',
      'venditrice': 'Salesperson',
      'cuoco': 'Chef',
      'cuoca': 'Chef',
      'meccanico italiano': 'Mechanic',
      'elettricista': 'Electrician',
      'idraulico': 'Plumber',
      'giardiniere': 'Gardener',
      'autista': 'Driver',
      'pilota italiano': 'Pilot',
      'artista italiano': 'Artist',
      'musicista': 'Musician',
      'scrittore': 'Writer',
      'scrittrice': 'Writer',
      'giornalista': 'Journalist',
      'fotografo': 'Photographer',
      'fotografa': 'Photographer',
      'architetto': 'Architect'
    };
    
    // Check for direct translation
    if (translations[words]) {
      return translations[words];
    }
    
    // Enhanced language detection - covers more languages and character sets
    const hasNonEnglishChars = /[àáâäæçèéêëìíîïñòóôöøùúûüÿ]|[ÀÁÂÄÆÇÈÉÊËÌÍÎÏÑÒÓÔÖØÙÚÛÜŸ]|[αβγδεζηθικλμνξοπρστυφχψω]|[абвгдеёжзийклмнопрстуфхцчшщъыьэюя]|[АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ]|[äöüß]|[ñáéíóú]|[ç]/i.test(words);
    
    // If no non-English characters detected, assume it's already English
    if (!hasNonEnglishChars) {
      return capitalizeJobTitle(jobTitle);
    }
    
    return null; // Translation needed but not found
  } catch (error) {
    return null;
  }
};

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
      if (!inputValue.trim()) {
        setInternalError("");
        return true;
      }

      if (inputValue.length < 2) {
        setInternalError("Job title must be at least 2 characters long");
        return false;
      }

      if (inputValue.length > 100) {
        setInternalError("Job title cannot exceed 100 characters");
        return false;
      }

      if (!JOB_TITLE_PATTERN.test(inputValue)) {
        setInternalError("Job title must contain only letters and spaces");
        return false;
      }

      if (NUMBERS_ONLY_PATTERN.test(inputValue)) {
        setInternalError("Job title cannot contain only numbers");
        return false;
      }

      if (SYMBOLS_ONLY_PATTERN.test(inputValue)) {
        setInternalError("Job title cannot contain only symbols");
        return false;
      }

      if (EMOJI_PATTERN.test(inputValue)) {
        setInternalError("Job title cannot contain emojis");
        return false;
      }

      if (isGibberish(inputValue)) {
        setInternalError("Please enter a valid job title");
        return false;
      }

      setInternalError("");
      return true;
    };

    const handleInputChange = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const capitalizedValue = capitalizeJobTitle(rawValue);
      
      setInternalValue(capitalizedValue);
      
      if (validateJobTitle(capitalizedValue)) {
        if (capitalizedValue.trim().length >= 2) {
          // Attempt translation
          setIsTranslating(true);
          setTranslationFailed(false);
          
          const translation = await translateJobTitle(capitalizedValue);
          
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
      const manualValue = capitalizeJobTitle(e.target.value);
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

export const validateJobTitle = (value: string) => {
  if (!value.trim()) return null;
  
  if (value.length < 2) return "Job title must be at least 2 characters long";
  if (value.length > 100) return "Job title cannot exceed 100 characters";
  if (!JOB_TITLE_PATTERN.test(value)) return "Job title must contain only letters and spaces";
  if (NUMBERS_ONLY_PATTERN.test(value)) return "Job title cannot contain only numbers";
  if (SYMBOLS_ONLY_PATTERN.test(value)) return "Job title cannot contain only symbols";
  if (EMOJI_PATTERN.test(value)) return "Job title cannot contain emojis";
  if (isGibberish(value)) return "Please enter a valid job title";
  
  return null;
};

export { JobTitleInput };