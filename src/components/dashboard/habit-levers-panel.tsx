import React, { useState, useEffect } from 'react';
import { Sliders, RotateCcw, Sparkles } from 'lucide-react';
import { HabitLever } from '@/types/life-model.types';
import { HabitLeverSlider } from './habit-lever-slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface HabitLeversPanelProps {
  /** Active habit levers from the LifeModel */
  levers: HabitLever[];
  /** Callback fired when user applies modified levers */
  onApplyChanges: (updatedLevers: HabitLever[]) => void;
  /** Optional callback when user resets levers to baseline */
  onResetToBaseline?: () => void;
  /** Whether futures recalculation is actively in progress */
  isRegenerating?: boolean;
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * HabitLeversPanel provides an interactive dashboard control panel allowing
 * users to adjust habit levers, visualize staged modifications against baseline,
 * and trigger dynamic futures recalculation.
 *
 * @param props - HabitLeversPanel properties
 * @returns JSX Element rendering the habit levers management card
 */
export function HabitLeversPanel({
  levers,
  onApplyChanges,
  onResetToBaseline,
  isRegenerating = false,
  className,
}: HabitLeversPanelProps): React.JSX.Element {
  // Baseline snapshot mapped by lever id
  const [baselineValues, setBaselineValues] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    levers.forEach((l) => {
      map[l.id] = l.currentValue;
    });
    return map;
  });

  // Staged values currently selected on the sliders
  const [stagedValues, setStagedValues] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    levers.forEach((l) => {
      map[l.id] = l.currentValue;
    });
    return map;
  });

  // Keep state in sync if parent passes fresh levers (e.g. after regeneration)
  useEffect(() => {
    const freshMap: Record<string, number> = {};
    levers.forEach((l) => {
      freshMap[l.id] = l.currentValue;
    });
    setBaselineValues(freshMap);
    setStagedValues(freshMap);
  }, [levers]);

  const handleSliderChange = (leverId: string, newValue: number) => {
    setStagedValues((prev) => ({
      ...prev,
      [leverId]: newValue,
    }));
  };

  const handleReset = () => {
    setStagedValues({ ...baselineValues });
    onResetToBaseline?.();
  };

  const handleApply = () => {
    const updatedLevers: HabitLever[] = levers.map((lever) => ({
      ...lever,
      currentValue: stagedValues[lever.id] ?? lever.currentValue,
    }));
    onApplyChanges(updatedLevers);
  };

  // Count modified levers
  const modifiedCount = levers.reduce((acc, lever) => {
    const current = stagedValues[lever.id] ?? lever.currentValue;
    const baseline = baselineValues[lever.id] ?? lever.currentValue;
    return Math.abs(current - baseline) > 0.001 ? acc + 1 : acc;
  }, 0);

  const hasModifications = modifiedCount > 0;

  return (
    <Card
      className={cn('border-border-primary/80 bg-bg-primary/60 backdrop-blur-sm', className)}
      data-testid="habit-levers-panel"
    >
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-primary/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-improved/10 text-accent-improved flex items-center justify-center">
              <Sliders className="w-4 h-4" aria-hidden="true" />
            </div>
            <CardTitle as="h3" className="text-lg font-bold text-text-primary">
              Habit Levers
            </CardTitle>
            <Badge
              variant={hasModifications ? 'improved' : 'neutral'}
              className="ml-1 text-xs"
              data-testid="modified-levers-badge"
            >
              {hasModifications ? `${modifiedCount} modified` : 'Baseline'}
            </Badge>
          </div>
          <CardDescription className="text-xs sm:text-sm text-text-secondary">
            Adjust your daily inputs to simulate how compounding changes alter your Improved Path.
          </CardDescription>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            disabled={!hasModifications || isRegenerating}
            aria-label="Reset levers to baseline"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            Reset
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            disabled={!hasModifications || isRegenerating}
            isLoading={isRegenerating}
            aria-label="Apply habit changes"
            leftIcon={!isRegenerating ? <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> : undefined}
          >
            {isRegenerating ? 'Recalculating...' : 'Apply Changes'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {levers.length === 0 ? (
          <div className="py-8 text-center text-sm text-text-tertiary">
            No configurable habit levers found in your life model.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {levers.map((lever) => {
              const currentStaged = stagedValues[lever.id] ?? lever.currentValue;
              const leverWithStaged: HabitLever = {
                ...lever,
                currentValue: currentStaged,
              };
              const baseline = baselineValues[lever.id] ?? lever.currentValue;

              return (
                <HabitLeverSlider
                  key={lever.id}
                  lever={leverWithStaged}
                  baselineValue={baseline}
                  disabled={isRegenerating}
                  onChange={(val) => handleSliderChange(lever.id, val)}
                />
              );
            })}
          </div>
        )}

        {/* Reflection Footnote */}
        <div className="pt-2 border-t border-border-primary/40 flex items-center justify-between text-xs text-text-tertiary">
          <span>
            Adjusting levers alters the Improved Path; Current Path remains the fixed baseline.
          </span>
          <span className="font-mono text-[11px] hidden sm:inline">
            {levers.length} levers available
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
