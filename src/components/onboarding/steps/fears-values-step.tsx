'use client';

import React from 'react';
import { AlertTriangle, Heart, RotateCcw, Compass, ShieldAlert } from 'lucide-react';
import { useOnboardingStore } from '@/stores';
import { GoalListBuilder } from './goal-list-builder';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { MotivationType } from '@/types';
import { cn } from '@/lib/utils';

export interface FearsValuesStepProps {
  className?: string;
}

const FEAR_SUGGESTIONS = [
  'Unrealized Potential & Stagnation',
  'Financial Insecurity & Scarcity',
  'Health & Physical Vitality Collapse',
  'Superficial / Broken Relationships',
  'Living an Inauthentic Life',
  'Imposter Syndrome & Paralyzing Doubt',
];

const VALUE_SUGGESTIONS = [
  'Autonomy & Creative Freedom',
  'Deep Family & Genuine Connection',
  'Intellectual Rigor & Truth',
  'Physical Vitality & Resilience',
  'Financial Sovereignty',
  'Integrity & Moral Courage',
  'Continuous Mastery & Craft',
];

const MOTIVATION_OPTIONS: { value: MotivationType; label: string; desc: string }[] = [
  {
    value: 'internal',
    label: 'Internal / Intrinsic',
    desc: 'Driven by curiosity, personal purpose, craft mastery, and joy of the work itself.',
  },
  {
    value: 'external',
    label: 'External / Extrinsic',
    desc: 'Driven by measurable impact, status, peer recognition, and financial rewards.',
  },
  {
    value: 'mixed',
    label: 'Balanced / Mixed',
    desc: 'An equal balance of internal creative fire and tangible external outcomes.',
  },
];

/**
 * Step 6 form component capturing deepest anxieties, core non-negotiable values,
 * past regrets, motivational origin, and risk tolerance profile.
 *
 * @param props - FearsValuesStep component properties
 * @returns JSX Element rendering the fears, values, and drivers form
 */
export function FearsValuesStep({ className }: FearsValuesStepProps): React.JSX.Element {
  const { fearsAndValues, updateFearsAndValues } = useOnboardingStore();

  const handleAddFear = (fear: string) => {
    if (!fearsAndValues.biggestFears.includes(fear)) {
      updateFearsAndValues({
        biggestFears: [...fearsAndValues.biggestFears, fear],
      });
    }
  };

  const handleRemoveFear = (index: number) => {
    updateFearsAndValues({
      biggestFears: fearsAndValues.biggestFears.filter((_, i) => i !== index),
    });
  };

  const handleAddValue = (value: string) => {
    if (!fearsAndValues.coreValues.includes(value)) {
      updateFearsAndValues({
        coreValues: [...fearsAndValues.coreValues, value],
      });
    }
  };

  const handleRemoveValue = (index: number) => {
    updateFearsAndValues({
      coreValues: fearsAndValues.coreValues.filter((_, i) => i !== index),
    });
  };

  const getRiskToleranceNote = (rating: number) => {
    if (rating >= 9) return 'Aggressive venture risk: High appetite for disruption and high stakes';
    if (rating >= 7) return 'Bold explorer: Embraces uncertainty for asymmetrical upside';
    if (rating >= 4) return 'Calculated pragmatist: Measured risks with fallback safety nets';
    return 'Security-first: Prefers proven, highly predictable, low-variance paths';
  };

  return (
    <div className={cn('space-y-8 text-left', className)}>
      {/* 1. Biggest Fears & Anxieties */}
      <GoalListBuilder
        id="biggest-fears-input"
        label="Primary Anxieties & Potential Regrets"
        description="What worst-case outcomes or traps are you most determined to avoid in 5 years?"
        placeholder="e.g. Wasting potential on safe jobs, chronic burnout, isolation"
        goals={fearsAndValues.biggestFears}
        suggestions={FEAR_SUGGESTIONS}
        badgeVariant="current"
        onAddGoal={handleAddFear}
        onRemoveGoal={handleRemoveFear}
        inputAriaLabel="Add a primary fear or anxiety"
        buttonAriaLabel="Add fear"
        removeAriaLabelPrefix="Remove fear"
      />

      <div className="border-t border-border-primary/50" />

      {/* 2. Core Life Values */}
      <GoalListBuilder
        id="core-values-input"
        label="Non-Negotiable Core Values"
        description="The principles and virtues that anchor your decisions when trade-offs arise."
        placeholder="e.g. Intellectual Freedom, Family Loyalty, Total Honesty"
        goals={fearsAndValues.coreValues}
        suggestions={VALUE_SUGGESTIONS}
        badgeVariant="improved"
        onAddGoal={handleAddValue}
        onRemoveGoal={handleRemoveValue}
        inputAriaLabel="Add a core value or operating principle"
        buttonAriaLabel="Add core value"
        removeAriaLabelPrefix="Remove core value"
      />

      <div className="border-t border-border-primary/50" />

      {/* 3. Regrets Reflection Textarea */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-accent-current" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">
            Past Choices, Habits, or Unaddressed Regrets
          </h4>
        </div>
        <p className="text-xs text-text-secondary">
          What past patterns, missed opportunities, or lingering regrets do you want your future self to break free from?
        </p>

        <Textarea
          id="regrets-input"
          label="Reflective Regrets & Patterns to Break"
          placeholder="e.g. In my early twenties, I stayed in a stagnant role out of fear of failure. I often let short-term comfort delay long-term creative projects..."
          rows={3}
          value={fearsAndValues.regrets}
          onChange={(e) => updateFearsAndValues({ regrets: e.target.value })}
          aria-label="Reflective regrets and patterns to break"
        />
      </div>

      <div className="border-t border-border-primary/50" />

      {/* 4. Motivation Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-accent-info" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Core Motivational Drive</h4>
        </div>
        <p className="text-xs text-text-secondary">
          Where does your primary engine of drive and ambition originate?
        </p>
        <div
          role="radiogroup"
          aria-label="Core motivational drive"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1"
        >
          {MOTIVATION_OPTIONS.map((option) => {
            const isSelected = fearsAndValues.motivation === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateFearsAndValues({ motivation: option.value })}
                className={cn(
                  'flex flex-col items-start p-3.5 rounded-xl border text-left transition-all duration-150',
                  isSelected
                    ? 'border-accent-improved bg-accent-improved/10 shadow-sm'
                    : 'border-border-primary bg-bg-secondary hover:bg-bg-hover'
                )}
              >
                <span
                  className={cn(
                    'font-semibold text-xs',
                    isSelected ? 'text-accent-improved' : 'text-text-primary'
                  )}
                >
                  {option.label}
                </span>
                <span className="text-[11px] text-text-muted mt-1 leading-snug">
                  {option.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border-primary/50" />

      {/* 5. Risk Tolerance Rating Slider */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent-warning" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Appetite for Risk (1–10)</h4>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <p className="text-xs text-text-secondary">
            Your willingness to endure short-term instability for high-upside potential.
          </p>
          <span className="text-[11px] font-mono text-accent-warning font-medium">
            {getRiskToleranceNote(fearsAndValues.riskTolerance)}
          </span>
        </div>
        <Slider
          id="risk-tolerance-slider"
          min={1}
          max={10}
          step={1}
          unit="/ 10"
          value={fearsAndValues.riskTolerance}
          onChange={(val) => updateFearsAndValues({ riskTolerance: val })}
          aria-label="Appetite for risk rating from 1 to 10"
          variant="neutral"
          className="pt-2"
        />
      </div>
    </div>
  );
}
