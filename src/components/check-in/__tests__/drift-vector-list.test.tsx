import React from 'react';
import { render, screen } from '@testing-library/react';
import { DriftVectorList } from '../drift-vector-list';
import { HabitDriftVector } from '@/types';

const mockVectors: HabitDriftVector[] = [
  {
    habitId: 'sleep-hours',
    label: 'Nightly Sleep',
    baselineValue: 6.5,
    targetValue: 8.0,
    actualValue: 8.5,
    unit: 'hrs',
    driftPercentage: 133.3,
    status: 'surpassing',
  },
  {
    habitId: 'exercise-frequency',
    label: 'Physical Exercise',
    baselineValue: 1,
    targetValue: 5,
    actualValue: 4,
    unit: 'days/wk',
    driftPercentage: 75,
    status: 'aligned',
  },
  {
    habitId: 'screen-time',
    label: 'Digital Screen Time',
    baselineValue: 5.0,
    targetValue: 2.0,
    actualValue: 4.5,
    unit: 'hrs/day',
    driftPercentage: 16.7,
    status: 'drifting_current',
  },
];

describe('DriftVectorList Component', () => {
  it('renders fallback empty state when no vectors provided', () => {
    render(<DriftVectorList vectors={[]} />);
    expect(
      screen.getByText(/No habit drift vectors recorded yet/i)
    ).toBeInTheDocument();
  });

  it('renders summary stat pills with accurate counts', () => {
    render(<DriftVectorList vectors={mockVectors} />);

    expect(screen.getByText('1 Aligned')).toBeInTheDocument();
    expect(screen.getByText('1 Surpassing')).toBeInTheDocument();
    expect(screen.getByText('1 Drifting')).toBeInTheDocument();
  });

  it('renders each habit card with label, status, and metrics', () => {
    render(<DriftVectorList vectors={mockVectors} />);

    expect(screen.getByText('Nightly Sleep')).toBeInTheDocument();
    expect(screen.getByText('Physical Exercise')).toBeInTheDocument();
    expect(screen.getByText('Digital Screen Time')).toBeInTheDocument();

    expect(screen.getByText('8.5 hrs')).toBeInTheDocument();
    expect(screen.getByText('Baseline: 6.5 hrs')).toBeInTheDocument();
    expect(screen.getByText('Target: 8 hrs')).toBeInTheDocument();

    expect(screen.getByText('Surpassing')).toBeInTheDocument();
    expect(screen.getByText('Aligned')).toBeInTheDocument();
    expect(screen.getByText('Drifting')).toBeInTheDocument();

    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(3);
  });
});
