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
import { cn } from '@/lib/utils';
import { useEffect, useMemo } from 'react';

// Regex patterns
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const passportRegex = /^[A-Z0-9]{6,9}$/i;
const nationalityRegex = /^(AF|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|CV|KH|CM|CA|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|SZ|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/;
const cityRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
const stateRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/;
const postalRegex = /^[A-Za-z0-9 -]{3,10}$/;

// Comprehensive nationality list
const nationalities = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BQ', name: 'Bonaire, Sint Eustatius and Saba' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BV', name: 'Bouvet Island' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IO', name: 'British Indian Ocean Territory' },
  { code: 'BN', name: 'Brunei Darussalam' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CV', name: 'Cabo Verde' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CX', name: 'Christmas Island' },
  { code: 'CC', name: 'Cocos (Keeling) Islands' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo, Democratic Republic of the' },
  { code: 'CK', name: 'Cook Islands' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CW', name: 'Curaçao' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czechia' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FK', name: 'Falkland Islands (Malvinas)' },
  { code: 'FO', name: 'Faroe Islands' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GF', name: 'French Guiana' },
  { code: 'PF', name: 'French Polynesia' },
  { code: 'TF', name: 'French Southern Territories' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GP', name: 'Guadeloupe' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GG', name: 'Guernsey' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HM', name: 'Heard Island and McDonald Islands' },
  { code: 'VA', name: 'Holy See (Vatican City State)' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran, Islamic Republic of' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JE', name: 'Jersey' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: "Korea, Democratic People's Republic of" },
  { code: 'KR', name: 'Korea, Republic of' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: "Lao People's Democratic Republic" },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao' },
  { code: 'MK', name: 'Macedonia, the former Yugoslav Republic of' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MQ', name: 'Martinique' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'YT', name: 'Mayotte' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia, Federated States of' },
  { code: 'MD', name: 'Moldova, Republic of' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MS', name: 'Montserrat' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NC', name: 'New Caledonia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NU', name: 'Niue' },
  { code: 'NF', name: 'Norfolk Island' },
  { code: 'MP', name: 'Northern Mariana Islands' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestine, State of' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PN', name: 'Pitcairn' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RE', name: 'Réunion' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russian Federation' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BL', name: 'Saint Barthélemy' },
  { code: 'SH', name: 'Saint Helena, Ascension and Tristan da Cunha' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'MF', name: 'Saint Martin (French part)' },
  { code: 'PM', name: 'Saint Pierre and Miquelon' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SX', name: 'Sint Maarten (Dutch part)' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GS', name: 'South Georgia and the South Sandwich Islands' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SJ', name: 'Svalbard and Jan Mayen' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syrian Arab Republic' },
  { code: 'TW', name: 'Taiwan, Province of China' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania, United Republic of' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TK', name: 'Tokelau' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TC', name: 'Turks and Caicos Islands' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UM', name: 'United States Minor Outlying Islands' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Viet Nam' },
  { code: 'VG', name: 'Virgin Islands, British' },
  { code: 'VI', name: 'Virgin Islands, U.S.' },
  { code: 'WF', name: 'Wallis and Futuna' },
  { code: 'EH', name: 'Western Sahara' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' }
];

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

const defaultApplicant = (shareAddress = false, shareEmail = false): z.infer<typeof applicantBase> => ({
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  nationality: '',
  email: '',
  passportNumber: '',
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
      const order = ['firstName','lastName','dateOfBirth','nationality','email','passportNumber'];
      for (const k of order) { if (e?.[k]) return `applicants.${i}.${k}` as const; }
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

