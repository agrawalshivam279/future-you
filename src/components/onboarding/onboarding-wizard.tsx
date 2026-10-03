'use client';

import React, { useState } from 'react';
import { useOnboardingStore } from '@/stores';
import { WizardProgress } from './wizard-progress';
import { StepWrapper } from './step-wrapper';
import { WizardNav } from './wizard-nav';
import { ONBOARDING_STEPS, TOTAL_STEPS } from './constants';
import { cn } from '@/lib/utils';

export interface OnboardingWizardProps {
  className?: string;
  onComplete?: () => void;
}

/**
 * Main coordinator for the 6-step Future You onboarding flow.
 * Manages step sequence, directional transitions, progress synchronization, and step content slots.
 *
 * @param props - OnboardingWizard component properties
 * @returns JSX Element rendering the complete onboarding wizard
 */
export function OnboardingWizard({
  className,
  onComplete,
}: OnboardingWizardProps): React.JSX.Element {
  const { currentStep, nextStep, prevStep, setCurrentStep } = useOnboardingStore();
  const [direction, setDirection] = useState<number>(0);

  const currentMeta = ONBOARDING_STEPS[currentStep - 1] || ONBOARDING_STEPS[0];

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      nextStep();
    } else {
      onComplete?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      prevStep();
    }
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep !== currentStep) {
      setDirection(targetStep > currentStep ? 1 : -1);
      setCurrentStep(targetStep);
    }
  };

  return (
    <div className={cn('w-full max-w-3xl mx-auto space-y-6 sm:space-y-8', className)}>
      {/* Step Progress Stepper */}
      <WizardProgress
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onStepClick={handleStepClick}
      />

      {/* Animated Step Container */}
      <StepWrapper
        stepNumber={currentStep}
        title={currentMeta.title}
        subtitle={currentMeta.subtitle}
        description={currentMeta.description}
        direction={direction}
      >
        <div className="py-6 min-h-[220px] flex flex-col justify-center">
          {/* Step content slot placeholder (will host individual step forms in 4.1b-g) */}
          <div
            data-testid={`onboarding-step-content-${currentStep}`}
            className="rounded-xl border border-dashed border-border-primary/80 bg-bg-tertiary/40 p-8 text-center space-y-2"
          >
            <currentMeta.icon className="w-8 h-8 mx-auto text-accent-improved/70" aria-hidden="true" />
            <h3 className="text-base font-semibold text-text-primary">{currentMeta.title}</h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              {currentMeta.description}
            </p>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <WizardNav
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onBack={handleBack}
          onNext={handleNext}
        />
      </StepWrapper>
    </div>
  );
}
