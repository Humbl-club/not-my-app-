import React, { useState, useEffect } from 'react';
import { HeaderPro } from '@/components/HeaderPro';
import { FooterPro } from '@/components/FooterPro';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  RefreshCw,
  Shield,
  Info,
  Plus,
  FolderOpen,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SimpleSaveService } from '@/services/simpleSaveService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SavedApplication {
  id: string;
  applicantData: any[];
  savedAt: string;
  expiresAt: string;
  currentStep: string;
  completionPercentage: number;
}

const AccountProgressPro: React.FC = () => {
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
        toast.success('Application restored successfully!', {
          description: `Continuing from ${getStepLabel(application.currentStep)}`
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
    if (window.confirm('Are you sure you want to delete this saved application? This action cannot be undone.')) {
      try {
        SimpleSaveService.clearSpecific(applicationId);
        loadSavedApplications();
        toast.success('Application deleted successfully');
      } catch (error) {
        console.error('Error deleting application:', error);
        toast.error('Failed to delete application');
      }
    }
  };

  const getStepIcon = (step: string) => {
    if (step.includes('documents')) return <Camera className="h-5 w-5" />;
    if (step.includes('applicant')) return <FileText className="h-5 w-5" />;
    if (step.includes('payment')) return <CreditCard className="h-5 w-5" />;
    if (step.includes('review')) return <CheckCircle className="h-5 w-5" />;
    return <Users className="h-5 w-5" />;
  };

  const getStepLabel = (step: string) => {
    if (step.includes('documents')) return 'Document Upload';
    if (step.includes('applicant')) return 'Personal Information';
    if (step.includes('payment')) return 'Payment';
    if (step.includes('review')) return 'Review';
    return 'Application Management';
  };

  const getStepColor = (step: string) => {
    if (step.includes('documents')) return 'purple';
    if (step.includes('applicant')) return 'blue';
    if (step.includes('payment')) return 'green';
    if (step.includes('review')) return 'indigo';
    return 'gray';
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) <= new Date();
  };

  const getTimeRemainingMinutes = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    return Math.floor(diff / 60000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderPro />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your saved applications...</p>
          </div>
        </div>
        <FooterPro />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderPro />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Your Applications</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Manage Your Applications
            </h1>
            <p className="text-xl text-gray-600">
              Resume saved applications or start a new UK ETA application
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <strong>{savedApplications.filter(app => !isExpired(app.expiresAt)).length}</strong> Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  <strong>{savedApplications.filter(app => isExpired(app.expiresAt)).length}</strong> Expired
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <Button 
              onClick={() => navigate('/application')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Start New Application
            </Button>
            <Button 
              variant="outline" 
              onClick={loadSavedApplications}
              className="px-6 py-3 rounded-xl border-2"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Saved Applications */}
          {savedApplications.length === 0 ? (
            <Card className="shadow-xl border-2">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Saved Applications</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  You don't have any saved applications on this device. Start a new application to get your UK ETA.
                </p>
                <Button 
                  onClick={() => navigate('/application')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Start Your Application
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {savedApplications.map((app) => {
                const expired = isExpired(app.expiresAt);
                const remainingMinutes = getTimeRemainingMinutes(app.expiresAt);
                const isUrgent = remainingMinutes < 10 && remainingMinutes > 0;
                const stepColor = getStepColor(app.currentStep);
                
                return (
                  <Card 
                    key={app.id}
                    className={cn(
                      "shadow-lg transition-all hover:shadow-xl border-2",
                      expired ? "border-red-200 bg-red-50/50" : 
                      isUrgent ? "border-amber-200 bg-amber-50/50" : 
                      "hover:border-blue-200"
                    )}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            app.applicantData.length === 1 
                              ? "bg-gradient-to-br from-blue-100 to-indigo-100"
                              : "bg-gradient-to-br from-purple-100 to-pink-100"
                          )}>
                            {app.applicantData.length === 1 ? (
                              <User className="w-6 h-6 text-blue-600" />
                            ) : (
                              <Users className="w-6 h-6 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {app.applicantData.length} Applicant{app.applicantData.length !== 1 ? 's' : ''}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Saved {new Date(app.savedAt).toLocaleDateString('en-GB')} at{' '}
                              {new Date(app.savedAt).toLocaleTimeString('en-GB', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          className={cn(
                            "flex items-center gap-1",
                            expired ? "bg-red-100 text-red-700 border-red-200" :
                            isUrgent ? "bg-amber-100 text-amber-700 border-amber-200" :
                            "bg-blue-100 text-blue-700 border-blue-200"
                          )}
                        >
                          <Clock className="h-3 w-3" />
                          {expired ? 'Expired' : getTimeRemaining(app.expiresAt)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Application Progress</span>
                          <span className="text-sm font-bold text-gray-900">{app.completionPercentage}%</span>
                        </div>
                        <Progress value={app.completionPercentage} className="h-2" />
                      </div>

                      {/* Current Step */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            stepColor === 'blue' && "bg-blue-100",
                            stepColor === 'purple' && "bg-purple-100",
                            stepColor === 'green' && "bg-green-100",
                            stepColor === 'indigo' && "bg-indigo-100",
                            stepColor === 'gray' && "bg-gray-100"
                          )}>
                            <div className={cn(
                              stepColor === 'blue' && "text-blue-600",
                              stepColor === 'purple' && "text-purple-600",
                              stepColor === 'green' && "text-green-600",
                              stepColor === 'indigo' && "text-indigo-600",
                              stepColor === 'gray' && "text-gray-600"
                            )}>
                              {getStepIcon(app.currentStep)}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Last Step</p>
                            <p className="font-semibold">{getStepLabel(app.currentStep)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Applicant Names */}
                      {app.applicantData.length > 0 && app.applicantData.some(a => a.firstName) && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Applicants:</p>
                          <div className="flex flex-wrap gap-2">
                            {app.applicantData.slice(0, 3).map((applicant, index) => (
                              applicant.firstName && (
                                <Badge key={index} variant="outline" className="bg-white">
                                  {applicant.firstName} {applicant.lastName}
                                </Badge>
                              )
                            ))}
                            {app.applicantData.length > 3 && (
                              <Badge variant="outline" className="bg-white">
                                +{app.applicantData.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Warning for expiring soon */}
                      {isUrgent && (
                        <Alert className="border-amber-200 bg-amber-50">
                          <AlertCircle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-800">
                            This application expires in {remainingMinutes} minutes
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {!expired ? (
                          <>
                            <Button 
                              onClick={() => resumeApplication(app)}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl"
                            >
                              Resume Application
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                            <Button 
                              variant="outline"
                              size="icon"
                              onClick={() => deleteApplication(app.id)}
                              className="rounded-xl hover:bg-red-50 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outline"
                            onClick={() => deleteApplication(app.id)}
                            className="w-full rounded-xl hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
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

          {/* Information Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Secure Storage</h3>
                <p className="text-sm text-gray-600">
                  Your data is encrypted and stored locally on this device only
                </p>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Auto-Save</h3>
                <p className="text-sm text-gray-600">
                  Applications are saved for 30 minutes and can be resumed anytime
                </p>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Multiple Applications</h3>
                <p className="text-sm text-gray-600">
                  Save and manage multiple applications simultaneously
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-3">How Save & Resume Works</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    Applications are automatically saved as you progress
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    Data is stored locally for 30 minutes for security
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    No account or login required - device-based storage
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    Clear your browser data to remove all saved applications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterPro />
    </div>
  );
};

export default AccountProgressPro;