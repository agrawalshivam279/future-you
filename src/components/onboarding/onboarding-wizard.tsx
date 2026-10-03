'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useOnboardingStore } from '@/stores';
import { validateStep } from '@/lib/validation';
import { WizardProgress } from './wizard-progress';
import { StepWrapper } from './step-wrapper';
import { WizardNav } from './wizard-nav';
import {
  GoalsStep,
  HabitsStep,
  TimeStep,
  MoneyStep,
  SkillsStep,
  FearsValuesStep,
} from './steps';
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
  const {
    currentStep,
    nextStep,
    prevStep,
    setCurrentStep,
    getOnboardingData,
    setCompleted,
  } = useOnboardingStore();
  const router = useRouter();
  const [direction, setDirection] = useState<number>(0);
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  const currentMeta = ONBOARDING_STEPS[currentStep - 1] || ONBOARDING_STEPS[0];

  const handleNext = () => {
    const data = getOnboardingData();
    const result = validateStep(currentStep, data);

    if (!result.isValid) {
      setStepErrors(result.errors);
      return;
    }

    setStepErrors([]);
    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      nextStep();
    } else {
      setCompleted(true);
      onComplete?.();
      router.push('/generate');
    }
  };

  const handleBack = () => {
    setStepErrors([]);
    if (currentStep > 1) {
      setDirection(-1);
      prevStep();
    }
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep !== currentStep) {
      setStepErrors([]);
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
        <div className="py-4 min-h-[220px]">
          {currentStep === 1 && <GoalsStep />}
          {currentStep === 2 && <HabitsStep />}
          {currentStep === 3 && <TimeStep />}
          {currentStep === 4 && <MoneyStep />}
          {currentStep === 5 && <SkillsStep />}
          {currentStep === 6 && <FearsValuesStep />}
        </div>

        {/* Step Validation Alert */}
        {stepErrors.length > 0 && (
          <div
            role="alert"
            aria-live="polite"
            className="p-3.5 mb-4 rounded-xl border border-accent-danger/50 bg-accent-danger/10 text-accent-danger space-y-1.5"
          >
            <div className="flex items-center gap-2 font-semibold text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Please address the following before continuing:</span>
            </div>
            <ul className="list-disc list-inside text-xs space-y-0.5 text-text-primary/90 pl-1">
              {stepErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

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
