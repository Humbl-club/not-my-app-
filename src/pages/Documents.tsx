import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Documents = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('application.progress.step', { current: 2, total: 4 })}</span>
              <span className="text-sm text-muted-foreground">{t('application.progress.complete', { percent: 50 })}</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('application.documents.title')}</h1>
            <p className="text-muted-foreground">{t('application.documents.subtitle')}</p>
          </div>

          {/* Document Upload */}
          <div className="space-y-6">
            {/* Passport Upload */}
            <Card>
              <CardHeader>
                <CardTitle>{t('application.documents.passport.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">{t('application.documents.passport.uploadTitle')}</p>
                  <p className="text-muted-foreground mb-4">{t('application.documents.passport.format')}</p>
                  <Button variant="outline">
                    {t('application.documents.passport.chooseFile')}
                  </Button>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <h4 className="font-medium mb-2">{t('application.documents.passport.requirements.title')}</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>The photo must be unaltered by effects or filters</li>
                    <li>Original, not a screenshot or photocopy</li>
                    <li>Of a physical passport, not a digital passport</li>
                    <li>In colour</li>
                    <li>Horizontal (landscape)</li>
                    <li>A jpg or jpeg file</li>
                    <li>{t('application.documents.passport.requirements.readable')}</li>
                    <li>{t('application.documents.passport.requirements.visible')}</li>
                    <li>{t('application.documents.passport.requirements.noGlare')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle>{t('application.documents.photo.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium mb-1">{t('application.documents.photo.upload.title')}</p>
                    <p className="text-sm text-muted-foreground mb-3">{t('application.documents.photo.upload.format')}</p>
                    <Button variant="outline" size="sm">
                      {t('application.documents.photo.upload.button')}
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium mb-1">{t('application.documents.photo.camera.title')}</p>
                    <p className="text-sm text-muted-foreground mb-3">{t('application.documents.photo.camera.subtitle')}</p>
                    <Button variant="outline" size="sm">
                      {t('application.documents.photo.camera.button')}
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <h4 className="font-medium mb-2">{t('application.documents.photo.requirements.title')}</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-foreground mb-1">The photo must be:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>different to the one in your passport</li>
                        <li>recently taken (no more than 3 months old)</li>
                        <li>vertical (portrait)</li>
                        <li>a jpg or jpeg file</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">You must not:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>upload a photo of another photo</li>
                        <li>use any effects or filters</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/application')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('application.back')}
            </Button>
            <Button 
              onClick={() => navigate('/application/manage')}
              className="flex items-center gap-2"
            >
              {t('application.continue')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;