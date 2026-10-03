import React, { useState } from 'react';
import { TimelineMilestone } from '@/types/timeline.types';
import { PersonaId } from '@/types/persona.types';
import { MilestoneTooltip } from './milestone-tooltip';
import { cn } from '@/lib/utils';

export interface TimelineNodeProps {
  /** Milestone represented by this node */
  milestone: TimelineMilestone;
  /** Path trajectory identity */
  personaId: PersonaId;
  /** Whether this node is externally forced into active/selected state */
  isSelected?: boolean;
  /** Callback triggered when user clicks or selects this milestone */
  onSelect?: (milestone: TimelineMilestone) => void;
  /** Placement for the associated milestone tooltip */
  position?: 'top' | 'bottom';
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * Returns diameter classes corresponding to the milestone year horizon.
 * Year 1: 14px, Year 3: 18px, Year 5: 24px.
 */
function getNodeSizeClasses(year: 1 | 3 | 5): string {
  switch (year) {
    case 1:
      return 'w-3.5 h-3.5';
    case 3:
      return 'w-[18px] h-[18px]';
    case 5:
      return 'w-6 h-6';
    default:
      return 'w-4 h-4';
  }
}

/**
 * TimelineNode renders an interactive milestone anchor along a 5-year trajectory,
 * scaling diameter by year horizon and revealing a rich contextual tooltip on
 * hover, focus, or tap.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the timeline node
 */
export function TimelineNode({
  milestone,
  personaId,
  isSelected = false,
  onSelect,
  position = 'top',
  className,
}: TimelineNodeProps): React.JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isCurrent = personaId === 'current';
  const isTooltipVisible = isHovered || isFocused || isSelected;

  const handleClick = () => {
    onSelect?.(milestone);
  };

  const accentStyles = isCurrent
    ? cn(
        'bg-accent-current border-amber-300 ring-accent-current/30 text-accent-current',
        (isHovered || isFocused || isSelected) && 'ring-4 ring-accent-current/60 scale-110 shadow-lg shadow-accent-current/20'
      )
    : cn(
        'bg-accent-improved border-emerald-300 ring-accent-improved/30 text-accent-improved',
        (isHovered || isFocused || isSelected) && 'ring-4 ring-accent-improved/60 scale-110 shadow-lg shadow-accent-improved/20'
      );

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={handleClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label={`Year ${milestone.year} milestone: ${milestone.title}`}
        aria-expanded={isTooltipVisible}
        aria-haspopup="dialog"
        data-testid={`timeline-node-${personaId}-${milestone.year}`}
        className={cn(
          'rounded-full border-2 ring-2 transition-all duration-200 outline-none select-none cursor-pointer',
          'focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
          getNodeSizeClasses(milestone.year),
          accentStyles
        )}
      >
        <span className="sr-only">
          Year {milestone.year}: {milestone.title}
        </span>
      </button>

      {/* Floating Milestone Context Tooltip */}
      <MilestoneTooltip
        milestone={milestone}
        personaId={personaId}
        isVisible={isTooltipVisible}
        position={position}
      />
    </div>
  );
}
