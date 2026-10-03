import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional variant for predefined shapes */
  variant?: 'default' | 'circular' | 'text' | 'card';
  /** Width override (e.g. 100, '50%') */
  width?: string | number;
  /** Height override (e.g. 20, '100%') */
  height?: string | number;
}

const variantStyles: Record<NonNullable<SkeletonProps['variant']>, string> = {
  default: 'rounded-md',
  circular: 'rounded-full',
  text: 'h-4 w-full rounded',
  card: 'h-32 w-full rounded-lg',
};

/**
 * Skeleton component for rendering placeholder loading shapes.
 * Prevents Cumulative Layout Shift (CLS) during content fetching.
 * Respects user motion preferences by only pulsing when motion is safe.
 */
export function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const customStyles: React.CSSProperties = {
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
    ...style,
  };

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={cn(
        'bg-bg-tertiary/70 motion-safe:animate-pulse',
        variantStyles[variant],
        className
      )}
      style={customStyles}
      {...props}
    >
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
