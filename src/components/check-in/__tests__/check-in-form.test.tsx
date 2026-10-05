import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckInForm, CheckInFormData } from '../check-in-form';
import { useCheckInStore } from '@/stores/check-in-store';
import { useOnboardingStore } from '@/stores/onboarding-store';

describe('CheckInForm Component', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCheckInStore.getState().resetCheckInStore();
    useOnboardingStore.getState().resetOnboarding();
  });

  it('renders all form controls and labels', () => {
    render(<CheckInForm onSubmit={mockSubmit} />);

    expect(screen.getByText('Record Habit Checkpoint')).toBeInTheDocument();
    expect(screen.getByText('Nightly Sleep')).toBeInTheDocument();
    expect(screen.getByText('Physical Exercise Cadence')).toBeInTheDocument();
    expect(screen.getByText('Deep Focus Work')).toBeInTheDocument();
    expect(screen.getByText('Digital Screen Time')).toBeInTheDocument();
    expect(screen.getByText('Savings Rate')).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Friction and Weekly Observations/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Evaluate Checkpoint/i })
    ).toBeInTheDocument();
  });

  it('pre-populates with supplied initialValues', () => {
    const customInitial: CheckInFormData = {
      sleepHours: 8.5,
      exerciseFrequency: 'daily',
      deepWorkHoursPerWeek: 40,
      screenTimeHoursPerDay: 1.5,
      savingsRatePercentage: 35,
      notes: 'Excellent week with high energy.',
    };

    render(<CheckInForm initialValues={customInitial} onSubmit={mockSubmit} />);

    const dailyBtn = screen.getByRole('radio', { name: /Daily: 5–7 days\/wk/i });
    expect(dailyBtn).toHaveAttribute('aria-checked', 'true');

    const notesInput = screen.getByLabelText(/Friction and Weekly Observations/i);
    expect(notesInput).toHaveValue('Excellent week with high energy.');
  });

  it('allows selecting different exercise frequencies and submitting', () => {
    render(<CheckInForm onSubmit={mockSubmit} />);

    const dailyBtn = screen.getByRole('radio', { name: /Daily: 5–7 days\/wk/i });
    fireEvent.click(dailyBtn);
    expect(dailyBtn).toHaveAttribute('aria-checked', 'true');

    const notesInput = screen.getByLabelText(/Friction and Weekly Observations/i);
    fireEvent.change(notesInput, { target: { value: 'Got 3 morning workouts in.' } });

    const submitBtn = screen.getByRole('button', { name: /Evaluate Checkpoint/i });
    fireEvent.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    const submittedData: CheckInFormData = mockSubmit.mock.calls[0][0];
    expect(submittedData.exerciseFrequency).toBe('daily');
    expect(submittedData.notes).toBe('Got 3 morning workouts in.');
  });

  it('disables controls and submit button when isLoading is true', () => {
    render(<CheckInForm onSubmit={mockSubmit} isLoading={true} />);

    const submitBtn = screen.getByRole('button', { name: /Evaluate Checkpoint/i });
    expect(submitBtn).toBeDisabled();

    const dailyBtn = screen.getByRole('radio', { name: /Daily: 5–7 days\/wk/i });
    expect(dailyBtn).toBeDisabled();

    const notesInput = screen.getByLabelText(/Friction and Weekly Observations/i);
    expect(notesInput).toBeDisabled();
  });
});
