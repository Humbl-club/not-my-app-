import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CreditCard, Shield, Lock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';

const Payment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Track applicants from unified structure
  const [applicants, setApplicants] = useState<any[]>([]);
  
  useEffect(() => {
    try {
      // Load from new unified structure
      const applicantsData = sessionStorage.getItem('application.applicants');
      if (applicantsData) {
        const parsedApplicants = JSON.parse(applicantsData);
        setApplicants(parsedApplicants);
        return;
      }

      // Fallback: Load from legacy structure
      const legacyApplicants = [];
      const mainApplicantData = sessionStorage.getItem('application.primaryApplicant');
      const secondApplicantData = sessionStorage.getItem('application.secondApplicant');
      
      if (mainApplicantData) {
        legacyApplicants.push(JSON.parse(mainApplicantData));
      }
      if (secondApplicantData) {
        legacyApplicants.push(JSON.parse(secondApplicantData));
      }
      
      setApplicants(legacyApplicants);
    } catch {
      setApplicants([]);
    }
  }, []);

  const paymentSchema = z.object({
    cardholderName: z.string().min(1, 'Cardholder name is required'),
    cardNumber: z.string().min(16, 'Card number must be at least 16 digits').max(19, 'Card number is too long'),
    expiryDate: z.string().min(5, 'Expiry date is required (MM/YY)').regex(/^\d{2}\/\d{2}$/, 'Use MM/YY format'),
    cvv: z.string().min(3, 'CVV must be at least 3 digits').max(4, 'CVV is too long'),
    acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  });

  type PaymentValues = z.infer<typeof paymentSchema>;

  const form = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      acceptTerms: false,
    },
  });

  const handleAddApplicant = () => {
    navigate('/application/manage');
  };

  const handleSubmit = async (values: PaymentValues) => {
    // Process payment here
    navigate('/application/confirmation');
  };

  // Dynamic fee calculation for 1-8 applicants
  const numberOfApplicants = Math.max(1, applicants.length);
  const governmentFee = 16.00; // £16.00 per applicant (government fee)
  const mainAdminFee = 36.00; // £36.00 main admin fee for first applicant
  const additionalAdminFee = 26.00; // £26.00 per additional applicant
  
  // Calculate fees
  const totalGovernmentFees = governmentFee * numberOfApplicants;
  const totalAdminFees = mainAdminFee + (additionalAdminFee * Math.max(0, numberOfApplicants - 1));
  const subtotal = totalGovernmentFees + totalAdminFees;
  const vat = subtotal * 0.2; // 20% VAT
  const total = subtotal + vat;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">{t('application.progress.step', { current: 4, total: 4 })}</span>
              <span className="text-sm text-muted-foreground">{t('application.progress.complete', { percent: 100 })}</span>
            </div>
            <Progress value={100} className="h-3 bg-muted/50 [&>[data-state=complete]]:bg-gradient-travel" />
          </div>

          {/* Header */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-8 tracking-tight">
              {t('application.payment.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              {t('application.payment.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Payment Form */}
            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card hover:shadow-form transition-all duration-500">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-light text-foreground">
                  <CreditCard className="h-6 w-6 text-primary" />
                  {t('application.payment.details.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
                    <FormField control={form.control} name="cardholderName" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('application.payment.details.cardholderName.label')}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder={t('application.payment.details.cardholderName.placeholder')} 
                            aria-invalid={!!fieldState.error} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="cardNumber" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t('application.payment.details.cardNumber.label')}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder={t('application.payment.details.cardNumber.placeholder')} 
                            maxLength={19}
                            onChange={(e) => {
                              // Format card number with spaces
                              let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                              value = value.replace(/(\d{4})/g, '$1 ').trim();
                              field.onChange(value);
                            }}
                            aria-invalid={!!fieldState.error} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="expiryDate" render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>{t('application.payment.details.expiryDate.label')}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder={t('application.payment.details.expiryDate.placeholder')} 
                              maxLength={5}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) {
                                  value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                }
                                field.onChange(value);
                              }}
                              aria-invalid={!!fieldState.error} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="cvv" render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel>{t('application.payment.details.cvv.label')}</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder={t('application.payment.details.cvv.placeholder')} 
                              maxLength={4}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                field.onChange(value);
                              }}
                              aria-invalid={!!fieldState.error} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="acceptTerms" render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id="acceptTerms" 
                            checked={!!field.value} 
                            onCheckedChange={field.onChange}
                          />
                          <label htmlFor="acceptTerms" className="text-sm">
                            I accept the <a href="/terms" className="text-primary underline">terms and conditions</a> and <a href="/privacy" className="text-primary underline">privacy policy</a>
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>{t('application.payment.details.security')}</span>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-primary to-turquoise text-white rounded-full px-8 py-4 hover:shadow-lg transition-all duration-300" size="lg">
                      <Lock className="h-5 w-5 mr-2" />
                      {t('application.payment.complete')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <div className="space-y-8">
              {/* Applicants Summary */}
              <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-light text-foreground">
                    Application Summary ({numberOfApplicants} {numberOfApplicants === 1 ? 'applicant' : 'applicants'})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {applicants.map((applicant, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {index === 0 ? 'Main Applicant' : `Applicant ${index + 1}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {applicant.firstName && applicant.lastName 
                              ? `${applicant.firstName} ${applicant.lastName}`
                              : 'Details provided'
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {numberOfApplicants < 8 && (
                      <div className="text-center py-4 border-t">
                        <p className="text-muted-foreground mb-4">
                          Add more applicants to this application
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={handleAddApplicant}
                          className="flex items-center gap-2 rounded-full border-border/50 hover:bg-muted/50"
                        >
                          <Plus className="h-4 w-4" />
                          Add Another Applicant
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Fee Breakdown */}
              <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-light text-foreground">{t('application.payment.summary.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Government fees ({numberOfApplicants} × £{governmentFee.toFixed(2)})</span>
                    <span>£{totalGovernmentFees.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Main applicant admin fee</span>
                    <span>£{mainAdminFee.toFixed(2)}</span>
                  </div>
                  
                  {numberOfApplicants > 1 && (
                    <div className="flex justify-between">
                      <span>Additional applicants ({numberOfApplicants - 1} × £{additionalAdminFee.toFixed(2)})</span>
                      <span>£{(additionalAdminFee * (numberOfApplicants - 1)).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t('application.payment.summary.vat')}</span>
                    <span>£{vat.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>{t('application.payment.summary.total')}</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>{t('application.payment.summary.sslSecured')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>{t('application.payment.summary.moneyBack')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-16">
            <Button 
              variant="outline" 
              onClick={() => navigate('/application/manage')}
              className="flex items-center gap-2 rounded-full px-8 py-3 border-border/50 hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('application.back')}
            </Button>
            <Button 
              onClick={() => navigate('/application/review')}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-turquoise text-white rounded-full px-8 py-3 hover:shadow-lg transition-all duration-300"
            >
              Review Application
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;