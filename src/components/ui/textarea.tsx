import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Accessible Textarea primitive with label, error feedback, helper annotations,
 * and dark mode aesthetic.
 *
 * @param props - Textarea component properties
 * @param ref - Forwarded reference to HTMLTextAreaElement
 * @returns JSX Element rendering styled multiline textarea
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    className,
    id,
    label,
    error,
    helperText,
    disabled = false,
    rows = 4,
    ...props
  }: TextareaProps,
  ref: React.ForwardedRef<HTMLTextAreaElement>
): React.JSX.Element {
  const generatedId = React.useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

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
          htmlFor={textareaId}
          className="block text-sm font-medium text-text-secondary select-none"
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(
          'w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted border rounded-lg text-sm transition-colors duration-150',
          'px-3.5 py-2.5 resize-y focus:outline-none focus:ring-2 focus:ring-accent-info/50 focus:border-accent-info',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-accent-danger text-accent-danger focus:ring-accent-danger/50 focus:border-accent-danger'
            : 'border-border-primary hover:border-border-focus',
          className
        )}
        {...props}
      />

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

Textarea.displayName = 'Textarea';
