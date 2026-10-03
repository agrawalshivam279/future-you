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

  it('prevents advancing from step 1 when required fields are missing', () => {
    render(<OnboardingWizard />);

    const continueBtn = screen.getByRole('button', { name: /continue to next step/i });
    fireEvent.click(continueBtn);

    // Stays on step 1
    expect(useOnboardingStore.getState().currentStep).toBe(1);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.getByText(/please enter your name or callsign/i)
    ).toBeInTheDocument();
  });

  it('advances to step 2 when step 1 validation criteria are met', () => {
    useOnboardingStore.getState().updateBasics('Alex', 28);
    useOnboardingStore.getState().updateGoals({ shortTerm: ['Launch my product'] });

    render(<OnboardingWizard />);

    const continueBtn = screen.getByRole('button', { name: /continue to next step/i });
    fireEvent.click(continueBtn);

    expect(useOnboardingStore.getState().currentStep).toBe(2);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getAllByText('Daily Habits & Lifestyle').length).toBeGreaterThan(0);
    expect(screen.getByText('Nightly Sleep Duration')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
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

  it('advances to step 5 when step 4 financial data is provided', () => {
    useOnboardingStore.getState().setCurrentStep(4);
    useOnboardingStore.getState().updateMoney({
      incomeRange: '$60k - $100k',
      financialGoal: 'Save $50k down payment',
    });

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

  it('advances to step 6 when step 5 skills data is provided', () => {
    useOnboardingStore.getState().setCurrentStep(5);
    useOnboardingStore.getState().updateSkills({
      currentSkills: ['Fullstack React'],
      careerField: 'Software Engineering',
    });

    render(<OnboardingWizard />);

    const continueBtn = screen.getByRole('button', { name: /continue to next step/i });
    fireEvent.click(continueBtn);

    expect(useOnboardingStore.getState().currentStep).toBe(6);
    expect(screen.getByRole('progressbar', { name: /step 6 of 6/i })).toHaveAttribute(
      'aria-valuenow',
      '6'
    );
    expect(screen.getAllByText('Fears, Values & Drivers').length).toBeGreaterThan(0);
    expect(screen.getByText('Primary Anxieties & Potential Regrets')).toBeInTheDocument();
    expect(screen.getByText('Non-Negotiable Core Values')).toBeInTheDocument();
  });

  it('navigates back to step 1 from step 2 when back button is clicked and clears errors', () => {
    useOnboardingStore.getState().setCurrentStep(2);
    render(<OnboardingWizard />);

    const backBtn = screen.getByRole('button', { name: /go to previous step/i });
    fireEvent.click(backBtn);

    expect(useOnboardingStore.getState().currentStep).toBe(1);
    expect(screen.getAllByText('Goals & Aspirations').length).toBeGreaterThan(0);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('validates final step, sets completion flag, and invokes onComplete callback', () => {
    const handleComplete = jest.fn();
    useOnboardingStore.getState().setCurrentStep(6);
    useOnboardingStore.getState().updateFearsAndValues({
      coreValues: ['Autonomy', 'Truth'],
      biggestFears: ['Stagnation'],
    });

    render(<OnboardingWizard onComplete={handleComplete} />);

    const finishBtn = screen.getByRole('button', {
      name: /generate my future simulations/i,
    });
    fireEvent.click(finishBtn);

    expect(useOnboardingStore.getState().isCompleted).toBe(true);
    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
