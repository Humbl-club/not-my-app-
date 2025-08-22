import * as React from "react";
import { Check, ChevronDown, Search, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import { 
  jobClassifications, 
  majorGroups, 
  popularJobs, 
  searchJobs, 
  getJobByCode,
  getSubCategories,
  getCategories,
  type JobClassification 
} from "@/constants/job-classifications";

interface JobData {
  isStandardized?: boolean;
  jobCode?: string;
  titleOriginal?: string;
  titleEnglish?: string;
  category?: string;
}

interface JobSelectorProps {
  value?: JobData;
  onChange?: (value: JobData) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Validation patterns (same as JobTitleInput)
const JOB_TITLE_PATTERN = /^[\p{L}\s]{2,100}$/u;
const NUMBERS_ONLY_PATTERN = /^[0-9\s]*$/;
const SYMBOLS_ONLY_PATTERN = /^[^\p{L}0-9\s]*$/u;
// More precise emoji pattern - focuses on actual emoji ranges, avoiding accented characters
const EMOJI_PATTERN = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/u;

const isGibberish = (value: string): boolean => {
  const cleanValue = value.trim().toLowerCase();
  
  const charCount: Record<string, number> = {};
  for (const char of cleanValue.replace(/\s/g, '')) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  
  const totalChars = cleanValue.replace(/\s/g, '').length;
  const maxRepeated = Math.max(...Object.values(charCount));
  
  if (totalChars > 0 && maxRepeated / totalChars > 0.5) return true;
  
  const sequences = ['abcd', 'efgh', 'ijkl', 'mnop', 'qrst', 'uvwx', 'yzab', '1234', '5678', '9012'];
  return sequences.some(seq => cleanValue.includes(seq));
};

const capitalizeJobTitle = (value: string): string => {
  return value.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const validateJobTitle = (value: string): string | null => {
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

// Simple translation service (mock implementation)
const translateJobTitle = async (jobTitle: string): Promise<string | null> => {
  try {
    const words = jobTitle.toLowerCase().trim();
    
    const translations = {
      'médecin': 'Doctor',
      'docteur': 'Doctor', 
      'infirmier': 'Nurse',
      'infirmière': 'Nurse',
      'professeur': 'Teacher',
      'enseignant': 'Teacher',
      'ingénieur': 'Engineer',
      'avocat': 'Lawyer',
      'comptable': 'Accountant',
      'vendeur': 'Salesperson',
      'vendeuse': 'Salesperson',
      'cuisinier': 'Chef',
      'cuisinière': 'Chef',
    };
    
    if (translations[words]) {
      return translations[words];
    }
    
    const hasNonEnglishChars = /[àáâäæçèéêëìíîïñòóôöùúûüÿ]|[ÀÁÂÄÆÇÈÉÊËÌÍÎÏÑÒÓÔÖÙÚÛÜŸ]|[αβγδεζηθικλμνξοπρστυφχψω]/i.test(words);
    
    if (!hasNonEnglishChars) {
      return capitalizeJobTitle(jobTitle);
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

const JobSelector = React.forwardRef<HTMLButtonElement, JobSelectorProps>(
  ({ value, onChange, placeholder = "Select your job", required = false, disabled = false, className }, ref) => {
    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language || 'en';
    
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [showCustomInput, setShowCustomInput] = React.useState(false);
    const [customInput, setCustomInput] = React.useState("");
    const [customError, setCustomError] = React.useState<string>("");
    const [isTranslating, setIsTranslating] = React.useState(false);
    const [translationFailed, setTranslationFailed] = React.useState(false);
    const [manualTranslation, setManualTranslation] = React.useState("");

    // Get popular jobs first, then categorized jobs
    const filteredJobs = React.useMemo(() => {
      const searchResults = searchJobs(searchValue, currentLanguage);
      
      // Sort: popular jobs first, then alphabetically by title
      return searchResults.sort((a, b) => {
        const aIsPopular = popularJobs.includes(a.code);
        const bIsPopular = popularJobs.includes(b.code);
        
        if (aIsPopular && !bIsPopular) return -1;
        if (!aIsPopular && bIsPopular) return 1;
        if (aIsPopular && bIsPopular) {
          return popularJobs.indexOf(a.code) - popularJobs.indexOf(b.code);
        }
        
        const aTitle = a.titles[currentLanguage] || a.titleEn;
        const bTitle = b.titles[currentLanguage] || b.titleEn;
        return aTitle.localeCompare(bTitle);
      });
    }, [searchValue, currentLanguage]);

    // Group jobs by category and then by subcategory
    const groupedJobs = React.useMemo(() => {
      const groups: Record<string, Record<string, JobClassification[]>> = {};
      
      filteredJobs.forEach(job => {
        if (!groups[job.category]) {
          groups[job.category] = {};
        }
        if (!groups[job.category][job.subCategory]) {
          groups[job.category][job.subCategory] = [];
        }
        groups[job.category][job.subCategory].push(job);
      });
      
      return groups;
    }, [filteredJobs]);

    const selectedJob = React.useMemo(() => {
      if (value?.isStandardized && value.jobCode) {
        return getJobByCode(value.jobCode);
      }
      return null;
    }, [value]);

    const handleJobSelect = React.useCallback((job: JobClassification) => {
      const jobData: JobData = {
        isStandardized: true,
        jobCode: job.code,
        titleOriginal: job.titles[currentLanguage] || job.titleEn,
        titleEnglish: job.titleEn,
        category: job.category
      };
      
      onChange?.(jobData);
      setOpen(false);
      setShowCustomInput(false);
    }, [currentLanguage, onChange]);

    const handleCustomOptionSelect = () => {
      setShowCustomInput(true);
      setOpen(false);
    };

    const handleCustomInputChange = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const capitalizedValue = capitalizeJobTitle(rawValue);
      
      setCustomInput(capitalizedValue);
      
      const error = validateJobTitle(capitalizedValue);
      setCustomError(error || "");
      
      if (!error && capitalizedValue.trim().length >= 2) {
        setIsTranslating(true);
        setTranslationFailed(false);
        
        const translation = await translateJobTitle(capitalizedValue);
        
        setIsTranslating(false);
        
        if (translation) {
          setTranslationFailed(false);
          const jobData: JobData = {
            isStandardized: false,
            titleOriginal: capitalizedValue,
            titleEnglish: translation,
          };
          onChange?.(jobData);
        } else {
          setTranslationFailed(true);
        }
      }
    }, [onChange]);

    const handleManualTranslationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const manualValue = capitalizeJobTitle(e.target.value);
      setManualTranslation(manualValue);
      
      if (manualValue.trim() && customInput.trim()) {
        const jobData: JobData = {
          isStandardized: false,
          titleOriginal: customInput,
          titleEnglish: manualValue,
        };
        onChange?.(jobData);
      }
    };

    const getDisplayValue = () => {
      if (selectedJob) {
        return selectedJob.titles[currentLanguage] || selectedJob.titleEn;
      }
      if (value && !value.isStandardized) {
        return value.titleOriginal;
      }
      return "";
    };

    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={ref}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                aria-required={required}
                disabled={disabled}
                className={cn(
                  "w-full justify-between text-left font-normal",
                  !value && "text-muted-foreground",
                  className
                )}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 opacity-50" />
                  <span className="truncate">
                    {getDisplayValue() || placeholder}
                  </span>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command className="rounded-lg border-none">
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput
                    placeholder={t('jobSelector.searchPlaceholder')}
                    value={searchValue}
                    onValueChange={setSearchValue}
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <CommandList className="max-h-[300px] overflow-y-auto">
                  {filteredJobs.length === 0 && searchValue && (
                    <CommandEmpty>{t('jobSelector.noJobsFound')}</CommandEmpty>
                  )}
                  
                  {/* Popular Jobs Section */}
                  {!searchValue && (
                    <CommandGroup heading={t('jobSelector.popularJobs')}>
                      {jobClassifications
                        .filter(job => popularJobs.includes(job.code))
                        .sort((a, b) => popularJobs.indexOf(a.code) - popularJobs.indexOf(b.code))
                        .map((job) => {
                          const title = job.titles[currentLanguage] || job.titleEn;
                          return (
                            <CommandItem
                              key={job.code}
                              value={`${job.code}-${title}`}
                              onSelect={() => handleJobSelect(job)}
                              className="flex items-center justify-between"
                            >
                               <div className="flex flex-col">
                                 <span>{title}</span>
                                 <span className="text-xs text-muted-foreground">
                                   {job.subCategory}
                                 </span>
                               </div>
                              {value?.jobCode === job.code && (
                                <Check className="h-4 w-4" />
                              )}
                            </CommandItem>
                          );
                        })}
                    </CommandGroup>
                  )}
                  
                   {/* Job Categories and Subcategories */}
                   {Object.entries(groupedJobs).map(([categoryName, subCategories]) => (
                     <div key={categoryName}>
                       {/* Category Header */}
                       <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b">
                         {categoryName}
                       </div>
                       
                       {/* Subcategories */}
                       {Object.entries(subCategories).map(([subCategoryName, jobs]) => (
                         <CommandGroup key={`${categoryName}-${subCategoryName}`} heading={subCategoryName}>
                           {jobs.map((job) => {
                             const title = job.titles[currentLanguage] || job.titleEn;
                             return (
                               <CommandItem
                                 key={job.code}
                                 value={`${job.code}-${title}`}
                                 onSelect={() => handleJobSelect(job)}
                                 className="flex items-center justify-between"
                               >
                                 <div className="flex flex-col">
                                   <span>{title}</span>
                                   <span className="text-xs text-muted-foreground">
                                     {job.subCategory}
                                   </span>
                                 </div>
                                 {value?.jobCode === job.code && (
                                   <Check className="h-4 w-4" />
                                 )}
                               </CommandItem>
                             );
                           })}
                         </CommandGroup>
                       ))}
                     </div>
                   ))}
                  
                  {/* Other Option */}
                  <Separator />
                   <CommandGroup>
                     <CommandItem onSelect={handleCustomOptionSelect}>
                       <div className="flex flex-col">
                         <span>{t('jobSelector.other')}</span>
                         <span className="text-xs text-muted-foreground">
                           {t('jobSelector.customJobPrompt')}
                         </span>
                       </div>
                     </CommandItem>
                   </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {/* Custom Input Section */}
          {showCustomInput && (
            <div className="space-y-3 p-4 border rounded-md bg-muted/20">
              <div className="space-y-2">
                <Label htmlFor="custom-job-input" className="text-sm font-medium">
                  {t('jobSelector.enterJobTitle')}
                </Label>
                <Input
                  id="custom-job-input"
                  value={customInput}
                  onChange={handleCustomInputChange}
                  placeholder={t('jobSelector.typeJobTitle')}
                  className={cn(
                    customError && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {customError && (
                  <p className="text-sm text-destructive">{customError}</p>
                )}
              </div>
              
              {isTranslating && (
                <p className="text-sm text-muted-foreground">{t('jobSelector.translating')}</p>
              )}
              
              {value?.titleEnglish && !translationFailed && !isTranslating && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{t('jobSelector.englishTranslation')}</span> {value.titleEnglish} ({value.titleOriginal})
                </div>
              )}
              
              {translationFailed && customInput.length >= 2 && (
                <div className="space-y-2">
                  <Label htmlFor="manual-translation" className="text-sm text-muted-foreground">
                    {t('jobSelector.manualTranslationPrompt')}
                  </Label>
                  <Input
                    id="manual-translation"
                    value={manualTranslation}
                    onChange={handleManualTranslationChange}
                    placeholder={t('jobSelector.englishJobTitle')}
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCustomInput(false);
                    setCustomInput("");
                    setCustomError("");
                    setTranslationFailed(false);
                    setManualTranslation("");
                  }}
                >
                  {t('jobSelector.cancel')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

JobSelector.displayName = "JobSelector";

export { JobSelector };
