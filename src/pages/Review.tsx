import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, AlertTriangle, Edit } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Review = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  // SEO setup
  useEffect(() => {
    document.title = t('review.pageTitle') + ' | UK ETA';
    const ensureTag = (selector: string, el: HTMLElement) => {
      const existing = document.head.querySelector(selector);
      if (existing) existing.replaceWith(el);
      else document.head.appendChild(el);
    };
    const metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    metaDesc.content = t('review.metaDescription');
    ensureTag('meta[name="description"]', metaDesc);
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = window.location.href;
    ensureTag('link[rel="canonical"]', canonical);
  }, [t]);

  const applicants = useMemo(() => {
    try { 
      const stored = sessionStorage.getItem('application.applicants');
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      }
      // Fallback to legacy structure for migration
      const primary = JSON.parse(sessionStorage.getItem('application.primaryApplicant') || 'null');
      const second = JSON.parse(sessionStorage.getItem('application.secondApplicant') || 'null');
      return [primary, second].filter(Boolean);
    } catch (error) { 
      console.error('Error parsing applicant data:', error);
      return []; 
    }
  }, []);

  const hasValidData = useMemo(() => {
    return applicants.length > 0 && applicants.every(applicant => 
      // Check that applicant exists and has all required personal info and documents
      applicant && 
      applicant.firstName && 
      applicant.lastName && 
      applicant.email &&
      applicant.passportNumber &&
      applicant.passportPhoto &&
      applicant.personalPhoto
    );
  }, [applicants]);

  // Route protection - redirect if no valid data
  useEffect(() => {
    if (!hasValidData) {
      navigate('/application/manage');
    }
  }, [hasValidData, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('review.header.title')}</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/application/manage')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> {t('review.header.backButton')}
            </Button>
            <Button 
              onClick={() => navigate('/application/payment')}
              disabled={!hasValidData}
            >
              {t('review.header.proceedToPayment')}
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!hasValidData && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('review.validation.emptyData')}
            </AlertDescription>
          </Alert>
        )}
        
        <section>
          <Card>
            <CardHeader>
              <CardTitle>{t('review.summary.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {applicants.map((applicant, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {index === 0 ? t('review.summary.mainApplicant') : t('review.summary.additionalApplicant', { number: index + 1 })}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => navigate(`/application/applicant/${index === 0 ? 'main' : index + 1}`)}
                    >
                      <Edit className="h-4 w-4" />
                      {t('review.summary.editButton')}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>{t('review.summary.name')}:</strong> {applicant.firstName} {applicant.lastName}</p>
                      <p><strong>{t('review.summary.dateOfBirth')}:</strong> {applicant.dateOfBirth}</p>
                      <p><strong>{t('review.summary.nationality')}:</strong> {applicant.nationality}</p>
                      <p><strong>{t('review.summary.email')}:</strong> {applicant.email}</p>
                    </div>
                    <div>
                      <p><strong>{t('review.summary.passportNumber')}:</strong> {applicant.passportNumber}</p>
                      <p><strong>{t('review.summary.job')}:</strong> {applicant.job}</p>
                      {applicant.address && (
                        <p><strong>{t('review.summary.address')}:</strong> {applicant.address.line1}, {applicant.address.city}, {applicant.address.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  {t('review.disclaimer')}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Review;