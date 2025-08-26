import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save, Clock, CheckCircle } from 'lucide-react';
import { SimpleSaveService } from '@/services/simpleSaveService';
import { DataManager } from '@/utils/dataManager';
import { toast } from 'sonner';

interface SimpleSaveButtonProps {
  currentStep: string;
  className?: string;
}

export const SimpleSaveButton: React.FC<SimpleSaveButtonProps> = ({
  currentStep,
  className = ''
}) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Get current applicant data
      const applicants = DataManager.getApplicants();
      
      if (applicants.length === 0) {
        toast.error('No application data to save');
        return;
      }
      
      // Save to cache
      const cacheId = SimpleSaveService.saveToCache(applicants, currentStep);
      
      // Show success message
      toast.success('Application cached for 30 minutes!', {
        description: 'Return to this browser to continue where you left off',
        duration: 4000
      });
      
      // Navigate to homepage after brief delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving to cache:', error);
      toast.error('Failed to save application', {
        description: 'Please try again'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button 
      type="button"
      variant="secondary"
      onClick={handleSave}
      disabled={isSaving}
      className={`flex items-center gap-2 ${className}`}
    >
      {isSaving ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          Save & Continue Later
        </>
      )}
    </Button>
  );
};