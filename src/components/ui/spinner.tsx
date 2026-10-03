import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner indicator */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant of the spinner */
  variant?: 'default' | 'primary' | 'current' | 'improved';
  /** Accessible text for screen readers */
  label?: string;
}

const sizeClasses: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses: Record<NonNullable<SpinnerProps['variant']>, string> = {
  default: 'text-text-tertiary',
  primary: 'text-text-primary',
  current: 'text-amber-500',
  improved: 'text-emerald-500',
};

/**
 * Accessible rotary loading spinner for buttons, forms, and async operations.
 * Respects user preferences by spinning only when motion is safe.
 */
export function Spinner({
  className,
  size = 'md',
  variant = 'default',
  label = 'Loading...',
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      <svg
        className={cn(
          'motion-safe:animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        data-testid="spinner-svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}
