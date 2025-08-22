import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary to-turquoise rounded-full mb-8">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-8 tracking-tight">
              {t('confirmation.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              {t('confirmation.subtitle')}
            </p>
          </div>

          {/* Application Details */}
          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card mb-12">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-light text-foreground">{t('confirmation.applicationDetails')}</CardTitle>
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
          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card mb-12">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-light text-foreground">{t('confirmation.nextSteps.title')}</CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Button variant="outline" className="flex items-center gap-2 rounded-full border-border/50 hover:bg-muted/50 px-6 py-3">
              <Download className="h-4 w-4" />
              {t('confirmation.actions.downloadReceipt')}
            </Button>
            <Button variant="outline" className="flex items-center gap-2 rounded-full border-border/50 hover:bg-muted/50 px-6 py-3">
              <Mail className="h-4 w-4" />
              {t('confirmation.actions.emailReceipt')}
            </Button>
            <Button onClick={() => navigate('/track')} className="flex items-center gap-2 bg-gradient-to-r from-primary to-turquoise text-white rounded-full px-6 py-3 hover:shadow-lg transition-all duration-300">
              {t('confirmation.actions.trackApplication')}
            </Button>
          </div>

          {/* Support Information */}
          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-light text-foreground">{t('confirmation.support.title')}</CardTitle>
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
          <div className="text-center mt-16">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              size="lg"
              className="rounded-full border-border/50 hover:bg-muted/50 px-8 py-3"
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
