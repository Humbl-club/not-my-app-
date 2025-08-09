import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t('confirmation.title')}</h1>
            <p className="text-muted-foreground">{t('confirmation.subtitle')}</p>
          </div>

          {/* Application Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('confirmation.applicationDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('confirmation.referenceNumber')}</label>
                  <p className="font-mono text-lg">ETA-2024-001234</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('confirmation.submissionDate')}</label>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('confirmation.processingTime')}</label>
                  <p>24-72 hours</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('confirmation.amountPaid')}</label>
                  <p className="font-bold">£124.80</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('confirmation.nextSteps.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-medium">{t('confirmation.nextSteps.step1.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('confirmation.nextSteps.step1.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-medium">{t('confirmation.nextSteps.step2.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('confirmation.nextSteps.step2.description')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-medium">{t('confirmation.nextSteps.step3.title')}</h4>
                  <p className="text-muted-foreground text-sm">{t('confirmation.nextSteps.step3.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('confirmation.actions.downloadReceipt')}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {t('confirmation.actions.emailReceipt')}
            </Button>
            <Button onClick={() => navigate('/track')} className="flex items-center gap-2">
              {t('confirmation.actions.trackApplication')}
            </Button>
          </div>

          {/* Support Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('confirmation.support.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t('confirmation.support.email')}</p>
                    <p className="text-sm text-muted-foreground">support@uketaservice.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t('confirmation.support.phone')}</p>
                    <p className="text-sm text-muted-foreground">+44 20 7946 0958</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">{t('confirmation.support.hours')}</p>
            </CardContent>
          </Card>

          {/* Return Home */}
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              size="lg"
            >
              {t('confirmation.returnHome')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
