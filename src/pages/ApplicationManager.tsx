import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Plus, Edit, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  personalInfoComplete: boolean;
  documentsComplete: boolean;
}

const ApplicationManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [primaryApplicant, setPrimaryApplicant] = useState<Applicant | null>(null);
  const [additionalApplicants, setAdditionalApplicants] = useState<Applicant[]>([]);

  const maxApplicants = 10;

  useEffect(() => {
    // Load primary applicant
    try {
      const primaryData = sessionStorage.getItem('application.primaryApplicant');
      if (primaryData) {
        const data = JSON.parse(primaryData);
        setPrimaryApplicant({
          id: 'primary',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          personalInfoComplete: !!(data.firstName && data.lastName && data.email),
          documentsComplete: !!(data.passportPhoto && data.personalPhoto),
        });
      }
    } catch {}

    // Load additional applicants
    try {
      const applicantsData = sessionStorage.getItem('application.applicants');
      if (applicantsData) {
        const data = JSON.parse(applicantsData);
        setAdditionalApplicants(data.map((applicant: any, index: number) => ({
          id: `applicant-${index + 1}`,
          firstName: applicant.firstName || '',
          lastName: applicant.lastName || '',
          personalInfoComplete: !!(applicant.firstName && applicant.lastName && applicant.email),
          documentsComplete: !!(applicant.passportPhoto && applicant.personalPhoto),
        })));
      }
    } catch {}
  }, []);

  const totalApplicants = 1 + additionalApplicants.length;
  const allApplicantsComplete = primaryApplicant?.personalInfoComplete && 
    primaryApplicant?.documentsComplete && 
    additionalApplicants.every(app => app.personalInfoComplete && app.documentsComplete);

  const handleAddApplicant = () => {
    if (totalApplicants >= maxApplicants) return;
    
    const newApplicantId = `applicant-${additionalApplicants.length + 1}`;
    navigate(`/application/applicant/${newApplicantId}`);
  };

  const handleEditApplicant = (id: string) => {
    if (id === 'primary') {
      navigate('/application');
    } else {
      navigate(`/application/applicant/${id}`);
    }
  };

  const handleRemoveApplicant = (id: string) => {
    if (id === 'primary') return; // Can't remove primary
    
    try {
      const currentData = sessionStorage.getItem('application.applicants');
      if (currentData) {
        const applicants = JSON.parse(currentData);
        const applicantIndex = parseInt(id.replace('applicant-', '')) - 1;
        applicants.splice(applicantIndex, 1);
        sessionStorage.setItem('application.applicants', JSON.stringify(applicants));
        
        // Refresh data
        setAdditionalApplicants(applicants.map((applicant: any, index: number) => ({
          id: `applicant-${index + 1}`,
          firstName: applicant.firstName || '',
          lastName: applicant.lastName || '',
          personalInfoComplete: !!(applicant.firstName && applicant.lastName && applicant.email),
          documentsComplete: !!(applicant.passportPhoto && applicant.personalPhoto),
        })));
      }
    } catch {}
  };

  const ApplicantCard = ({ applicant, isPrimary = false }: { applicant: Applicant; isPrimary?: boolean }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-medium">
                {isPrimary ? 'Primary Applicant' : `Applicant ${applicant.id.replace('applicant-', '')}`}
              </h3>
              {applicant.personalInfoComplete && applicant.documentsComplete && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {applicant.firstName && applicant.lastName 
                ? `${applicant.firstName} ${applicant.lastName}`
                : 'Not started'
              }
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {applicant.personalInfoComplete ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
                <span>Personal Information</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {applicant.documentsComplete ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
                <span>Documents</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditApplicant(applicant.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {!isPrimary && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemoveApplicant(applicant.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{t('application.progress.step', { current: 3, total: 4 })}</span>
              <span className="text-sm text-muted-foreground">
                {allApplicantsComplete ? t('application.progress.complete', { percent: 75 }) : 'Complete all applicants to proceed'}
              </span>
            </div>
            <Progress value={allApplicantsComplete ? 75 : 60} className="h-2" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Manage Applicants</h1>
            <p className="text-muted-foreground">
              Add up to {maxApplicants} applicants total. Complete all forms before proceeding to payment.
            </p>
          </div>

          {/* Primary Applicant */}
          <div className="space-y-6">
            {primaryApplicant && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Primary Applicant</h2>
                <ApplicantCard applicant={primaryApplicant} isPrimary />
              </div>
            )}

            {/* Additional Applicants */}
            {additionalApplicants.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Additional Applicants</h2>
                <div className="space-y-3">
                  {additionalApplicants.map((applicant) => (
                    <ApplicantCard key={applicant.id} applicant={applicant} />
                  ))}
                </div>
              </div>
            )}

            {/* Add Applicant */}
            {totalApplicants < maxApplicants && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Plus className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="font-medium mb-2">Add Another Applicant</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {totalApplicants} of {maxApplicants} applicants added
                  </p>
                  <Button onClick={handleAddApplicant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Applicant
                  </Button>
                </CardContent>
              </Card>
            )}

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
                onClick={() => navigate('/application/payment')}
                disabled={!allApplicantsComplete}
                className="flex items-center gap-2"
              >
                {t('application.continue')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationManager;