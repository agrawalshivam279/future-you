import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HabitLeverSlider } from '../habit-lever-slider';
import { HabitLever } from '@/types/life-model.types';

const mockLever: HabitLever = {
  id: 'sleep-hours',
  label: 'Nightly Sleep',
  min: 4,
  max: 10,
  step: 0.5,
  currentValue: 7,
  unit: 'hrs',
};

describe('HabitLeverSlider', () => {
  it('renders lever title, unit, min/max bounds, and baseline indicator', () => {
    render(
      <HabitLeverSlider
        lever={mockLever}
        baselineValue={7}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('Nightly Sleep')).toBeInTheDocument();
    expect(screen.getByText(/Baseline:/i)).toBeInTheDocument();
    expect(screen.getByText(/4\s*hrs/)).toBeInTheDocument();
    expect(screen.getByText(/10\s*hrs/)).toBeInTheDocument();
    expect(screen.getAllByText(/7\s*hrs/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders "Baseline" diff badge when currentValue equals baselineValue', () => {
    render(
      <HabitLeverSlider
        lever={mockLever}
        baselineValue={7}
        onChange={jest.fn()}
      />
    );

    const diffBadge = screen.getByTestId('lever-diff-sleep-hours');
    expect(diffBadge).toHaveTextContent('Baseline');
  });

  it('renders positive delta diff badge when currentValue exceeds baselineValue', () => {
    const increasedLever: HabitLever = {
      ...mockLever,
      currentValue: 8.5,
    };

    render(
      <HabitLeverSlider
        lever={increasedLever}
        baselineValue={7}
        onChange={jest.fn()}
      />
    );

    const diffBadge = screen.getByTestId('lever-diff-sleep-hours');
    expect(diffBadge).toHaveTextContent('+1.5 hrs');
  });

  it('renders negative delta diff badge when currentValue is less than baselineValue', () => {
    const decreasedLever: HabitLever = {
      ...mockLever,
      currentValue: 5.5,
    };

    render(
      <HabitLeverSlider
        lever={decreasedLever}
        baselineValue={7}
        onChange={jest.fn()}
      />
    );

    const diffBadge = screen.getByTestId('lever-diff-sleep-hours');
    expect(diffBadge).toHaveTextContent('-1.5 hrs');
  });

  it('calls onChange with the new numeric value when slider changes', () => {
    const handleChange = jest.fn();
    render(
      <HabitLeverSlider
        lever={mockLever}
        baselineValue={7}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('slider', { name: /Nightly Sleep/i });
    fireEvent.change(input, { target: { value: '8' } });

    expect(handleChange).toHaveBeenCalledWith(8);
  });

  it('disables the range slider when disabled is true', () => {
    render(
      <HabitLeverSlider
        lever={mockLever}
        baselineValue={7}
        disabled={true}
        onChange={jest.fn()}
      />
    );

    const input = screen.getByRole('slider', { name: /Nightly Sleep/i });
    expect(input).toBeDisabled();
  });
});
