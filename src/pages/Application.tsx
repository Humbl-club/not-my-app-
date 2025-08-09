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
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useEffect, useMemo } from 'react';
import { nationalities } from '@/constants/nationalities';

// Regex patterns
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const passportRegex = /^[A-Z0-9]{6,9}$/i;
const nationalityRegex = /^(AF|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|CV|KH|CM|CA|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|SZ|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/;
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
    hasAdditionalNationalities: z.boolean().optional().default(false),
    additionalNationalities: z.array(z.string().regex(nationalityRegex, 'Please select a nationality')).optional().default([]),
    email: z.string().min(1, 'Email is required').regex(emailRegex, 'Please enter a valid email address'),
    passportNumber: z
      .string()
      .min(1, 'Passport number is required')
      .regex(passportRegex, 'Use 6-9 characters (letters and numbers)'),
    hasJob: z.enum(['yes', 'no'], { required_error: 'Please answer this question' }),
    job: z.string().optional(),
    hasCriminalConvictions: z.enum(['yes', 'no'], { required_error: 'Please answer this question' }),
    hasWarCrimesConvictions: z.enum(['yes', 'no'], { required_error: 'Please answer this question' }),
    useSameAddressAsPrimary: z.boolean().optional().default(false),
    useSameEmailAsPrimary: z.boolean().optional().default(false),
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
      const countryCode = val.address?.country ?? '';
      const stateRequired = ['US','CA'].includes(countryCode);
      if (stateRequired) {
        if (!val.address?.state || !stateRegex.test(val.address.state)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid state/province', path: ['address', 'state'] });
        }
      } else {
        if (val.address?.state && !stateRegex.test(val.address.state)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid state/province', path: ['address', 'state'] });
        }
      }
      if (!val.address?.postalCode || !postalRegex.test(val.address.postalCode)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid postal code', path: ['address', 'postalCode'] });
      }
      if (!val.address?.country || !nationalityRegex.test(val.address.country)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please select a country', path: ['address', 'country'] });
      }
    }

    // Employment validation
    if (val.hasJob === 'yes') {
      if (!val.job || val.job.trim().length < 2) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Job title is required', path: ['job'] });
      }
    }

    if (val.hasAdditionalNationalities) {
      const arr = val.additionalNationalities ?? [];
      if (arr.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please add at least one nationality', path: ['additionalNationalities'] });
      }
      arr.forEach((c, i) => {
        if (!nationalityRegex.test(c)) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please select a nationality', path: ['additionalNationalities', i] });
        }
      });
    }
  });

const schema = z.object({
  applicants: z.array(applicantBase).min(1, 'At least one applicant is required'),
});

type FormValues = z.infer<typeof schema>;

