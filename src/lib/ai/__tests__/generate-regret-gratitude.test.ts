import { generateRegretGratitude, generateDualRegretGratitude } from '../generate-regret-gratitude';
import { useSettingsStore } from '@/stores/settings-store';
import { OnboardingData, AISettings } from '@/types';
import OpenAI from 'openai';

jest.mock('openai');

describe('generateRegretGratitude Orchestrators', () => {
  const mockCreate = jest.fn();

  const mockOnboardingData: OnboardingData = {
    name: 'Morgan',
    age: 26,
    goals: {
      shortTerm: ['Ship project'],
      longTerm: ['Build creative company'],
      dreamLife: 'High autonomy and deep relationships',
    },
    habits: {
      sleepHours: 7,
      exerciseFrequency: 'weekly',
      dietQuality: 'good',
      screenTime: 4,
      meditationOrReflection: true,
    },
    time: {
      workHoursPerWeek: 40,
      studyHoursPerWeek: 6,
      socialHoursPerWeek: 8,
      creativeHoursPerWeek: 4,
      wastedHoursPerWeek: 4,
    },
    money: {
      incomeRange: '$85k',
      savingsRate: 20,
      debtLevel: 'none',
      spendingHabits: 'Conscious',
      financialGoal: 'Sovereignty',
    },
    skills: {
      currentSkills: ['TypeScript', 'Design'],
      learningGoals: ['AI Systems'],
      careerField: 'Software Engineering',
      careerSatisfaction: 7,
      growthMindset: 8,
    },
    fearsAndValues: {
      biggestFears: ['Stagnation'],
      coreValues: ['Autonomy', 'Mastery'],
      regrets: 'None',
      motivation: 'internal',
      riskTolerance: 6,
    },
  };

  const sampleCurrentReflectionsJson = JSON.stringify({
    regrets: [
      'Waiting years before launching my independent ideas.',
      'Trading late evening hours for endless feeds.',
    ],
    gratitudes: [
      'Keeping our physical baseline healthy.',
      'Staying connected with close friends.',
    ],
  });

  const sampleImprovedReflectionsJson = JSON.stringify({
    regrets: [
      'Being overly anxious about speed during Year 1.',
    ],
    gratitudes: [
      'Protecting our morning deep work routine.',
      'Saying no to toxic distractions.',
      'Believing in quiet, compound consistency.',
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    useSettingsStore.setState({
      provider: 'openai',
      apiKey: 'sk-test-valid-key',
      baseURL: 'https://api.openai.com/v1',
      modelName: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4096,
    });
  });

  describe('generateRegretGratitude', () => {
    it('generates structured regrets and gratitudes with disclaimer and token tracking', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: sampleCurrentReflectionsJson } }],
        usage: {
          prompt_tokens: 110,
          completion_tokens: 150,
          total_tokens: 260,
        },
      });

      const progress: string[] = [];
      let tokenUsage: unknown = null;

      const result = await generateRegretGratitude('current', mockOnboardingData, {
        onProgress: (p) => progress.push(p),
        onTokenUsage: (u) => {
          tokenUsage = u;
        },
      });

      expect(result.regrets).toHaveLength(2);
      expect(result.gratitudes).toHaveLength(2);
      expect(progress.length).toBeGreaterThan(0);
      expect(tokenUsage).toEqual({
        promptTokens: 110,
        completionTokens: 150,
        totalTokens: 260,
      });

      const callArgs = mockCreate.mock.calls[0][0];
      const sys = callArgs.messages.find((m: { role: string }) => m.role === 'system');
      expect(sys.content).toContain('CRITICAL INVARIANT: You are a reflection tool, not a prediction engine.');
    });

    it('throws error when settings are unconfigured', async () => {
      useSettingsStore.setState({ apiKey: '' });

      await expect(generateRegretGratitude('current', mockOnboardingData)).rejects.toThrow(
        /AI provider is not configured/i
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('retries on malformed JSON and parses valid output on next attempt', async () => {
      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: 'Not JSON' } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: sampleImprovedReflectionsJson } }] });

      const result = await generateRegretGratitude('improved', mockOnboardingData, { maxRetries: 1 });
      expect(result.gratitudes).toHaveLength(3);
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it('halts immediately on 401 Unauthorized without retrying', async () => {
      mockCreate.mockRejectedValueOnce(new Error('401 Unauthorized'));

      await expect(
        generateRegretGratitude('current', mockOnboardingData, { maxRetries: 2 })
      ).rejects.toThrow(/Invalid API key/i);

      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it('halts immediately when AbortSignal is cancelled', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(
        generateRegretGratitude('current', mockOnboardingData, { signal: controller.signal })
      ).rejects.toThrow(/Generation cancelled by user/i);

      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('generateDualRegretGratitude', () => {
    it('generates reflections for both paths concurrently', async () => {
      mockCreate
        .mockResolvedValueOnce({
          choices: [{ message: { content: sampleCurrentReflectionsJson } }],
          usage: { prompt_tokens: 100, completion_tokens: 100, total_tokens: 200 },
        })
        .mockResolvedValueOnce({
          choices: [{ message: { content: sampleImprovedReflectionsJson } }],
          usage: { prompt_tokens: 100, completion_tokens: 120, total_tokens: 220 },
        });

      let totalReported: unknown = null;

      const result = await generateDualRegretGratitude(mockOnboardingData, {
        onTokenUsage: (u) => {
          totalReported = u;
        },
      });

      expect(result.current.regrets).toHaveLength(2);
      expect(result.improved.gratitudes).toHaveLength(3);
      expect(mockCreate).toHaveBeenCalledTimes(2);
      expect(totalReported).toEqual({
        promptTokens: 200,
        completionTokens: 220,
        totalTokens: 420,
      });
    });

    it('supports customSettings parameter', async () => {
      const customSettings: AISettings = {
        provider: 'freellmapi',
        apiKey: '',
        baseURL: 'http://localhost:8000/v1',
        modelName: 'llama-3.1',
      };

      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: sampleCurrentReflectionsJson } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: sampleImprovedReflectionsJson } }] });

      const result = await generateDualRegretGratitude(mockOnboardingData, { customSettings });
      expect(result.current).toBeDefined();
      expect(result.improved).toBeDefined();
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'llama-3.1' }),
        expect.anything()
      );
    });
  });
});
