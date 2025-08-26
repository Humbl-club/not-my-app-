import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Users, 
  FileText, 
  Camera, 
  CreditCard, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { SimpleSaveService } from '@/services/simpleSaveService';
import { DataManager } from '@/utils/dataManager';
import { toast } from 'sonner';

interface SavedApplication {
  id: string;
  applicantData: any[];
  savedAt: string;
  expiresAt: string;
  currentStep: string;
  completionPercentage: number;
}

const AccountProgress: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [savedApplications, setSavedApplications] = useState<SavedApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedApplications();
    // Auto-refresh every 30 seconds to update expiry times
    const interval = setInterval(loadSavedApplications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSavedApplications = () => {
    setLoading(true);
    try {
      // Get cached applications for this device
      const cached = SimpleSaveService.getCachedForUser();
      setSavedApplications(cached);
    } catch (error) {
      console.error('Error loading saved applications:', error);
      toast.error('Failed to load saved applications');
    } finally {
      setLoading(false);
    }
  };

  const resumeApplication = (application: SavedApplication) => {
    try {
      // Load the application data
      const loaded = SimpleSaveService.loadFromCache(application.id);
      
      if (loaded) {
        toast.success('Application restored!', {
          description: `Continuing from ${application.currentStep}`
        });
        
        // Navigate to the appropriate step
        if (application.currentStep.includes('documents')) {
          const applicantId = application.currentStep.split('-')[1] || '1';
          navigate(`/application/applicant/${applicantId}/documents`);
        } else if (application.currentStep.includes('applicant')) {
          const applicantId = application.currentStep.split('-')[1] || '1';
          navigate(`/application/applicant/${applicantId}`);
        } else {
          navigate('/application/manage');
        }
      }
    } catch (error) {
      console.error('Error resuming application:', error);
      toast.error('Failed to resume application');
    }
  };

  const deleteApplication = (applicationId: string) => {
    if (window.confirm('Are you sure you want to delete this saved application?')) {
      try {
        SimpleSaveService.clearSpecific(applicationId);
        loadSavedApplications();
        toast.success('Application deleted');
      } catch (error) {
        console.error('Error deleting application:', error);
        toast.error('Failed to delete application');
      }
    }
  };

  const getStepIcon = (step: string) => {
    if (step.includes('documents')) return <Camera className="h-4 w-4" />;
    if (step.includes('applicant')) return <FileText className="h-4 w-4" />;
    if (step.includes('payment')) return <CreditCard className="h-4 w-4" />;
    if (step.includes('review')) return <CheckCircle className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  const getStepLabel = (step: string) => {
    if (step.includes('documents')) return 'Document Upload';
    if (step.includes('applicant')) return 'Personal Information';
    if (step.includes('payment')) return 'Payment';
    if (step.includes('review')) return 'Review';
    return 'Application Management';
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} minutes`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes % 60} minutes`;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) <= new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading saved applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 tracking-tight">
              Your Applications
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Resume your saved UK ETA applications or start a new one
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <Button 
              onClick={() => navigate('/application')}
              className="bg-gradient-to-r from-primary to-turquoise hover:opacity-90 transition-opacity"
            >
              Start New Application
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              onClick={loadSavedApplications}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Saved Applications */}
          {savedApplications.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm rounded-3xl border border-border/30 shadow-card">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-light mb-2">No Saved Applications</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any saved applications on this device.
                </p>
                <Button onClick={() => navigate('/application')}>
                  Start Your Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {savedApplications.map((app) => {
                const expired = isExpired(app.expiresAt);
                return (
                  <Card 
                    key={app.id}
                    className={`bg-white/90 backdrop-blur-sm rounded-3xl border shadow-card transition-all hover:shadow-lg ${
                      expired ? 'border-red-200 opacity-75' : 'border-border/30'
                    }`}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-normal flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {app.applicantData.length} Applicant{app.applicantData.length !== 1 ? 's' : ''}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Saved {new Date(app.savedAt).toLocaleDateString()} at {new Date(app.savedAt).toLocaleTimeString()}
                          </CardDescription>
                        </div>
                        <Badge variant={expired ? 'destructive' : 'secondary'} className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {expired ? 'Expired' : getTimeRemaining(app.expiresAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{app.completionPercentage}%</span>
                        </div>
                        <Progress value={app.completionPercentage} className="h-2" />
                      </div>

                      {/* Current Step */}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Last step:</span>
                        <div className="flex items-center gap-1">
                          {getStepIcon(app.currentStep)}
                          <span className="font-medium">{getStepLabel(app.currentStep)}</span>
                        </div>
                      </div>

                      {/* Applicant Names */}
                      {app.applicantData.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-sm text-muted-foreground">Applicants:</span>
                          <div className="flex flex-wrap gap-2">
                            {app.applicantData.slice(0, 3).map((applicant, index) => (
                              <Badge key={index} variant="outline">
                                {applicant.firstName} {applicant.lastName}
                              </Badge>
                            ))}
                            {app.applicantData.length > 3 && (
                              <Badge variant="outline">
                                +{app.applicantData.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Warning for expiring soon */}
                      {!expired && parseInt(getTimeRemaining(app.expiresAt)) < 10 && (
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>This application will expire soon</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {!expired ? (
                          <>
                            <Button 
                              onClick={() => resumeApplication(app)}
                              className="flex-1"
                            >
                              Resume Application
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                            <Button 
                              variant="outline"
                              size="icon"
                              onClick={() => deleteApplication(app.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outline"
                            onClick={() => deleteApplication(app.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Expired Application
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Information Card */}
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-foreground">Important Information</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Applications are saved locally on this device for 30 minutes</li>
                    <li>• Your data is encrypted and secure</li>
                    <li>• No account or login is required</li>
                    <li>• You can save and resume multiple applications</li>
                    <li>• Clear your browser data to remove all saved applications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountProgress;