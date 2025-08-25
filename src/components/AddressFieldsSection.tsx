import { useTranslation } from 'react-i18next';
import { Control, FieldPath, FieldValues, useWatch, UseFormReturn } from 'react-hook-form';
import { useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { addressValidationRules, extractAddressFromPassport } from '@/utils/addressValidator';

interface AddressFieldsSectionProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  baseName: string; // e.g., "applicants.0" or "" for single forms
  className?: string;
  showSameAsPassportOption?: boolean;
  passportData?: any; // Uploaded passport data for extraction
}

export function AddressFieldsSection<T extends FieldValues>({
  form,
  baseName,
  className,
  showSameAsPassportOption = true,
  passportData
}: AddressFieldsSectionProps<T>) {
  const { t } = useTranslation();
  const [isExtracting, setIsExtracting] = useState(false);

  const getFieldName = (field: string): FieldPath<T> => {
    return (baseName ? `${baseName}.${field}` : field) as FieldPath<T>;
  };

  // Watch the "same as passport" checkbox
  const useSameAsPassport = useWatch({ 
    control: form.control, 
    name: getFieldName('useSameAddressAsPassport')
  });

  const handleSameAsPassportChange = async (checked: boolean) => {
    if (checked && passportData) {
      setIsExtracting(true);
      try {
        // Extract address from passport data
        const extractedAddress = extractAddressFromPassport(passportData);
        
        // Set the extracted values using setValue method
        form.setValue(getFieldName('address.line1'), extractedAddress.line1 as any);
        form.setValue(getFieldName('address.line2'), extractedAddress.line2 as any);
        form.setValue(getFieldName('address.line3'), extractedAddress.line3 as any);
        form.setValue(getFieldName('address.city'), extractedAddress.city as any);
        form.setValue(getFieldName('address.country'), extractedAddress.country as any);
        form.setValue(getFieldName('address.postalCode'), extractedAddress.postalCode as any);
      } catch (error) {
        console.error('Address extraction failed:', error);
      } finally {
        setIsExtracting(false);
      }
    } else if (!checked) {
      // Clear address fields when unchecked
      form.setValue(getFieldName('address.line1'), '' as any);
      form.setValue(getFieldName('address.line2'), '' as any);
      form.setValue(getFieldName('address.line3'), '' as any);
      form.setValue(getFieldName('address.city'), '' as any);
      form.setValue(getFieldName('address.country'), '' as any);
      form.setValue(getFieldName('address.postalCode'), '' as any);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Same as Passport Checkbox */}
      {showSameAsPassportOption && (
        <FormField
          control={form.control}
          name={getFieldName('useSameAddressAsPassport')}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleSameAsPassportChange(!!checked);
                  }}
                  disabled={!passportData || isExtracting}
                />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel className="text-base font-semibold">
                  {t('application.address.sameAsPassport.label')}
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  {t('application.address.sameAsPassport.description')}
                </p>
                {isExtracting && (
                  <p className="text-sm text-primary">
                    {t('application.address.extracting')}
                  </p>
                )}
              </div>
            </FormItem>
          )}
        />
      )}

      {/* Manual Address Fields - Hidden when using passport address */}
      {!useSameAsPassport && (
        <div className="grid grid-cols-1 gap-4">
          {/* Address Line 1 - Required */}
          <FormField
            control={form.control}
            name={getFieldName('address.line1')}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  {t('application.address.line1.label')}
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('application.address.line1.placeholder')}
                    aria-invalid={!!fieldState.error}
                    onBlur={(e) => {
                      const error = addressValidationRules.line1(e.target.value);
                      if (error) {
                        fieldState.error = { message: error } as any;
                      }
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Line 2 - Optional */}
          <FormField
            control={form.control}
            name={getFieldName('address.line2')}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  {t('application.address.line2.label')}
                  <span className="text-xs text-muted-foreground ml-2">
                    {t('application.personalInfo.optional')}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('application.address.line2.placeholder')}
                    aria-invalid={!!fieldState.error}
                    onBlur={(e) => {
                      const error = addressValidationRules.line2(e.target.value);
                      if (error) {
                        fieldState.error = { message: error } as any;
                      }
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Line 3 - Optional */}
          <FormField
            control={form.control}
            name={getFieldName('address.line3')}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  {t('application.address.line3.label')}
                  <span className="text-xs text-muted-foreground ml-2">
                    {t('application.personalInfo.optional')}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('application.address.line3.placeholder')}
                    aria-invalid={!!fieldState.error}
                    onBlur={(e) => {
                      const error = addressValidationRules.line3(e.target.value);
                      if (error) {
                        fieldState.error = { message: error } as any;
                      }
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* City and Country Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={getFieldName('address.city')}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t('application.address.city.label')}
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('application.address.city.placeholder')}
                      aria-invalid={!!fieldState.error}
                      onBlur={(e) => {
                        const error = addressValidationRules.city(e.target.value);
                        if (error) {
                          fieldState.error = { message: error } as any;
                        }
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={getFieldName('address.country')}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t('application.address.country.label')}
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('application.address.country.placeholder')}
                      aria-invalid={!!fieldState.error}
                      onBlur={(e) => {
                        const error = addressValidationRules.country(e.target.value);
                        if (error) {
                          fieldState.error = { message: error } as any;
                        }
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Postal Code - Optional */}
          <FormField
            control={form.control}
            name={getFieldName('address.postalCode')}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  {t('application.address.postalCode.label')}
                  <span className="text-xs text-muted-foreground ml-2">
                    {t('application.personalInfo.optional')}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t('application.address.postalCode.placeholder')}
                    aria-invalid={!!fieldState.error}
                    onBlur={(e) => {
                      const error = addressValidationRules.postalCode(e.target.value);
                      if (error) {
                        fieldState.error = { message: error } as any;
                      }
                      field.onBlur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}