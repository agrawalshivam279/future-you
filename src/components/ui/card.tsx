import React from 'react';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'current' | 'improved';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  isInteractive?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-bg-secondary border border-border-primary',
  current: 'bg-current-bg/30 border border-current-border border-l-4 border-l-accent-current',
  improved: 'bg-improved-bg/30 border border-improved-border border-l-4 border-l-accent-improved',
};

/**
 * Card container primitive supporting persona-aware accent borders (Current / Improved)
 * and interactive hover elevations.
 *
 * @param props - Card component properties
 * @returns JSX Element rendering the styled container
 */
export function Card({
  children,
  className,
  variant = 'default',
  isInteractive = false,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'rounded-xl text-text-primary p-6 transition-colors duration-150',
        variantStyles[variant],
        isInteractive && 'hover:border-border-focus cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader subcomponent containing the title, description, or action triggers.
 *
 * @param props - CardHeader component properties
 * @returns JSX Element rendering header layout
 */
export function CardHeader({
  children,
  className,
  ...props
}: CardHeaderProps): React.JSX.Element {
  return (
    <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardTitle subcomponent rendering accessible headings inside a Card.
 *
 * @param props - CardTitle component properties
 * @returns JSX Element rendering styled heading
 */
export function CardTitle({
  children,
  className,
  as: Component = 'h3',
  ...props
}: CardTitleProps): React.JSX.Element {
  return (
    <Component
      className={cn('font-semibold tracking-tight text-lg text-text-primary', className)}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * CardDescription subcomponent rendering secondary caption or subtitle text.
 *
 * @param props - CardDescription component properties
 * @returns JSX Element rendering styled paragraph
 */
export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps): React.JSX.Element {
  return (
    <p className={cn('text-sm text-text-secondary leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

/**
 * CardContent subcomponent housing the primary body content of a Card.
 *
 * @param props - CardContent component properties
 * @returns JSX Element rendering content body
 */
export function CardContent({
  children,
  className,
  ...props
}: CardContentProps): React.JSX.Element {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardFooter subcomponent positioning actions and secondary metadata at the bottom.
 *
 * @param props - CardFooter component properties
 * @returns JSX Element rendering footer bar
 */
export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps): React.JSX.Element {
  return (
    <div className={cn('flex items-center pt-4 border-t border-border-primary/50 mt-4', className)} {...props}>
      {children}
    </div>
  );
}
