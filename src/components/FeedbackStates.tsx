import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  RefreshCw,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FeedbackProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// Success State
export const SuccessState: React.FC<FeedbackProps> = ({
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-50" />
        <div className="relative bg-green-50 p-4 rounded-full">
          <CheckCircle className="w-12 h-12 text-green-600 success-check-slide" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mb-4 max-w-md">{description}</p>
      )}
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="mt-4 btn-press bg-green-600 hover:bg-green-700"
        >
          {action.label}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      )}
      
      {/* Success animation particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-0"
            style={{
              left: '50%',
              top: '50%',
              animation: `particle-float 2s ease-out ${i * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Error State
export const ErrorState: React.FC<FeedbackProps & { retry?: () => void }> = ({
  title,
  description,
  action,
  retry,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50" />
        <div className="relative bg-red-50 p-4 rounded-full field-error-shake">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mb-4 max-w-md">{description}</p>
      )}
      
      <div className="flex gap-3 mt-4">
        {retry && (
          <Button 
            onClick={retry}
            variant="outline"
            className="btn-press"
          >
            <RefreshCw className="mr-2 w-4 h-4" />
            Try Again
          </Button>
        )}
        
        {action && (
          <Button 
            onClick={action.onClick}
            className="btn-press"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};

// Warning State
export const WarningState: React.FC<FeedbackProps> = ({
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-amber-100 rounded-full blur-xl opacity-50 warning-pulse" />
        <div className="relative bg-amber-50 p-4 rounded-full">
          <AlertTriangle className="w-12 h-12 text-amber-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mb-4 max-w-md">{description}</p>
      )}
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="mt-4 btn-press bg-amber-600 hover:bg-amber-700"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Empty State
export const EmptyState: React.FC<FeedbackProps & { icon?: React.ReactNode }> = ({
  title,
  description,
  action,
  icon,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <div className="mb-4 text-gray-300">
        {icon || (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <Info className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mb-4 max-w-md">{description}</p>
      )}
      
      {action && (
        <Button 
          onClick={action.onClick}
          className="mt-4 btn-press"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Loading State with Progress
interface LoadingStateProps {
  title?: string;
  description?: string;
  progress?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Processing...",
  description,
  progress,
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <div className="relative mb-4">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full spinner-professional" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full spinner-professional" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mb-4 max-w-md">{description}</p>
      )}
      
      {progress !== undefined && (
        <div className="w-full max-w-xs mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full progress-fill-animation"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Loading dots */}
      <div className="flex gap-1 mt-4">
        <div className="w-2 h-2 bg-blue-600 rounded-full loading-dot" />
        <div className="w-2 h-2 bg-blue-600 rounded-full loading-dot" />
        <div className="w-2 h-2 bg-blue-600 rounded-full loading-dot" />
      </div>
    </div>
  );
};

// Inline Success Message
export const InlineSuccess: React.FC<{ message: string; className?: string }> = ({
  message,
  className
}) => {
  return (
    <div className={cn(
      'flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg slide-in-right',
      className
    )}>
      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
      <span className="text-sm text-green-800 font-medium">{message}</span>
    </div>
  );
};

// Inline Error Message
export const InlineError: React.FC<{ message: string; className?: string }> = ({
  message,
  className
}) => {
  return (
    <div className={cn(
      'flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg field-error-shake',
      className
    )}>
      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
      <span className="text-sm text-red-800 font-medium">{message}</span>
    </div>
  );
};

// Inline Warning Message
export const InlineWarning: React.FC<{ message: string; className?: string }> = ({
  message,
  className
}) => {
  return (
    <div className={cn(
      'flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg',
      className
    )}>
      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
      <span className="text-sm text-amber-800 font-medium">{message}</span>
    </div>
  );
};

// Inline Info Message
export const InlineInfo: React.FC<{ message: string; className?: string }> = ({
  message,
  className
}) => {
  return (
    <div className={cn(
      'flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg',
      className
    )}>
      <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
      <span className="text-sm text-blue-800 font-medium">{message}</span>
    </div>
  );
};

// Add particle animation
const particleStyles = `
@keyframes particle-float {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--x, 0px)), calc(-50% + var(--y, -100px))) scale(1);
    opacity: 0;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = particleStyles;
  document.head.appendChild(styleSheet);
}