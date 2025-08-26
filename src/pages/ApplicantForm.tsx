import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useEffect, useState, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { JobSelector } from "@/components/ui/job-selector";
import { EmailInput, EMAIL_PATTERN } from '@/components/ui/email-input';
import { PASSPORT_NAME_PATTERN } from '@/components/ui/passport-name-input';
import { DateOfBirthInput, validateDateOfBirth } from '@/components/ui/date-of-birth-input';
import { PassportNumberInput } from '@/components/ui/passport-number-input';
import { NameFieldsSection } from '@/components/NameFieldsSection';
import { NationalityRadioSection } from '@/components/NationalityRadioSection';
import { AddressFieldsSection } from '@/components/AddressFieldsSection';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { nationalities } from '@/constants/nationalities';
import { FormValidationStatus } from '@/components/FormValidationStatus';
import { FieldStatusIndicator } from '@/components/FieldStatusIndicator';
import { cn } from '@/lib/utils';

const ApplicantForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [primaryApplicant, setPrimaryApplicant] = useState<any | null>(null);
  const [passportData, setPassportData] = useState<any | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    try {
      // Load main applicant (previously called primary)
      const raw = sessionStorage.getItem('application.applicants');
      if (raw) {
        const applicants = JSON.parse(raw);
        if (applicants[0]) {
          setPrimaryApplicant(applicants[0]);
        }
      } else {
        // Fallback to legacy structure for migration
        const legacyRaw = sessionStorage.getItem('application.primaryApplicant');
        if (legacyRaw) {
          const legacy = JSON.parse(legacyRaw);
          setPrimaryApplicant(legacy);
          // Migrate to new structure
          sessionStorage.setItem('application.applicants', JSON.stringify([legacy]));
          sessionStorage.removeItem('application.primaryApplicant');
        }
      }
    } catch {}
  }, []);

  // Load passport data for address extraction
  useEffect(() => {
    if (id) {
      try {
        const applicantsData = sessionStorage.getItem('application.applicants');
        if (applicantsData) {
          const applicants = JSON.parse(applicantsData);
          let applicantData = null;
          
          if (id === 'main' && applicants[0]) {
            applicantData = applicants[0];
          } else {
            const match = id.match(/^applicant-(\d+)$/);
            if (match) {
              const applicantNumber = parseInt(match[1]);
              const applicantIndex = applicantNumber - 1;
              if (applicants[applicantIndex]) {
                applicantData = applicants[applicantIndex];
              }
            }
          }
          
          if (applicantData?.passportPhoto) {
            setPassportData({ photo: applicantData.passportPhoto });
          }
        }
      } catch {}
    }
  }, [id]);

  const nameRegex = PASSPORT_NAME_PATTERN;
  const emailRegex = EMAIL_PATTERN;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const passportRegex = /^[A-Z0-9]{6,9}$/i;
  const nationalityRegex = /^(AF|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|CV|KH|CM|CA|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|SZ|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/;

  // Create Zod schema inside component to access translations
  const applicantSchema = useMemo(() => z.object({
    firstName: z.string().min(1, t('validation.passportName.required')).regex(nameRegex, t('validation.passportName.format')).max(50, t('validation.passportName.tooLong')),
    secondNames: z.string().regex(nameRegex, t('validation.passportName.format')).max(50, t('validation.passportName.tooLong')).optional(),
    lastName: z.string().min(1, t('validation.passportName.required')).regex(nameRegex, t('validation.passportName.format')).max(50, t('validation.passportName.tooLong')),
    dateOfBirth: z
      .string()
      .refine((val) => validateDateOfBirth(val) === null, (val) => ({
        message: validateDateOfBirth(val) || t('validation.dateOfBirth.invalid')
      })),
    nationality: z.string().regex(nationalityRegex, t('validation.nationality.required')),
    hasAdditionalNationalities: z.boolean().optional().default(false),
    additionalNationalities: z.array(z.string().regex(nationalityRegex, t('validation.nationality.required'))).optional().default([]),
    email: z.string().min(1, t('validation.email.required')).regex(emailRegex, t('validation.email.invalid')),
    passportNumber: z
      .string()
      .min(6, { message: t('validation.passportNumber.tooShort') })
      .max(10, { message: t('validation.passportNumber.tooLong') })
      .regex(/^[A-Z0-9]+$/, { 
        message: t('validation.passportNumber.format')
      }),
    useSameAddressAsPrimary: z.boolean().optional().default(false),
    useSameAddressAsPassport: z.boolean().optional().default(false),
    useSameEmailAsPrimary: z.boolean().optional().default(false),
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      line3: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    }).optional(),
    hasJob: z.enum(['yes', 'no'], { 
      required_error: t('validation.employment.required'),
      invalid_type_error: t('validation.employment.required')
    }),
    jobTitle: z.object({
      isStandardized: z.boolean().default(false),
      jobCode: z.string().optional(),
      titleOriginal: z.string().default(""),
      titleEnglish: z.string().default(""),
      category: z.string().optional(),
    }),
    hasCriminalConvictions: z.enum(['yes', 'no'], {
      required_error: t('validation.security.criminalConvictions.required'),
      invalid_type_error: t('validation.security.criminalConvictions.required')
    }),
    hasWarCrimesConvictions: z.enum(['yes', 'no'], {
      required_error: t('validation.security.warCrimes.required'),
      invalid_type_error: t('validation.security.warCrimes.required')
    }),
  }).superRefine((data, ctx) => {
    // Address validation - only required if not using same address options
    if (!data.useSameAddressAsPrimary && !data.useSameAddressAsPassport) {
      if (!data.address?.line1?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.address.line1Required'),
          path: ['address', 'line1'],
        });
      }
      if (!data.address?.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.address.cityRequired'),
          path: ['address', 'city'],
        });
      }
      if (!data.address?.country?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.address.countryRequired'),
          path: ['address', 'country'],
        });
      }
      if (!data.address?.postalCode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.address.postalCodeRequired'),
          path: ['address', 'postalCode'],
        });
      }
    }
    
    // Job title validation - only required if user has a job
    if (data.hasJob === 'yes' && (!data.jobTitle?.titleOriginal?.trim() && !data.jobTitle?.titleEnglish?.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('validation.jobTitle.required'),
        path: ['jobTitle', 'titleOriginal'],
      });
    }
  }), [t]);

  type ApplicantValues = z.infer<typeof applicantSchema>;

  // Load existing data if editing
  const [existingData, setExistingData] = useState<ApplicantValues | null>(null);
  useEffect(() => {
    if (!id) return;
    
    try {
      const applicantsData = sessionStorage.getItem('application.applicants');
      if (applicantsData) {
        const applicants = JSON.parse(applicantsData);
        if (id === 'main') {
          // Load main applicant
          if (applicants[0]) {
            setExistingData(applicants[0]);
          }
        } else {
          // Load additional applicant
          const match = id.match(/^applicant-(\d+)$/);
          if (match) {
            const applicantNumber = parseInt(match[1]);
            const applicantIndex = applicantNumber - 1; // Convert to 0-based index
            if (applicants[applicantIndex]) {
              setExistingData(applicants[applicantIndex]);
            }
          }
        }
      }
    } catch {}
  }, [id]);

  const form = useForm<ApplicantValues>({
    resolver: zodResolver(applicantSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      secondNames: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      hasAdditionalNationalities: false,
      additionalNationalities: [],
      email: '',
      passportNumber: '',
      useSameAddressAsPrimary: false,
      useSameAddressAsPassport: false,
      useSameEmailAsPrimary: false,
      address: { line1: '', line2: '', line3: '', city: '', state: '', postalCode: '', country: '' },
      hasJob: undefined,
      jobTitle: {
        isStandardized: false,
        titleOriginal: "",
        titleEnglish: "",
      },
      hasCriminalConvictions: undefined,
      hasWarCrimesConvictions: undefined,
    },
  });

  // Watch form state for validation feedback
  const formState = form.formState;
  const formValues = form.watch();
  
  // Simplified validation - use React Hook Form's built-in validation
  const isFormValid = formState.isValid;
  
  // Enhanced debug logging
  console.log('CONTINUE BUTTON DEBUG:', {
    isFormValid,
    formStateValid: formState.isValid,
    hasErrors: Object.keys(formState.errors).length > 0,
    errors: formState.errors,
    isDirty: formState.isDirty,
    isSubmitted: formState.isSubmitted,
    radioValues: {
      hasJob: formValues.hasJob,
      hasCriminalConvictions: formValues.hasCriminalConvictions,
      hasWarCrimesConvictions: formValues.hasWarCrimesConvictions
    },
    addressStates: {
      useSameAsPrimary: formValues.useSameAddressAsPrimary,
      useSameAsPassport: formValues.useSameAddressAsPassport,
      addressLine1: formValues.address?.line1,
      addressCity: formValues.address?.city
    },
    requiredFields: {
      firstName: !!formValues.firstName?.trim(),
      lastName: !!formValues.lastName?.trim(),
      dateOfBirth: !!formValues.dateOfBirth?.trim(),
      nationality: !!formValues.nationality?.trim(),
      email: !!formValues.email?.trim(),
      passportNumber: !!formValues.passportNumber?.trim()
    },
    jobTitle: formValues.jobTitle
  });
  
  // Calculate completion percentage
  const calculateCompletion = () => {
    const fields = [
      'firstName', 'lastName', 'dateOfBirth', 'nationality', 'email', 
      'passportNumber', 'hasJob', 'hasCriminalConvictions', 'hasWarCrimesConvictions'
    ];
    
    // Address fields only required if not using same as primary or passport
    const addressFields = (formValues.useSameAddressAsPrimary || formValues.useSameAddressAsPassport) 
      ? [] 
      : ['address.line1', 'address.city', 'address.country', 'address.postalCode'];
    
    // Job fields only required if user has a job
    const jobFields = formValues.hasJob === 'yes' 
      ? [(formValues.jobTitle?.titleOriginal || formValues.jobTitle?.titleEnglish) ? 'jobTitle' : null].filter(Boolean)
      : [];
    
    const allFields = [...fields, ...addressFields, ...jobFields];
    const completedFields = allFields.filter(field => {
      if (!field) return false;
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], formValues)
        : formValues[field as keyof typeof formValues];
      return value && value !== '' && value !== undefined;
    });
    
    return Math.round((completedFields.length / allFields.length) * 100);
  };
  
  const completionPercentage = calculateCompletion();

  // Watch checkbox values for reactive updates
  const useSameEmail = useWatch({ control: form.control, name: 'useSameEmailAsPrimary' });
  const useSameAddress = useWatch({ control: form.control, name: 'useSameAddressAsPrimary' });

  // Load existing data when editing
  useEffect(() => {
    if (existingData) {
      form.reset(existingData);
    }
  }, [existingData, form]);

  // Handle email checkbox change
  useEffect(() => {
    if (useSameEmail && primaryApplicant?.email) {
      form.setValue('email', primaryApplicant.email);
    } else if (!useSameEmail) {
      form.setValue('email', '');
    }
  }, [useSameEmail, primaryApplicant?.email, form]);

  // Handle address checkbox change
  useEffect(() => {
    if (useSameAddress && primaryApplicant?.address) {
      form.setValue('address', primaryApplicant.address);
      // Clear validation errors for address when using primary address
      form.clearErrors('address');
    } else if (!useSameAddress) {
      form.setValue('address', { line1: '', line2: '', line3: '', city: '', state: '', postalCode: '', country: '' });
    }
  }, [useSameAddress, primaryApplicant?.address, form]);

  // Watch address checkbox for passport option
  const useSamePassportAddress = useWatch({ control: form.control, name: 'useSameAddressAsPassport' });
  
  useEffect(() => {
    if (useSamePassportAddress) {
      // Clear address validation errors when using passport address
      form.clearErrors('address');
    }
  }, [useSamePassportAddress, form]);

  const handleSubmit = async (values: ApplicantValues) => {
    if (!id) return;
    
    try {
      // Get existing applicants
      const existingApplicants = JSON.parse(sessionStorage.getItem('application.applicants') || '[]');
      
      if (id === 'main') {
        // Update main applicant (index 0)
        existingApplicants[0] = values;
      } else {
        // Update additional applicant
        const match = id.match(/^applicant-(\d+)$/);
        if (match) {
          const applicantNumber = parseInt(match[1]);
          const applicantIndex = applicantNumber - 1; // Convert to 0-based index
          
          // Ensure array is large enough
          while (existingApplicants.length <= applicantIndex) {
            existingApplicants.push({});
          }
          existingApplicants[applicantIndex] = values;
        }
      }
      
      sessionStorage.setItem('application.applicants', JSON.stringify(existingApplicants));
    } catch {}
    
    navigate(`/application/applicant/${id}/documents`);
  };

  // Parse applicant number with validation
  const getApplicantNumber = (applicantId: string | undefined): number => {
    if (!applicantId || applicantId === 'main') return 1;
    const match = applicantId.match(/^applicant-(\d+)$/);
    if (match) {
      const num = parseInt(match[1]);
      return isNaN(num) ? 2 : num;
    }
    return 2; // fallback
  };
  
  const applicantNumber = getApplicantNumber(id);
  const isMainApplicant = id === 'main';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('application.progress.step', { current: 2, total: 4 })}</span>
              <span className="text-sm text-muted-foreground">{t('application.progress.complete', { percent: completionPercentage })}</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isMainApplicant ? 'Main Applicant' : `Applicant ${applicantNumber}`}
            </h1>
            <p className="text-muted-foreground">
              {isMainApplicant ? 'Please provide your details' : `Please provide details for applicant ${applicantNumber}`}
            </p>
          </div>

          {/* Applicant Form */}
          <Card>
            <CardHeader>
              <CardTitle>{t('application.personalInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Form Status Indicator */}
              <div className="mb-6">
                <FormValidationStatus 
                  isValid={isFormValid}
                  completionPercentage={completionPercentage}
                  errors={formState.errors}
                />
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
                  <NameFieldsSection
                    control={form.control}
                    baseName=""
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="dateOfBirth" render={({ field, fieldState }) => (
                      <FormItem className="relative">
                         <FieldStatusIndicator
                           isRequired={true}
                           hasValue={!!field.value?.trim()}
                           hasError={!!fieldState.error}
                           hasInteracted={fieldState.isTouched}
                           className="z-10"
                         />
                        <FormLabel>{t('application.personalInfo.dateOfBirth.label')} <span className="text-destructive">*</span></FormLabel>
                         <FormControl>
                           <DateOfBirthInput {...field} placeholder="YYYY-MM-DD" aria-invalid={!!fieldState.error} />
                         </FormControl>
                         <p className="text-sm text-muted-foreground mt-1">
                           {t('application.personalInfo.dateOfBirth.helperText')}
                         </p>
                         <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="nationality" render={({ field, fieldState }) => (
                      <FormItem className="relative">
                         <FieldStatusIndicator
                           isRequired={true}
                           hasValue={!!field.value?.trim()}
                           hasError={!!fieldState.error}
                           hasInteracted={fieldState.isTouched}
                           className="z-10"
                         />
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


                  <NationalityRadioSection
                    control={form.control}
                    baseName=""
                  />

                  <AddressFieldsSection
                    form={form}
                    baseName=""
                    showSameAsPassportOption={true}
                    passportData={passportData}
                  />

                  <FormField control={form.control} name="email" render={({ field, fieldState }) => (
                    <FormItem className="relative">
                       <FieldStatusIndicator
                         isRequired={true}
                         hasValue={!!field.value?.trim()}
                         hasError={!!fieldState.error}
                         hasInteracted={fieldState.isTouched}
                         className="z-10"
                       />
                      <FormLabel>{t('application.personalInfo.email.label')} <span className="text-warning">*</span></FormLabel>
                      <FormControl>
                        <EmailInput 
                          {...field} 
                          aria-invalid={!!fieldState.error}
                          showRealTimeErrors={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {primaryApplicant?.email && (
                    <FormField control={form.control} name="useSameEmailAsPrimary" render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold">{t('application.email.sameAsMain')}</FormLabel>
                          <p className="text-sm text-muted-foreground">{t('application.email.usingMain')}: {primaryApplicant.email}</p>
                        </div>
                      </FormItem>
                    )} />
                  )}

                  <FormField control={form.control} name="passportNumber" render={({ field, fieldState }) => (
                    <FormItem className="relative">
                       <FieldStatusIndicator
                         isRequired={true}
                         hasValue={!!field.value?.trim()}
                         hasError={!!fieldState.error}
                         hasInteracted={fieldState.isTouched}
                         className="z-10"
                       />
                      <FormLabel>{t('application.personalInfo.passportNumber.label')} <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <PassportNumberInput
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          error={fieldState.error?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="useSameAddressAsPrimary" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">{t('application.address.sameAsMain')}</FormLabel>
                        <p className="text-sm text-muted-foreground">{t('application.address.usingMain')}</p>
                      </div>
                    </FormItem>
                  )} />

                  {!form.getValues('useSameAddressAsPrimary') && !form.getValues('useSameAddressAsPassport') && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="address.line1" render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>{t('application.address.line1.label')} <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} aria-invalid={!!fieldState.error} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="address.line2" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('application.address.line2.label')}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="address.city" render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>{t('application.address.city.label')} <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} aria-invalid={!!fieldState.error} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="address.state" render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>{t('application.address.state.label')} <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} aria-invalid={!!fieldState.error} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="address.postalCode" render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>{t('application.address.postalCode.label')} <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input {...field} aria-invalid={!!fieldState.error} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="address.country" render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel>{t('application.address.country.label')} <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/5 aria-[invalid=true]:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                aria-invalid={!!fieldState.error}
                              >
                                <option value="">{t('application.address.country.placeholder')}</option>
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

                  <FormField control={form.control} name="hasJob" render={({ field, fieldState }) => (
                    <FormItem className="relative">
                       <FieldStatusIndicator
                         isRequired={true}
                         hasValue={field.value !== undefined}
                         hasError={!!fieldState.error}
                         hasInteracted={fieldState.isTouched}
                         className="z-10"
                       />
                      <FormLabel>{t('application.employment.hasJob.label')} <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                         <RadioGroup 
                           onValueChange={(value) => {
                             field.onChange(value);
                             // Trigger validation immediately
                             form.trigger('hasJob');
                           }} 
                           value={field.value} 
                           className="flex flex-col space-y-1"
                         >
                         <FormItem className="flex items-center space-x-3 space-y-0">
                           <FormControl>
                             <RadioGroupItem value="yes" />
                           </FormControl>
                           <FormLabel>{t('application.options.yes')}</FormLabel>
                         </FormItem>
                         <FormItem className="flex items-center space-x-3 space-y-0">
                           <FormControl>
                             <RadioGroupItem value="no" />
                           </FormControl>
                           <FormLabel>{t('application.options.no')}</FormLabel>
                         </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                   {form.getValues('hasJob') === 'yes' && (
                     <FormField control={form.control} name="jobTitle" render={({ field, fieldState }) => (
                       <FormItem>
                         <FormLabel>{t('application.employment.jobTitle.label')} <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                             <JobSelector 
                               value={field.value}
                               onChange={field.onChange}
                               placeholder={t('application.employment.jobTitle.placeholder')}
                               required
                             />
                          </FormControl>
                         <FormMessage />
                       </FormItem>
                     )} />
                   )}

                   <FormField control={form.control} name="hasCriminalConvictions" render={({ field, fieldState }) => (
                     <FormItem className="relative">
                        <FieldStatusIndicator
                          isRequired={true}
                          hasValue={field.value !== undefined}
                          hasError={!!fieldState.error}
                          hasInteracted={fieldState.isTouched}
                          className="z-10"
                        />
                       <FormLabel>{t('application.security.criminalConvictions.label')} <span className="text-destructive">*</span></FormLabel>
                       <FormControl>
                         <RadioGroup 
                           onValueChange={(value) => {
                             field.onChange(value);
                             // Trigger validation immediately
                             form.trigger('hasCriminalConvictions');
                           }} 
                           value={field.value} 
                           className="flex flex-col space-y-1"
                         >
                         <FormItem className="flex items-center space-x-3 space-y-0">
                           <FormControl>
                             <RadioGroupItem value="yes" />
                           </FormControl>
                           <FormLabel>{t('application.options.yes')}</FormLabel>
                         </FormItem>
                         <FormItem className="flex items-center space-x-3 space-y-0">
                           <FormControl>
                             <RadioGroupItem value="no" />
                           </FormControl>
                           <FormLabel>{t('application.options.no')}</FormLabel>
                         </FormItem>
                        </RadioGroup>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )} />

                   <FormField control={form.control} name="hasWarCrimesConvictions" render={({ field, fieldState }) => (
                     <FormItem className="relative">
                        <FieldStatusIndicator
                          isRequired={true}
                          hasValue={field.value !== undefined}
                          hasError={!!fieldState.error}
                          hasInteracted={fieldState.isTouched}
                          className="z-10"
                        />
                       <FormLabel>{t('application.security.warCrimes.label')} <span className="text-destructive">*</span></FormLabel>
                       <FormControl>
                         <RadioGroup 
                           onValueChange={(value) => {
                             field.onChange(value);
                             // Trigger validation immediately
                             form.trigger('hasWarCrimesConvictions');
                           }} 
                           value={field.value} 
                           className="flex flex-col space-y-1"
                         >
                         <FormItem className="flex items-center space-x-3 space-y-0">
                           <FormControl>
                             <RadioGroupItem value="yes" />
                           </FormControl>
                           <FormLabel>{t('application.options.yes')}</FormLabel>
                         </FormItem>
                         <FormItem className="flex items-center space-x-3 space-y-0">
                           <FormControl>
                             <RadioGroupItem value="no" />
                           </FormControl>
                           <FormLabel>{t('application.options.no')}</FormLabel>
                         </FormItem>
                        </RadioGroup>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )} />
                  
                   {/* Form Validation Summary */}
                   {!isFormValid && Object.keys(formState.errors).length > 0 && (
                     <div className="p-4 bg-error-gentle-light border border-error-gentle/20 rounded-lg">
                       <h3 className="text-sm font-medium text-error-gentle mb-2">
                         Please complete the following required fields:
                       </h3>
                       <ul className="text-sm text-error-gentle space-y-1">
                         {Object.entries(formState.errors).map(([field, error]) => {
                           if (field.startsWith('address.') && (formValues.useSameAddressAsPrimary || formValues.useSameAddressAsPassport)) {
                             return null; // Don't show address errors if using same address
                           }
                            return (
                              <li key={field} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-error-gentle rounded-full"></span>
                                {field.includes('address.') ? 
                                  `Address ${field.split('.')[1]}: ${(error as any)?.message || 'Invalid value'}` : 
                                  `${field.charAt(0).toUpperCase() + field.slice(1)}: ${(error as any)?.message || 'Invalid value'}`
                                }
                             </li>
                           );
                         }).filter(Boolean)}
                       </ul>
                     </div>
                   )}
                   
                   {/* Navigation */}
                   <div className="flex justify-between pt-6">
                     <Button 
                       type="button"
                       variant="outline" 
                       onClick={() => navigate('/application/manage')}
                       className="flex items-center gap-2"
                     >
                       <ArrowLeft className="h-4 w-4" />
                       {t('application.back')}
                     </Button>
                     <Button 
                       type="submit" 
                       disabled={!isFormValid}
                       className={cn(
                         "flex items-center gap-2",
                         !isFormValid && "opacity-50 cursor-not-allowed"
                       )}
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

export default ApplicantForm;
