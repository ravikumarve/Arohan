import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-gray-700 text-gray-300',
      success: 'bg-green-900/50 text-green-400 border border-green-700',
      warning: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700',
      danger: 'bg-red-900/50 text-red-400 border border-red-700',
      info: 'bg-blue-900/50 text-blue-400 border border-blue-700',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
