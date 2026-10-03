import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'current' | 'improved';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-text-primary text-bg-primary font-medium hover:bg-white/90 active:scale-[0.98] shadow-sm',
  secondary:
    'bg-bg-tertiary text-text-primary border border-border-primary hover:bg-bg-hover active:scale-[0.98]',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover active:scale-[0.98]',
  danger:
    'bg-accent-danger/10 text-accent-danger border border-accent-danger/20 hover:bg-accent-danger/20 active:scale-[0.98]',
  current:
    'bg-accent-current/10 text-accent-current border border-accent-current/30 hover:bg-accent-current/20 active:scale-[0.98]',
  improved:
    'bg-accent-improved/10 text-accent-improved border border-accent-improved/30 hover:bg-accent-improved/20 active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-lg',
};

/**
 * Button primitive component supporting multiple visual variants, sizes,
 * loading states, icons, and persona-specific styling (Current / Improved).
 *
 * @param props - Button component properties
 * @param ref - Forwarded reference to HTML button element
 * @returns JSX Element rendering an accessible interactive button
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    type = 'button',
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
): React.JSX.Element {
  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isButtonDisabled}
      aria-busy={isLoading ? 'true' : undefined}
      className={cn(
        'inline-flex items-center justify-center font-medium select-none transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0" aria-hidden="true">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0" aria-hidden="true">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
