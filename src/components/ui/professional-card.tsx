import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, MoreVertical } from "lucide-react";

interface ProfessionalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient';
  interactive?: boolean;
  status?: 'default' | 'success' | 'warning' | 'error';
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

const ProfessionalCard = React.forwardRef<HTMLDivElement, ProfessionalCardProps>(
  ({ 
    className, 
    variant = 'default', 
    interactive = false, 
    status = 'default',
    badge,
    actions,
    children,
    ...props 
  }, ref) => {
    
    const variants = {
      default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
      elevated: 'bg-white shadow-lg hover:shadow-xl',
      bordered: 'bg-white border-2 border-gray-300 hover:border-blue-400',
      gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md hover:shadow-lg'
    };

    const statusStyles = {
      default: '',
      success: 'border-l-4 border-l-green-500',
      warning: 'border-l-4 border-l-amber-500',
      error: 'border-l-4 border-l-red-500'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-200 overflow-hidden',
          variants[variant],
          statusStyles[status],
          interactive && 'cursor-pointer card-lift',
          className
        )}
        {...props}
      >
        {/* Badge */}
        {badge && (
          <div className="absolute -top-2 -right-2 z-10">
            {badge}
          </div>
        )}

        {/* Actions Menu */}
        {actions && (
          <div className="absolute top-4 right-4 z-10">
            {actions}
          </div>
        )}

        {children}
      </div>
    );
  }
);

ProfessionalCard.displayName = "ProfessionalCard";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-6 py-4 border-b border-gray-100",
      className
    )}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6", className)} 
    {...props} 
  />
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-6 py-4 bg-gray-50 border-t border-gray-100",
      className
    )}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

// Specialized Card Types

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  trend = 'neutral',
  className
}) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <ProfessionalCard variant="elevated" className={cn("relative overflow-visible", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 count-animation">{value}</p>
            {change !== undefined && (
              <p className={cn("text-xs font-medium", trendColors[trend])}>
                {change > 0 ? '+' : ''}{change}%
              </p>
            )}
          </div>
          {icon && (
            <div className="p-2 bg-blue-50 rounded-lg">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </ProfessionalCard>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
  className
}) => {
  return (
    <ProfessionalCard 
      variant="bordered" 
      interactive 
      onClick={onClick}
      className={cn("group", className)}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
      </CardContent>
    </ProfessionalCard>
  );
};

interface StatusCardProps {
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description?: string;
  timestamp?: string;
  className?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  status,
  description,
  timestamp,
  className
}) => {
  const statusConfig = {
    pending: {
      color: 'bg-amber-100 text-amber-800',
      dot: 'bg-amber-500',
      text: 'Pending'
    },
    processing: {
      color: 'bg-blue-100 text-blue-800',
      dot: 'bg-blue-500',
      text: 'Processing'
    },
    completed: {
      color: 'bg-green-100 text-green-800',
      dot: 'bg-green-500',
      text: 'Completed'
    },
    failed: {
      color: 'bg-red-100 text-red-800',
      dot: 'bg-red-500',
      text: 'Failed'
    }
  };

  const config = statusConfig[status];

  return (
    <ProfessionalCard 
      variant="default" 
      status={status === 'failed' ? 'error' : status === 'completed' ? 'success' : 'default'}
      className={className}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
            config.color
          )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
            {config.text}
          </span>
        </div>
        {description && (
          <p className="text-sm text-gray-600 mb-2">{description}</p>
        )}
        {timestamp && (
          <p className="text-xs text-gray-500">{timestamp}</p>
        )}
      </CardContent>
    </ProfessionalCard>
  );
};

export { 
  ProfessionalCard, 
  CardHeader, 
  CardContent, 
  CardFooter,
  MetricCard,
  ActionCard,
  StatusCard
};