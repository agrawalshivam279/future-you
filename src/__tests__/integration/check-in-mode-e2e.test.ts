import { useCheckInStore } from '@/stores/check-in-store';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useSettingsStore } from '@/stores/settings-store';
import {
  evaluateCheckInDrift,
  calculateHabitDriftVectors,
  calculateOverallAlignmentScore,
  computeProgress,
  frequencyToDays,
} from '@/lib/scoring';
import {
  buildCheckInReflectionSystemPrompt,
  parseCheckInReflectionResponse,
} from '@/lib/prompts/check-in-reflection';
import { evaluateAndGenerateCheckInFeedback } from '@/lib/ai/check-in-feedback';
import { deleteAllLocalData } from '@/lib/storage/data-manager';
import { mockLifeModel } from '@/app/dashboard/__tests__/fixtures';
import { CheckInLog } from '@/types';
import { STORAGE_PREFIX } from '@/lib/constants';

describe('Phase 16: Check-in Mode Integration & Invariants E2E Suite', () => {
  const sampleLog: Omit<CheckInLog, 'id' | 'loggedAt'> = {
    sleepHours: 7.5,
    exerciseFrequency: 'weekly',
    deepWorkHoursPerWeek: 28,
    screenTimeHoursPerDay: 3.0,
    savingsRatePercentage: 22,
    notes: 'Kept consistent sleep rhythms all week.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCheckInStore.getState().resetCheckInStore();
    useLifeModelStore.getState().resetLifeModel();
    useOnboardingStore.getState().resetOnboarding();
    useSettingsStore.getState().resetSettings();
    localStorage.clear();
  });

  describe('1. Mathematical Scoring Engine & Edge Case Invariants', () => {
    it('accurately computes standard and inverted progress polarity', () => {
      // Standard metric (Sleep: Baseline 6h, Target 8h)
      expect(computeProgress(7, 6, 8)).toBe(0.5);
      expect(computeProgress(8, 6, 8)).toBe(1.0);
      expect(computeProgress(5, 6, 8)).toBe(-0.5);

      // Inverted metric (Screen time: Baseline 6h, Target 2h -> less is better)
      expect(computeProgress(4, 6, 2, true)).toBe(0.5);
      expect(computeProgress(2, 6, 2, true)).toBe(1.0);
      expect(computeProgress(7, 6, 2, true)).toBe(-0.25);
    });

    it('safeguards against zero-denominators when target equals baseline', () => {
      expect(computeProgress(8, 8, 8, false)).toBe(1.0);
      expect(computeProgress(6, 8, 8, false)).toBe(0.0);
      expect(computeProgress(2, 2, 2, true)).toBe(1.0);
      expect(computeProgress(5, 2, 2, true)).toBe(0.0);
    });

    it('maps categorical exercise frequencies to standard weekly days', () => {
      expect(frequencyToDays('daily')).toBe(6);
      expect(frequencyToDays('weekly')).toBe(3);
      expect(frequencyToDays('rarely')).toBe(1);
      expect(frequencyToDays('never')).toBe(0);
    });

    it('clamps individual vector contributions to [0, 100] for composite scoring', () => {
      const vectors = [
        {
          habitId: 'habit-1',
          label: 'H1',
          baselineValue: 0,
          targetValue: 10,
          actualValue: 60,
          unit: 'u',
          driftPercentage: 600, // extreme overperformance
          status: 'surpassing' as const,
        },
        {
          habitId: 'habit-2',
          label: 'H2',
          baselineValue: 0,
          targetValue: 10,
          actualValue: 0,
          unit: 'u',
          driftPercentage: -50, // severe regression
          status: 'drifting_current' as const,
        },
      ];

      // Average of clamped [100, 0] must be exactly 50
      expect(calculateOverallAlignmentScore(vectors)).toBe(50);
    });
  });

  describe('2. AI System Prompt & Reflection Disclaimer Invariant', () => {
    it('mandatorily contains the exact reflection disclaimer in system prompt', () => {
      const systemPrompt = buildCheckInReflectionSystemPrompt();
      expect(systemPrompt).toContain('You are a reflection tool, not a prediction engine');
    });

    it('enforces 5-year Improved Path tone without toxic positivity', () => {
      const systemPrompt = buildCheckInReflectionSystemPrompt();
      expect(systemPrompt).toContain('Future Self (Improved Path, 5 years ahead)');
      expect(systemPrompt).toContain('Anti-Toxic Positivity');
    });

    it('parses structured JSON responses into reflection result', () => {
      const rawJson = JSON.stringify({
        futureSelfReflection: 'You held the line this week on sleep.',
        recommendedAdjustment: 'Keep protecting your evening routine.',
        encouragement: 'Every compound habit matters.',
      });
      const parsed = parseCheckInReflectionResponse(rawJson);
      expect(parsed.futureSelfReflection).toBe('You held the line this week on sleep.');
      expect(parsed.recommendedAdjustment).toBe('Keep protecting your evening routine.');
      expect(parsed.encouragement).toBe('Every compound habit matters.');
    });
  });

  describe('3. End-to-End Checkpoint Logging, Evaluation & Persistence', () => {
    it('executes full evaluation flow and persists under future-you:check-ins', async () => {
      useLifeModelStore.getState().setLifeModel(mockLifeModel);

      // Add new log to store
      const createdLog = useCheckInStore.getState().addLog(sampleLog);
      expect(createdLog.id).toMatch(/^checkin-/);
      expect(useCheckInStore.getState().logs).toHaveLength(1);

      // Evaluate drift and generate feedback in deterministic fallback mode
      const evaluation = await evaluateAndGenerateCheckInFeedback(createdLog, {
        fallbackOnly: true,
      });

      expect(evaluation.logId).toBe(createdLog.id);
      expect(evaluation.overallAlignmentScore).toBeGreaterThanOrEqual(0);
      expect(evaluation.overallAlignmentScore).toBeLessThanOrEqual(100);
      expect(evaluation.driftVectors).toHaveLength(5);
      expect(evaluation.futureSelfReflection).toContain('Micro-adjustment:');

      // Verify cached in store
      const cached = useCheckInStore.getState().getEvaluationForLog(createdLog.id);
      expect(cached).toEqual(evaluation);
    });
  });

  describe('4. Privacy & Single-Click Data Purge Invariant', () => {
    it('clears all check-in logs and cached evaluations on deleteAllLocalData', async () => {
      const log = useCheckInStore.getState().addLog(sampleLog);
      const evalResult = {
        logId: log.id,
        evaluatedAt: new Date().toISOString(),
        overallAlignmentScore: 85,
        driftVectors: [],
        futureSelfReflection: 'Testing reflection note',
      };
      useCheckInStore.getState().setEvaluation(log.id, evalResult);

      expect(useCheckInStore.getState().logs).toHaveLength(1);
      expect(Object.keys(useCheckInStore.getState().evaluations)).toHaveLength(1);

      // Trigger full privacy purge
      await deleteAllLocalData();

      expect(useCheckInStore.getState().logs).toHaveLength(0);
      expect(Object.keys(useCheckInStore.getState().evaluations)).toHaveLength(0);
      expect(useCheckInStore.getState().activeLogId).toBeNull();
    });
  });

  describe('5. Phase 16 Exit Criteria Verification', () => {
    it('calculates alignment score and drift vectors instantaneously (< 50ms)', () => {
      const start = performance.now();
      const result = evaluateCheckInDrift(
        { ...sampleLog, id: 'perf-test', loggedAt: new Date().toISOString() },
        { habits: { sleepHours: 6.5, exerciseFrequency: 'rarely', screenTime: 5.0 } }
      );
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(50);
      expect(result.alignmentScore).toBeGreaterThanOrEqual(0);
      expect(result.driftVectors).toHaveLength(5);
    });
  });
});
