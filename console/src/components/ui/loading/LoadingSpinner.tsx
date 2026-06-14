// Loading Spinner Component for loading states

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <Loader2 className={`animate-spin text-slate-400 ${sizeClasses[size]} ${className}`} />
  );
}

// Loading skeleton component
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-800 rounded ${className}`} />
  );
}

// Full page loading component
export function FullPageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

// Card loading skeleton
export function CardLoadingSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-4">
        <LoadingSkeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="h-4 w-3/4" />
          <LoadingSkeleton className="h-3 w-1/2" />
        </div>
      </div>
      <LoadingSkeleton className="h-20 w-full" />
    </div>
  );
}

// Table loading skeleton
export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded">
          <LoadingSkeleton className="w-8 h-8 rounded" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="h-4 w-1/4" />
            <LoadingSkeleton className="h-3 w-1/3" />
          </div>
          <LoadingSkeleton className="h-8 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}
