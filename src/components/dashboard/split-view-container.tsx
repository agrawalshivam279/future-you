import React from 'react';
import { LifeModel, PersonaId } from '@/types';
import { PersonaCard } from './persona-card';
import { ComparisonStatsGrid } from './comparison-stat-row';
import { cn } from '@/lib/utils';

export interface SplitViewContainerProps {
  /** Dual-path life simulation model */
  lifeModel: LifeModel;
  /** Callback triggered when clicking chat for a persona */
  onChatClick?: (personaId: PersonaId) => void;
  /** Callback triggered when clicking letter for a persona */
  onLetterClick?: (personaId: PersonaId) => void;
  /** Callback triggered when clicking reflections for a persona */
  onReflectionsClick?: (personaId: PersonaId) => void;
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * SplitViewContainer arranges the Current and Improved personas side-by-side
 * on desktop (>= 1024px) or stacked on mobile (< 768px), paired with the
 * 5-domain Trajectory Comparison grid.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the split view layout
 */
export function SplitViewContainer({
  lifeModel,
  onChatClick,
  onLetterClick,
  onReflectionsClick,
  className,
}: SplitViewContainerProps): React.JSX.Element {
  return (
    <section
      className={cn('space-y-8', className)}
      aria-label="Simulated Futures Split View"
      data-testid="split-view-container"
    >
      {/* 2-Column Responsive Persona Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Current Path Persona */}
        <div className="flex flex-col h-full">
          <PersonaCard
            persona={lifeModel.currentPath}
            onChatClick={() => onChatClick?.('current')}
            onLetterClick={() => onLetterClick?.('current')}
            onReflectionsClick={() => onReflectionsClick?.('current')}
            className="flex-1"
          />
        </div>

        {/* Improved Path Persona */}
        <div className="flex flex-col h-full">
          <PersonaCard
            persona={lifeModel.improvedPath}
            onChatClick={() => onChatClick?.('improved')}
            onLetterClick={() => onLetterClick?.('improved')}
            onReflectionsClick={() => onReflectionsClick?.('improved')}
            className="flex-1"
          />
        </div>
      </div>

      {/* Trajectory Comparison Ledger */}
      <div>
        <ComparisonStatsGrid
          currentPersona={lifeModel.currentPath}
          improvedPersona={lifeModel.improvedPath}
        />
      </div>
    </section>
  );
}
