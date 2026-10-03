'use client';

import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TOTAL_STEPS } from './constants';

export interface WizardNavProps {
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  onNext: () => void;
  isBackDisabled?: boolean;
  isNextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
  isSubmitting?: boolean;
  className?: string;
}

/**
 * Bottom navigation controls for the onboarding wizard.
 * Provides accessible Previous/Next actions, step position indicator, and final step trigger.
 *
 * @param props - WizardNav component properties
 * @returns JSX Element rendering the wizard navigation bar
 */
export function WizardNav({
  currentStep,
  totalSteps = TOTAL_STEPS,
  onBack,
  onNext,
  isBackDisabled,
  isNextDisabled,
  nextLabel,
  backLabel = 'Back',
  isSubmitting = false,
  className,
}: WizardNavProps): React.JSX.Element {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const defaultNextLabel = isLastStep ? 'Review & Generate' : 'Continue';
  const effectiveNextLabel = nextLabel || defaultNextLabel;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 pt-4 border-t border-border-primary/40',
        className
      )}
    >
      {/* Back Button */}
      <Button
        type="button"
        variant="secondary"
        onClick={onBack}
        disabled={isBackDisabled || isFirstStep || isSubmitting}
        leftIcon={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}
        aria-label="Go to previous step"
        className={cn(
          'transition-opacity',
          isFirstStep && 'opacity-0 pointer-events-none'
        )}
      >
        {backLabel}
      </Button>

      {/* Step Indicator text */}
      <span className="text-xs text-text-muted font-mono tracking-wider">
        Step {currentStep} of {totalSteps}
      </span>

      {/* Next / Continue Button */}
      <Button
        type="button"
        variant={isLastStep ? 'improved' : 'primary'}
        onClick={onNext}
        disabled={isNextDisabled || isSubmitting}
        isLoading={isSubmitting}
        rightIcon={
          isLastStep ? (
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          )
        }
        aria-label={
          isLastStep ? 'Generate my future simulations' : 'Continue to next step'
        }
      >
        {effectiveNextLabel}
      </Button>
    </div>
  );
}
