import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface FormCompletionOptions {
  form: UseFormReturn<any>;
  requiredFields: string[];
  optionalFields?: string[];
}

interface FormCompletionResult {
  percentage: number;
  completedFields: number;
  totalRequiredFields: number;
  missingRequiredFields: string[];
  status: 'empty' | 'started' | 'halfway' | 'almost' | 'complete';
  motivationalMessage: string;
}

export const useFormCompletion = ({ 
  form, 
  requiredFields, 
  optionalFields = [] 
}: FormCompletionOptions): FormCompletionResult => {
  return useMemo(() => {
    const formValues = form.getValues();
    
    // Check required fields completion
    const completedRequiredFields = requiredFields.filter(field => {
      const value = getNestedValue(formValues, field);
      return isFieldComplete(value);
    });
    
    // Check optional fields completion (for bonus percentage)
    const completedOptionalFields = optionalFields.filter(field => {
      const value = getNestedValue(formValues, field);
      return isFieldComplete(value);
    });
    
    const requiredPercentage = (completedRequiredFields.length / requiredFields.length) * 100;
    const optionalBonus = optionalFields.length > 0 
      ? (completedOptionalFields.length / optionalFields.length) * 10 
      : 0;
    
    const totalPercentage = Math.min(100, requiredPercentage + optionalBonus);
    
    const missingRequiredFields = requiredFields.filter(field => {
      const value = getNestedValue(formValues, field);
      return !isFieldComplete(value);
    });
    
    // Determine status and motivational message
    let status: FormCompletionResult['status'];
    let motivationalMessage: string;
    
    if (totalPercentage === 0) {
      status = 'empty';
      motivationalMessage = 'Let\'s get started!';
    } else if (totalPercentage < 30) {
      status = 'started';
      motivationalMessage = 'Great start! Keep going.';
    } else if (totalPercentage < 70) {
      status = 'halfway';
      motivationalMessage = `You're ${Math.round(totalPercentage)}% done! Making good progress.`;
    } else if (totalPercentage < 95) {
      status = 'almost';
      motivationalMessage = `Almost there! Just ${missingRequiredFields.length} more fields to go.`;
    } else {
      status = 'complete';
      motivationalMessage = 'Perfect! All required fields completed.';
    }
    
    return {
      percentage: Math.round(totalPercentage),
      completedFields: completedRequiredFields.length,
      totalRequiredFields: requiredFields.length,
      missingRequiredFields,
      status,
      motivationalMessage,
    };
  }, [form.watch(), requiredFields, optionalFields]);
};

// Helper function to get nested object values (e.g., "address.line1")
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Helper function to check if a field value is considered complete
const isFieldComplete = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'boolean') return true; // booleans are always "complete"
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    // For objects, check if any property has a value
    return Object.values(value).some(v => isFieldComplete(v));
  }
  return Boolean(value);
};