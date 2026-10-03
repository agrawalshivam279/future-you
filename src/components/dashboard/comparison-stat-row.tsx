import React from 'react';
import {
  Briefcase,
  Moon,
  PiggyBank,
  Sparkles,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { Persona } from '@/types/persona.types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ComparisonStatRowProps {
  /** Metric display label */
  label: string;
  /** Value on Current Path */
  currentValue: string | number;
  /** Value on Improved Path */
  improvedValue: string | number;
  /** Measurement unit (e.g. '/10', 'hrs', '%') */
  unit?: string;
  /** Contextual category or domain */
  category?: string;
  /** Optional icon graphic */
  icon?: React.ReactNode;
  /** Explicit delta override (or auto-computed if numbers provided) */
  delta?: string;
  /** Whether higher values represent better outcomes (default: true) */
  higherIsBetter?: boolean;
  /** Optional CSS classes */
  className?: string;
}

export interface ComparisonStatsGridProps {
  /** Current Path persona */
  currentPersona: Persona;
  /** Improved Path persona */
  improvedPersona: Persona;
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * Computes a human-readable delta string between current and improved numerical metrics.
 */
function computeDelta(
  current: string | number,
  improved: string | number,
  unit: string = '',
  higherIsBetter: boolean = true
): { text: string; isPositive: boolean } | null {
  const numCurrent = typeof current === 'number' ? current : parseFloat(current);
  const numImproved = typeof improved === 'number' ? improved : parseFloat(improved);

  if (Number.isNaN(numCurrent) || Number.isNaN(numImproved)) {
    return null;
  }

  const diff = Number((numImproved - numCurrent).toFixed(1));
  if (diff === 0) {
    return { text: 'No change', isPositive: true };
  }

  const sign = diff > 0 ? '+' : '';
  const isPositive = higherIsBetter ? diff > 0 : diff < 0;
  return {
    text: `${sign}${diff}${unit ? ` ${unit}` : ''}`,
    isPositive,
  };
}

/**
 * ComparisonStatRow renders a high-contrast side-by-side metric comparison row
 * contrasting baseline status-quo values with intentional habit outcomes.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the comparative stat row
 */
export function ComparisonStatRow({
  label,
  currentValue,
  improvedValue,
  unit = '',
  category,
  icon,
  delta,
  higherIsBetter = true,
  className,
}: ComparisonStatRowProps): React.JSX.Element {
  const computed = delta
    ? { text: delta, isPositive: true }
    : computeDelta(currentValue, improvedValue, unit, higherIsBetter);

  return (
    <div
      className={cn(
        'p-3 rounded-lg bg-bg-tertiary/40 border border-border-primary/80 hover:border-border-focus transition-colors duration-150',
        className
      )}
      data-testid={`comparison-row-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-text-tertiary flex-shrink-0">{icon}</span>}
          <div>
            <span className="text-sm font-medium text-text-primary block truncate">
              {label}
            </span>
            {category && (
              <span className="text-xs text-text-tertiary block">{category}</span>
            )}
          </div>
        </div>

        {computed && (
          <Badge
            variant={computed.isPositive ? 'improved' : 'danger'}
            size="sm"
            className="flex-shrink-0"
          >
            {computed.text}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border-primary/40">
        {/* Current Path Metric */}
        <div className="flex flex-col">
          <span className="text-text-tertiary text-[11px]">Current Path</span>
          <span className="font-semibold text-accent-current text-sm">
            {currentValue}
            {unit ? ` ${unit}` : ''}
          </span>
        </div>

        {/* Improved Path Metric */}
        <div className="flex flex-col text-right">
          <span className="text-text-tertiary text-[11px]">Improved Path</span>
          <span className="font-semibold text-accent-improved text-sm">
            {improvedValue}
            {unit ? ` ${unit}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * ComparisonStatsGrid renders the complete 5-domain comparative ledger
 * contrasting Current and Improved personas across career, sleep, finances,
 * skills, and relationships.
 *
 * @param props - Component properties
 * @returns JSX Element rendering the comparative grid card
 */
export function ComparisonStatsGrid({
  currentPersona,
  improvedPersona,
  className,
}: ComparisonStatsGridProps): React.JSX.Element {
  return (
    <Card className={cn('space-y-4', className)} data-testid="comparison-stats-grid">
      <CardHeader className="p-0">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-accent-improved" aria-hidden="true" />
          <CardTitle as="h3" className="text-lg font-bold">
            Trajectory Comparison
          </CardTitle>
        </div>
        <CardDescription>
          Side-by-side divergent metrics after 5 simulated years of daily compounding habits.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-2.5">
        <ComparisonStatRow
          label="Career Satisfaction"
          category="Professional"
          icon={<Briefcase className="w-4 h-4" aria-hidden="true" />}
          currentValue={currentPersona.career.satisfaction}
          improvedValue={improvedPersona.career.satisfaction}
          unit="/10"
        />

        <ComparisonStatRow
          label="Sleep Duration"
          category="Vitality & Rest"
          icon={<Moon className="w-4 h-4" aria-hidden="true" />}
          currentValue={currentPersona.health.sleepAverageHours}
          improvedValue={improvedPersona.health.sleepAverageHours}
          unit="hrs"
        />

        <ComparisonStatRow
          label="Savings Rate"
          category="Financial Autonomy"
          icon={<PiggyBank className="w-4 h-4" aria-hidden="true" />}
          currentValue={currentPersona.finances.savingsRate}
          improvedValue={improvedPersona.finances.savingsRate}
          unit="%"
        />

        <ComparisonStatRow
          label="Skills Mastered"
          category="Capabilities"
          icon={<Sparkles className="w-4 h-4" aria-hidden="true" />}
          currentValue={currentPersona.skills?.length ?? 0}
          improvedValue={improvedPersona.skills?.length ?? 0}
          unit="skills"
        />

        <ComparisonStatRow
          label="Relational Health"
          category="Community & Bonds"
          icon={<Heart className="w-4 h-4" aria-hidden="true" />}
          currentValue={currentPersona.relationships.satisfaction}
          improvedValue={improvedPersona.relationships.satisfaction}
          unit="/10"
        />
      </CardContent>
    </Card>
  );
}
