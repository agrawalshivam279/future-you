import React from 'react';
import { TimelineMilestone } from '@/types/timeline.types';
import { PersonaId } from '@/types/persona.types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface MilestoneTooltipProps {
  /** Milestone data object */
  milestone: TimelineMilestone;
  /** Persona trajectory identity */
  personaId: PersonaId;
  /** Whether the tooltip is currently visible */
  isVisible?: boolean;
  /** Placement relative to the anchor node */
  position?: 'top' | 'bottom';
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * MilestoneTooltip renders an elevated, accessible floating popover
 * detailing a specific chronological milestone event along the future timeline.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the tooltip popover
 */
export function MilestoneTooltip({
  milestone,
  personaId,
  isVisible = true,
  position = 'top',
  className,
}: MilestoneTooltipProps): React.JSX.Element | null {
  const isCurrent = personaId === 'current';
  const moodVariant =
    milestone.mood === 'positive'
      ? 'improved'
      : milestone.mood === 'negative'
      ? 'danger'
      : 'neutral';

  const positionClasses =
    position === 'bottom'
      ? 'top-full mt-3'
      : 'bottom-full mb-3';

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="tooltip"
      id={`milestone-tooltip-${personaId}-${milestone.year}`}
      data-testid={`milestone-tooltip-${personaId}-${milestone.year}`}
      className={cn(
        'absolute z-30 w-72 sm:w-80 p-3.5 rounded-xl bg-bg-secondary/95 backdrop-blur-md border shadow-2xl text-left pointer-events-auto',
        'animate-in fade-in duration-150',
        isCurrent
          ? 'border-accent-current/30 shadow-accent-current/5'
          : 'border-accent-improved/30 shadow-accent-improved/5',
        positionClasses,
        className
      )}
    >
          {/* Header Area */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className={cn(
                'text-xs font-semibold uppercase tracking-wider',
                isCurrent ? 'text-accent-current' : 'text-accent-improved'
              )}
            >
              Year {milestone.year} Horizon
            </span>

            <Badge variant={moodVariant} size="sm" className="capitalize">
              {milestone.mood}
            </Badge>
          </div>

          {/* Milestone Title */}
          <h4 className="text-sm font-bold text-text-primary mb-1.5 leading-snug">
            {milestone.title}
          </h4>

          {/* Narrative Description */}
          <p className="text-xs text-text-secondary leading-relaxed mb-2.5">
            {milestone.description}
          </p>

          {/* Domain Metrics (if available) */}
          {milestone.metrics && Object.keys(milestone.metrics).length > 0 && (
            <div className="pt-2 border-t border-border-primary/60 flex flex-wrap gap-1.5">
              {Object.entries(milestone.metrics).map(([key, val]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 text-[11px] bg-bg-tertiary px-2 py-0.5 rounded text-text-tertiary border border-border-primary/40 font-mono"
                >
                  <span className="capitalize">{key}:</span>
                  <span className="text-text-primary font-medium">{val}</span>
                </span>
              ))}
            </div>
          )}
        </div>
  );
}