const defaultApplicant = (shareAddress = false, shareEmail = false): z.infer<typeof applicantBase> => ({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  nationality: '',
  hasAdditionalNationalities: false,
  additionalNationalities: [],
  email: '',
  passportNumber: '',
  hasJob: undefined as any,
  job: '',
  hasCriminalConvictions: undefined as any,
  hasWarCrimesConvictions: undefined as any,
  useSameAddressAsPrimary: shareAddress,
  useSameEmailAsPrimary: shareEmail,
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
  
  // Watch all applicants to avoid hooks issues
  const applicants = useWatch({ control, name: 'applicants' });

  const primaryEmail = applicants?.[0]?.email ?? '';

  useEffect(() => {
    if (!applicants) return;
    applicants.forEach((a, i) => {
      if (i === 0) return;
      if (a?.useSameEmailAsPrimary) {
        form.setValue(`applicants.${i}.email`, primaryEmail, { shouldValidate: true });
      }
    });
  }, [primaryEmail, applicants?.length, JSON.stringify(applicants?.map(a => a?.useSameEmailAsPrimary))]);

  const applicantsWithErrors = useMemo(() => {
    const errs = (formState.errors?.applicants as any[]) || [];
    const list: number[] = [];
    errs.forEach((e, i) => { if (e) list.push(i); });
    return list;
  }, [formState.errors]);

  const firstErrorPath = useMemo(() => {
      const errs: any[] = (formState.errors?.applicants as any[]) || [];
    for (let i = 0; i < errs.length; i++) {
      const e = errs[i];
      if (!e) continue;
      const order = ['firstName','lastName','dateOfBirth','nationality','email','passportNumber','hasJob','job','hasCriminalConvictions','hasWarCrimesConvictions'];
      for (const k of order) { if (e?.[k]) return `applicants.${i}.${k}` as const; }
      if (e?.additionalNationalities && Array.isArray(e.additionalNationalities)) {
        for (let j = 0; j < e.additionalNationalities.length; j++) {
          if (e.additionalNationalities[j]) {
            return `applicants.${i}.additionalNationalities.${j}` as const;
          }
        }
      }
      if (e?.address) {
        const addrOrder = ['line1','city','state','postalCode','country'];
        for (const k of addrOrder) { if (e.address?.[k]) return `applicants.${i}.address.${k}` as const; }
      }
    }
    return null;
  }, [formState.errors]);

  const onSubmit = () => {
    const primary = form.getValues('applicants.0');
    try {
      sessionStorage.setItem('application.primaryApplicant', JSON.stringify(primary));
    } catch {}
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
                  {formState.submitCount > 0 && !isValid && (
                    <div role="alert" aria-live="polite" className="rounded-md border border-destructive/50 bg-destructive/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-destructive">Some required fields are missing or invalid.</p>
                          {applicantsWithErrors.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Applicants needing attention: {applicantsWithErrors.map((i) => i + 1).join(', ')}
                            </p>
                          )}
                        </div>
                        {firstErrorPath && (
                          <Button type="button" variant="destructive" size="sm" onClick={() => form.setFocus(firstErrorPath as any)}>
                            Review missing fields
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  {fields.map((field, idx) => {
                    const useSame = applicants?.[idx]?.useSameAddressAsPrimary;
                    const hasApplicantError = !!formState.errors?.applicants?.[idx];
                    const stateRequired = ['US','CA'].includes((applicants?.[idx]?.address?.country as string) || '');
                    return (
                      <div key={field.id} className={cn("rounded-lg border p-4 space-y-4", hasApplicantError && "border-destructive/50 ring-1 ring-destructive/30 bg-destructive/5")}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">
                            {t('application.applicant.title', { defaultValue: 'Applicant {{num}}', num: idx + 1 })}
                          </h3>
                          <div className="flex items-center gap-2">
                            {hasApplicantError && (
                              <Badge variant="destructive">
                                {t('application.errors.needsAttention', { defaultValue: 'Needs attention' })}
                              </Badge>
                            )}
                            {idx > 0 && (
                              <Button type="button" variant="outline" onClick={() => remove(idx)} className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" /> {t('application.applicant.remove', { defaultValue: 'Remove' })}
                              </Button>
                            )}
                          </div>
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
                                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/5 aria-[invalid=true]:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                     aria-required="true"
                                     aria-invalid={!!fieldState.error}
                                   >
                                     <option value="">{t('application.personalInfo.nationality.placeholder')}</option>
                                     {nationalities.map((nationality) => (
                                       <option key={nationality.code} value={nationality.code}>
                                         {nationality.name}
                                       </option>
                                     ))}
                                   </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Additional Nationalities */}
                        <div className="space-y-3">
                          <FormField
                            control={control}
                            name={`applicants.${idx}.hasAdditionalNationalities` as const}
                            render={({ field }) => (
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`hasAdditionalNationalities-${idx}`}
                                  checked={!!field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    if (!checked) {
                                      form.setValue(`applicants.${idx}.additionalNationalities` as const, [], { shouldValidate: true });
                                    } else if ((applicants?.[idx]?.additionalNationalities?.length ?? 0) === 0) {
                                      form.setValue(`applicants.${idx}.additionalNationalities` as const, [''], { shouldValidate: true });
                                    }
                                  }}
                                />
                                <label htmlFor={`hasAdditionalNationalities-${idx}`} className="text-sm">
                                  {t('application.personalInfo.nationality.additionalQuestion', { defaultValue: 'Do you hold another nationality?' })}
                                </label>
                              </div>
                            )}
                          />

                          {applicants?.[idx]?.hasAdditionalNationalities && (
                            <div className="space-y-3">
                              {(applicants?.[idx]?.additionalNationalities ?? []).map((_, j) => (
                                <div key={j} className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <FormField
                                      control={control}
                                      name={`applicants.${idx}.additionalNationalities.${j}` as const}
                                      render={({ field, fieldState }) => (
                                        <FormItem>
                                          <FormLabel className="sr-only">{t('application.personalInfo.nationality.additionalLabel', { defaultValue: 'Additional nationality' })}</FormLabel>
                                          <FormControl>
                                            <select
                                              {...field}
                                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/5 aria-[invalid=true]:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                              aria-invalid={!!fieldState.error}
                                            >
                                              <option value="">{t('application.personalInfo.nationality.placeholder')}</option>
                                              {nationalities.map((n) => (
                                                <option key={`${n.code}-${j}`} value={n.code}>
                                                  {n.name}
                                                </option>
                                              ))}
                                            </select>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <Button type="button" variant="outline" size="icon" onClick={() => {
                                    const current = applicants?.[idx]?.additionalNationalities ?? [];
                                    const next = current.filter((_, k) => k !== j);
                                    form.setValue(`applicants.${idx}.additionalNationalities` as const, next, { shouldValidate: true });
                                  }} aria-label={t('common.remove', { defaultValue: 'Remove' })}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button type="button" variant="secondary" size="sm" className="mt-1" onClick={() => {
                                const current = applicants?.[idx]?.additionalNationalities ?? [];
                                form.setValue(`applicants.${idx}.additionalNationalities` as const, [...current, ''], { shouldValidate: true });
                              }}>
                                <UserPlus className="h-4 w-4 mr-2" /> {t('application.personalInfo.nationality.addAnother', { defaultValue: 'Add another nationality' })}
                              </Button>
                            </div>
                          )}
                        </div>

                         <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <FormLabel>
                              {t('application.personalInfo.email.label')} <span aria-hidden="true" className="text-destructive">*</span>
                            </FormLabel>
                            {idx > 0 && (
                              <FormField
                                control={control}
                                name={`applicants.${idx}.useSameEmailAsPrimary`}
                                render={({ field }) => (
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      id={`sameEmail-${idx}`}
                                      checked={!!field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <label htmlFor={`sameEmail-${idx}`} className="text-sm text-muted-foreground">
                                      {t('application.email.sameAsPrimary', { defaultValue: 'Same as Applicant 1' })}
                                    </label>
                                  </div>
                                )}
                              />
                            )}
                          </div>

                          {(!applicants?.[idx]?.useSameEmailAsPrimary || idx === 0) && (
                            <FormField
                              control={control}
                              name={`applicants.${idx}.email`}
                              render={({ field, fieldState }) => (
                                <FormItem>
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
                          )}

                          {applicants?.[idx]?.useSameEmailAsPrimary && idx > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {t('application.email.usingPrimary', { defaultValue: "Using Applicant 1's email address" })}
                            </p>
                          )}
                        </div>

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

                        <FormField
                          control={control}
                          name={`applicants.${idx}.hasJob`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>
                                {t('application.employment.hasJob.label', { defaultValue: 'Do you have a job?' })} <span aria-hidden="true" className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="flex space-x-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id={`hasjob-yes-${idx}`} />
                                    <label htmlFor={`hasjob-yes-${idx}`} className="text-sm">{t('application.options.yes', { defaultValue: 'Yes' })}</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id={`hasjob-no-${idx}`} />
                                    <label htmlFor={`hasjob-no-${idx}`} className="text-sm">{t('application.options.no', { defaultValue: 'No' })}</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {applicants?.[idx]?.hasJob === 'yes' && (
                          <FormField
                            control={control}
                            name={`applicants.${idx}.job`}
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel>
                                  {t('application.employment.jobTitle.label', { defaultValue: "What's your job?" })} <span aria-hidden="true" className="text-destructive">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="text"
                                    inputMode="text"
                                    placeholder={t('application.employment.jobTitle.placeholder', { defaultValue: 'Enter your job title' })}
                                    aria-required="true"
                                    aria-invalid={!!fieldState.error}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}


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
                                      {t('application.address.state.label', { defaultValue: 'State/Province' })} {stateRequired && (<span aria-hidden="true" className="text-destructive">*</span>)}
                                    </FormLabel>
                                    <FormControl>
                                      <Input {...field} type="text" aria-required={stateRequired} aria-invalid={!!fieldState.error} />
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
                                         className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/5 aria-[invalid=true]:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                         aria-required="true"
                                         aria-invalid={!!fieldState.error}
                                       >
                                         <option value="">{t('application.address.country.placeholder', { defaultValue: 'Select a country' })}</option>
                                         {nationalities.map((nationality) => (
                                           <option key={nationality.code} value={nationality.code}>
                                             {nationality.name}
                                           </option>
                                         ))}
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

                        <FormField
                          control={control}
                          name={`applicants.${idx}.hasCriminalConvictions`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>
                                {t('application.security.criminalConvictions.label', { defaultValue: 'Have you ever had criminal convictions?' })} <span aria-hidden="true" className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="flex space-x-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id={`criminal-yes-${idx}`} />
                                    <label htmlFor={`criminal-yes-${idx}`} className="text-sm">{t('application.options.yes', { defaultValue: 'Yes' })}</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id={`criminal-no-${idx}`} />
                                    <label htmlFor={`criminal-no-${idx}`} className="text-sm">{t('application.options.no', { defaultValue: 'No' })}</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`applicants.${idx}.hasWarCrimesConvictions`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>
                                {t('application.security.warCrimes.label', { defaultValue: 'Have you ever been suspected or convicted of war crimes, terrorism or extremism?' })} <span aria-hidden="true" className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="flex space-x-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id={`war-yes-${idx}`} />
                                    <label htmlFor={`war-yes-${idx}`} className="text-sm">{t('application.options.yes', { defaultValue: 'Yes' })}</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id={`war-no-${idx}`} />
                                    <label htmlFor={`war-no-${idx}`} className="text-sm">{t('application.options.no', { defaultValue: 'No' })}</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                      </div>
                    );
                  })}

                  <div className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      {t('application.applicant.addLater', { defaultValue: 'You can add another applicant just before payment.' })}
                    </div>
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

