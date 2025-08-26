import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormValidationStatusProps {
  isValid: boolean;
  completionPercentage: number;
  errors: Record<string, any>;
}

export const FormValidationStatus: React.FC<FormValidationStatusProps> = ({
  isValid,
  completionPercentage,
  errors
}) => {
  const { t } = useTranslation();

  const getStatusIcon = () => {
    if (isValid) return <CheckCircle className="h-5 w-5 text-success" />;
    if (completionPercentage > 50) return <Clock className="h-5 w-5 text-warning" />;
    return <AlertCircle className="h-5 w-5 text-error-gentle" />;
  };

  const getStatusText = () => {
    if (isValid) return "Form completed successfully";
    if (completionPercentage > 75) return "Almost complete";
    if (completionPercentage > 50) return "More than halfway complete";
    return "Please fill out required fields";
  };

  const getStatusColor = () => {
    if (isValid) return "text-success bg-success-light border-success/20";
    if (completionPercentage > 50) return "text-warning bg-warning-light border-warning/20";
    return "text-error-gentle bg-error-gentle-light border-error-gentle/20";
  };

  return (
    <div className={cn("flex items-center gap-3 p-3 rounded-lg border", getStatusColor())}>
      {getStatusIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium">{getStatusText()}</p>
        <p className="text-xs opacity-75">{completionPercentage}% complete</p>
      </div>
    </div>
  );
};