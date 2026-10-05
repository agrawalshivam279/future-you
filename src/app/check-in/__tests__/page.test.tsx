import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CheckInPage from '../page';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useCheckInStore } from '@/stores/check-in-store';
import { useSettingsStore } from '@/stores/settings-store';
import { mockLifeModel } from '@/app/dashboard/__tests__/fixtures';
import { ToastProvider } from '@/components/ui/toast';
import { CheckInLog, CheckInEvaluation } from '@/types';
import { evaluateAndGenerateCheckInFeedback } from '@/lib/ai/check-in-feedback';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/lib/ai/check-in-feedback', () => ({
  evaluateAndGenerateCheckInFeedback: jest.fn(),
}));

const mockLog: Omit<CheckInLog, 'id' | 'loggedAt'> = {
  sleepHours: 8.0,
  exerciseFrequency: 'daily',
  deepWorkHoursPerWeek: 35,
  screenTimeHoursPerDay: 2.0,
  savingsRatePercentage: 30,
  notes: 'Very clean week.',
};

const mockEvaluation: CheckInEvaluation = {
  logId: 'placeholder',
  evaluatedAt: '2026-10-06T00:00:00.000Z',
  overallAlignmentScore: 95,
  driftVectors: [
    {
      habitId: 'sleep-hours',
      label: 'Nightly Sleep',
      baselineValue: 6.5,
      targetValue: 8.0,
      actualValue: 8.0,
      unit: 'hrs',
      driftPercentage: 100,
      status: 'aligned',
    },
  ],
  futureSelfReflection: 'Great work maintaining sleep alignment this week.',
};

function renderWithProviders(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe('CheckInPage Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLifeModelStore.getState().resetLifeModel();
    useCheckInStore.getState().resetCheckInStore();
    useSettingsStore.getState().resetSettings();
  });

  it('renders onboarding guard when life model is absent', () => {
    renderWithProviders(<CheckInPage />);

    expect(screen.getByTestId('empty-checkin-guard')).toBeInTheDocument();
    expect(screen.getByText('No Future Models Found')).toBeInTheDocument();

    const startBtn = screen.getByRole('button', { name: /Start onboarding/i });
    fireEvent.click(startBtn);
    expect(mockPush).toHaveBeenCalledWith('/onboarding');
  });

  it('renders CheckInForm when model exists but no logs exist yet', () => {
    useLifeModelStore.getState().setLifeModel(mockLifeModel);

    renderWithProviders(<CheckInPage />);

    expect(screen.getByText('Trajectory Check-in')).toBeInTheDocument();
    expect(screen.getByText('Record Habit Checkpoint')).toBeInTheDocument();
  });

  it('renders active evaluation overview and historical card when logs exist', () => {
    useLifeModelStore.getState().setLifeModel(mockLifeModel);
    const added = useCheckInStore.getState().addLog(mockLog);
    useCheckInStore.getState().setEvaluation(added.id, {
      ...mockEvaluation,
      logId: added.id,
    });

    renderWithProviders(<CheckInPage />);

    expect(screen.getByText('Trajectory Check-in')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
    expect(screen.getByText(/Great work maintaining sleep alignment/i)).toBeInTheDocument();
    expect(screen.getByText('Habit Vector Analysis')).toBeInTheDocument();
    expect(screen.getByText('Check-in History & Streaks')).toBeInTheDocument();
  });

  it('toggles recording mode when clicking Record Checkpoint button and can cancel', () => {
    useLifeModelStore.getState().setLifeModel(mockLifeModel);
    const added = useCheckInStore.getState().addLog(mockLog);
    useCheckInStore.getState().setEvaluation(added.id, {
      ...mockEvaluation,
      logId: added.id,
    });

    renderWithProviders(<CheckInPage />);

    const recordBtn = screen.getByRole('button', { name: /Record New Checkpoint/i });
    fireEvent.click(recordBtn);

    expect(screen.getByText('Record Habit Checkpoint')).toBeInTheDocument();

    const cancelBtn = screen.getByText(/Cancel and view latest checkpoint/i);
    fireEvent.click(cancelBtn);

    expect(screen.getByText('Habit Vector Analysis')).toBeInTheDocument();
  });

  it('submits a new check-in and evaluates drift', async () => {
    useLifeModelStore.getState().setLifeModel(mockLifeModel);
    (evaluateAndGenerateCheckInFeedback as jest.Mock).mockResolvedValueOnce(mockEvaluation);

    renderWithProviders(<CheckInPage />);

    const submitBtn = screen.getByRole('button', { name: /Evaluate Checkpoint/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(evaluateAndGenerateCheckInFeedback).toHaveBeenCalled();
  });
});
