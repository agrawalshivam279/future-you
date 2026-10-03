import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Accessible Input primitive with label, helper text, error messaging,
 * icon adornments, and dark mode focus rings.
 *
 * @param props - Input component properties
 * @param ref - Forwarded reference to HTMLInputElement
 * @returns JSX Element rendering styled input with form annotations
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    id,
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    disabled = false,
    ...props
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
): React.JSX.Element {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const ariaDescribedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-secondary select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div
            className="absolute left-3.5 flex items-center pointer-events-none text-text-muted"
            aria-hidden="true"
          >
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          className={cn(
            'w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted border rounded-lg text-sm transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-accent-info/50 focus:border-accent-info',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-accent-danger text-accent-danger focus:ring-accent-danger/50 focus:border-accent-danger'
              : 'border-border-primary hover:border-border-focus',
            leftIcon ? 'pl-10 pr-3.5 py-2.5' : 'px-3.5 py-2.5',
            rightIcon ? 'pr-10' : '',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div
            className="absolute right-3.5 flex items-center pointer-events-none text-text-muted"
            aria-hidden="true"
          >
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-accent-danger font-medium mt-1">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-text-tertiary mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
