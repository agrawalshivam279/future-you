import {
  evaluateAndGenerateCheckInFeedback,
  generateDeterministicReflection,
} from '../check-in-feedback';
import { useSettingsStore } from '@/stores/settings-store';
import { useCheckInStore } from '@/stores/check-in-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useLifeModelStore } from '@/stores/life-model-store';
import { CheckInLog } from '@/types';
import OpenAI from 'openai';

jest.mock('openai');

describe('check-in-feedback Orchestrator', () => {
  const mockCreate = jest.fn();

  const mockLog: CheckInLog = {
    id: 'log-ai-feedback-1',
    loggedAt: '2026-10-06T00:00:00.000Z',
    sleepHours: 8.0,
    exerciseFrequency: 'daily',
    deepWorkHoursPerWeek: 35,
    screenTimeHoursPerDay: 2.0,
    savingsRatePercentage: 30,
    notes: 'Protected my morning deep work sessions cleanly.',
  };

  const sampleJsonResponse = JSON.stringify({
    futureSelfReflection:
      'Looking across these past 5 years, this was the exact week where momentum started feeling natural.',
    recommendedAdjustment: 'Keep the morning phone quarantine intact.',
    encouragement: 'Quiet discipline is already reshaping your reality.',
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useSettingsStore.getState().resetSettings();
    useCheckInStore.getState().resetCheckInStore();
    useOnboardingStore.getState().resetOnboarding();
    useLifeModelStore.getState().resetLifeModel();

    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));
  });

  describe('generateDeterministicReflection', () => {
    it('generates high-alignment reflections for scores >= 80', () => {
      const note = generateDeterministicReflection(85);
      expect(note).toContain('holding your trajectory with remarkable steadiness');
      expect(note).toContain('Micro-adjustment:');
    });

    it('generates mid-alignment recalibration reflections for scores 50-79', () => {
      const note = generateDeterministicReflection(60);
      expect(note).toContain('Progress is rarely a straight diagonal');
      expect(note).toContain('Micro-adjustment:');
    });

    it('generates compassionate recovery reflections for scores < 50', () => {
      const note = generateDeterministicReflection(35);
      expect(note).toContain('heavy friction and cognitive drag');
      expect(note).toContain('Be kind to yourself today');
    });
  });

  describe('evaluateAndGenerateCheckInFeedback fallback mode', () => {
    it('evaluates drift and returns cached evaluation without calling LLM', async () => {
      const onProgress = jest.fn();
      const evaluation = await evaluateAndGenerateCheckInFeedback(mockLog, {
        fallbackOnly: true,
        onProgress,
      });

      expect(mockCreate).not.toHaveBeenCalled();
      expect(evaluation.logId).toBe(mockLog.id);
      expect(evaluation.overallAlignmentScore).toBeGreaterThanOrEqual(0);
      expect(evaluation.driftVectors).toHaveLength(5);
      expect(evaluation.futureSelfReflection).toContain('Micro-adjustment:');

      // Verify cached in store
      const cached = useCheckInStore.getState().getEvaluationForLog(mockLog.id);
      expect(cached).toBeDefined();
      expect(cached?.overallAlignmentScore).toBe(evaluation.overallAlignmentScore);
      expect(onProgress).toHaveBeenCalledWith(expect.stringContaining('Evaluating habit drift'));
    });
  });

  describe('evaluateAndGenerateCheckInFeedback LLM execution', () => {
    it('throws error when AI provider is not configured', async () => {
      useSettingsStore.getState().setApiKey('');

      await expect(evaluateAndGenerateCheckInFeedback(mockLog)).rejects.toThrow(
        'AI provider is not configured. Please add an API key in Settings.'
      );
    });

    it('successfully calls LLM, records tokens, formats reflection, and persists evaluation', async () => {
      useSettingsStore.getState().setApiKey('mock-key-123');

      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: sampleJsonResponse } }],
        usage: { prompt_tokens: 300, completion_tokens: 150, total_tokens: 450 },
      });

      const onProgress = jest.fn();
      const onTokenUsage = jest.fn();

      const evaluation = await evaluateAndGenerateCheckInFeedback(mockLog, {
        onProgress,
        onTokenUsage,
      });

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(onProgress).toHaveBeenCalledWith(expect.stringContaining('Synthesizing Future Self reflection'));
      expect(onTokenUsage).toHaveBeenCalledWith({
        promptTokens: 300,
        completionTokens: 150,
        totalTokens: 450,
      });

      expect(evaluation.logId).toBe(mockLog.id);
      expect(evaluation.overallAlignmentScore).toBe(100);
      expect(evaluation.futureSelfReflection).toContain('momentum started feeling natural');
      expect(evaluation.futureSelfReflection).toContain('Micro-adjustment: Keep the morning phone quarantine intact.');
      expect(evaluation.futureSelfReflection).toContain('Quiet discipline is already reshaping your reality.');

      // Check store persistence
      const stored = useCheckInStore.getState().getEvaluationForLog(mockLog.id);
      expect(stored).toEqual(evaluation);
    });

    it('handles cancellation via AbortSignal', async () => {
      useSettingsStore.getState().setApiKey('mock-key-123');
      const abortController = new AbortController();
      abortController.abort();

      await expect(
        evaluateAndGenerateCheckInFeedback(mockLog, { signal: abortController.signal })
      ).rejects.toThrow('Check-in reflection generation was cancelled by user.');
    });
  });
});
