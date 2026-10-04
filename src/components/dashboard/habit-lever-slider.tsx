import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { HabitLever } from '@/types/life-model.types';
import { cn } from '@/lib/utils';

export interface HabitLeverSliderProps {
  /** The habit lever configuration and current value */
  lever: HabitLever;
  /** Baseline value before user adjustments (defaults to lever.currentValue) */
  baselineValue?: number;
  /** Callback fired when the lever value changes */
  onChange: (value: number) => void;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Optional custom CSS classes */
  className?: string;
}

/**
 * Formats a numeric difference with appropriate sign and clean decimal precision.
 *
 * @param delta - The numerical difference
 * @param unit - Unit of measurement
 * @returns Human-readable delta string
 */
function formatDelta(delta: number, unit: string): string {
  const rounded = Math.round(delta * 100) / 100;
  if (rounded > 0) {
    return `+${rounded} ${unit}`.trim();
  }
  if (rounded < 0) {
    return `${rounded} ${unit}`.trim();
  }
  return 'Baseline';
}

/**
 * HabitLeverSlider renders an interactive slider for a single habit lever,
 * complete with live value readouts, min/max bounds, baseline references,
 * and dynamic positive/negative diff indicators.
 *
 * @param props - HabitLeverSlider properties
 * @returns JSX Element rendering the habit lever control
 */
export function HabitLeverSlider({
  lever,
  baselineValue,
  onChange,
  disabled = false,
  className,
}: HabitLeverSliderProps): React.JSX.Element {
  const baseline = baselineValue !== undefined ? baselineValue : lever.currentValue;
  const delta = lever.currentValue - baseline;
  const hasChanged = Math.abs(delta) > 0.001;

  return (
    <div
      className={cn(
        'p-4 rounded-xl bg-bg-secondary/60 border border-border-primary/60',
        'hover:border-border-primary transition-colors space-y-3',
        className
      )}
      data-testid={`habit-lever-slider-${lever.id}`}
    >
      {/* Header Info & Live Diff Indicator */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-text-primary truncate">
            {lever.label}
          </h4>
          <p className="text-xs text-text-tertiary">
            Baseline: <span className="text-text-secondary font-mono">{baseline} {lever.unit}</span>
          </p>
        </div>

        {/* Delta Diff Badge */}
        <div
          data-testid={`lever-diff-${lever.id}`}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium border shrink-0',
            hasChanged && delta > 0 && 'text-accent-improved bg-accent-improved/10 border-accent-improved/30',
            hasChanged && delta < 0 && 'text-accent-current bg-accent-current/10 border-accent-current/30',
            !hasChanged && 'text-text-tertiary bg-bg-tertiary/60 border-border-primary/40'
          )}
        >
          {hasChanged && delta > 0 && <TrendingUp className="w-3 h-3" aria-hidden="true" />}
          {hasChanged && delta < 0 && <TrendingDown className="w-3 h-3" aria-hidden="true" />}
          {!hasChanged && <Minus className="w-3 h-3" aria-hidden="true" />}
          <span>{formatDelta(delta, lever.unit)}</span>
        </div>
      </div>

      {/* Range Slider */}
      <Slider
        id={`lever-slider-${lever.id}`}
        value={lever.currentValue}
        min={lever.min}
        max={lever.max}
        step={lever.step}
        unit={lever.unit}
        variant="improved"
        disabled={disabled}
        aria-label={`${lever.label} slider`}
        onChange={onChange}
      />
    </div>
  );
}
