import { useCheckInStore } from '../check-in-store';
import { STORAGE_PREFIX } from '@/lib/constants';
import { CheckInLog, CheckInEvaluation } from '@/types';

const mockLogPayload: Omit<CheckInLog, 'id' | 'loggedAt'> = {
  sleepHours: 7.5,
  exerciseFrequency: 'weekly',
  deepWorkHoursPerWeek: 32,
  screenTimeHoursPerDay: 3.5,
  savingsRatePercentage: 25,
  notes: 'Solid focus, disciplined sleep schedule.',
};

const mockEvaluation: CheckInEvaluation = {
  logId: 'temp-id',
  evaluatedAt: new Date().toISOString(),
  overallAlignmentScore: 84,
  driftVectors: [
    {
      habitId: 'sleep-hours',
      label: 'Nightly Sleep',
      baselineValue: 6.5,
      targetValue: 8.0,
      actualValue: 7.5,
      unit: 'hrs',
      driftPercentage: 66.7,
      status: 'aligned',
    },
  ],
  futureSelfReflection: 'Consistent compounding in your rest is keeping your focus razor sharp.',
};

describe('useCheckInStore Zustand Store', () => {
  beforeEach(() => {
    localStorage.clear();
    useCheckInStore.getState().resetCheckInStore();
  });

  it('initializes with clean default values', () => {
    const state = useCheckInStore.getState();
    expect(state.logs).toEqual([]);
    expect(state.evaluations).toEqual({});
    expect(state.activeLogId).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('adds a new check-in log and sets it as activeLogId', () => {
    const created = useCheckInStore.getState().addLog(mockLogPayload);

    expect(created.id).toMatch(/^checkin-/);
    expect(created.loggedAt).toBeDefined();
    expect(created.sleepHours).toBe(7.5);
    expect(created.notes).toBe('Solid focus, disciplined sleep schedule.');

    const state = useCheckInStore.getState();
    expect(state.logs).toHaveLength(1);
    expect(state.logs[0].id).toBe(created.id);
    expect(state.activeLogId).toBe(created.id);
  });

  it('prepends newest logs to the front of the logs array', () => {
    const log1 = useCheckInStore.getState().addLog(mockLogPayload);
    const log2 = useCheckInStore.getState().addLog({
      ...mockLogPayload,
      sleepHours: 8.0,
    });

    const state = useCheckInStore.getState();
    expect(state.logs).toHaveLength(2);
    expect(state.logs[0].id).toBe(log2.id);
    expect(state.logs[1].id).toBe(log1.id);
    expect(state.getLatestLog()?.id).toBe(log2.id);
  });

  it('stores and retrieves evaluations keyed by logId', () => {
    const created = useCheckInStore.getState().addLog(mockLogPayload);
    const evaluation = { ...mockEvaluation, logId: created.id };

    useCheckInStore.getState().setEvaluation(created.id, evaluation);

    const retrieved = useCheckInStore.getState().getEvaluationForLog(created.id);
    expect(retrieved).toEqual(evaluation);
    expect(retrieved?.overallAlignmentScore).toBe(84);
  });

  it('deletes a log and cleans up its associated evaluation and activeLogId', () => {
    const created1 = useCheckInStore.getState().addLog(mockLogPayload);
    const created2 = useCheckInStore.getState().addLog({ ...mockLogPayload, sleepHours: 6.0 });

    useCheckInStore.getState().setEvaluation(created1.id, {
      ...mockEvaluation,
      logId: created1.id,
    });

    expect(useCheckInStore.getState().logs).toHaveLength(2);
    expect(useCheckInStore.getState().getEvaluationForLog(created1.id)).toBeDefined();

    // Delete created2 (currently active)
    useCheckInStore.getState().deleteLog(created2.id);

    const stateAfterDelete = useCheckInStore.getState();
    expect(stateAfterDelete.logs).toHaveLength(1);
    expect(stateAfterDelete.logs[0].id).toBe(created1.id);
    expect(stateAfterDelete.activeLogId).toBe(created1.id);

    // Delete created1
    useCheckInStore.getState().deleteLog(created1.id);
    expect(useCheckInStore.getState().logs).toHaveLength(0);
    expect(useCheckInStore.getState().activeLogId).toBeNull();
    expect(useCheckInStore.getState().getEvaluationForLog(created1.id)).toBeUndefined();
  });

  it('updates loading and error states', () => {
    useCheckInStore.getState().setLoading(true);
    expect(useCheckInStore.getState().isLoading).toBe(true);

    useCheckInStore.getState().setError('Failed to compute drift.');
    expect(useCheckInStore.getState().error).toBe('Failed to compute drift.');

    useCheckInStore.getState().setLoading(false);
    expect(useCheckInStore.getState().isLoading).toBe(false);
  });

  it('resets store back to clean initial state', () => {
    useCheckInStore.getState().addLog(mockLogPayload);
    useCheckInStore.getState().setError('Some error');
    useCheckInStore.getState().setLoading(true);

    useCheckInStore.getState().resetCheckInStore();

    const state = useCheckInStore.getState();
    expect(state.logs).toEqual([]);
    expect(state.evaluations).toEqual({});
    expect(state.activeLogId).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('persists store state locally under future-you:check-ins key', () => {
    useCheckInStore.getState().addLog(mockLogPayload);

    const raw = localStorage.getItem(`${STORAGE_PREFIX}check-ins`);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed.state.logs).toHaveLength(1);
    expect(parsed.state.logs[0].sleepHours).toBe(7.5);
  });
});
