'use client';

import React from 'react';
import { AlertCircle, Heart, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ReflectionItemCard } from './reflection-item-card';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

export interface ReflectionsGridProps {
  /** List of regret reflections */
  regrets: string[];
  /** List of gratitude reflections */
  gratitudes: string[];
  /** Trajectory identifier for contextual theming */
  personaId?: 'current' | 'improved';
  /** Persona display name */
  personaName?: string;
  /** Optional custom container styling */
  className?: string;
}

/**
 * Two-column reflection matrix displaying future regrets (left column)
 * and future gratitudes (right column) with responsive mobile stacking.
 */
export function ReflectionsGrid({
  regrets,
  gratitudes,
  personaId = 'improved',
  personaName,
  className = '',
}: ReflectionsGridProps): React.JSX.Element {
  const isImproved = personaId === 'improved';

  const accentBadge = isImproved
    ? 'bg-accent-improved/10 text-accent-improved border-accent-improved/30'
    : 'bg-accent-current/10 text-accent-current border-accent-current/30';

  return (
    <Card
      role="region"
      className={`rounded-2xl border border-border-primary bg-bg-secondary/80 backdrop-blur-sm p-6 sm:p-8 space-y-8 ${className}`}
      aria-label={`Reflections for ${personaName || (isImproved ? 'Improved Path' : 'Current Path')}`}
    >
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-primary/50 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${accentBadge}`}
            >
              {isImproved ? 'Improved Path' : 'Current Path'}
            </span>
            <span className="text-xs text-text-tertiary">5-Year Introspection</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-text-primary">
            Regrets & Gratitudes
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary">
            Looking back from 5 years in the future: what was painful, and what was deeply worthwhile.
          </p>
        </div>
      </div>

      {/* Two-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Regrets Column (Left) */}
        <section aria-label="Future Regrets" className="space-y-4">
          <div className="flex items-center justify-between border-b border-accent-danger/20 pb-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent-danger">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span>Regrets</span>
            </div>
            <span className="text-xs font-mono text-text-tertiary px-2 py-0.5 rounded-md bg-bg-tertiary">
              {regrets.length} {regrets.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {regrets.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-border-primary text-center text-xs text-text-tertiary">
              No specific regrets noted along this path.
            </div>
          ) : (
            <div className="space-y-3">
              {regrets.map((regret, index) => (
                <ReflectionItemCard
                  key={`regret-${index}`}
                  text={regret}
                  type="regret"
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* Gratitudes Column (Right) */}
        <section aria-label="Future Gratitudes" className="space-y-4">
          <div className="flex items-center justify-between border-b border-accent-improved/20 pb-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent-improved">
              <Heart className="w-4 h-4" aria-hidden="true" />
              <span>Gratitudes</span>
            </div>
            <span className="text-xs font-mono text-text-tertiary px-2 py-0.5 rounded-md bg-bg-tertiary">
              {gratitudes.length} {gratitudes.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {gratitudes.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-border-primary text-center text-xs text-text-tertiary">
              No specific gratitudes noted along this path.
            </div>
          ) : (
            <div className="space-y-3">
              {gratitudes.map((gratitude, index) => (
                <ReflectionItemCard
                  key={`gratitude-${index}`}
                  text={gratitude}
                  type="gratitude"
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mandatory Reflection Disclaimer Footer */}
      <footer className="pt-4 border-t border-border-primary/50 flex items-start gap-2 text-xs text-text-tertiary">
        <Quote className="w-4 h-4 shrink-0 mt-0.5 text-text-tertiary" aria-hidden="true" />
        <p>{HONESTY_DISCLAIMER}</p>
      </footer>
    </Card>
  );
}
