import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HabitLeversPanel } from '../habit-levers-panel';
import { HabitLever } from '@/types/life-model.types';

const mockLevers: HabitLever[] = [
  {
    id: 'sleep-hours',
    label: 'Nightly Sleep',
    min: 4,
    max: 10,
    step: 0.5,
    currentValue: 7,
    unit: 'hrs',
  },
  {
    id: 'deep-work',
    label: 'Deep Work',
    min: 1,
    max: 8,
    step: 0.5,
    currentValue: 3,
    unit: 'hrs/day',
  },
];

describe('HabitLeversPanel', () => {
  it('renders fallback empty state when levers array is empty', () => {
    render(
      <HabitLeversPanel
        levers={[]}
        onApplyChanges={jest.fn()}
      />
    );

    expect(screen.getByText(/No configurable habit levers found/i)).toBeInTheDocument();
  });

  it('renders all habit levers with their labels and units', () => {
    render(
      <HabitLeversPanel
        levers={mockLevers}
        onApplyChanges={jest.fn()}
      />
    );

    expect(screen.getByText('Habit Levers')).toBeInTheDocument();
    expect(screen.getByText('Nightly Sleep')).toBeInTheDocument();
    expect(screen.getByText('Deep Work')).toBeInTheDocument();
    expect(screen.getByTestId('modified-levers-badge')).toHaveTextContent('Baseline');
  });

  it('disables Reset and Apply buttons when no modifications exist', () => {
    render(
      <HabitLeversPanel
        levers={mockLevers}
        onApplyChanges={jest.fn()}
      />
    );

    const resetButton = screen.getByRole('button', { name: /Reset levers to baseline/i });
    const applyButton = screen.getByRole('button', { name: /Apply habit changes/i });

    expect(resetButton).toBeDisabled();
    expect(applyButton).toBeDisabled();
  });

  it('updates modified badge and enables buttons when a slider is adjusted', () => {
    render(
      <HabitLeversPanel
        levers={mockLevers}
        onApplyChanges={jest.fn()}
      />
    );

    const sleepSlider = screen.getByRole('slider', { name: /Nightly Sleep/i });
    fireEvent.change(sleepSlider, { target: { value: '8.5' } });

    expect(screen.getByTestId('modified-levers-badge')).toHaveTextContent('1 modified');

    const resetButton = screen.getByRole('button', { name: /Reset levers to baseline/i });
    const applyButton = screen.getByRole('button', { name: /Apply habit changes/i });

    expect(resetButton).toBeEnabled();
    expect(applyButton).toBeEnabled();
  });

  it('resets adjustments when Reset button is clicked', () => {
    const handleReset = jest.fn();
    render(
      <HabitLeversPanel
        levers={mockLevers}
        onApplyChanges={jest.fn()}
        onResetToBaseline={handleReset}
      />
    );

    const sleepSlider = screen.getByRole('slider', { name: /Nightly Sleep/i });
    fireEvent.change(sleepSlider, { target: { value: '8.5' } });
    expect(screen.getByTestId('modified-levers-badge')).toHaveTextContent('1 modified');

    const resetButton = screen.getByRole('button', { name: /Reset levers to baseline/i });
    fireEvent.click(resetButton);

    expect(screen.getByTestId('modified-levers-badge')).toHaveTextContent('Baseline');
    expect(handleReset).toHaveBeenCalledTimes(1);
    expect(resetButton).toBeDisabled();
  });

  it('submits updated levers array when Apply Changes is clicked', () => {
    const handleApply = jest.fn();
    render(
      <HabitLeversPanel
        levers={mockLevers}
        onApplyChanges={handleApply}
      />
    );

    const sleepSlider = screen.getByRole('slider', { name: /Nightly Sleep/i });
    fireEvent.change(sleepSlider, { target: { value: '8.5' } });

    const deepWorkSlider = screen.getByRole('slider', { name: /Deep Work/i });
    fireEvent.change(deepWorkSlider, { target: { value: '4' } });

    expect(screen.getByTestId('modified-levers-badge')).toHaveTextContent('2 modified');

    const applyButton = screen.getByRole('button', { name: /Apply habit changes/i });
    fireEvent.click(applyButton);

    expect(handleApply).toHaveBeenCalledTimes(1);
    expect(handleApply).toHaveBeenCalledWith([
      expect.objectContaining({ id: 'sleep-hours', currentValue: 8.5 }),
      expect.objectContaining({ id: 'deep-work', currentValue: 4 }),
    ]);
  });

  it('disables controls and displays loading text when isRegenerating is true', () => {
    render(
      <HabitLeversPanel
        levers={mockLevers}
        onApplyChanges={jest.fn()}
        isRegenerating={true}
      />
    );

    const sleepSlider = screen.getByRole('slider', { name: /Nightly Sleep/i });
    expect(sleepSlider).toBeDisabled();

    const applyButton = screen.getByRole('button', { name: /Apply habit changes/i });
    expect(applyButton).toBeDisabled();
    expect(applyButton).toHaveTextContent('Recalculating...');
  });
});
