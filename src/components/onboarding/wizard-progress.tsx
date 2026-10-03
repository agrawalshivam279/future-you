'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ONBOARDING_STEPS, TOTAL_STEPS } from './constants';

export interface WizardProgressProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

/**
 * Responsive progress indicator for the 6-step onboarding wizard.
 * Displays a desktop stepper with step names and a mobile-optimized progress bar.
 *
 * @param props - WizardProgress component properties
 * @returns JSX Element rendering accessible progress bar and stepper
 */
export function WizardProgress({
  currentStep,
  totalSteps = TOTAL_STEPS,
  onStepClick,
  className,
}: WizardProgressProps): React.JSX.Element {
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentStep / totalSteps) * 100)));

  return (
    <nav
      aria-label="Onboarding Progress"
      className={cn('w-full space-y-4 select-none', className)}
    >
      {/* Mobile Progress Bar (< 768px) */}
      <div className="md:hidden space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-text-primary">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-text-muted font-mono">{progressPercent}% Completed</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${currentStep} of ${totalSteps}`}
          className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden border border-border-primary/40"
        >
          <div
            className="h-full bg-accent-improved transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Desktop Stepper (>= 768px) */}
      <div className="hidden md:block">
        <ol className="flex items-center justify-between w-full relative">
          {ONBOARDING_STEPS.map((stepMeta, index) => {
            const isCompleted = currentStep > stepMeta.step;
            const isCurrent = currentStep === stepMeta.step;
            const isUpcoming = currentStep < stepMeta.step;
            const StepIcon = stepMeta.icon;

            return (
              <li
                key={stepMeta.step}
                aria-current={isCurrent ? 'step' : undefined}
                className="flex-1 relative flex flex-col items-center group"
              >
                {/* Connector Line behind steps */}
                {index > 0 && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      'absolute top-4 -left-1/2 right-1/2 h-[2px] -z-0 transition-colors duration-300',
                      isCompleted || isCurrent ? 'bg-accent-improved/70' : 'bg-border-primary'
                    )}
                  />
                )}

                {/* Step Circle Button / Indicator */}
                <button
                  type="button"
                  disabled={!isCompleted || !onStepClick}
                  onClick={() => isCompleted && onStepClick?.(stepMeta.step)}
                  aria-label={`Step ${stepMeta.step}: ${stepMeta.title}${
                    isCompleted ? ' (Completed)' : isCurrent ? ' (Current)' : ''
                  }`}
                  className={cn(
                    'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold',
                    'transition-all duration-200 outline-none',
                    isCompleted &&
                      'bg-accent-improved text-bg-primary hover:opacity-90 cursor-pointer shadow-sm',
                    isCurrent &&
                      'bg-bg-primary border-2 border-accent-improved text-accent-improved ring-4 ring-accent-improved/15',
                    isUpcoming &&
                      'bg-bg-tertiary border border-border-primary text-text-muted cursor-default'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                  ) : (
                    <StepIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>

                {/* Step Labels */}
                <div className="mt-2 text-center max-w-[110px]">
                  <span
                    className={cn(
                      'block text-xs font-medium truncate',
                      isCurrent && 'text-text-primary font-semibold',
                      isCompleted && 'text-text-secondary',
                      isUpcoming && 'text-text-muted'
                    )}
                  >
                    {stepMeta.title}
                  </span>
                  <span className="block text-[10px] text-text-muted truncate">
                    {stepMeta.subtitle}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
