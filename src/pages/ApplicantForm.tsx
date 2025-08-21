import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { nationalities } from '@/constants/nationalities';

const ApplicantForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Load primary applicant for reference
  const [primaryApplicant, setPrimaryApplicant] = useState<any | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('application.primaryApplicant');
      if (raw) setPrimaryApplicant(JSON.parse(raw));
    } catch {}
  }, []);

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  const dateRegex = /^\\d{4}-\\d{2}-\\d{2}$/;
  const passportRegex = /^[A-Z0-9]{6,9}$/i;
  const nationalityRegex = /^(AF|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|CV|KH|CM|CA|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|SZ|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/;

  const applicantSchema = z.object({
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
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    }).superRefine((data, ctx) => {
      // Skip validation if using primary applicant's address
      const form = ctx.path[0] === 'address' ? ctx.path.slice(0, -1) : [];
      return true; // Address validation will be handled by form state
    }),
    hasJob: z.enum(['yes', 'no'], { required_error: 'Please answer if you have a job' }),
    jobTitle: z.string().optional(),
    hasCriminalConvictions: z.enum(['yes', 'no'], { required_error: 'Please answer about criminal convictions' }),
    hasWarCrimesConvictions: z.enum(['yes', 'no'], { required_error: 'Please answer about war crimes convictions' }),
  });

  type ApplicantValues = z.infer<typeof applicantSchema>;

  // Load existing data if editing
  const [existingData, setExistingData] = useState<ApplicantValues | null>(null);
  useEffect(() => {
    if (!id) return;
    
    try {
      const applicantsData = sessionStorage.getItem('application.applicants');
      if (applicantsData) {
        const applicants = JSON.parse(applicantsData);
        const applicantIndex = parseInt(id.replace('applicant-', '')) - 1;
        if (applicants[applicantIndex]) {
          setExistingData(applicants[applicantIndex]);
        }
      }
    } catch {}
  }, [id]);

  const form = useForm<ApplicantValues>({
    resolver: zodResolver(applicantSchema),
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
      useSameEmailAsPrimary: false,
      address: { line1: '', line2: '', city: '', state: '', postalCode: '', country: '' },
      hasJob: undefined,
      jobTitle: '',
      hasCriminalConvictions: undefined,
      hasWarCrimesConvictions: undefined,
    },
  });

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
    } else if (!useSameAddress) {
      form.setValue('address', { line1: '', line2: '', city: '', state: '', postalCode: '', country: '' });
    }
  }, [useSameAddress, primaryApplicant?.address, form]);

  const handleSubmit = async (values: ApplicantValues) => {
    if (!id) return;
    
    try {
      // Get existing applicants
      const existingApplicants = JSON.parse(sessionStorage.getItem('application.applicants') || '[]');
      const applicantIndex = parseInt(id.replace('applicant-', '')) - 1;
      
      // Update or add applicant
      if (applicantIndex >= 0 && applicantIndex < existingApplicants.length) {
        existingApplicants[applicantIndex] = values;
      } else {
        // Ensure array is large enough
        while (existingApplicants.length <= applicantIndex) {
          existingApplicants.push({});
        }
        existingApplicants[applicantIndex] = values;
      }
      
      sessionStorage.setItem('application.applicants', JSON.stringify(existingApplicants));
    } catch {}
    
    navigate(`/application/applicant/${id}/documents`);
  };

  const applicantNumber = id ? parseInt(id.replace('applicant-', '')) + 1 : 2;

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
            <h1 className="text-3xl font-bold mb-2">Applicant {applicantNumber}</h1>
            <p className="text-muted-foreground">Please provide details for applicant {applicantNumber}</p>
          </div>

          {/* Applicant Form */}
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

                  <FormField control={form.control} name="hasAdditionalNationalities" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                         <div className="space-y-0.5">
                           <FormLabel className="text-base font-semibold">{t('application.additionalNationalities.label')}</FormLabel>
                           <p className="text-sm text-muted-foreground">{t('application.additionalNationalities.description')}</p>
                         </div>
                    </FormItem>
                  )} />

                  {form.getValues('hasAdditionalNationalities') && (
                     <FormField control={form.control} name="additionalNationalities" render={({ field, fieldState }) => (
                       <FormItem>
                         <FormLabel>{t('application.additionalNationalities.label')} <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            {field.value?.map((nationality, index) => (
                              <div key={index} className="flex items-center space-x-3">
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
                                  <option value="">{t('application.personalInfo.nationality.placeholder')}</option>
                                  {nationalities.map((n) => (
                                    <option key={n.code} value={n.code}>{n.name}</option>
                                  ))}
                                </select>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newNationalities = [...(field.value || [])];
                                    newNationalities.splice(index, 1);
                                    field.onChange(newNationalities);
                                  }}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {field.value?.length < 5 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  field.onChange([...(field.value || []), '']);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('application.additionalNationalities.addButton')}
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}

                  <FormField control={form.control} name="email" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{t('application.personalInfo.email.label')} <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} type="email" aria-invalid={!!fieldState.error} />
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
                           <FormLabel className="text-base font-semibold">{t('application.email.sameAsPrimary')}</FormLabel>
                           <p className="text-sm text-muted-foreground">{t('application.email.usingPrimary')}: {primaryApplicant.email}</p>
                        </div>
                      </FormItem>
                    )} />
                  )}

                  <FormField control={form.control} name="passportNumber" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>{t('application.personalInfo.passportNumber.label')} <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input {...field} aria-invalid={!!fieldState.error} />
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
                         <FormLabel className="text-base font-semibold">{t('application.address.sameAsPrimary')}</FormLabel>
                         <p className="text-sm text-muted-foreground">{t('application.address.usingPrimary')}</p>
                      </div>
                    </FormItem>
                  )} />

                  {!form.getValues('useSameAddressAsPrimary') && (
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
                    <FormItem>
                      <FormLabel>{t('application.employment.hasJob.label')} <span className="text-destructive">*</span></FormLabel>
                       <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
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
                      <FormMessage />
                    </FormItem>
                  )} />

                   {form.getValues('hasJob') === 'yes' && (
                     <FormField control={form.control} name="jobTitle" render={({ field, fieldState }) => (
                       <FormItem>
                         <FormLabel>{t('application.employment.jobTitle.label')} <span className="text-destructive">*</span></FormLabel>
                         <FormControl>
                           <Input {...field} placeholder={t('application.employment.jobTitle.placeholder')} aria-invalid={!!fieldState.error} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )} />
                   )}

                   <FormField control={form.control} name="hasCriminalConvictions" render={({ field, fieldState }) => (
                     <FormItem>
                       <FormLabel>{t('application.security.criminalConvictions.label')} <span className="text-destructive">*</span></FormLabel>
                       <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
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
                       <FormMessage />
                     </FormItem>
                   )} />

                   <FormField control={form.control} name="hasWarCrimesConvictions" render={({ field, fieldState }) => (
                     <FormItem>
                       <FormLabel>{t('application.security.warCrimes.label')} <span className="text-destructive">*</span></FormLabel>
                       <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
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
                       <FormMessage />
                     </FormItem>
                   )} />
                  
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

export default ApplicantForm;
