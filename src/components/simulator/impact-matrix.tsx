import React from 'react';
import { Calendar, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { HorizonProjection, DomainDelta } from '@/types';
import { cn } from '@/lib/utils';

export interface ImpactMatrixProps {
  /** Array of multi-horizon milestone projections (Years 1, 3, and 5) */
  projections: HorizonProjection[];
  /** Array of domain score deltas (-10 to +10) across key life dimensions */
  domainDeltas: DomainDelta[];
  /** Optional custom CSS classes for container */
  className?: string;
}

/**
 * Visualizes projected decision outcomes across multi-horizon timelines and domain impact scores.
 */
export function ImpactMatrix({
  projections,
  domainDeltas,
  className,
}: ImpactMatrixProps): React.JSX.Element {
  // Sort projections chronologically
  const sortedProjections = [...projections].sort((a, b) => a.year - b.year);

  return (
    <div className={cn('space-y-8', className)}>
      {/* 1. Domain Impact Scorecards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-text-primary tracking-tight">
            Domain Impact Deltas
          </h3>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            Projected score adjustments (-10 to +10) across key life dimensions resulting from this choice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {domainDeltas.map((delta) => {
            const isPositive = delta.delta > 0;
            const isNegative = delta.delta < 0;
            const formattedDelta = isPositive ? `+${delta.delta}` : `${delta.delta}`;

            return (
              <Card
                key={delta.domain}
                className={cn(
                  'p-4 border transition-all flex flex-col justify-between',
                  isPositive && 'border-accent-improved/30 bg-accent-improved/5',
                  isNegative && 'border-accent-current/30 bg-accent-current/5',
                  !isPositive && !isNegative && 'border-border-primary bg-bg-secondary'
                )}
                aria-label={`${delta.label} delta: ${formattedDelta}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-text-primary truncate">
                      {delta.label}
                    </span>
                    <Badge
                      variant={isPositive ? 'improved' : isNegative ? 'current' : 'neutral'}
                      className="text-xs font-bold px-2 py-0.5 shrink-0"
                    >
                      {isPositive && <TrendingUp className="w-3 h-3 mr-1 inline" />}
                      {isNegative && <TrendingDown className="w-3 h-3 mr-1 inline" />}
                      {!isPositive && !isNegative && <Minus className="w-3 h-3 mr-1 inline" />}
                      {formattedDelta}
                    </Badge>
                  </div>

                  {/* Visual Delta Bar Meter */}
                  <div className="w-full bg-bg-tertiary h-1.5 rounded-full overflow-hidden my-2.5">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-300',
                        isPositive ? 'bg-accent-improved' : isNegative ? 'bg-accent-current' : 'bg-text-tertiary'
                      )}
                      style={{
                        width: `${Math.min(100, Math.max(10, (Math.abs(delta.delta) / 10) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-text-tertiary line-clamp-3 leading-relaxed mt-1">
                  {delta.reasoning}
                </p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 2. Multi-Horizon Projection Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-text-primary tracking-tight">
            Multi-Horizon Projections (Years 1, 3, and 5)
          </h3>
          <p className="text-xs md:text-sm text-text-secondary mt-0.5">
            How this life decision transitions from immediate disruption to compounded reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedProjections.map((projection) => {
            return (
              <Card
                key={projection.year}
                className="p-5 md:p-6 border-border-primary bg-bg-secondary flex flex-col justify-between space-y-4"
                aria-label={`Projection for Year ${projection.year}: ${projection.phaseTitle}`}
              >
                {/* Year Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="neutral" className="gap-1.5 py-0.5 px-2 text-xs font-medium">
                      <Calendar className="w-3 h-3 text-text-secondary" />
                      Year {projection.year}
                    </Badge>
                    <span className="text-[11px] text-text-tertiary font-mono">
                      {projection.year === 1
                        ? 'Disruption / Shock'
                        : projection.year === 3
                        ? 'Adaptation / Shift'
                        : 'Compounded Reality'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-text-primary tracking-tight mb-2">
                    {projection.phaseTitle}
                  </h4>

                  <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                    {projection.summary}
                  </p>
                </div>

                {/* Challenges and Advantages */}
                <div className="space-y-2.5 pt-3 border-t border-border-primary/60 text-xs">
                  {/* Key Challenge */}
                  <div className="flex items-start gap-2 text-accent-current/90 bg-accent-current/5 p-2.5 rounded-lg border border-accent-current/15">
                    <AlertCircle className="w-4 h-4 shrink-0 text-accent-current mt-0.5" />
                    <div>
                      <span className="font-semibold block text-[11px] uppercase tracking-wider text-accent-current">
                        Primary Friction
                      </span>
                      <span className="text-text-secondary leading-snug">
                        {projection.keyChallenge}
                      </span>
                    </div>
                  </div>

                  {/* Key Advantage */}
                  <div className="flex items-start gap-2 text-accent-improved/90 bg-accent-improved/5 p-2.5 rounded-lg border border-accent-improved/15">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-accent-improved mt-0.5" />
                    <div>
                      <span className="font-semibold block text-[11px] uppercase tracking-wider text-accent-improved">
                        Strategic Advantage
                      </span>
                      <span className="text-text-secondary leading-snug">
                        {projection.keyAdvantage}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
