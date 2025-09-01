import React, { useEffect, useState, useMemo } from 'react';
import { HeaderPro } from '@/components/HeaderPro';
import { FooterPro } from '@/components/FooterPro';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  User,
  Users,
  FileText,
  Mail,
  Globe,
  Calendar,
  MapPin,
  Briefcase,
  Shield,
  CheckCircle,
  Info,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { SecureFormInput } from '@/components/SecureFormInput';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DataManager } from '@/utils/dataManager';
import { SimpleSaveButton } from '@/components/SimpleSaveButton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { nationalities } from '@/constants/nationalities';
import { validateDateOfBirth } from '@/components/ui/date-of-birth-input';
import { EMAIL_PATTERN } from '@/components/ui/email-input';
import { PASSPORT_NAME_PATTERN } from '@/components/ui/passport-name-input';
import { Input } from '@/components/ui/input';

const ApplicantFormPro = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [primaryApplicant, setPrimaryApplicant] = useState<any | null>(null);
  const [existingData, setExistingData] = useState<any | null>(null);
  
  const applicantNumber = parseInt(id || '1');
  const isMainApplicant = applicantNumber === 1;

  // Check if this is a group application
  const [isGroupApplication, setIsGroupApplication] = useState(false);
  const [totalApplicants, setTotalApplicants] = useState(1);

  useEffect(() => {
    const applicants = DataManager.getApplicants();
    setTotalApplicants(applicants.length || 1);
    setIsGroupApplication(applicants.length > 1 || sessionStorage.getItem('applicationType') === 'group');
  }, []);

  // Create schema with all validations
  const applicantSchema = useMemo(() => z.object({
    // Personal Information
    firstName: z.string()
      .min(1, 'First name is required')
      .regex(PASSPORT_NAME_PATTERN, 'Use only letters, spaces, hyphens and apostrophes')
      .max(50, 'First name is too long'),
    
    secondNames: z.string()
      .regex(PASSPORT_NAME_PATTERN, 'Use only letters, spaces, hyphens and apostrophes')
      .max(100, 'Middle names are too long')
      .optional()
      .or(z.literal('')),
    
    lastName: z.string()
      .min(1, 'Last name is required')
      .regex(PASSPORT_NAME_PATTERN, 'Use only letters, spaces, hyphens and apostrophes')
      .max(50, 'Last name is too long'),
    
    dateOfBirth: z.string()
      .refine((val) => validateDateOfBirth(val) === null, {
        message: 'Invalid date of birth'
      }),
    
    nationality: z.string().min(2, 'Nationality is required'),
    
    // Contact Information
    email: z.string()
      .min(1, 'Email is required')
      .regex(EMAIL_PATTERN, 'Invalid email address'),
    
    passportNumber: z.string()
      .min(6, 'Passport number must be at least 6 characters')
      .max(10, 'Passport number must be at most 10 characters')
      .regex(/^[A-Z0-9]+$/i, 'Use only letters and numbers'),
    
    // Address
    useSameAddressAsPrimary: z.boolean().default(false),
    address: z.object({
      line1: z.string(),
      line2: z.string().optional(),
      city: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }).optional(),
    
    // Employment
    hasJob: z.enum(['yes', 'no']),
    jobTitle: z.string().optional(),
    
    // Security Questions
    hasCriminalConvictions: z.enum(['yes', 'no']),
    hasWarCrimesConvictions: z.enum(['yes', 'no']),
  }).superRefine((data, ctx) => {
    // Address validation
    if (!isMainApplicant && !data.useSameAddressAsPrimary) {
      if (!data.address?.line1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Address line 1 is required',
          path: ['address', 'line1'],
        });
      }
      if (!data.address?.city) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'City is required',
          path: ['address', 'city'],
        });
      }
      if (!data.address?.postalCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Postal code is required',
          path: ['address', 'postalCode'],
        });
      }
      if (!data.address?.country) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Country is required',
          path: ['address', 'country'],
        });
      }
    }
    
    // Job title validation
    if (data.hasJob === 'yes' && !data.jobTitle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Job title is required',
        path: ['jobTitle'],
      });
    }
  }), [isMainApplicant]);

  type ApplicantFormData = z.infer<typeof applicantSchema>;

  const form = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      secondNames: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      email: '',
      passportNumber: '',
      useSameAddressAsPrimary: false,
      address: {
        line1: '',
        line2: '',
        city: '',
        postalCode: '',
        country: '',
      },
      hasJob: 'no',
      jobTitle: '',
      hasCriminalConvictions: 'no',
      hasWarCrimesConvictions: 'no',
    },
  });

  // Watch form values
  const hasJob = useWatch({ control: form.control, name: 'hasJob' });
  const useSameAddress = useWatch({ control: form.control, name: 'useSameAddressAsPrimary' });

  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Load primary applicant for reference
      if (!isMainApplicant) {
        const applicants = DataManager.getApplicants();
        if (applicants[0]) {
          setPrimaryApplicant(applicants[0]);
        }
      }
      
      // Load current applicant data
      const applicantData = DataManager.getApplicant(id || '1');
      if (applicantData) {
        setExistingData(applicantData);
        form.reset(applicantData);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [id, form, isMainApplicant]);

  // Handle address checkbox
  useEffect(() => {
    if (useSameAddress && primaryApplicant?.address) {
      form.setValue('address', primaryApplicant.address);
    }
  }, [useSameAddress, primaryApplicant, form]);

  // Calculate completion percentage
  const calculateCompletion = () => {
    const values = form.getValues();
    const requiredFields = [
      'firstName', 'lastName', 'dateOfBirth', 'nationality', 
      'email', 'passportNumber', 'hasJob', 
      'hasCriminalConvictions', 'hasWarCrimesConvictions'
    ];
    
    let completed = 0;
    requiredFields.forEach(field => {
      const value = values[field as keyof ApplicantFormData];
      if (value && value !== '') completed++;
    });
    
    // Check address
    if (!isMainApplicant) {
      if (useSameAddress || (values.address?.line1 && values.address?.city && values.address?.country)) {
        completed++;
      }
    } else if (values.address?.line1 && values.address?.city && values.address?.country) {
      completed++;
    }
    
    // Check job title if has job
    if (values.hasJob === 'yes' && values.jobTitle) {
      completed++;
    } else if (values.hasJob === 'no') {
      completed++;
    }
    
    const total = isMainApplicant ? requiredFields.length + 1 : requiredFields.length + 2;
    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (form.formState.isDirty) {
        handleAutoSave();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [form.formState.isDirty]);

  const handleAutoSave = async () => {
    const values = form.getValues();
    DataManager.updateApplicant(id || '1', values);
    toast.success('Progress saved automatically', {
      duration: 2000,
      icon: <Save className="w-4 h-4" />
    });
  };

  const handleSubmit = async (values: ApplicantFormData) => {
    setSaving(true);
    
    try {
      // Save applicant data
      DataManager.updateApplicant(id || '1', values);
      
      toast.success('Personal information saved successfully!');
      
      // Proceed to manager to continue the flow
      navigate('/application/manage');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderPro />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applicant information...</p>
          </div>
        </div>
        <FooterPro />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderPro />
      
      {/* Progress Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Step 3 of 5: Personal Information
                  </span>
                </div>
                {isGroupApplication && (
                  <Badge variant="outline" className="bg-white">
                    Applicant {applicantNumber} of {totalApplicants}
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {completionPercentage}% Complete
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            
            {/* Quick Progress Info */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="w-3 h-3" />
                Auto-saves every 30 seconds
              </div>
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                All progress is saved securely
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              {isMainApplicant ? (
                <User className="w-4 h-4 text-blue-600" />
              ) : (
                <Users className="w-4 h-4 text-purple-600" />
              )}
              <span className="text-sm font-medium text-blue-700">
                {isMainApplicant ? 'Primary Applicant' : `Additional Applicant ${applicantNumber}`}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Personal Information
            </h1>
            <p className="text-lg text-gray-600">
              {isMainApplicant 
                ? 'Please provide your personal details as they appear on your passport'
                : `Please provide details for applicant ${applicantNumber}`}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Name Section */}
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Full Name
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            First Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <SecureFormInput 
                              {...field} 
                              placeholder="John"
                              forceUppercase={true}
                              validatePattern={/^[A-Z][A-Z\s'-]*$/}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="secondNames"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name(s)</FormLabel>
                          <FormControl>
                            <SecureFormInput 
                              {...field} 
                              placeholder="Optional"
                              forceUppercase={true}
                              validatePattern={/^[A-Z][A-Z\s'-]*$/}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Last Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <SecureFormInput 
                              {...field} 
                              placeholder="Smith"
                              forceUppercase={true}
                              validatePattern={/^[A-Z][A-Z\s'-]*$/}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Enter your name exactly as it appears on your passport
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Personal Details */}
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Personal Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Date of Birth <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="date" 
                              max={new Date().toISOString().split('T')[0]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nationality <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              <option value="">Select nationality</option>
                              {nationalities.map((n) => (
                                <option key={n.code} value={n.code}>
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
                  
                  <FormField
                    control={form.control}
                    name="passportNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Passport Number <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <SecureFormInput 
                            {...field} 
                            placeholder="A12345678"
                            className="uppercase"
                            forceUppercase={true}
                            validatePattern={/^[A-Z0-9]{0,10}$/}
                            onSecureChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-green-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <SecureFormInput 
                            {...field} 
                            type="email"
                            placeholder="john.smith@example.com"
                            validatePattern={EMAIL_PATTERN}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-gray-500 mt-1">
                          We'll use this to send your ETA confirmation
                        </p>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Home Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isMainApplicant && primaryApplicant && (
                    <FormField
                      control={form.control}
                      name="useSameAddressAsPrimary"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-4 bg-blue-50 border-blue-200">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="font-medium cursor-pointer">
                              Use same address as primary applicant
                            </FormLabel>
                            {primaryApplicant.address && (
                              <p className="text-sm text-gray-600">
                                {primaryApplicant.address.line1}, {primaryApplicant.address.city}
                              </p>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {(!useSameAddress || isMainApplicant) && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address.line1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Address Line 1 <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <SecureFormInput 
                                {...field} 
                                placeholder="123 Main Street"
                                sanitizeOnBlur={true}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address.line2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address Line 2</FormLabel>
                            <FormControl>
                              <SecureFormInput 
                                {...field} 
                                placeholder="Apartment, suite, etc. (optional)"
                                sanitizeOnBlur={true}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="address.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                City <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <SecureFormInput 
                                  {...field} 
                                  placeholder="London"
                                  sanitizeOnBlur={true}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="address.postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Postal Code <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <SecureFormInput 
                                  {...field} 
                                  placeholder="SW1A 1AA"
                                  forceUppercase={true}
                                  sanitizeOnBlur={true}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Country <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              >
                                <option value="">Select country</option>
                                {nationalities.map((n) => (
                                  <option key={n.code} value={n.code}>
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
                  )}
                </CardContent>
              </Card>

              {/* Employment */}
              <Card className="shadow-lg border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                    Employment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="hasJob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Are you currently employed? <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-6"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Yes
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                No
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {hasJob === 'yes' && (
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Job Title <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <SecureFormInput 
                              {...field} 
                              placeholder="Software Engineer"
                              sanitizeOnBlur={true}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Security Questions */}
              <Card className="shadow-lg border-2 border-red-100">
                <CardHeader className="bg-red-50">
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <Shield className="w-5 h-5 text-red-600" />
                    Security Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      You must answer these questions truthfully. False information may result in denial of entry.
                    </AlertDescription>
                  </Alert>
                  
                  <FormField
                    control={form.control}
                    name="hasCriminalConvictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Have you ever been convicted of a criminal offense? <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-6"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                No
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Yes
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hasWarCrimesConvictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Have you ever been convicted of war crimes or crimes against humanity? <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-6"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                No
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Yes
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Form Errors Summary */}
              {Object.keys(form.formState.errors).length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please correct the errors above before continuing
                  </AlertDescription>
                </Alert>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/application/manage')}
                  className="px-6 py-3 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                <div className="flex gap-3">
                  <SimpleSaveButton currentStep={`applicant-${id}`} />
                  
                  <Button
                    type="submit"
                    disabled={saving || !form.formState.isValid}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Continue to Documents
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>

          {/* Help Section */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• All fields marked with * are required</li>
                  <li>• Your information must match your passport exactly</li>
                  <li>• Your progress is automatically saved every 30 seconds</li>
                  <li>• You can return to edit this information at any time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterPro />
    </div>
  );
};

export default ApplicantFormPro;
