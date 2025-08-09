import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Trash2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

// Regex patterns
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const passportRegex = /^[A-Z0-9]{6,9}$/i;
const nationalityRegex = /^(US|CA|AU|JP|KR)$/;
const cityRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
const stateRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
const postalRegex = /^[A-Za-z0-9 -]{3,10}$/;

const addressShape = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

type AddressValues = z.infer<typeof addressShape>;

const applicantBase = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .regex(nameRegex, "Please enter a valid first name (letters, spaces, - and ' allowed)")
      .max(50, 'First name is too long'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .regex(nameRegex, "Please enter a valid last name (letters, spaces, - and ' allowed)")
      .max(50, 'Last name is too long'),
    dateOfBirth: z
      .string()
      .min(1, 'Date of birth is required')
      .regex(dateRegex, 'Use format YYYY-MM-DD'),
    nationality: z.string().regex(nationalityRegex, 'Please select a nationality'),
    email: z.string().min(1, 'Email is required').regex(emailRegex, 'Please enter a valid email address'),
    passportNumber: z
      .string()
      .min(1, 'Passport number is required')
      .regex(passportRegex, 'Use 6-9 characters (letters and numbers)'),
    useSameAddressAsPrimary: z.boolean().optional().default(false),
    address: addressShape,
  })
  .superRefine((val, ctx) => {
    if (!val.useSameAddressAsPrimary) {
      // Validate address only when not sharing with primary
      if (!val.address?.line1 || val.address.line1.trim().length < 3) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Address line 1 is required', path: ['address', 'line1'] });
      }
      if (!val.address?.city || !cityRegex.test(val.address.city)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid city', path: ['address', 'city'] });
      }
      if (!val.address?.state || !stateRegex.test(val.address.state)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid state/province', path: ['address', 'state'] });
      }
      if (!val.address?.postalCode || !postalRegex.test(val.address.postalCode)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid postal code', path: ['address', 'postalCode'] });
      }
      if (!val.address?.country || !nationalityRegex.test(val.address.country)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please select a country', path: ['address', 'country'] });
      }
    }
  });

const schema = z.object({
  applicants: z.array(applicantBase).min(1, 'At least one applicant is required'),
});

type FormValues = z.infer<typeof schema>;

const defaultApplicant = (shareAddress = false): z.infer<typeof applicantBase> => ({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  nationality: '',
  email: '',
  passportNumber: '',
  useSameAddressAsPrimary: shareAddress,
  address: { line1: '', line2: '', city: '', state: '', postalCode: '', country: '' },
});

