import { useEffect, useRef, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DataManager } from '@/utils/dataManager';
import { toast } from 'sonner';

interface AutoSaveOptions {
  applicantId: string;
  form: UseFormReturn<any>;
  interval?: number; // milliseconds
  showToast?: boolean;
}

export const useAutoSave = ({ 
  applicantId, 
  form, 
  interval = 30000, // 30 seconds
  showToast = true 
}: AutoSaveOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedData = useRef<string>('');
  
  const saveData = useCallback(() => {
    if (!applicantId) return;
    
    const currentData = form.getValues();
    const currentDataStr = JSON.stringify(currentData);
    
    // Only save if data has changed
    if (currentDataStr === lastSavedData.current) {
      return;
    }
    
    try {
      DataManager.updateApplicant(applicantId, currentData);
      lastSavedData.current = currentDataStr;
      
      if (showToast) {
        toast.success('Progress saved automatically', {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      if (showToast) {
        toast.error('Failed to save progress', {
          duration: 3000,
        });
      }
    }
  }, [applicantId, form, showToast]);
  
  const saveNow = useCallback(() => {
    saveData();
  }, [saveData]);
  
  // Start auto-save interval
  useEffect(() => {
    if (!applicantId) return;
    
    intervalRef.current = setInterval(saveData, interval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [saveData, interval, applicantId]);
  
  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveData();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveData]);
  
  return { saveNow };
};