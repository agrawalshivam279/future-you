import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckInSummaryCard } from '../check-in-summary-card';
import { useCheckInStore } from '@/stores/check-in-store';
import { CheckInLog, CheckInEvaluation } from '@/types';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockLog: Omit<CheckInLog, 'id' | 'loggedAt'> = {
  sleepHours: 8.0,
  exerciseFrequency: 'daily',
  deepWorkHoursPerWeek: 35,
  screenTimeHoursPerDay: 2.0,
  savingsRatePercentage: 30,
};

const mockEvaluation: CheckInEvaluation = {
  logId: 'placeholder',
  evaluatedAt: '2026-10-06T00:00:00.000Z',
  overallAlignmentScore: 88,
  driftVectors: [],
  futureSelfReflection: 'Great week.',
};

describe('CheckInSummaryCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCheckInStore.getState().resetCheckInStore();
  });

  it('renders empty checkpoint state when no logs exist', () => {
    render(<CheckInSummaryCard />);

    expect(screen.getByText('Check-in Mode')).toBeInTheDocument();
    expect(screen.getByText('Track Habit Trajectory Drift')).toBeInTheDocument();
    expect(screen.getByText('Track daily rhythms')).toBeInTheDocument();

    const ctaBtn = screen.getByRole('button', { name: /Open Trajectory Check-in/i });
    expect(ctaBtn).toHaveTextContent('Log Checkpoint');

    fireEvent.click(ctaBtn);
    expect(mockPush).toHaveBeenCalledWith('/check-in');
  });

  it('renders alignment score when evaluated log exists', () => {
    const added = useCheckInStore.getState().addLog(mockLog);
    useCheckInStore.getState().setEvaluation(added.id, {
      ...mockEvaluation,
      logId: added.id,
    });

    render(<CheckInSummaryCard />);

    expect(screen.getByText('88% Trajectory Alignment')).toBeInTheDocument();
    const ctaBtn = screen.getByRole('button', { name: /Open Trajectory Check-in/i });
    expect(ctaBtn).toHaveTextContent('View Alignment');

    fireEvent.click(ctaBtn);
    expect(mockPush).toHaveBeenCalledWith('/check-in');
  });

  it('invokes custom onNavigate callback if provided', () => {
    const onNavigate = jest.fn();
    render(<CheckInSummaryCard onNavigate={onNavigate} />);

    const ctaBtn = screen.getByRole('button', { name: /Open Trajectory Check-in/i });
    fireEvent.click(ctaBtn);

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
