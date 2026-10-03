import React from 'react';
import { motion } from 'framer-motion';
import { Milestone } from 'lucide-react';
import { TimelineMilestone } from '@/types/timeline.types';
import { TimelineNode } from './timeline-node';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface DualTimelineProps {
  /** Chronological milestones along Current Path */
  currentMilestones: TimelineMilestone[];
  /** Chronological milestones along Improved Path */
  improvedMilestones: TimelineMilestone[];
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * Normalizes and sorts milestones strictly by milestone year (1, 3, 5).
 */
function sortMilestones(milestones: TimelineMilestone[]): TimelineMilestone[] {
  return [...milestones].sort((a, b) => a.year - b.year);
}

/**
 * DualTimeline renders parallel chronological tracks for the Current and Improved
 * personas, connecting Years 1, 3, and 5 with connecting animated lines and
 * interactive nodes.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the dual timeline comparison
 */
export function DualTimeline({
  currentMilestones,
  improvedMilestones,
  className,
}: DualTimelineProps): React.JSX.Element {
  const sortedCurrent = sortMilestones(currentMilestones);
  const sortedImproved = sortMilestones(improvedMilestones);

  return (
    <Card
      className={cn('space-y-6', className)}
      data-testid="dual-timeline"
      aria-label="5-Year Milestone Timeline"
    >
      <CardHeader className="p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Milestone className="w-5 h-5 text-accent-info" aria-hidden="true" />
              <CardTitle as="h3" className="text-lg font-bold">
                5-Year Timeline Comparison
              </CardTitle>
            </div>
            <CardDescription>
              Parallel milestone progression across Years 1, 3, and 5 contrasting status-quo habits with intentional adjustments.
            </CardDescription>
          </div>

          {/* Trajectory Legend */}
          <div className="flex items-center gap-3 text-xs self-start sm:self-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-current inline-block" aria-hidden="true" />
              <span className="text-text-secondary">Current Path</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-improved inline-block" aria-hidden="true" />
              <span className="text-text-secondary">Improved Path</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-2 space-y-10">
        {/* Desktop / Tablet Horizontal Timeline (md+) */}
        <div className="hidden md:block space-y-8">
          {/* Year Markers Header */}
          <div className="grid grid-cols-3 pl-36 pr-8 text-center text-xs font-semibold text-text-tertiary">
            <div>Year 1 (12 Mo)</div>
            <div>Year 3 (36 Mo)</div>
            <div>Year 5 (60 Mo)</div>
          </div>

          {/* Current Path Track */}
          <div className="flex items-center gap-4">
            <div className="w-32 flex-shrink-0">
              <Badge variant="current" size="sm">
                Current Path
              </Badge>
            </div>

            <div className="relative flex-1 flex items-center justify-between pr-8">
              {/* Animated Connecting Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ originX: 0 }}
                className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-accent-current/30 z-0"
              />

              {sortedCurrent.map((m) => (
                <div key={`current-${m.year}`} className="relative z-10 flex flex-col items-center">
                  <TimelineNode
                    milestone={m}
                    personaId="current"
                    position="bottom"
                  />
                  <span className="text-[11px] text-text-tertiary mt-2 max-w-[120px] text-center truncate">
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Improved Path Track */}
          <div className="flex items-center gap-4 pt-2">
            <div className="w-32 flex-shrink-0">
              <Badge variant="improved" size="sm">
                Improved Path
              </Badge>
            </div>

            <div className="relative flex-1 flex items-center justify-between pr-8">
              {/* Animated Connecting Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                style={{ originX: 0 }}
                className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-accent-improved/30 z-0"
              />

              {sortedImproved.map((m) => (
                <div key={`improved-${m.year}`} className="relative z-10 flex flex-col items-center">
                  <TimelineNode
                    milestone={m}
                    personaId="improved"
                    position="bottom"
                  />
                  <span className="text-[11px] text-text-tertiary mt-2 max-w-[120px] text-center truncate">
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Vertical Stacked Timeline (< md) */}
        <div className="md:hidden space-y-8">
          {/* Mobile Current Path Track */}
          <div className="space-y-4">
            <Badge variant="current" size="sm">
              Current Path
            </Badge>

            <div className="relative pl-6 border-l-2 border-accent-current/30 space-y-6">
              {sortedCurrent.map((m) => (
                <div key={`mobile-current-${m.year}`} className="relative">
                  <div className="absolute -left-[31px] top-0.5">
                    <TimelineNode
                      milestone={m}
                      personaId="current"
                      position="bottom"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-accent-current block">
                      Year {m.year}
                    </span>
                    <h4 className="text-sm font-medium text-text-primary">
                      {m.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Improved Path Track */}
          <div className="space-y-4 pt-4 border-t border-border-primary/60">
            <Badge variant="improved" size="sm">
              Improved Path
            </Badge>

            <div className="relative pl-6 border-l-2 border-accent-improved/30 space-y-6">
              {sortedImproved.map((m) => (
                <div key={`mobile-improved-${m.year}`} className="relative">
                  <div className="absolute -left-[31px] top-0.5">
                    <TimelineNode
                      milestone={m}
                      personaId="improved"
                      position="bottom"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-accent-improved block">
                      Year {m.year}
                    </span>
                    <h4 className="text-sm font-medium text-text-primary">
                      {m.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
