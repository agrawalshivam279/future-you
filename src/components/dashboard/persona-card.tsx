import React from 'react';
import {
  MessageSquare,
  Mail,
  BookOpen,
  Sparkles,
  AlertCircle,
  Briefcase,
  Moon,
  PiggyBank,
} from 'lucide-react';
import { Persona } from '@/types/persona.types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PersonaCardProps {
  /** Persona entity containing 5-year trajectory data */
  persona: Persona;
  /** Callback invoked when clicking the 'Talk to Persona' button */
  onChatClick?: () => void;
  /** Callback invoked when clicking the 'Read Letter' button */
  onLetterClick?: () => void;
  /** Callback invoked when clicking the 'Reflections' button */
  onReflectionsClick?: () => void;
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * PersonaCard renders a high-level executive summary of a simulated 5-year future self,
 * displaying psychological mood, core domain metrics (career, health, finances),
 * key accomplishments or struggles, and primary navigation action triggers.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the persona card
 */
export function PersonaCard({
  persona,
  onChatClick,
  onLetterClick,
  onReflectionsClick,
  className,
}: PersonaCardProps): React.JSX.Element {
  const isCurrent = persona.id === 'current';
  const accentClass = isCurrent ? 'text-accent-current' : 'text-accent-improved';
  const badgeVariant = isCurrent ? 'current' : 'improved';
  const buttonVariant = isCurrent ? 'current' : 'improved';
  const primaryHighlight = isCurrent
    ? persona.struggles?.[0] || 'Continuing status-quo habits'
    : persona.achievements?.[0] || 'Mastered intentional habits';

  return (
    <Card
      variant={persona.id}
      className={cn('flex flex-col justify-between h-full space-y-6', className)}
      data-testid={`persona-card-${persona.id}`}
    >
      <div>
        <CardHeader className="p-0 mb-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <Badge variant={badgeVariant} size="sm">
              {isCurrent ? 'Current Path' : 'Improved Path'}
            </Badge>
            <Badge variant="neutral" size="sm" className="truncate max-w-[180px]">
              {persona.emotionalState}
            </Badge>
          </div>

          <CardTitle as="h3" className="text-xl font-bold flex items-baseline gap-2">
            <span>{persona.name}</span>
            <span className="text-xs font-normal text-text-tertiary">
              (Age {persona.age})
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 space-y-5">
          {/* Narrative Summary */}
          <p className="text-sm text-text-secondary leading-relaxed italic border-l-2 border-border-primary pl-3">
            &ldquo;{persona.summary}&rdquo;
          </p>

          {/* Metric Highlights Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {/* Career */}
            <div className="bg-bg-tertiary/60 border border-border-primary rounded-lg p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-text-tertiary text-xs mb-1">
                <Briefcase className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Career</span>
              </div>
              <div className="text-xs font-medium text-text-primary truncate" title={persona.career.title}>
                {persona.career.title}
              </div>
              <div className={cn('text-xs font-semibold mt-1', accentClass)}>
                {persona.career.satisfaction}/10 sat.
              </div>
            </div>

            {/* Health / Sleep */}
            <div className="bg-bg-tertiary/60 border border-border-primary rounded-lg p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-text-tertiary text-xs mb-1">
                <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sleep</span>
              </div>
              <div className="text-xs font-medium text-text-primary">
                {persona.health.sleepAverageHours}h / night
              </div>
              <div className={cn('text-xs font-semibold mt-1', accentClass)}>
                {persona.health.energyLevel}
              </div>
            </div>

            {/* Finances */}
            <div className="bg-bg-tertiary/60 border border-border-primary rounded-lg p-2.5 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-text-tertiary text-xs mb-1">
                <PiggyBank className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Savings</span>
              </div>
              <div className="text-xs font-medium text-text-primary">
                {persona.finances.savingsRate}% rate
              </div>
              <div className={cn('text-xs font-semibold mt-1', accentClass)}>
                {persona.finances.freedomLevel}
              </div>
            </div>
          </div>

          {/* Trajectory Highlight / Struggle */}
          <div className="text-xs text-text-secondary bg-bg-secondary border border-border-primary rounded-lg p-3 flex items-start gap-2.5">
            {isCurrent ? (
              <AlertCircle
                className="w-4 h-4 text-accent-current flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
            ) : (
              <Sparkles
                className="w-4 h-4 text-accent-improved flex-shrink-0 mt-0.5"
                aria-hidden="true"
              />
            )}
            <div className="space-y-0.5 min-w-0">
              <span className="font-medium text-text-primary block">
                {isCurrent ? 'Key Ongoing Struggle:' : 'Key Milestone Accomplishment:'}
              </span>
              <p className="line-clamp-2 leading-relaxed text-text-tertiary">
                {primaryHighlight}
              </p>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Action Footer */}
      <CardFooter className="p-0 pt-4 border-t border-border-primary/60 flex flex-wrap items-center gap-2">
        <Button
          variant={buttonVariant}
          size="sm"
          className="flex-1 min-w-[120px]"
          onClick={onChatClick}
          aria-label={`Chat with ${persona.name}`}
          leftIcon={<MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />}
        >
          Talk to Persona
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onLetterClick}
          aria-label={`Read letter from ${persona.name}`}
          leftIcon={<Mail className="w-3.5 h-3.5" aria-hidden="true" />}
        >
          Letter
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onReflectionsClick}
          aria-label={`View regrets and gratitudes from ${persona.name}`}
          leftIcon={<BookOpen className="w-3.5 h-3.5" aria-hidden="true" />}
        >
          Reflections
        </Button>
      </CardFooter>
    </Card>
  );
}
