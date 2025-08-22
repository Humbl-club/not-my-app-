import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const Track = () => {
  const { t } = useTranslation();
  const [referenceNumber, setReferenceNumber] = useState('');

  const sampleRef = referenceNumber || 'ETA-2024-001234';

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-8 tracking-tight">
              {t('tracking.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              {t('tracking.subtitle')}
            </p>
          </div>

          {/* Search Form */}
          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card mb-12">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-light text-foreground">{t('tracking.lookupTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder={t('tracking.referencePlaceholder')}
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                </div>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-turquoise text-white rounded-full px-6 py-3 hover:shadow-lg transition-all duration-300">
                  <Search className="h-4 w-4" />
                  {t('tracking.trackButton')}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{t('tracking.hint')}</p>
            </CardContent>
          </Card>

          {/* Sample Application Status */}
          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card mb-12">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-light text-foreground">{t('tracking.applicationStatus', { ref: sampleRef })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('tracking.labels.applicantName')}</label>
                    <p className="font-medium">John Smith</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('tracking.labels.submissionDate')}</label>
                    <p>{new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('tracking.labels.currentStatus')}</label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-yellow-600">{t('tracking.status.processing')}</span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-4">
                  <h3 className="font-semibold">{t('tracking.timeline.title')}</h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{t('tracking.timeline.submitted')}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{t('tracking.timeline.descriptions.submitted')}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{t('tracking.timeline.documentsVerified')}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{t('tracking.timeline.descriptions.documentsVerified')}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <Clock className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{t('tracking.timeline.underReview')}</h4>
                          <span className="text-sm text-muted-foreground">{t('tracking.timeline.current')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{t('tracking.timeline.descriptions.underReview')}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-muted-foreground">{t('tracking.timeline.etaIssued')}</h4>
                          <span className="text-sm text-muted-foreground">{t('tracking.timeline.pending')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{t('tracking.timeline.descriptions.etaIssued')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estimated Completion */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">{t('tracking.estimated.title')}</h4>
                  </div>
                  <p className="text-blue-800 text-sm">{t('tracking.estimated.description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-light text-foreground">{t('tracking.support.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">{t('tracking.support.contactTitle')}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{t('tracking.support.description')}</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>{t('tracking.support.emailLabel')}:</strong> {t('tracking.support.email')}</p>
                    <p><strong>{t('tracking.support.phoneLabel')}:</strong> {t('tracking.support.phone')}</p>
                    <p><strong>{t('tracking.support.hoursLabel')}:</strong> {t('header.available247', { defaultValue: 'Available 24/7' })}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t('tracking.processingTimes.title')}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{t('tracking.processingTimes.description')}</p>
                  <div className="space-y-2 text-sm">
                    <p>{t('tracking.processingTimes.standard')}</p>
                    <p>{t('tracking.processingTimes.peak')}</p>
                    <p>{t('tracking.processingTimes.complex')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Track;
