import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Application = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('application.personalInfo.firstName')} {t('application.personalInfo.required')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('application.personalInfo.firstNamePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('application.personalInfo.lastName')} {t('application.personalInfo.required')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t('application.personalInfo.lastNamePlaceholder')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('application.personalInfo.dateOfBirth')} {t('application.personalInfo.required')}
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('application.personalInfo.nationality')} {t('application.personalInfo.required')}
                  </label>
                  <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">{t('application.personalInfo.nationalityPlaceholder')}</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="JP">Japan</option>
                    <option value="KR">South Korea</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('application.personalInfo.email')} {t('application.personalInfo.required')}
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('application.personalInfo.emailPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('application.personalInfo.passportNumber')} {t('application.personalInfo.required')}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('application.personalInfo.passportNumberPlaceholder')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('application.back')}
            </Button>
            <Button 
              onClick={() => navigate('/application/documents')}
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

export default Application;