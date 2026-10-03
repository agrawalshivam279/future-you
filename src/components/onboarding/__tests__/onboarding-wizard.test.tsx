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
    expect(
      screen.getByLabelText(/what should your future selves call you/i)
    ).toBeInTheDocument();
  });

  it('advances to step 2 when continue button is clicked', () => {
    render(<OnboardingWizard />);

    const continueBtn = screen.getByRole('button', { name: /continue to next step/i });
    fireEvent.click(continueBtn);

    expect(useOnboardingStore.getState().currentStep).toBe(2);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getAllByText('Daily Habits & Lifestyle').length).toBeGreaterThan(0);
    expect(screen.getByText('Nightly Sleep Duration')).toBeInTheDocument();
  });

  it('advances to step 3 and renders Weekly Time Allocation form', () => {
    useOnboardingStore.getState().setCurrentStep(2);
    render(<OnboardingWizard />);

    const continueBtn = screen.getByRole('button', { name: /continue to next step/i });
    fireEvent.click(continueBtn);

    expect(useOnboardingStore.getState().currentStep).toBe(3);
    expect(screen.getByRole('progressbar', { name: /step 3 of 6/i })).toHaveAttribute(
      'aria-valuenow',
      '3'
    );
    expect(screen.getAllByText('Time Allocation').length).toBeGreaterThan(0);
    expect(screen.getByText('168-Hour Weekly Budget')).toBeInTheDocument();
    expect(screen.getByText('Career & Work Hours')).toBeInTheDocument();
  });

  it('advances to step 4 and renders Finances & Resources form', () => {
    useOnboardingStore.getState().setCurrentStep(3);
    render(<OnboardingWizard />);

    const continueBtn = screen.getByRole('button', { name: /continue to next step/i });
    fireEvent.click(continueBtn);

    expect(useOnboardingStore.getState().currentStep).toBe(4);
    expect(screen.getByRole('progressbar', { name: /step 4 of 6/i })).toHaveAttribute(
      'aria-valuenow',
      '4'
    );
    expect(screen.getAllByText('Finances & Resources').length).toBeGreaterThan(0);
    expect(screen.getByText('Current Annual Income Bracket')).toBeInTheDocument();
    expect(screen.getByText('Monthly Savings & Investment Rate')).toBeInTheDocument();
  });

  it('advances to step 5 and renders Skills & Learning form', () => {
    useOnboardingStore.getState().setCurrentStep(4);
    render(<OnboardingWizard />);

    const continueBtn = screen.getByRole('button', { name: /continue to next step/i });
    fireEvent.click(continueBtn);

    expect(useOnboardingStore.getState().currentStep).toBe(5);
    expect(screen.getByRole('progressbar', { name: /step 5 of 6/i })).toHaveAttribute(
      'aria-valuenow',
      '5'
    );
    expect(screen.getAllByText('Skills & Learning').length).toBeGreaterThan(0);
    expect(screen.getByText('Key Current Strengths & Capabilities')).toBeInTheDocument();
    expect(screen.getByText('Target Capabilities & Learning Goals')).toBeInTheDocument();
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
