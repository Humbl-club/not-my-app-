import React from 'react';
import { Shield, Lock, CheckCircle, Award, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  variant?: 'security' | 'verified' | 'performance' | 'users';
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ 
  variant = 'security', 
  className 
}) => {
  const badges = {
    security: {
      icon: Shield,
      text: '256-bit SSL Secured',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    verified: {
      icon: CheckCircle,
      text: 'Verified Service',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    performance: {
      icon: TrendingUp,
      text: '99.9% Uptime',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    users: {
      icon: Users,
      text: '50,000+ Applications',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    }
  };

  const badge = badges[variant];
  const Icon = badge.icon;

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-2 rounded-lg border trust-glow',
      badge.bg,
      badge.border,
      className
    )}>
      <Icon className={cn('w-4 h-4', badge.color)} />
      <span className={cn('text-sm font-medium', badge.color)}>
        {badge.text}
      </span>
    </div>
  );
};

interface SecurityIndicatorProps {
  className?: string;
}

export const SecurityIndicator: React.FC<SecurityIndicatorProps> = ({ className }) => {
  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200',
      className
    )}>
      <Lock className="w-4 h-4 text-green-600" />
      <span className="text-sm font-medium text-green-700">
        Secure Connection
      </span>
      <div className="flex gap-1 ml-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};

interface PaymentSecurityProps {
  className?: string;
}

export const PaymentSecurity: React.FC<PaymentSecurityProps> = ({ className }) => {
  return (
    <div className={cn(
      'flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200',
      className
    )}>
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600" />
        <span className="text-sm font-medium text-gray-700">Secured by</span>
      </div>
      
      {/* Payment Provider Badges - Using text instead of logos */}
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 bg-white rounded border border-gray-300">
          <span className="text-sm font-semibold text-gray-700">Stripe</span>
        </div>
        <div className="px-3 py-1 bg-white rounded border border-gray-300">
          <span className="text-xs font-medium text-gray-600">PCI DSS</span>
        </div>
        <div className="px-3 py-1 bg-white rounded border border-gray-300">
          <span className="text-xs font-medium text-gray-600">Level 1</span>
        </div>
      </div>
    </div>
  );
};

interface ProcessingStatsProps {
  applications?: number;
  successRate?: number;
  avgTime?: string;
  className?: string;
}

export const ProcessingStats: React.FC<ProcessingStatsProps> = ({ 
  applications = 52341,
  successRate = 99.8,
  avgTime = '48 hours',
  className 
}) => {
  return (
    <div className={cn(
      'grid grid-cols-3 gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200',
      className
    )}>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-700 count-animation">
          {applications.toLocaleString()}
        </div>
        <div className="text-xs text-blue-600 mt-1">Applications Processed</div>
      </div>
      
      <div className="text-center border-x border-blue-200">
        <div className="text-2xl font-bold text-blue-700 count-animation">
          {successRate}%
        </div>
        <div className="text-xs text-blue-600 mt-1">Success Rate</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-700 count-animation">
          {avgTime}
        </div>
        <div className="text-xs text-blue-600 mt-1">Average Processing</div>
      </div>
    </div>
  );
};

interface VerificationBadgeProps {
  status: 'pending' | 'verified' | 'failed';
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  status, 
  className 
}) => {
  const configs = {
    pending: {
      icon: Award,
      text: 'Verification Pending',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      animation: 'animate-pulse'
    },
    verified: {
      icon: CheckCircle,
      text: 'Verified & Secure',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      animation: 'success-check-slide'
    },
    failed: {
      icon: Shield,
      text: 'Verification Required',
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      animation: ''
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-2 rounded-lg border',
      config.bg,
      config.border,
      config.animation,
      className
    )}>
      <Icon className={cn('w-4 h-4', config.color)} />
      <span className={cn('text-sm font-medium', config.color)}>
        {config.text}
      </span>
    </div>
  );
};

// Trust signals bar for the header/footer
export const TrustBar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn(
      'flex flex-wrap items-center justify-center gap-6 py-3 px-4 bg-gradient-to-r from-gray-50 to-blue-50 border-y border-gray-200',
      className
    )}>
      <TrustBadge variant="security" />
      <TrustBadge variant="verified" />
      <TrustBadge variant="performance" />
      <TrustBadge variant="users" />
    </div>
  );
};

export default {
  TrustBadge,
  SecurityIndicator,
  PaymentSecurity,
  ProcessingStats,
  VerificationBadge,
  TrustBar
};