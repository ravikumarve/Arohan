import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
        {...props}
      >
        {icon != null && <div className="mb-4 text-gray-600">{icon}</div>}
        <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
        {description != null && <p className="text-sm text-gray-500 mb-4 max-w-md">{description}</p>}
        {action != null && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
