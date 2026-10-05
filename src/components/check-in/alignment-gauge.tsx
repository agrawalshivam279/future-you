import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface AlignmentGaugeProps {
  /** 0 to 100 percentage score */
  score: number;
  /** Size tier: sm (96px), md (160px), lg (220px) */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to display the text status label below or alongside */
  showLabel?: boolean;
  /** Optional container class overrides */
  className?: string;
}

const SIZE_CONFIG = {
  sm: { dimension: 96, strokeWidth: 8, radius: 40, textSize: 'text-xl', subTextSize: 'text-xs' },
  md: { dimension: 160, strokeWidth: 12, radius: 68, textSize: 'text-3xl', subTextSize: 'text-sm' },
  lg: { dimension: 220, strokeWidth: 16, radius: 92, textSize: 'text-4xl', subTextSize: 'text-base' },
};

/**
 * Returns semantic metadata based on alignment score.
 */
function getAlignmentMetadata(score: number): {
  label: string;
  badgeVariant: 'improved' | 'current' | 'danger';
  strokeColor: string;
  textColor: string;
  description: string;
} {
  if (score >= 80) {
    return {
      label: 'Strong Alignment',
      badgeVariant: 'improved',
      strokeColor: '#10b981', // emerald-500
      textColor: 'text-accent-improved',
      description: 'Your daily habits are strongly anchored to your 5-year compounding vision.',
    };
  }
  if (score >= 50) {
    return {
      label: 'Moderate Alignment',
      badgeVariant: 'current',
      strokeColor: '#f59e0b', // amber-500
      textColor: 'text-accent-current',
      description: 'Key rhythms are holding, with a few habits drifting toward the status quo.',
    };
  }
  return {
    label: 'Drifting Trajectory',
    badgeVariant: 'danger',
    strokeColor: '#ef4444', // red-500
    textColor: 'text-red-400',
    description: 'Friction is pulling current daily habits toward old status quo defaults.',
  };
}

/**
 * Visual radial gauge displaying the composite 0-100% trajectory alignment score.
 * Accessible with ARIA meter roles and animated progress transitions.
 */
export function AlignmentGauge({
  score,
  size = 'md',
  showLabel = true,
  className,
}: AlignmentGaugeProps): React.JSX.Element {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const meta = getAlignmentMetadata(clampedScore);
  const cfg = SIZE_CONFIG[size];

  const circumference = 2 * Math.PI * cfg.radius;
  const strokeDashoffset = circumference - (circumference * clampedScore) / 100;

  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center select-none', className)}
      role="meter"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Trajectory Alignment Score: ${clampedScore}% (${meta.label})`}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: cfg.dimension, height: cfg.dimension }}
      >
        <svg
          width={cfg.dimension}
          height={cfg.dimension}
          viewBox={`0 0 ${cfg.dimension} ${cfg.dimension}`}
          className="transform -rotate-90"
        >
          {/* Background Track Circle */}
          <circle
            cx={cfg.dimension / 2}
            cy={cfg.dimension / 2}
            r={cfg.radius}
            stroke="currentColor"
            strokeWidth={cfg.strokeWidth}
            fill="transparent"
            className="text-border"
          />

          {/* Animated Value Progress Circle */}
          <motion.circle
            cx={cfg.dimension / 2}
            cy={cfg.dimension / 2}
            r={cfg.radius}
            stroke={meta.strokeColor}
            strokeWidth={cfg.strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            fill="transparent"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold tracking-tight text-text-primary', cfg.textSize)}>
            {clampedScore}%
          </span>
          <span className={cn('text-text-muted font-medium', cfg.subTextSize)}>
            Alignment
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 space-y-1">
          <Badge variant={meta.badgeVariant} size="sm">
            {meta.label}
          </Badge>
          <p className="text-xs text-text-secondary max-w-xs px-2">
            {meta.description}
          </p>
        </div>
      )}
    </div>
  );
}
