import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingWizard } from '../onboarding-wizard';
import { useOnboardingStore } from '@/stores';

describe('OnboardingWizard Component', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetOnboarding();
  });

  it('renders initial step 1 with Goals & Aspirations title', () => {
    render(<OnboardingWizard />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
    expect(screen.getAllByText('Goals & Aspirations').length).toBeGreaterThan(0);
    expect(screen.getByTestId('onboarding-step-content-1')).toBeInTheDocument();
  });

  it('advances to step 2 when continue button is clicked', () => {
    render(<OnboardingWizard />);

    const continueBtn = screen.getByRole('button', { name: /continue to next step/i });
    fireEvent.click(continueBtn);

    expect(useOnboardingStore.getState().currentStep).toBe(2);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getAllByText('Daily Habits & Lifestyle').length).toBeGreaterThan(0);
  });

  it('navigates back to step 1 from step 2 when back button is clicked', () => {
    useOnboardingStore.getState().setCurrentStep(2);
    render(<OnboardingWizard />);

    const backBtn = screen.getByRole('button', { name: /go to previous step/i });
    fireEvent.click(backBtn);

    expect(useOnboardingStore.getState().currentStep).toBe(1);
    expect(screen.getAllByText('Goals & Aspirations').length).toBeGreaterThan(0);
  });

  it('calls onComplete when clicking continue on the final step', () => {
    const handleComplete = jest.fn();
    useOnboardingStore.getState().setCurrentStep(6);

    render(<OnboardingWizard onComplete={handleComplete} />);

    const finishBtn = screen.getByRole('button', {
      name: /generate my future simulations/i,
    });
    fireEvent.click(finishBtn);

    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
