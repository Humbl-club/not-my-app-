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

  // Check if there's a second applicant
  const [hasSecondApplicant, setHasSecondApplicant] = useState(false);
  const [secondApplicant, setSecondApplicant] = useState<any | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('application.secondApplicant');
      if (raw) {
        setSecondApplicant(JSON.parse(raw));
        setHasSecondApplicant(true);
      }
    } catch {}
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

  const handleAddSecondApplicant = () => {
    navigate('/application/manage');
  };

  const handleSubmit = async (values: PaymentValues) => {
    // Process payment here
    navigate('/application/confirmation');
  };

  const serviceFee = 79.99;
  const vat = serviceFee * 0.2;
  const total = serviceFee + vat;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('application.progress.step', { current: 4, total: 4 })}</span>
              <span className="text-sm text-muted-foreground">{t('application.progress.complete', { percent: 100 })}</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('application.payment.title')}</h1>
            <p className="text-muted-foreground">{t('application.payment.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
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

                    <Button type="submit" className="w-full" size="lg">
                      <Lock className="h-4 w-4 mr-2" />
                      {t('application.payment.complete')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Additional Applicant Option */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Applicant</CardTitle>
                </CardHeader>
                <CardContent>
                  {hasSecondApplicant && secondApplicant ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Second Applicant Added</p>
                          <p className="text-sm text-muted-foreground">
                            {secondApplicant.firstName} {secondApplicant.lastName}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate('/application/second-applicant')}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">
                        Add a second applicant to this application
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleAddSecondApplicant}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Second Applicant
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('application.payment.summary.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t('application.payment.summary.application')}</span>
                    <span>£{serviceFee.toFixed(2)}</span>
                  </div>
                  
                  {hasSecondApplicant && (
                    <div className="flex justify-between">
                      <span>Second Applicant</span>
                      <span>£{serviceFee.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t('application.payment.summary.vat')}</span>
                    <span>£{(vat * (hasSecondApplicant ? 2 : 1)).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>{t('application.payment.summary.total')}</span>
                      <span>£{(total * (hasSecondApplicant ? 2 : 1)).toFixed(2)}</span>
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
              onClick={() => navigate('/application/review')}
              className="flex items-center gap-2"
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