import { useTranslation } from 'react-i18next';
import { Control, FieldPath, FieldValues, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { nationalities } from '@/constants/nationalities';

interface NationalityRadioSectionProps<T extends FieldValues> {
  control: Control<T>;
  baseName: string; // e.g., "applicants.0" or "" for single forms
  className?: string;
}

export function NationalityRadioSection<T extends FieldValues>({
  control,
  baseName,
  className
}: NationalityRadioSectionProps<T>) {
  const { t } = useTranslation();

  const getFieldName = (field: string): FieldPath<T> => {
    return (baseName ? `${baseName}.${field}` : field) as FieldPath<T>;
  };

  // Watch the radio button value
  const hasAdditionalNationalities = useWatch({ 
    control, 
    name: getFieldName('hasAdditionalNationalities')
  });

  const additionalNationalities = useWatch({ 
    control, 
    name: getFieldName('additionalNationalities')
  }) || [];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Do you hold another nationality? - Radio Buttons */}
      <FormField
        control={control}
        name={getFieldName('hasAdditionalNationalities')}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-semibold">
              {t('application.additionalNationalities.label', { 
                defaultValue: 'Do you hold another nationality?' 
              })}
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === 'yes')}
                value={field.value === true ? 'yes' : field.value === false ? 'no' : undefined}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="nationality-yes" />
                  <FormLabel htmlFor="nationality-yes" className="font-normal cursor-pointer">
                    {t('application.options.yes', { defaultValue: 'Yes' })}
                  </FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="nationality-no" />
                  <FormLabel htmlFor="nationality-no" className="font-normal cursor-pointer">
                    {t('application.options.no', { defaultValue: 'No' })}
                  </FormLabel>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Additional Nationalities Section - Show only if "Yes" selected */}
      {hasAdditionalNationalities === true && (
        <FormField 
          control={control} 
          name={getFieldName('additionalNationalities')} 
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {t('application.additionalNationalities.addButton', { 
                  defaultValue: 'Additional Nationalities' 
                })}
                <span className="text-destructive ml-1">*</span>
              </FormLabel>
              <FormControl>
                <div className="space-y-3">
                  {field.value?.map((nationality: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      {/* Use dropdown for known nationalities */}
                      <select
                        value={nationality}
                        onChange={(e) => {
                          const newNationalities = [...(field.value || [])];
                          newNationalities[index] = e.target.value;
                          field.onChange(newNationalities);
                        }}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/5 aria-[invalid=true]:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        aria-invalid={!!fieldState.error}
                      >
                        <option value="">
                          {t('common.select', { 
                            defaultValue: 'Select nationality' 
                          })}
                        </option>
                        {nationalities.map((n) => (
                          <option key={n.code} value={n.code}>{n.name}</option>
                        ))}
                        <option value="OTHER">
                          {t('common.other', { 
                            defaultValue: 'Other (please specify below)' 
                          })}
                        </option>
                      </select>
                      
                      {/* Remove button */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newNationalities = [...(field.value || [])];
                          newNationalities.splice(index, 1);
                          field.onChange(newNationalities);
                        }}
                        aria-label={t('common.remove', { 
                          defaultValue: 'Remove nationality' 
                        })}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Manual input for "Other" nationality */}
                  {field.value?.some((nat: string) => nat === 'OTHER') && (
                    <div className="mt-3">
                      <FormLabel className="text-sm font-medium">
                        {t('common.specify', { 
                          defaultValue: 'Please specify your other nationality' 
                        })}
                      </FormLabel>
                      <Input
                        placeholder={t('common.enterValue', { 
                          defaultValue: 'Enter nationality name' 
                        })}
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  {/* Add button - Limit to 8 additional nationalities */}
                  {(field.value?.length || 0) < 8 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        field.onChange([...(field.value || []), '']);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {t('application.additionalNationalities.addButton', { 
                        defaultValue: 'Add another nationality' 
                      })}
                    </Button>
                  )}

                  {/* Limit message */}
                  {(field.value?.length || 0) >= 8 && (
                    <p className="text-sm text-muted-foreground">
                      {t('common.maxLimit', { 
                        defaultValue: 'Maximum 8 additional nationalities allowed',
                        count: 8
                      })}
                    </p>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}