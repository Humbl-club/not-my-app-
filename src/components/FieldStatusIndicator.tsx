import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldStatusIndicatorProps {
  isRequired?: boolean;
  hasValue?: boolean;
  hasError?: boolean;
  className?: string;
}

export const FieldStatusIndicator: React.FC<FieldStatusIndicatorProps> = ({
  isRequired = false,
  hasValue = false,
  hasError = false,
  className
}) => {
  if (!isRequired) return null;

  const getIcon = () => {
    if (hasError) return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (hasValue) return <CheckCircle className="h-4 w-4 text-success" />;
    return <Clock className="h-4 w-4 text-warning" />;
  };

  const getStatusColor = () => {
    if (hasError) return "border-destructive bg-destructive/5";
    if (hasValue) return "border-success bg-success/5";
    return "border-warning bg-warning/5";
  };

  return (
    <div className={cn("absolute -top-1 -right-1 p-1 rounded-full border-2 bg-background", getStatusColor(), className)}>
      {getIcon()}
    </div>
  );
};