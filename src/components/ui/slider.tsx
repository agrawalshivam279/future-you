import React from 'react';
import { cn } from '@/lib/utils';

export type SliderVariant = 'neutral' | 'current' | 'improved';

export interface SliderProps {
  id?: string;
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  variant?: SliderVariant;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  onChange: (value: number) => void;
}

const fillStyles: Record<SliderVariant, string> = {
  neutral: 'bg-text-primary',
  current: 'bg-accent-current',
  improved: 'bg-accent-improved',
};

/**
 * Accessible Slider primitive tailored for Habit Levers and onboarding range selections.
 * Features customizable min/max, fill tracks, formatted numeric readouts, and ARIA value indicators.
 *
 * @param props - Slider component properties
 * @returns JSX Element rendering accessible range slider with track and value readout
 */
export function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  variant = 'neutral',
  disabled = false,
  className,
  'aria-label': ariaLabel,
  onChange,
}: SliderProps): React.JSX.Element {
  const generatedId = React.useId();
  const sliderId = id || generatedId;

  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={cn('w-full space-y-2 text-left select-none', className)}>
      {(label || unit) && (
        <div className="flex items-center justify-between text-sm">
          {label && (
            <label htmlFor={sliderId} className="font-medium text-text-secondary">
              {label}
            </label>
          )}
          <span className="font-mono text-sm font-semibold text-text-primary tabular-nums">
            {value}
            {unit ? ` ${unit}` : ''}
          </span>
        </div>
      )}

      <div className="relative flex items-center w-full h-6">
        {/* Visual Track Background */}
        <div className="absolute w-full h-2 rounded-full bg-bg-tertiary border border-border-primary/60 overflow-hidden pointer-events-none">
          <div
            className={cn('h-full transition-all duration-75', fillStyles[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Real HTML Range Input for accessibility & keyboard navigation */}
        <input
          id={sliderId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={ariaLabel || label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value} ${unit}`.trim()}
          onChange={handleInputChange}
          className={cn(
            'relative w-full h-2 opacity-0 cursor-pointer z-10',
            'disabled:cursor-not-allowed'
          )}
        />

        {/* Visual Custom Thumb */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute w-4 h-4 rounded-full bg-white shadow-md border border-black/10 pointer-events-none transition-transform duration-75',
            disabled && 'bg-text-muted opacity-50'
          )}
          style={{
            left: `calc(${percentage}% - 8px)`,
          }}
        />
      </div>

      <div className="flex justify-between text-[11px] font-mono text-text-muted">
        <span>
          {min}
          {unit ? ` ${unit}` : ''}
        </span>
        <span>
          {max}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
    </div>
  );
}
