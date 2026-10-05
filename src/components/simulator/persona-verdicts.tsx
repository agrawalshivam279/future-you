import React from 'react';
import { Quote, ShieldAlert, Sparkles } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { DecisionPersonaReactions } from '@/types';
import { cn } from '@/lib/utils';

export interface PersonaVerdictsProps {
  /** Dual persona reactions from the AI decision evaluation */
  reactions: DecisionPersonaReactions;
  /** Optional custom CSS classes for the container */
  className?: string;
}

/**
 * Renders contrasting, first-person commentary from both simulated future personas
 * (Current Path vs. Improved Path) in response to a user-submitted decision scenario.
 *
 * @param props - Component properties containing persona reaction statements
 * @returns JSX Element rendering side-by-side perspective cards
 */
export function PersonaVerdicts({
  reactions,
  className,
}: PersonaVerdictsProps): React.JSX.Element {
  const currentVerdict = reactions.currentPathVerdict?.trim() || 'No perspective recorded for Current Path.';
  const improvedVerdict = reactions.improvedPathVerdict?.trim() || 'No perspective recorded for Improved Path.';

  return (
    <section className={cn('space-y-4', className)} aria-labelledby="persona-verdicts-title">
      <div>
        <h3
          id="persona-verdicts-title"
          className="text-base md:text-lg font-semibold text-text-primary tracking-tight"
        >
          Future Selves&apos; Perspectives
        </h3>
        <p className="text-xs md:text-sm text-text-secondary mt-0.5">
          How your competing future identities perceive the trade-offs of this path.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Current Path Card */}
        <Card
          className="p-5 border border-accent-current/30 bg-accent-current/5 flex flex-col justify-between transition-all"
          aria-label="Current Path perspective on decision"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-accent-current/10 text-accent-current">
                  <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">
                    Current Path Perspective
                  </h4>
                  <p className="text-xs text-text-secondary">
                    Status Quo &amp; Risk Preservation
                  </p>
                </div>
              </div>
              <Badge variant="current" size="sm">
                Current Self
              </Badge>
            </div>

            <blockquote className="relative pl-6 mt-4 text-xs md:text-sm italic text-text-primary/90 leading-relaxed border-l-2 border-accent-current/40">
              <Quote
                className="w-4 h-4 text-accent-current/60 absolute -top-1 left-0 -translate-x-1/2 bg-transparent"
                aria-hidden="true"
              />
              &ldquo;{currentVerdict}&rdquo;
            </blockquote>
          </div>

          <div className="mt-4 pt-3 border-t border-accent-current/15 flex items-center justify-between text-xs text-text-secondary">
            <span>Primary Focus: Continuity &amp; Familiarity</span>
          </div>
        </Card>

        {/* Improved Path Card */}
        <Card
          className="p-5 border border-accent-improved/30 bg-accent-improved/5 flex flex-col justify-between transition-all"
          aria-label="Improved Path perspective on decision"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-accent-improved/10 text-accent-improved">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">
                    Improved Path Perspective
                  </h4>
                  <p className="text-xs text-text-secondary">
                    Compounding Agency &amp; Calculated Risk
                  </p>
                </div>
              </div>
              <Badge variant="improved" size="sm">
                Improved Self
              </Badge>
            </div>

            <blockquote className="relative pl-6 mt-4 text-xs md:text-sm italic text-text-primary/90 leading-relaxed border-l-2 border-accent-improved/40">
              <Quote
                className="w-4 h-4 text-accent-improved/60 absolute -top-1 left-0 -translate-x-1/2 bg-transparent"
                aria-hidden="true"
              />
              &ldquo;{improvedVerdict}&rdquo;
            </blockquote>
          </div>

          <div className="mt-4 pt-3 border-t border-accent-improved/15 flex items-center justify-between text-xs text-text-secondary">
            <span>Primary Focus: Growth &amp; Discipline</span>
          </div>
        </Card>
      </div>
    </section>
  );
}
