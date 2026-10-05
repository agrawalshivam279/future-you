import React from 'react';
import { HabitDriftVector, DriftStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface DriftVectorListProps {
  vectors: HabitDriftVector[];
  className?: string;
}

/**
 * Returns badge and styling metadata for a drift status.
 */
function getVectorStatusMeta(status: DriftStatus): {
  label: string;
  badgeVariant: 'improved' | 'current' | 'danger';
  barColor: string;
} {
  switch (status) {
    case 'surpassing':
      return {
        label: 'Surpassing',
        badgeVariant: 'improved',
        barColor: 'bg-emerald-400',
      };
    case 'aligned':
      return {
        label: 'Aligned',
        badgeVariant: 'improved',
        barColor: 'bg-accent-improved',
      };
    case 'drifting_current':
    default:
      return {
        label: 'Drifting',
        badgeVariant: 'current',
        barColor: 'bg-accent-current',
      };
  }
}

/**
 * Visual breakdown list displaying individual habit drift vectors and summary counters.
 */
export function DriftVectorList({
  vectors,
  className,
}: DriftVectorListProps): React.JSX.Element {
  if (vectors.length === 0) {
    return (
      <div className={cn('text-center py-6 text-text-muted text-sm', className)}>
        No habit drift vectors recorded yet.
      </div>
    );
  }

  const surpassingCount = vectors.filter((v) => v.status === 'surpassing').length;
  const alignedCount = vectors.filter((v) => v.status === 'aligned').length;
  const driftingCount = vectors.filter((v) => v.status === 'drifting_current').length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary Stat Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-text-muted font-medium">Trajectory Breakdown:</span>
        <Badge variant="improved" size="sm" aria-label={`${alignedCount} Habits Aligned`}>
          {alignedCount} Aligned
        </Badge>
        {surpassingCount > 0 && (
          <Badge variant="improved" size="sm" aria-label={`${surpassingCount} Habits Surpassing`}>
            {surpassingCount} Surpassing
          </Badge>
        )}
        <Badge
          variant={driftingCount > 0 ? 'current' : 'neutral'}
          size="sm"
          aria-label={`${driftingCount} Habits Drifting`}
        >
          {driftingCount} Drifting
        </Badge>
      </div>

      {/* Vector Rows */}
      <div role="list" aria-label="Habit Drift Vectors" className="space-y-3">
        {vectors.map((vector) => {
          const meta = getVectorStatusMeta(vector.status);
          const clampedProgress = Math.max(0, Math.min(100, Math.round(vector.driftPercentage)));

          return (
            <Card
              key={vector.habitId}
              role="listitem"
              className="border-border bg-bg-surface hover:border-border-hover transition-colors"
            >
              <CardContent className="p-4 space-y-2.5">
                {/* Header: Label, Drift Pct & Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-text-primary">
                      {vector.label}
                    </span>
                    <Badge variant={meta.badgeVariant} size="sm">
                      {meta.label}
                    </Badge>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-mono font-medium',
                      vector.status === 'surpassing'
                        ? 'text-emerald-400'
                        : vector.status === 'aligned'
                        ? 'text-accent-improved'
                        : 'text-accent-current'
                    )}
                  >
                    {vector.driftPercentage > 0 ? `+${vector.driftPercentage}%` : `${vector.driftPercentage}%`}
                  </span>
                </div>

                {/* Metric Readouts */}
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>
                    Logged:{' '}
                    <strong className="text-text-primary">
                      {vector.actualValue} {vector.unit}
                    </strong>
                  </span>
                  <div className="flex items-center space-x-3 text-text-muted">
                    <span>Baseline: {vector.baselineValue} {vector.unit}</span>
                    <span>Target: {vector.targetValue} {vector.unit}</span>
                  </div>
                </div>

                {/* Progress Track */}
                <div
                  className="w-full bg-bg-tertiary h-2 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label={`${vector.label} Progress toward target`}
                  aria-valuenow={clampedProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={cn('h-full transition-all duration-500 rounded-full', meta.barColor)}
                    style={{ width: `${clampedProgress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
