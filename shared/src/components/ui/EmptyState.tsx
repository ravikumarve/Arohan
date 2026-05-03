import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
        {...props}
      >
        {icon && <div className="mb-4 text-gray-600">{icon}</div>}
        <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
        {description && <p className="text-sm text-gray-500 mb-4 max-w-md">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