const Application = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      applicants: [defaultApplicant(false)],
    },
  });

  const { control, handleSubmit, formState } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'applicants' });
  const { isValid, isSubmitting } = formState;

  const onSubmit = () => {
    navigate('/application/documents');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('application.progress.step', { current: 1, total: 4 })}</span>
              <span className="text-sm text-muted-foreground">{t('application.progress.complete', { percent: 25 })}</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('application.title')}</h1>
            <p className="text-muted-foreground">{t('application.subtitle')}</p>
          </div>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('application.personalInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                  {fields.map((field, idx) => {
                    const useSame = useWatch({ control, name: `applicants.${idx}.useSameAddressAsPrimary` });
                    return (
                      <div key={field.id} className="rounded-lg border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {t('application.applicant.title', { defaultValue: 'Applicant {{num}}', num: idx + 1 })}
                          </h3>
                          {idx > 0 && (
                            <Button type="button" variant="outline" onClick={() => remove(idx)} className="flex items-center gap-2">
                              <Trash2 className="h-4 w-4" /> {t('application.applicant.remove', { defaultValue: 'Remove' })}
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={control}
                            name={`applicants.${idx}.firstName`}
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel>
                                  {t('application.personalInfo.firstName.label')} <span aria-hidden="true" className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="text"
                                    inputMode="text"
                                    placeholder={t('application.personalInfo.firstName.placeholder')}
                                    aria-required="true"
                                    aria-invalid={!!fieldState.error}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name={`applicants.${idx}.lastName`}
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel>
                                  {t('application.personalInfo.lastName.label')} <span aria-hidden="true" className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="text"
                                    inputMode="text"
                                    placeholder={t('application.personalInfo.lastName.placeholder')}
                                    aria-required="true"
                                    aria-invalid={!!fieldState.error}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={control}
                            name={`applicants.${idx}.dateOfBirth`}
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel>
                                  {t('application.personalInfo.dateOfBirth.label')} <span aria-hidden="true" className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="date"
                                    placeholder="YYYY-MM-DD"
                                    aria-required="true"
                                    aria-invalid={!!fieldState.error}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={control}
                            name={`applicants.${idx}.nationality`}
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel>
                                  {t('application.personalInfo.nationality.label')} <span aria-hidden="true" className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <select
                                    {...field}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                    aria-required="true"
                                    aria-invalid={!!fieldState.error}
                                  >
                                    <option value="">{t('application.personalInfo.nationality.placeholder')}</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="AU">Australia</option>
                                    <option value="JP">Japan</option>
                                    <option value="KR">South Korea</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={control}
                          name={`applicants.${idx}.email`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>
                                {t('application.personalInfo.email.label')} <span aria-hidden="true" className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  inputMode="email"
                                  placeholder={t('application.personalInfo.email.placeholder')}
                                  aria-required="true"
                                  aria-invalid={!!fieldState.error}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`applicants.${idx}.passportNumber`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>
                                {t('application.personalInfo.passportNumber.label')} <span aria-hidden="true" className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  inputMode="text"
                                  placeholder={t('application.personalInfo.passportNumber.placeholder')}
                                  aria-required="true"
                                  aria-invalid={!!fieldState.error}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Address */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-medium">
                              {t('application.address.title', { defaultValue: 'Address' })}
                            </h4>
                            {idx > 0 && (
                              <FormField
                                control={control}
                                name={`applicants.${idx}.useSameAddressAsPrimary`}
                                render={({ field }) => (
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      id={`sameAddress-${idx}`}
                                      checked={!!field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <label htmlFor={`sameAddress-${idx}`} className="text-sm text-muted-foreground">
                                      {t('application.address.sameAsPrimary', { defaultValue: 'Same as Applicant 1' })}
                                    </label>
                                  </div>
                                )}
                              />
                            )}
                          </div>

                          {!useSame && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={control}
                                name={`applicants.${idx}.address.line1`}
                                render={({ field, fieldState }) => (
                                  <FormItem className="md:col-span-2">
                                    <FormLabel>
                                      {t('application.address.line1.label', { defaultValue: 'Address line 1' })} <span aria-hidden="true" className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} type="text" aria-required="true" aria-invalid={!!fieldState.error} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={control}
                                name={`applicants.${idx}.address.line2`}
                                render={({ field }) => (
                                  <FormItem className="md:col-span-2">
                                    <FormLabel>{t('application.address.line2.label', { defaultValue: 'Address line 2 (optional)' })}</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="text" />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={control}
                                name={`applicants.${idx}.address.city`}
                                render={({ field, fieldState }) => (
                                  <FormItem>
                                    <FormLabel>
                                      {t('application.address.city.label', { defaultValue: 'City' })} <span aria-hidden="true" className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} type="text" aria-required="true" aria-invalid={!!fieldState.error} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={control}
                                name={`applicants.${idx}.address.state`}
                                render={({ field, fieldState }) => (
                                  <FormItem>
                                    <FormLabel>
                                      {t('application.address.state.label', { defaultValue: 'State/Province' })} <span aria-hidden="true" className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} type="text" aria-required="true" aria-invalid={!!fieldState.error} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={control}
                                name={`applicants.${idx}.address.postalCode`}
                                render={({ field, fieldState }) => (
                                  <FormItem>
                                    <FormLabel>
                                      {t('application.address.postalCode.label', { defaultValue: 'Postal code' })} <span aria-hidden="true" className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} type="text" inputMode="text" aria-required="true" aria-invalid={!!fieldState.error} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={control}
                                name={`applicants.${idx}.address.country`}
                                render={({ field, fieldState }) => (
                                  <FormItem>
                                    <FormLabel>
                                      {t('application.address.country.label', { defaultValue: 'Country' })} <span aria-hidden="true" className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <select
                                        {...field}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                        aria-required="true"
                                        aria-invalid={!!fieldState.error}
                                      >
                                        <option value="">{t('application.address.country.placeholder', { defaultValue: 'Select a country' })}</option>
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="AU">Australia</option>
                                        <option value="JP">Japan</option>
                                        <option value="KR">South Korea</option>
                                      </select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}

                          {useSame && idx > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {t('application.address.usingPrimary', { defaultValue: "Using Applicant 1's address" })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => append(defaultApplicant(fields.length > 0))}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      {t('application.applicant.add', { defaultValue: 'Add another person' })}
                    </Button>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t('application.back')}
                    </Button>
                    <Button
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={!isValid || isSubmitting}
                      aria-disabled={!isValid || isSubmitting}
                    >
                      {t('application.continue')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Application;

