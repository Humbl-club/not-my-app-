import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ApplicationSaveService } from '@/services/applicationSaveService';
import { DataManager } from '@/utils/dataManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, RefreshCw, Home, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const ResumeApplication: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!token) {
      setError('Invalid resume link');
      setLoading(false);
      return;
    }

    loadApplication();
  }, [token]);

  const loadApplication = async () => {
    if (!token) return;
    
    setLoading(true);
    setError('');

    try {
      const result = await ApplicationSaveService.resumeApplication(token);
      
      if (result.success && result.application) {
        setApplication(result.application);
        
        // Load the application data into the current session
        DataManager.clearAllData(); // Clear any existing data
        
        // Restore each applicant
        result.application.applicantData.forEach((applicant, index) => {
          DataManager.updateApplicant((index + 1).toString(), applicant);
        });
        
        toast.success('Application loaded successfully!', {
          description: `${result.application.applicantData.length} applicant(s) restored`,
          duration: 3000
        });
        
      } else {
        setError(result.error || 'Failed to load application');
      }
    } catch (error) {
      console.error('Error loading application:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueApplication = () => {
    if (!application) return;
    
    // Get the current progress to determine where to navigate
    const progress = DataManager.getApplicationProgress();
    
    if (progress) {
      switch (progress.step) {
        case 1:
          navigate(`/application/applicant/${progress.applicantId}`);
          break;
        case 2:
          navigate(`/application/applicant/${progress.applicantId}/documents`);
          break;
        case 3:
          navigate('/application/review');
          break;
        default:
          navigate('/application');
      }
    } else {
      navigate('/application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Loading Your Application</h2>
            <p className="text-muted-foreground">Please wait while we restore your progress...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Unable to Load Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">This could happen if:</p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• The resume link has expired (30 days)</li>
                <li>• The link has already been used</li>
                <li>• The link is invalid or corrupted</li>
              </ul>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
              <Button
                onClick={() => navigate('/application')}
                className="flex-1"
              >
                Start New Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Application Found</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't find a saved application with this link.
            </p>
            <Button onClick={() => navigate('/application')}>
              Start New Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-6 w-6" />
            Application Successfully Restored
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Application Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applicants:</span>
                <span className="font-medium">{application.applicantData.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium">{application.completionPercentage}% complete</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saved:</span>
                <span className="font-medium">
                  {new Date(application.savedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium">
                  {new Date(application.expiresAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Applicants Restored:</h4>
            <div className="space-y-2">
              {application.applicantData.map((applicant: any, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>
                    {index === 0 ? 'Main Applicant' : `Applicant ${index + 1}`}: {' '}
                    {applicant.firstName && applicant.lastName 
                      ? `${applicant.firstName} ${applicant.lastName}`
                      : 'Partially completed'
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            <Button
              onClick={handleContinueApplication}
              className="flex-1"
            >
              Continue Application
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeApplication;