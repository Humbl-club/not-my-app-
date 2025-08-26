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
import { FieldStatusIndicator } from '@/components/FieldStatusIndicator';
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
    <div className={cn("grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 overflow-hidden", className)}>
      {/* First Name - Required */}
      <FormField
        control={control}
        name={getFieldName('firstName')}
        render={({ field, fieldState }) => (
          <FormItem className="relative space-y-1 w-full min-w-0">
            <FieldStatusIndicator
              isRequired={true}
              hasValue={!!field.value?.trim()}
              hasError={!!fieldState.error}
              className="z-10"
            />
            <FormLabel className="text-sm font-medium leading-5 min-h-[3rem] break-words text-start flex items-start gap-1">
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
          <FormItem className="space-y-1 w-full min-w-0">
            <FormLabel className="text-sm font-medium leading-5 min-h-[3rem] break-words text-start flex items-start gap-2">
              {t('application.personalInfo.secondNames.label')}
              <span className="text-xs text-muted-foreground font-normal">
                {t('application.personalInfo.optional', { defaultValue: '(Optional)' })}
              </span>
            </FormLabel>
            <FormControl>
              <PassportNameInput
                {...field}
                required={false}
                placeholder={t('application.personalInfo.secondNames.placeholder')}
                error={fieldState.error?.message}
                className="transition-all duration-200 focus:shadow-sm"
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
          <FormItem className="relative space-y-1 w-full min-w-0">
            <FieldStatusIndicator
              isRequired={true}
              hasValue={!!field.value?.trim()}
              hasError={!!fieldState.error}
              className="z-10"
            />
            <FormLabel className="text-sm font-medium leading-5 min-h-[3rem] break-words text-start flex items-start gap-1">
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
  );
}