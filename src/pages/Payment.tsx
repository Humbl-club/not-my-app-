import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CreditCard, Shield, Lock, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { nationalities } from '@/constants/nationalities';

const Payment = () => {
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

  // Second applicant form and state
  const [addSecond, setAddSecond] = useState(false);

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
  });

  type SecondApplicantValues = z.infer<typeof secondApplicantSchema>;

  const secondForm = useForm<SecondApplicantValues>({
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
    },
  });

  const useSameEmail = useWatch({ control: secondForm.control, name: 'useSameEmailAsPrimary' });
  useEffect(() => {
    if (addSecond && useSameEmail && primaryApplicant?.email) {
      secondForm.setValue('email', primaryApplicant.email, { shouldValidate: true });
    }
  }, [addSecond, useSameEmail, primaryApplicant?.email]);

  const handleComplete = async () => {
    if (addSecond) {
      const valid = await secondForm.trigger();
      if (!valid) {
        const e = secondForm.formState.errors as any;
        const order = ['firstName','lastName','dateOfBirth','nationality','email','passportNumber'];
        for (const k of order) {
          if (e?.[k]) { secondForm.setFocus(k as any); return; }
        }
        // Check additional nationalities
        if (e?.additionalNationalities) {
          if (Array.isArray(e.additionalNationalities)) {
            for (let i = 0; i < e.additionalNationalities.length; i++) {
              if (e.additionalNationalities[i]) {
                secondForm.setFocus(`additionalNationalities.${i}` as any);
                return;
              }
            }
          } else {
            secondForm.setFocus('hasAdditionalNationalities' as any);
            return;
          }
        }
        const addrOrder = ['line1','city','state','postalCode','country'];
        for (const k of addrOrder) {
          if (e?.address?.[k]) { secondForm.setFocus(('address.'+k) as any); return; }
        }
        return;
      }
    }
    navigate('/application/confirmation');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('application.progress.step', { current: 3, total: 4 })}</span>
              <span className="text-sm text-muted-foreground">{t('application.progress.complete', { percent: 75 })}</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('application.payment.title')}</h1>
            <p className="text-muted-foreground">{t('application.payment.subtitle')}</p>
          </div>

          {/* Additional Applicant (optional) */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('application.payment.additionalApplicant.title', { defaultValue: 'Additional applicant (optional)' })}</span>
                <div className="flex items-center gap-3">
                  <Checkbox id="add-second" checked={addSecond} onCheckedChange={(v) => setAddSecond(Boolean(v))} />
                  <label htmlFor="add-second" className="text-sm text-muted-foreground">{t('application.payment.additionalApplicant.toggle', { defaultValue: 'Add a second applicant' })}</label>
                </div>
              </CardTitle>
            </CardHeader>
            {addSecond && (
              <CardContent>
                <Form {...secondForm}>
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()} noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={secondForm.control} name="firstName" render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>{t('application.personalInfo.firstName.label')} <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} aria-invalid={!!fieldState.error} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={secondForm.control} name="lastName" render={({ field, fieldState }) => (
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
                      <FormField control={secondForm.control} name="dateOfBirth" render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>{t('application.personalInfo.dateOfBirth.label')} <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input {...field} type="date" placeholder="YYYY-MM-DD" aria-invalid={!!fieldState.error} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={secondForm.control} name="nationality" render={({ field, fieldState }) => (
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
                      <FormField control={secondForm.control} name="hasAdditionalNationalities" render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="hasAdditionalNationalities2" 
                              checked={!!field.value} 
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                if (!checked) {
                                  secondForm.setValue('additionalNationalities', []);
                                } else if (secondForm.getValues('additionalNationalities').length === 0) {
                                  secondForm.setValue('additionalNationalities', ['']);
                                }
                              }} 
                            />
                            <label htmlFor="hasAdditionalNationalities2" className="text-sm font-medium">
                              {t('application.personalInfo.additionalNationality.question', { defaultValue: 'Do you hold another nationality?' })}
                            </label>
                          </div>
                        </FormItem>
                      )} />

                      {secondForm.watch('hasAdditionalNationalities') && (
                        <div className="space-y-3">
                          {secondForm.watch('additionalNationalities').map((_, index) => (
                            <div key={index} className="flex items-end gap-3">
                              <FormField 
                                control={secondForm.control} 
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
                                {secondForm.watch('additionalNationalities').length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      const current = secondForm.getValues('additionalNationalities');
                                      const updated = current.filter((_, i) => i !== index);
                                      secondForm.setValue('additionalNationalities', updated);
                                    }}
                                    className="h-10 w-10"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                )}
                                {index === secondForm.watch('additionalNationalities').length - 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      const current = secondForm.getValues('additionalNationalities');
                                      secondForm.setValue('additionalNationalities', [...current, '']);
                                    }}
                                    className="h-10 w-10"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FormLabel>{t('application.personalInfo.email.label')} <span className="text-destructive">*</span></FormLabel>
                        {primaryApplicant?.email && (
                          <FormField control={secondForm.control} name="useSameEmailAsPrimary" render={({ field }) => (
                            <div className="flex items-center gap-2">
                              <Checkbox id="sameEmail2" checked={!!field.value} onCheckedChange={field.onChange} />
                              <label htmlFor="sameEmail2" className="text-sm text-muted-foreground">{t('application.email.sameAsPrimary', { defaultValue: 'Same as Applicant 1' })}</label>
                            </div>
                          )} />
                        )}
                      </div>
                      {(!useSameEmail || !primaryApplicant?.email) && (
                        <FormField control={secondForm.control} name="email" render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} type="email" inputMode="email" aria-invalid={!!fieldState.error} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      )}
                      {useSameEmail && primaryApplicant?.email && (
                        <p className="text-sm text-muted-foreground">{t('application.email.usingPrimary', { defaultValue: "Using Applicant 1's email address" })}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium">{t('application.address.title', { defaultValue: 'Address' })}</h4>
                        <FormField control={secondForm.control} name="useSameAddressAsPrimary" render={({ field }) => (
                          <div className="flex items-center gap-2">
                            <Checkbox id="sameAddress2" checked={!!field.value} onCheckedChange={field.onChange} />
                            <label htmlFor="sameAddress2" className="text-sm text-muted-foreground">{t('application.address.sameAsPrimary', { defaultValue: 'Same as Applicant 1' })}</label>
                          </div>
                        )} />
                      </div>

                      {!secondForm.watch('useSameAddressAsPrimary') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField control={secondForm.control} name="address.line1" render={({ field, fieldState }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>{t('application.address.line1.label', { defaultValue: 'Address line 1' })} <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} aria-invalid={!!fieldState.error} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={secondForm.control} name="address.line2" render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>{t('application.address.line2.label', { defaultValue: 'Address line 2 (optional)' })}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )} />
                          <FormField control={secondForm.control} name="address.city" render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>{t('application.address.city.label', { defaultValue: 'City' })} <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} aria-invalid={!!fieldState.error} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={secondForm.control} name="address.state" render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>{t('application.address.state.label', { defaultValue: 'State/Province' })} <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} aria-invalid={!!fieldState.error} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={secondForm.control} name="address.postalCode" render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>{t('application.address.postalCode.label', { defaultValue: 'Postal code' })} <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Input {...field} aria-invalid={!!fieldState.error} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={secondForm.control} name="address.country" render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel>{t('application.address.country.label', { defaultValue: 'Country' })} <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-[invalid=true]:border-destructive aria-[invalid=true]:bg-destructive/5 aria-[invalid=true]:focus-visible:ring-destructive disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                  aria-invalid={!!fieldState.error}
                                >
                                  <option value="">{t('application.address.country.placeholder', { defaultValue: 'Select a country' })}</option>
                                  {nationalities.map((n) => (
                                    <option key={n.code} value={n.code}>{n.name}</option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                      )}
                      {secondForm.watch('useSameAddressAsPrimary') && (
                        <p className="text-sm text-muted-foreground">{t('application.address.usingPrimary', { defaultValue: "Using Applicant 1's address" })}</p>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            )}
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {t('application.payment.details.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('application.payment.details.cardholderName.label')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('application.payment.details.cardholderName.placeholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('application.payment.details.cardNumber.label')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('application.payment.details.cardNumber.placeholder')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('application.payment.details.expiryDate.label')}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder={t('application.payment.details.expiryDate.placeholder')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                          {t('application.payment.details.cvv.label')}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder={t('application.payment.details.cvv.placeholder')}
                        />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    <p className="text-sm">
                      {t('application.payment.details.security')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t('application.payment.summary.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t('application.payment.summary.application')}</span>
                    <span>£89.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('application.payment.summary.serviceFee')}</span>
                    <span>£15.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t('application.payment.summary.vat')}</span>
                    <span>£20.80</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>{t('application.payment.summary.total')}</span>
                    <span>£124.80</span>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>{t('application.payment.summary.sslSecured')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>{t('application.payment.summary.moneyBack')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/application/documents')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('application.back')}
            </Button>
            <Button 
              onClick={handleComplete}
              className="flex items-center gap-2"
              size="lg"
            >
              {t('application.payment.complete')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;