import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HabitsStep } from '../habits-step';
import { useOnboardingStore } from '@/stores';

describe('HabitsStep Component', () => {
  beforeEach(() => {
    useOnboardingStore.getState().resetOnboarding();
  });

  it('renders all habit sections and controls', () => {
    render(<HabitsStep />);

    expect(screen.getByText('Nightly Sleep Duration')).toBeInTheDocument();
    expect(screen.getByText('Physical Exercise Frequency')).toBeInTheDocument();
    expect(screen.getByText('Nutrition & Diet Quality')).toBeInTheDocument();
    expect(screen.getByText('Recreational Screen Time')).toBeInTheDocument();
    expect(screen.getByText('Daily Meditation or Reflection Practice')).toBeInTheDocument();
  });

  it('updates sleep hours when range slider changes', () => {
    render(<HabitsStep />);

    const sleepSlider = screen.getByLabelText('Nightly sleep duration in hours');
    fireEvent.change(sleepSlider, { target: { value: '8.5' } });

    expect(useOnboardingStore.getState().habits.sleepHours).toBe(8.5);
  });

  it('updates exercise frequency when option clicked', () => {
    render(<HabitsStep />);

    const dailyBtn = screen.getByRole('radio', { name: /^daily/i });
    fireEvent.click(dailyBtn);

    expect(useOnboardingStore.getState().habits.exerciseFrequency).toBe('daily');
    expect(dailyBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('updates diet quality when option clicked', () => {
    render(<HabitsStep />);

    const excellentBtn = screen.getByRole('radio', { name: /excellent/i });
    fireEvent.click(excellentBtn);

    expect(useOnboardingStore.getState().habits.dietQuality).toBe('excellent');
    expect(excellentBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('updates recreational screen time when slider changes', () => {
    render(<HabitsStep />);

    const screenSlider = screen.getByLabelText('Daily recreational screen time in hours');
    fireEvent.change(screenSlider, { target: { value: '2' } });

    expect(useOnboardingStore.getState().habits.screenTime).toBe(2);
  });

  it('toggles daily meditation practice between yes and no', () => {
    render(<HabitsStep />);

    const yesBtn = screen.getByRole('radio', { name: /yes, daily habit/i });
    fireEvent.click(yesBtn);

    expect(useOnboardingStore.getState().habits.meditationOrReflection).toBe(true);

    const noBtn = screen.getByRole('radio', { name: /no \/ irregular/i });
    fireEvent.click(noBtn);

    expect(useOnboardingStore.getState().habits.meditationOrReflection).toBe(false);
  });
});
