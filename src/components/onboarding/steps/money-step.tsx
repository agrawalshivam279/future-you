'use client';

import React from 'react';
import { DollarSign, PiggyBank, CreditCard, ShoppingBag, Target } from 'lucide-react';
import { useOnboardingStore } from '@/stores';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { DebtLevel } from '@/types';
import { cn } from '@/lib/utils';

export interface MoneyStepProps {
  className?: string;
}

const INCOME_RANGES = [
  '< $30k',
  '$30k - $60k',
  '$60k - $100k',
  '$100k - $150k',
  '$150k - $250k',
  '$250k+',
];

const DEBT_OPTIONS: { value: DebtLevel; label: string; desc: string }[] = [
  { value: 'none', label: 'None', desc: 'Debt-free or paid monthly' },
  { value: 'low', label: 'Low', desc: 'Low-interest / manageable' },
  { value: 'moderate', label: 'Moderate', desc: 'Auto / student loans' },
  { value: 'high', label: 'High', desc: 'High-interest / heavy burden' },
];

const SPENDING_OPTIONS = [
  'Disciplined & Frugal',
  'Balanced & Conscious',
  'Comfort & Experiences',
  'Impulsive / Lifestyle Creep',
];

const GOAL_SUGGESTIONS = [
  'Build 6-month emergency reserve',
  'Become 100% debt-free',
  'Save down payment for a home',
  'Invest for early retirement / FIRE',
  'Fund my own business venture',
];

/**
 * Step 4 form component capturing economic trajectory, savings rate,
 * debt burden, spending behavior, and primary financial goal.
 *
 * @param props - MoneyStep component properties
 * @returns JSX Element rendering the finances and resources form
 */
export function MoneyStep({ className }: MoneyStepProps): React.JSX.Element {
  const { money, updateMoney } = useOnboardingStore();

  const getSavingsTrajectoryNote = (rate: number) => {
    if (rate >= 50) return 'Aggressive financial independence (FIRE) trajectory';
    if (rate >= 25) return 'Strong wealth accumulator, rapid asset compounding';
    if (rate >= 10) return 'Standard steady wealth builder';
    return 'Lean cushion, vulnerable to unexpected disruptions';
  };

  return (
    <div className={cn('space-y-8 text-left', className)}>
      {/* 1. Income Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Current Annual Income Bracket</h4>
        </div>
        <p className="text-xs text-text-secondary">
          Estimated pre-tax annual income across all streams (wages, freelancing, investments).
        </p>
        <div
          role="radiogroup"
          aria-label="Annual income bracket"
          className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1"
        >
          {INCOME_RANGES.map((range) => {
            const isSelected = money.incomeRange === range;
            return (
              <button
                key={range}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateMoney({ incomeRange: range })}
                className={cn(
                  'p-3 rounded-xl border text-center font-medium text-xs transition-all duration-150',
                  isSelected
                    ? 'border-accent-improved bg-accent-improved/10 text-accent-improved shadow-sm'
                    : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                )}
              >
                {range}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border-primary/50" />

      {/* 2. Monthly Savings Rate Slider */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PiggyBank className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Monthly Savings &amp; Investment Rate</h4>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <p className="text-xs text-text-secondary">
            Percentage of net monthly take-home income saved or invested.
          </p>
          <span className="text-[11px] font-mono text-accent-improved font-medium">
            {getSavingsTrajectoryNote(money.savingsRate)}
          </span>
        </div>
        <Slider
          id="savings-rate-slider"
          min={0}
          max={100}
          step={1}
          unit="% of income"
          value={money.savingsRate}
          onChange={(val) => updateMoney({ savingsRate: val })}
          aria-label="Monthly savings and investment rate percentage"
          variant="improved"
          className="pt-2"
        />
      </div>

      <div className="border-t border-border-primary/50" />

      {/* 3. Debt Burden Level */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-accent-warning" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Current Debt Burden</h4>
        </div>
        <p className="text-xs text-text-secondary">
          Level of outstanding personal liabilities (credit cards, student loans, auto loans, mortgages).
        </p>
        <div
          role="radiogroup"
          aria-label="Current debt burden level"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1"
        >
          {DEBT_OPTIONS.map((option) => {
            const isSelected = money.debtLevel === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateMoney({ debtLevel: option.value })}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150',
                  isSelected
                    ? 'border-accent-warning bg-accent-warning/10 text-accent-warning shadow-sm'
                    : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                )}
              >
                <span className="font-semibold text-xs text-text-primary">{option.label}</span>
                <span className="text-[10px] text-text-muted mt-0.5 leading-tight">{option.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border-primary/50" />

      {/* 4. Spending Habits */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-accent-current" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Spending Habits &amp; Discipline</h4>
        </div>
        <p className="text-xs text-text-secondary">
          How would you characterize your day-to-day purchasing impulses and budgeting discipline?
        </p>
        <div
          role="radiogroup"
          aria-label="Spending habits and discipline"
          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1"
        >
          {SPENDING_OPTIONS.map((option) => {
            const isSelected = money.spendingHabits === option;
            return (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateMoney({ spendingHabits: option })}
                className={cn(
                  'p-3 rounded-xl border text-left font-medium text-xs transition-all duration-150 flex items-center justify-between',
                  isSelected
                    ? 'border-accent-improved bg-accent-improved/10 text-accent-improved shadow-sm'
                    : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                )}
              >
                <span>{option}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-accent-improved" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border-primary/50" />

      {/* 5. Core Financial Goal */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Primary 5-Year Financial Target</h4>
        </div>
        <p className="text-xs text-text-secondary">
          The single most meaningful economic milestone you want your future self to achieve.
        </p>

        <Input
          id="financial-goal-input"
          label="Your 5-Year Financial Milestone"
          placeholder="e.g. Save $50,000 down payment for our family home"
          value={money.financialGoal}
          onChange={(e) => updateMoney({ financialGoal: e.target.value })}
          aria-label="Primary 5-year financial milestone target"
        />

        {/* Suggestion Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-medium text-text-muted">Quick ideas:</span>
          <div className="flex flex-wrap gap-1.5">
            {GOAL_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => updateMoney({ financialGoal: suggestion })}
                className="text-xs px-2.5 py-1 rounded-lg border border-border-primary/60 bg-bg-tertiary/60 text-text-secondary hover:text-text-primary hover:border-accent-improved/50 transition-colors duration-150"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
