import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Users, ArrowRight, Trash2 } from 'lucide-react';
import { DataManager } from '@/utils/dataManager';
import { toast } from 'sonner';

interface SavedApplicationBannerProps {
  onClearApplication?: () => void;
}

export const SavedApplicationBanner: React.FC<SavedApplicationBannerProps> = ({
  onClearApplication
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Check if there's a saved application
  const hasSavedApp = DataManager.hasSavedApplication();
  const progress = DataManager.getApplicationProgress();
  const applicants = DataManager.getApplicants();
  
  if (!hasSavedApp || !progress) {
    return null;
  }
  
  const handleContinueApplication = () => {
    switch (progress.step) {
      case 1:
        // Continue with personal info
        navigate(`/application/applicant/${progress.applicantId}`);
        break;
      case 2:
        // Continue with documents  
        navigate(`/application/applicant/${progress.applicantId}/documents`);
        break;
      case 3:
        // Continue with review/payment
        navigate('/application/review');
        break;
      default:
        navigate('/application');
    }
  };
  
  const handleClearApplication = () => {
    try {
      DataManager.clearAllData();
      toast.success('Saved application cleared');
      onClearApplication?.();
    } catch (error) {
      console.error('Error clearing application:', error);
      toast.error('Failed to clear application');
    }
  };
  
  const getProgressPercentage = () => {
    const stats = DataManager.getCompletionStats();
    return stats.percentageComplete;
  };
  
  return (
    <div className="bg-primary/5 border-l-4 border-primary">
      <div className="container mx-auto px-6 py-8">
        <Card className="bg-white/95 border border-primary/20 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left side - Application info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <h3 className="text-xl font-semibold text-primary">
                    You have a saved application in progress
                  </h3>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{applicants.length} {applicants.length === 1 ? 'applicant' : 'applicants'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{getProgressPercentage()}% complete</span>
                  </div>
                </div>
                
                <p className="text-muted-foreground">
                  <strong>Next step:</strong> {progress.description}
                </p>
              </div>
              
              {/* Right side - Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearApplication}
                  className="text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Start Over
                </Button>
                
                <Button 
                  onClick={handleContinueApplication}
                  className="bg-gradient-to-r from-primary to-turquoise text-white hover:shadow-lg transition-all duration-300"
                >
                  Continue Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};