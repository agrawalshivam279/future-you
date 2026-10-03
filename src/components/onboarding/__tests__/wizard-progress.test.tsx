import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WizardProgress } from '../wizard-progress';

describe('WizardProgress Component', () => {
  it('renders progress bar with accessible role and values', () => {
    render(<WizardProgress currentStep={3} totalSteps={6} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '3');
    expect(progressBar).toHaveAttribute('aria-valuemin', '1');
    expect(progressBar).toHaveAttribute('aria-valuemax', '6');
    expect(screen.getByText('50% Completed')).toBeInTheDocument();
  });

  it('marks current step with aria-current="step"', () => {
    render(<WizardProgress currentStep={2} />);

    const activeStepItem = screen.getByText('Daily Habits & Lifestyle').closest('li');
    expect(activeStepItem).toHaveAttribute('aria-current', 'step');
  });

  it('allows clicking previous completed steps', () => {
    const handleStepClick = jest.fn();
    render(<WizardProgress currentStep={3} onStepClick={handleStepClick} />);

    const step1Button = screen.getByRole('button', { name: /step 1: goals & aspirations \(completed\)/i });
    expect(step1Button).not.toBeDisabled();

    fireEvent.click(step1Button);
    expect(handleStepClick).toHaveBeenCalledWith(1);
  });

  it('disables future step buttons', () => {
    const handleStepClick = jest.fn();
    render(<WizardProgress currentStep={2} onStepClick={handleStepClick} />);

    const step4Button = screen.getByRole('button', { name: /step 4: finances & resources/i });
    expect(step4Button).toBeDisabled();
  });
});
