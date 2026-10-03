import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardNav } from '../wizard-nav';

describe('WizardNav Component', () => {
  it('disables back button on step 1', () => {
    const handleBack = jest.fn();
    const handleNext = jest.fn();

    render(
      <WizardNav
        currentStep={1}
        totalSteps={6}
        onBack={handleBack}
        onNext={handleNext}
      />
    );

    const backButton = screen.getByRole('button', { name: /go to previous step/i });
    expect(backButton).toBeDisabled();

    const nextButton = screen.getByRole('button', { name: /continue to next step/i });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);
    expect(handleNext).toHaveBeenCalledTimes(1);
  });

  it('enables back button on step > 1 and calls onBack when clicked', () => {
    const handleBack = jest.fn();
    const handleNext = jest.fn();

    render(
      <WizardNav
        currentStep={3}
        totalSteps={6}
        onBack={handleBack}
        onNext={handleNext}
      />
    );

    const backButton = screen.getByRole('button', { name: /go to previous step/i });
    expect(backButton).not.toBeDisabled();

    fireEvent.click(backButton);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('renders special submit label and sparkles icon on the final step', () => {
    const handleBack = jest.fn();
    const handleNext = jest.fn();

    render(
      <WizardNav
        currentStep={6}
        totalSteps={6}
        onBack={handleBack}
        onNext={handleNext}
      />
    );

    expect(screen.getByText('Review & Generate')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /generate my future simulations/i })
    ).toBeInTheDocument();
  });
});
