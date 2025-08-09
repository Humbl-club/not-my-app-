import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CreditCard, Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
              onClick={() => navigate('/application/confirmation')}
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