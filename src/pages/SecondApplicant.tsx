import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { nationalities } from '@/constants/nationalities';

const SecondApplicant = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Load primary applicant from session storage
  const [primaryApplicant, setPrimaryApplicant] = useState<any | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('application.primaryApplicant');
      if (raw) setPrimaryApplicant(JSON.parse(raw));
    } catch {}
  }, []);

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const passportRegex = /^[A-Z0-9]{6,9}$/i;
  const nationalityRegex = /^(AF|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|CV|KH|CM|CA|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|SZ|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/;

  const addressShape = z.object({
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  });

  const secondApplicantSchema = z.object({
    firstName: z.string().min(1, 'First name is required').regex(nameRegex).max(50),
    lastName: z.string().min(1, 'Last name is required').regex(nameRegex).max(50),
    dateOfBirth: z.string().min(1, 'Date of birth is required').regex(dateRegex, 'Use format YYYY-MM-DD'),
    nationality: z.string().regex(nationalityRegex, 'Please select a nationality'),
    hasAdditionalNationalities: z.boolean().optional().default(false),
    additionalNationalities: z.array(z.string().regex(nationalityRegex, 'Please select a nationality')).optional().default([]),
    email: z.string().min(1, 'Email is required').regex(emailRegex, 'Please enter a valid email address'),
    passportNumber: z.string().min(1, 'Passport number is required').regex(passportRegex, 'Use 6-9 characters (letters and numbers)'),
    useSameAddressAsPrimary: z.boolean().optional().default(false),
    useSameEmailAsPrimary: z.boolean().optional().default(false),
    address: addressShape,
    hasJob: z.enum(['yes', 'no'], { required_error: 'Please answer if you have a job' }),
    job: z.string().optional(),
    hasCriminalConvictions: z.enum(['yes', 'no'], { required_error: 'Please answer about criminal convictions' }),
    hasWarCrimesConvictions: z.enum(['yes', 'no'], { required_error: 'Please answer about war crimes convictions' }),
  }).superRefine((val, ctx) => {
    if (val.hasAdditionalNationalities && (!val.additionalNationalities || val.additionalNationalities.length === 0)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please select at least one additional nationality', path: ['additionalNationalities'] });
    }
    if (val.additionalNationalities && val.additionalNationalities.length > 0) {
      val.additionalNationalities.forEach((nat, index) => {
        if (!nat || !nationalityRegex.test(nat)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please select a nationality', path: ['additionalNationalities', index] });
        }
      });
    }
    if (!val.useSameAddressAsPrimary) {
      if (!val.address?.line1 || val.address.line1.trim().length < 3) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Address line 1 is required', path: ['address','line1'] });
      }
      if (!val.address?.city || !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/.test(val.address.city)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid city', path: ['address','city'] });
      }
      if (!val.address?.state || !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/.test(val.address.state)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid state/province', path: ['address','state'] });
      }
      if (!val.address?.postalCode || !/^[A-Za-z0-9 -]{3,10}$/.test(val.address.postalCode)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid postal code', path: ['address','postalCode'] });
      }
      if (!val.address?.country || !nationalityRegex.test(val.address.country)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please select a country', path: ['address','country'] });
      }
    }
    
    // Employment validation
    if (val.hasJob === 'yes' && (!val.job || val.job.trim().length < 2)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please enter your job title', path: ['job'] });
    }
  });

  type SecondApplicantValues = z.infer<typeof secondApplicantSchema>;

  const form = useForm<SecondApplicantValues>({
    resolver: zodResolver(secondApplicantSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      hasAdditionalNationalities: false,
      additionalNationalities: [],
      email: '',
      passportNumber: '',
      useSameAddressAsPrimary: false,
      useSameEmailAsPrimary: !!primaryApplicant?.email,
      address: { line1: '', line2: '', city: '', state: '', postalCode: '', country: '' },
      hasJob: undefined,
      job: '',
      hasCriminalConvictions: undefined,
      hasWarCrimesConvictions: undefined,
    },
  });

  const useSameEmail = useWatch({ control: form.control, name: 'useSameEmailAsPrimary' });
  const useSameAddress = useWatch({ control: form.control, name: 'useSameAddressAsPrimary' });
  const hasJob = useWatch({ control: form.control, name: 'hasJob' });

  useEffect(() => {
    if (useSameEmail && primaryApplicant?.email) {
      form.setValue('email', primaryApplicant.email, { shouldValidate: true });
    }
  }, [useSameEmail, primaryApplicant?.email]);

  useEffect(() => {
    if (useSameAddress && primaryApplicant?.address) {
      form.setValue('address', primaryApplicant.address, { shouldValidate: true });
    }
  }, [useSameAddress, primaryApplicant?.address]);

  const handleSubmit = async (values: SecondApplicantValues) => {
    try {
      sessionStorage.setItem('application.secondApplicant', JSON.stringify(values));
    } catch {}
    navigate('/application/second-applicant/documents');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('application.progress.step', { current: 2, total: 4 })}</span>
              <span className="text-sm text-muted-foreground">{t('application.progress.complete', { percent: 50 })}</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Second Applicant</h1>
            <p className="text-muted-foreground">Please provide details for the second applicant</p>
          </div>

          {/* Second Applicant Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('application.personalInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="firstName" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('application.personalInfo.firstName.label')} <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} aria-invalid={!!fieldState.error} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('application.personalInfo.lastName.label')} <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} aria-invalid={!!fieldState.error} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="dateOfBirth" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('application.personalInfo.dateOfBirth.label')} <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input {...field} type="date" placeholder="YYYY-MM-DD" aria-invalid={!!fieldState.error} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="nationality" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('application.personalInfo.nationality.label')} <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/5 aria-[invalid=true]:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            aria-invalid={!!fieldState.error}
                          >
                            <option value="">{t('application.personalInfo.nationality.placeholder')}</option>
                            {nationalities.map((n) => (
                              <option key={n.code} value={n.code}>{n.name}</option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="space-y-4">
                    <FormField control={form.control} name="hasAdditionalNationalities" render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="hasAdditionalNationalities" 
                            checked={!!field.value} 
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) {
                                form.setValue('additionalNationalities', []);
                              } else if (form.getValues('additionalNationalities').length === 0) {
                                form.setValue('additionalNationalities', ['']);
                              }
                            }} 
                          />
                          <label htmlFor="hasAdditionalNationalities" className="text-sm font-medium">
                            {t('application.personalInfo.additionalNationality.question', { defaultValue: 'Do you hold another nationality?' })}
                          </label>
                        </div>
                      </FormItem>
                    )} />

                    {form.watch('hasAdditionalNationalities') && (
                      <div className="space-y-3">
                        {form.watch('additionalNationalities').map((_, index) => (
                          <div key={index} className="flex items-end gap-3">
                            <FormField 
                              control={form.control} 
                              name={`additionalNationalities.${index}`} 
                              render={({ field, fieldState }) => (
                                <FormItem className="flex-1">
                                  {index === 0 && (
                                    <FormLabel>{t('application.personalInfo.additionalNationality.label', { defaultValue: 'Additional nationality' })} <span className="text-destructive">*</span></FormLabel>
                                  )}
                                  <FormControl>
                                    <select
                                      {...field}
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/5 aria-[invalid=true]:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                      aria-invalid={!!fieldState.error}
                                    >
                                      <option value="">{t('application.personalInfo.nationality.placeholder')}</option>
                                      {nationalities.map((n) => (
                                        <option key={n.code} value={n.code}>{n.name}</option>
                                      ))}
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex gap-2">
                              {index === form.watch('additionalNationalities').length - 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const current = form.getValues('additionalNationalities');
                                    form.setValue('additionalNationalities', [...current, '']);
                                  }}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                              {form.watch('additionalNationalities').length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const current = form.getValues('additionalNationalities');
                                    form.setValue('additionalNationalities', current.filter((_, i) => i !== index));
                                  }}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField control={form.control} name="passportNumber" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{t('application.personalInfo.passportNumber.label')} <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={!!fieldState.error} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Email Section */}
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <FormField control={form.control} name="useSameEmailAsPrimary" render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="useSameEmailAsPrimary" 
                              checked={!!field.value} 
                              onCheckedChange={field.onChange}
                              disabled={!primaryApplicant?.email}
                            />
                            <label htmlFor="useSameEmailAsPrimary" className="text-sm font-medium">
                              {t('application.payment.email.sameAsPrimary', { defaultValue: 'Same as Applicant 1' })}
                            </label>
                          </div>
                        </FormItem>
                      )} />

                      {useSameEmail && primaryApplicant?.email ? (
                        <div className="p-3 bg-muted rounded-md">
                          <p className="text-sm text-muted-foreground">
                            {t('application.payment.email.usingPrimary', { defaultValue: 'Using Applicant 1\'s email address' })}: {primaryApplicant.email}
                          </p>
                        </div>
                      ) : (
                        <FormField control={form.control} name="email" render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>{t('application.personalInfo.email.label')} <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} type="email" aria-invalid={!!fieldState.error} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      )}
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('application.payment.address.title', { defaultValue: 'Address' })}</h3>
                    
                    <FormField control={form.control} name="useSameAddressAsPrimary" render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="useSameAddressAsPrimary" 
                            checked={!!field.value} 
                            onCheckedChange={field.onChange}
                            disabled={!primaryApplicant?.address}
                          />
                          <label htmlFor="useSameAddressAsPrimary" className="text-sm font-medium">
                            {t('application.payment.address.sameAsPrimary', { defaultValue: 'Same as Applicant 1' })}
                          </label>
                        </div>
                      </FormItem>
                    )} />

                    {useSameAddress && primaryApplicant?.address ? (
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                          {t('application.payment.address.usingPrimary', { defaultValue: 'Using Applicant 1\'s address' })}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FormField control={form.control} name="address.line1" render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>{t('application.payment.address.line1.label', { defaultValue: 'Address line 1' })} <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} aria-invalid={!!fieldState.error} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="address.line2" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('application.payment.address.line2.label', { defaultValue: 'Address line 2 (optional)' })}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="address.city" render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>{t('application.payment.address.city.label', { defaultValue: 'City' })} <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} aria-invalid={!!fieldState.error} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="address.state" render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>{t('application.payment.address.state.label', { defaultValue: 'State/Province' })} <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} aria-invalid={!!fieldState.error} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="address.postalCode" render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>{t('application.payment.address.postalCode.label', { defaultValue: 'Postal code' })} <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} aria-invalid={!!fieldState.error} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="address.country" render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>{t('application.payment.address.country.label', { defaultValue: 'Country' })} <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/5 aria-[invalid=true]:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                  aria-invalid={!!fieldState.error}
                                >
                                  <option value="">{t('application.payment.address.country.placeholder', { defaultValue: 'Select a country' })}</option>
                                  {nationalities.map((n) => (
                                    <option key={n.code} value={n.code}>{n.name}</option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Employment Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('application.employment.title')}</h3>
                    
                    <FormField control={form.control} name="hasJob" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('application.employment.hasJob.label')} <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="hasJob-yes" />
                              <label htmlFor="hasJob-yes" className="text-sm font-medium">{t('application.payment.options.yes')}</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="hasJob-no" />
                              <label htmlFor="hasJob-no" className="text-sm font-medium">{t('application.payment.options.no')}</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {hasJob === 'yes' && (
                      <FormField control={form.control} name="job" render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>{t('application.employment.jobTitle.label')} <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('application.employment.jobTitle.placeholder')} aria-invalid={!!fieldState.error} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    )}
                  </div>

                  {/* Security Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('application.security.title')}</h3>
                    
                    <FormField control={form.control} name="hasCriminalConvictions" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('application.security.criminalConvictions.label')} <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="criminalConvictions-yes" />
                              <label htmlFor="criminalConvictions-yes" className="text-sm font-medium">{t('application.payment.options.yes')}</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="criminalConvictions-no" />
                              <label htmlFor="criminalConvictions-no" className="text-sm font-medium">{t('application.payment.options.no')}</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="hasWarCrimesConvictions" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('application.security.warCrimes.label')} <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="warCrimes-yes" />
                              <label htmlFor="warCrimes-yes" className="text-sm font-medium">{t('application.payment.options.yes')}</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="warCrimes-no" />
                              <label htmlFor="warCrimes-no" className="text-sm font-medium">{t('application.payment.options.no')}</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => navigate('/application/payment')}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t('application.back')}
                    </Button>
                    <Button type="submit" className="flex items-center gap-2">
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

export default SecondApplicant;