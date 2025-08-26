import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Plus, Users, Calculator, Banknote, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DataManager } from '@/utils/dataManager';
import { PaymentService, PaymentDetails } from '@/services/paymentService';
import { StripeWrapper } from '@/components/StripeWrapper';
import { StripeCheckout } from '@/components/StripeCheckout';

const Payment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Track applicants from unified structure
  const [applicants, setApplicants] = useState<any[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  
  useEffect(() => {
    const applicantsData = DataManager.getApplicants();
    setApplicants(applicantsData);
    
    // Calculate payment details
    const numberOfApplicants = Math.max(1, applicantsData.length);
    const payment = PaymentService.calculatePayment(numberOfApplicants);
    setPaymentDetails(payment);
  }, []);

  const handleAddApplicant = () => {
    navigate('/application/manage');
  };

  const handlePaymentSuccess = (referenceNumber: string) => {
    // Payment successful, navigate to confirmation
    navigate('/application/confirmation', { 
      state: { referenceNumber } 
    });
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Handle payment error (could show toast notification)
  };

  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

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
            {/* Stripe Payment Form */}
            <StripeWrapper>
              <StripeCheckout 
                paymentDetails={paymentDetails}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </StripeWrapper>

            {/* Order Summary */}
            <div className="space-y-8">
              {/* Applicants Summary */}
              <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-light text-foreground">
                    <Users className="h-5 w-5 text-primary" />
                    Application Summary ({paymentDetails.numberOfApplicants} {paymentDetails.numberOfApplicants === 1 ? 'applicant' : 'applicants'})
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
                    
                    {paymentDetails.numberOfApplicants < 8 && (
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
                  <CardTitle className="flex items-center gap-3 text-xl font-light text-foreground">
                    <Banknote className="h-5 w-5 text-primary" />
                    {t('application.payment.summary.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Government fees ({paymentDetails.numberOfApplicants} × £16.00)</span>
                    <span>£{paymentDetails.governmentFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>£{paymentDetails.adminFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t('application.payment.summary.vat')}</span>
                    <span>£{paymentDetails.vat.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>{t('application.payment.summary.total')}</span>
                      <span>£{paymentDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mt-6">
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
              onClick={() => navigate('/application/review')}
              className="flex items-center gap-2 rounded-full px-8 py-3 border-border/50 hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('application.back')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;