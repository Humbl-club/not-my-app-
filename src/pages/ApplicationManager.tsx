import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, UserPlus, Edit, Trash2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface Applicant {
  id: string;
  role: 'main' | 'additional';
  firstName?: string;
  lastName?: string;
  personalInfoComplete: boolean;
  documentsComplete: boolean;
}

const ApplicationManager = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Changed from max 10 to max 8 as per requirements
  const maxApplicants = 8;
  
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // Load applicant data from sessionStorage
  useEffect(() => {
    try {
      // Load from new unified structure
      const applicantsData = sessionStorage.getItem('application.applicants');
      if (applicantsData) {
        const parsedApplicants = JSON.parse(applicantsData);
        const mappedApplicants = parsedApplicants.map((applicant: any, index: number) => ({
          id: index === 0 ? 'main' : `applicant-${index}`,
          role: index === 0 ? 'main' : 'additional',
          firstName: applicant.firstName || '',
          lastName: applicant.lastName || '',
          personalInfoComplete: !!(applicant.firstName && applicant.lastName && applicant.email && applicant.passportNumber),
          documentsComplete: !!(applicant.passportPhoto && applicant.personalPhoto)
        }));
        setApplicants(mappedApplicants);
        return;
      }

      // Fallback: Load from legacy structure and migrate
      const mainApplicantData = sessionStorage.getItem('application.primaryApplicant');
      const secondApplicantData = sessionStorage.getItem('application.secondApplicant');
      
      const legacyApplicants: Applicant[] = [];
      
      if (mainApplicantData) {
        const mainApplicant = JSON.parse(mainApplicantData);
        legacyApplicants.push({
          id: 'main',
          role: 'main',
          firstName: mainApplicant.firstName || '',
          lastName: mainApplicant.lastName || '',
          personalInfoComplete: !!(mainApplicant.firstName && mainApplicant.lastName && mainApplicant.email && mainApplicant.passportNumber),
          documentsComplete: !!(mainApplicant.passportPhoto && mainApplicant.personalPhoto)
        });
      } else {
        // Create empty main applicant
        legacyApplicants.push({
          id: 'main',
          role: 'main',
          firstName: '',
          lastName: '',
          personalInfoComplete: false,
          documentsComplete: false
        });
      }

      if (secondApplicantData) {
        const secondApplicant = JSON.parse(secondApplicantData);
        legacyApplicants.push({
          id: 'applicant-1',
          role: 'additional',
          firstName: secondApplicant.firstName || '',
          lastName: secondApplicant.lastName || '',
          personalInfoComplete: !!(secondApplicant.firstName && secondApplicant.lastName && secondApplicant.email && secondApplicant.passportNumber),
          documentsComplete: !!(secondApplicant.passportPhoto && secondApplicant.personalPhoto)
        });
      }

      setApplicants(legacyApplicants);
    } catch (error) {
      // Create default main applicant if no data exists
      setApplicants([{
        id: 'main',
        role: 'main',
        firstName: '',
        lastName: '',
        personalInfoComplete: false,
        documentsComplete: false
      }]);
    }
  }, []);

  const totalApplicants = applicants.length;
  const completedApplicants = applicants.filter(a => a.personalInfoComplete && a.documentsComplete).length;
  const allApplicantsComplete = applicants.length > 0 && applicants.every(a => a.personalInfoComplete && a.documentsComplete);
  const overallProgress = applicants.length > 0 ? Math.round((completedApplicants / applicants.length) * 100) : 0;

  const handleAddApplicant = () => {
    if (applicants.length < maxApplicants) {
      const newId = applicants.length === 1 ? 'applicant-1' : `applicant-${applicants.length}`;
      navigate(`/application/applicant/${newId}`);
    }
  };

  const handleEditApplicant = (applicantId: string) => {
    navigate(`/application/applicant/${applicantId}`);
  };

  const handleRemoveApplicant = (applicantId: string) => {
    if (applicantId === 'main') return; // Cannot remove main applicant
    
    const updatedApplicants = applicants.filter(a => a.id !== applicantId);
    
    // Re-index additional applicants to maintain proper numbering
    const reindexedApplicants = updatedApplicants.map((applicant, index) => {
      if (applicant.role === 'main') return applicant;
      return {
        ...applicant,
        id: `applicant-${index}`
      };
    });
    
    setApplicants(reindexedApplicants);
    
    // Update sessionStorage
    try {
      const applicantsData = sessionStorage.getItem('application.applicants');
      if (applicantsData) {
        const allApplicants = JSON.parse(applicantsData);
        const applicantIndex = applicantId === 'main' ? 0 : parseInt(applicantId.replace('applicant-', ''));
        allApplicants.splice(applicantIndex, 1);
        sessionStorage.setItem('application.applicants', JSON.stringify(allApplicants));
      }
    } catch (error) {
      console.error('Error updating sessionStorage:', error);
    }
  };

  const ApplicantCard = ({ applicant, index }: { applicant: Applicant; index: number }) => {
    const isMain = applicant.role === 'main';
    const displayName = applicant.firstName && applicant.lastName 
      ? `${applicant.firstName} ${applicant.lastName}` 
      : isMain ? 'Main Applicant' : `Applicant ${index + 1}`;
    
    const personalInfoStatus = applicant.personalInfoComplete ? 'complete' : 'incomplete';
    const documentsStatus = applicant.documentsComplete ? 'complete' : 'incomplete';
    const overallStatus = applicant.personalInfoComplete && applicant.documentsComplete ? 'complete' : 'incomplete';

    return (
      <Card className={`transition-all duration-300 ${overallStatus === 'complete' ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg font-medium">
                {isMain ? t('application.applicant.main', { defaultValue: 'Main Applicant' }) : `${t('application.applicant.title', { defaultValue: 'Applicant {{num}}', num: index + 1 })}`}
              </CardTitle>
              {overallStatus === 'complete' && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Check className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditApplicant(applicant.id)}
                className="rounded-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {!isMain && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveApplicant(applicant.id)}
                  className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {displayName !== (isMain ? 'Main Applicant' : `Applicant ${index + 1}`) && (
            <p className="text-muted-foreground">{displayName}</p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Personal Information</span>
              <div className="flex items-center gap-2">
                {personalInfoStatus === 'complete' ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={`text-sm ${personalInfoStatus === 'complete' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {personalInfoStatus === 'complete' ? 'Complete' : 'Incomplete'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Documents</span>
              <div className="flex items-center gap-2">
                {documentsStatus === 'complete' ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={`text-sm ${documentsStatus === 'complete' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {documentsStatus === 'complete' ? 'Complete' : 'Incomplete'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {t('application.progress.step', { current: 2, total: 4 })}
              </span>
              <span className="text-sm text-muted-foreground">
                {t('application.progress.complete', { percent: overallProgress })}
              </span>
            </div>
            <Progress value={overallProgress} className="h-3 bg-muted/50 [&>[data-state=complete]]:bg-gradient-travel" />
          </div>

          {/* Header */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-8 tracking-tight">
              Manage Applicants
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              {completedApplicants} of {totalApplicants} applicants completed • {totalApplicants} {totalApplicants === 1 ? 'applicant' : 'applicants'} in application
            </p>
          </div>

          {/* Applicants List */}
          <div className="space-y-6 mb-12">
            {applicants.map((applicant, index) => (
              <ApplicantCard key={applicant.id} applicant={applicant} index={index} />
            ))}
          </div>

          {/* Add More Applicants */}
          {applicants.length < maxApplicants && (
            <Card className="border-dashed border-2 border-border/50 bg-muted/20">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Add up to {maxApplicants - applicants.length} more {maxApplicants - applicants.length === 1 ? 'applicant' : 'applicants'} to this application
                  </p>
                  <Button onClick={handleAddApplicant} className="rounded-full bg-gradient-to-r from-primary to-turquoise text-white hover:shadow-lg transition-all duration-300">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Another Applicant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-16">
            <Button 
              variant="outline" 
              onClick={() => navigate('/application')}
              className="flex items-center gap-2 rounded-full px-8 py-3 border-border/50 hover:bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('application.back')}
            </Button>
            <Button 
              onClick={() => navigate('/application/payment')}
              disabled={!allApplicantsComplete}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-turquoise text-white rounded-full px-8 py-3 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationManager;