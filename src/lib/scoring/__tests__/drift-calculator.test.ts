import {
  frequencyToDays,
  computeProgress,
  determineStatus,
  calculateHabitDriftVectors,
  calculateOverallAlignmentScore,
  evaluateCheckInDrift,
} from '../drift-calculator';
import { CheckInLog, HabitLever } from '@/types';

const mockLog: CheckInLog = {
  id: 'test-log-1',
  loggedAt: '2026-10-06T00:00:00.000Z',
  sleepHours: 8.0,
  exerciseFrequency: 'daily',
  deepWorkHoursPerWeek: 35,
  screenTimeHoursPerDay: 2.0,
  savingsRatePercentage: 30,
};

describe('drift-calculator Mathematical Scoring Engine', () => {
  describe('frequencyToDays', () => {
    it('converts exercise frequency categories to standard weekly days', () => {
      expect(frequencyToDays('daily')).toBe(6);
      expect(frequencyToDays('weekly')).toBe(3);
      expect(frequencyToDays('rarely')).toBe(1);
      expect(frequencyToDays('never')).toBe(0);
    });
  });

  describe('computeProgress', () => {
    it('computes positive progress for standard (higher is better) metrics', () => {
      // Baseline 6, Target 8
      expect(computeProgress(6, 6, 8)).toBe(0);
      expect(computeProgress(7, 6, 8)).toBe(0.5);
      expect(computeProgress(8, 6, 8)).toBe(1);
      expect(computeProgress(9, 6, 8)).toBe(1.5);
      expect(computeProgress(5, 6, 8)).toBe(-0.5);
    });

    it('computes inverted progress for lower-is-better metrics (screen time)', () => {
      // Baseline 6, Target 2 (less is better)
      expect(computeProgress(6, 6, 2, true)).toBe(0);
      expect(computeProgress(4, 6, 2, true)).toBe(0.5);
      expect(computeProgress(2, 6, 2, true)).toBe(1);
      expect(computeProgress(1, 6, 2, true)).toBe(1.25);
      expect(computeProgress(8, 6, 2, true)).toBe(-0.5);
    });

    it('handles identical target and baseline without NaN', () => {
      expect(computeProgress(8, 8, 8, false)).toBe(1.0);
      expect(computeProgress(7, 8, 8, false)).toBe(0.0);
      expect(computeProgress(2, 2, 2, true)).toBe(1.0);
      expect(computeProgress(3, 2, 2, true)).toBe(0.0);
    });
  });

  describe('determineStatus', () => {
    it('accurately categorizes drift percentages into status tiers', () => {
      expect(determineStatus(120)).toBe('surpassing');
      expect(determineStatus(111)).toBe('surpassing');
      expect(determineStatus(100)).toBe('aligned');
      expect(determineStatus(75)).toBe('aligned');
      expect(determineStatus(74.9)).toBe('drifting_current');
      expect(determineStatus(0)).toBe('drifting_current');
      expect(determineStatus(-20)).toBe('drifting_current');
    });
  });

  describe('calculateHabitDriftVectors', () => {
    it('evaluates all 5 habit vectors accurately with target alignment', () => {
      const vectors = calculateHabitDriftVectors(mockLog);

      expect(vectors).toHaveLength(5);
      const habits = vectors.map((v) => v.habitId);
      expect(habits).toEqual([
        'sleep-hours',
        'exercise-frequency',
        'screen-time',
        'deep-work',
        'savings-rate',
      ]);

      // All metrics in mockLog hit or surpass targets
      vectors.forEach((v) => {
        expect(v.driftPercentage).toBeGreaterThanOrEqual(100);
        expect(['aligned', 'surpassing']).toContain(v.status);
      });
    });

    it('respects dynamic habit levers when supplied', () => {
      const customLevers: HabitLever[] = [
        {
          id: 'sleep-lever',
          label: 'Sleep',
          min: 5,
          max: 9.0, // custom target 9h instead of 8h
          step: 0.5,
          currentValue: 7,
          unit: 'hrs',
        },
      ];

      const vectors = calculateHabitDriftVectors(
        { ...mockLog, sleepHours: 8.0 },
        { habits: { sleepHours: 6.0, exerciseFrequency: 'weekly', screenTime: 4 } },
        customLevers
      );

      const sleepVector = vectors.find((v) => v.habitId === 'sleep-hours');
      expect(sleepVector?.targetValue).toBe(9.0);
      expect(sleepVector?.baselineValue).toBe(6.0);
      // (8 - 6) / (9 - 6) = 2/3 = 66.7%
      expect(sleepVector?.driftPercentage).toBeCloseTo(66.7, 1);
      expect(sleepVector?.status).toBe('drifting_current');
    });

    it('handles drifting habits when user metrics regress', () => {
      const regressedLog: CheckInLog = {
        id: 'regressed-log',
        loggedAt: '2026-10-06T00:00:00.000Z',
        sleepHours: 5.0,
        exerciseFrequency: 'never',
        deepWorkHoursPerWeek: 10,
        screenTimeHoursPerDay: 8.0,
        savingsRatePercentage: 0,
      };

      const vectors = calculateHabitDriftVectors(regressedLog);
      vectors.forEach((v) => {
        expect(v.driftPercentage).toBeLessThan(75);
        expect(v.status).toBe('drifting_current');
      });
    });
  });

  describe('calculateOverallAlignmentScore', () => {
    it('returns 100 for perfectly aligned or surpassing vectors', () => {
      const vectors = calculateHabitDriftVectors(mockLog);
      const score = calculateOverallAlignmentScore(vectors);
      expect(score).toBe(100);
    });

    it('clamps outlier over-performance to 100 per vector for fair composite scoring', () => {
      const vectors = [
        {
          habitId: 'habit-1',
          label: 'H1',
          baselineValue: 0,
          targetValue: 10,
          actualValue: 50,
          unit: 'u',
          driftPercentage: 500, // extreme overperformer
          status: 'surpassing' as const,
        },
        {
          habitId: 'habit-2',
          label: 'H2',
          baselineValue: 0,
          targetValue: 10,
          actualValue: 0,
          unit: 'u',
          driftPercentage: 0, // completely unaligned
          status: 'drifting_current' as const,
        },
      ];

      // Average of clamped [100, 0] should be 50, NOT (500 + 0) / 2 = 250!
      const score = calculateOverallAlignmentScore(vectors);
      expect(score).toBe(50);
    });

    it('returns 0 when vectors array is empty', () => {
      expect(calculateOverallAlignmentScore([])).toBe(0);
    });
  });

  describe('evaluateCheckInDrift', () => {
    it('evaluates and returns both alignment score and vectors together', () => {
      const result = evaluateCheckInDrift(mockLog);
      expect(result.alignmentScore).toBeGreaterThanOrEqual(0);
      expect(result.alignmentScore).toBeLessThanOrEqual(100);
      expect(result.driftVectors).toHaveLength(5);
    });
  });
});
