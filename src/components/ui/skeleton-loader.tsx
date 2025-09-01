import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'title' | 'card' | 'avatar' | 'button' | 'input';
  lines?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  variant = 'text', 
  lines = 1,
  className,
  ...props 
}) => {
  const baseClass = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 background-size-200 background-position-minus-100";
  
  const variants = {
    text: 'h-4 rounded w-full',
    title: 'h-8 rounded w-3/4',
    card: 'h-48 rounded-xl w-full',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-32 rounded-lg',
    input: 'h-12 rounded-lg w-full'
  };

  if (lines > 1 && variant === 'text') {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClass,
              variants.text,
              i === lines - 1 && 'w-2/3' // Last line is shorter
            )}
            style={{
              animation: `skeleton-shimmer 1.5s infinite`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClass,
        variants[variant],
        className
      )}
      style={{
        animation: 'skeleton-shimmer 1.5s infinite'
      }}
      {...props}
    />
  );
};

// Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" className="h-3 w-24" />
          <Skeleton variant="input" />
        </div>
      ))}
      <Skeleton variant="button" className="ml-auto" />
    </div>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="title" className="w-1/3" />
        <Skeleton variant="avatar" />
      </div>
      <Skeleton variant="text" lines={3} />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="button" className="h-8 w-20" />
        <Skeleton variant="button" className="h-8 w-20" />
      </div>
    </div>
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" className="h-3" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  variant="text" 
                  className="h-4"
                  style={{
                    animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s`
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Dashboard Skeleton
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <Skeleton variant="text" className="h-3 w-20 mb-2" />
            <Skeleton variant="title" className="h-8 w-24" />
          </div>
        ))}
      </div>
      
      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Skeleton variant="title" className="mb-4" />
        <Skeleton variant="card" className="h-64" />
      </div>
      
      {/* Table */}
      <TableSkeleton />
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="avatar" className="h-20 w-20" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="title" className="w-48" />
          <Skeleton variant="text" className="w-32" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
    </div>
  );
};

// List Item Skeleton
export const ListItemSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/3" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
          <Skeleton variant="button" className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
};