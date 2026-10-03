import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'neutral' | 'current' | 'improved' | 'info' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-bg-tertiary text-text-secondary border-border-primary',
  current: 'bg-accent-current/10 text-accent-current border-accent-current/30',
  improved: 'bg-accent-improved/10 text-accent-improved border-accent-improved/30',
  info: 'bg-accent-info/10 text-accent-info border-accent-info/30',
  danger: 'bg-accent-danger/10 text-accent-danger border-accent-danger/30',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

/**
 * Badge primitive for tags, status indicators, and persona mood highlights.
 *
 * @param props - Badge component properties
 * @returns JSX Element rendering styled badge pill
 */
export function Badge({
  children,
  className,
  variant = 'neutral',
  size = 'sm',
  ...props
}: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full border select-none transition-colors duration-150',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
