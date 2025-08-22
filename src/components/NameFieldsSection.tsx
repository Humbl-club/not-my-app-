import { useTranslation } from 'react-i18next';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PassportNameInput } from '@/components/ui/passport-name-input';
import { cn } from '@/lib/utils';

interface NameFieldsSectionProps<T extends FieldValues> {
  control: Control<T>;
  baseName: string; // e.g., "applicants.0" or "" for single forms
  className?: string;
}

export function NameFieldsSection<T extends FieldValues>({
  control,
  baseName,
  className
}: NameFieldsSectionProps<T>) {
  const { t } = useTranslation();

  const getFieldName = (field: string): FieldPath<T> => {
    return (baseName ? `${baseName}.${field}` : field) as FieldPath<T>;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Section Header */}
      <div className="rounded-lg bg-secondary/50 border border-border/50 p-4">
        <h3 className="font-medium text-foreground mb-1">
          {t('application.personalInfo.nameSection.title', { defaultValue: 'Full Name' })}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('application.personalInfo.nameSection.description', { 
            defaultValue: 'Enter your names exactly as they appear on your passport' 
          })}
        </p>
      </div>

      {/* Name Fields Grid */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {/* Desktop: 3-column layout, Mobile: stacked */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* First Name - Required */}
          <FormField
            control={control}
            name={getFieldName('firstName')}
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium flex items-center gap-1">
                  {t('application.personalInfo.firstName.label')}
                  <span aria-hidden="true" className="text-destructive text-lg leading-none">*</span>
                </FormLabel>
                <FormControl>
                  <PassportNameInput
                    {...field}
                    placeholder={t('application.personalInfo.firstName.placeholder')}
                    aria-required="true"
                    error={fieldState.error?.message}
                    className="transition-all duration-200 focus:shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Second Names - Optional */}
          <FormField
            control={control}
            name={getFieldName('secondNames')}
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium flex items-center gap-2">
                  {t('application.personalInfo.secondNames.label')}
                  <span className="text-xs text-muted-foreground font-normal">
                    {t('application.personalInfo.optional', { defaultValue: '(Optional)' })}
                  </span>
                </FormLabel>
                <FormControl>
                  <PassportNameInput
                    {...field}
                    placeholder={t('application.personalInfo.secondNames.placeholder')}
                    error={fieldState.error?.message}
                    className="transition-all duration-200 focus:shadow-sm border-muted-foreground/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name - Required */}
          <FormField
            control={control}
            name={getFieldName('lastName')}
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium flex items-center gap-1">
                  {t('application.personalInfo.lastName.label')}
                  <span aria-hidden="true" className="text-destructive text-lg leading-none">*</span>
                </FormLabel>
                <FormControl>
                  <PassportNameInput
                    {...field}
                    placeholder={t('application.personalInfo.lastName.placeholder')}
                    aria-required="true"
                    error={fieldState.error?.message}
                    className="transition-all duration-200 focus:shadow-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Helper Text */}
        <div className="text-xs text-muted-foreground bg-muted/30 rounded-md p-3 border border-border/30">
          <p>
            {t('application.personalInfo.nameSection.helperText', {
              defaultValue: 'Use the "Second Names" field for additional given names if they don\'t fit in the first name field. Leave it empty if not needed.'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}