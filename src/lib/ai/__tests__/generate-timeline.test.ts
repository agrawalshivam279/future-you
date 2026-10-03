import { generateTimelines, generateSingleTimeline } from '../generate-timeline';
import { useSettingsStore } from '@/stores/settings-store';
import { OnboardingData, AISettings } from '@/types';
import OpenAI from 'openai';

jest.mock('openai');

describe('generateTimeline Orchestrators', () => {
  const mockCreate = jest.fn();

  const mockOnboardingData: OnboardingData = {
    name: 'Jordan',
    age: 27,
    goals: {
      shortTerm: ['Finish certificate'],
      longTerm: ['Start studio'],
      dreamLife: 'Creative freedom with high energy',
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
      studyHoursPerWeek: 5,
      socialHoursPerWeek: 8,
      creativeHoursPerWeek: 4,
      wastedHoursPerWeek: 4,
    },
    money: {
      incomeRange: '$70k',
      savingsRate: 15,
      debtLevel: 'none',
      spendingHabits: 'Moderate',
      financialGoal: 'Autonomy',
    },
    skills: {
      currentSkills: ['Design', 'Coding'],
      learningGoals: ['3D Modeling'],
      careerField: 'Product Design',
      careerSatisfaction: 6,
      growthMindset: 8,
    },
    fearsAndValues: {
      biggestFears: ['Stagnation'],
      coreValues: ['Creativity', 'Freedom'],
      regrets: 'None',
      motivation: 'internal',
      riskTolerance: 7,
    },
  };

  const validDualTimelineJson = JSON.stringify({
    currentTimeline: [
      { year: 1, title: 'Routine Solidifies', description: 'Same routine continues.', mood: 'neutral', metrics: { satisfaction: 6 } },
      { year: 3, title: 'Plateau Settles In', description: 'Comfortable stagnation.', mood: 'negative', metrics: { satisfaction: 5 } },
      { year: 5, title: 'The Inertia Toll', description: 'Looking back at deferred dreams.', mood: 'negative', metrics: { satisfaction: 4 } },
    ],
    improvedTimeline: [
      { year: 1, title: 'First Traction', description: 'Daily creative hours pay off.', mood: 'positive', metrics: { satisfaction: 7 } },
      { year: 3, title: 'Studio Inception', description: 'First independent clients.', mood: 'positive', metrics: { satisfaction: 8 } },
      { year: 5, title: 'Creative Sovereignty', description: 'Thriving autonomous studio.', mood: 'positive', metrics: { satisfaction: 9 } },
    ],
  });

  const validSingleTimelineJson = JSON.stringify({
    timeline: [
      { year: 1, title: 'Habit Shift', description: 'New sleep and exercise schedule.', mood: 'positive', metrics: { energy: 'high' } },
      { year: 3, title: 'Compounded Health', description: 'Significant endurance gain.', mood: 'positive', metrics: { energy: 'peak' } },
      { year: 5, title: 'Lifelong Vitality', description: 'Peak physical condition.', mood: 'positive', metrics: { energy: 'steady' } },
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

  describe('generateTimelines', () => {
    it('generates dual timeline milestones with honesty disclaimer and token tracking', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: validDualTimelineJson } }],
        usage: {
          prompt_tokens: 150,
          completion_tokens: 350,
          total_tokens: 500,
        },
      });

      const progress: string[] = [];
      let tokenUsage: unknown = null;

      const result = await generateTimelines(mockOnboardingData, {
        currentSummary: 'Status quo engineer',
        improvedSummary: 'Compound studio founder',
        onProgress: (p) => progress.push(p),
        onTokenUsage: (u) => {
          tokenUsage = u;
        },
      });

      expect(result.currentTimeline).toHaveLength(3);
      expect(result.improvedTimeline).toHaveLength(3);
      expect(result.currentTimeline[0].year).toBe(1);
      expect(result.currentTimeline[1].year).toBe(3);
      expect(result.currentTimeline[2].year).toBe(5);
      expect(result.improvedTimeline[0].year).toBe(1);
      expect(progress.length).toBeGreaterThan(0);
      expect(tokenUsage).toEqual({
        promptTokens: 150,
        completionTokens: 350,
        totalTokens: 500,
      });

      const callArgs = mockCreate.mock.calls[0][0];
      const sys = callArgs.messages.find((m: { role: string }) => m.role === 'system');
      expect(sys.content).toContain('You are a reflection tool, not a prediction engine.');
    });

    it('throws error when AI settings are unconfigured', async () => {
      useSettingsStore.setState({ apiKey: '' });

      await expect(generateTimelines(mockOnboardingData)).rejects.toThrow(
        /AI provider is not configured/i
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('retries on malformed JSON and parses fallback gracefully', async () => {
      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: 'Not JSON' } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: validDualTimelineJson } }] });

      const result = await generateTimelines(mockOnboardingData, { maxRetries: 1 });
      expect(result.currentTimeline).toHaveLength(3);
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it('halts immediately on 401 Unauthorized without retrying', async () => {
      mockCreate.mockRejectedValueOnce(new Error('401 Unauthorized'));

      await expect(
        generateTimelines(mockOnboardingData, { maxRetries: 2 })
      ).rejects.toThrow(/Invalid API key/i);

      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it('halts immediately when AbortSignal is aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(
        generateTimelines(mockOnboardingData, { signal: controller.signal })
      ).rejects.toThrow(/Generation cancelled by user/i);

      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('generateSingleTimeline', () => {
    it('generates single path timeline milestones', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: validSingleTimelineJson } }],
      });

      const timeline = await generateSingleTimeline('improved', mockOnboardingData, {
        personaSummary: 'High energy health path',
      });

      expect(timeline).toHaveLength(3);
      expect(timeline[0].title).toBe('Habit Shift');
      expect(timeline[1].year).toBe(3);
      expect(timeline[2].year).toBe(5);
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it('supports customSettings parameter', async () => {
      const customSettings: AISettings = {
        provider: 'freellmapi',
        apiKey: '',
        baseURL: 'http://localhost:8000/v1',
        modelName: 'local-model',
      };

      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: validSingleTimelineJson } }],
      });

      const timeline = await generateSingleTimeline('current', mockOnboardingData, { customSettings });
      expect(timeline).toHaveLength(3);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'local-model' }),
        expect.anything()
      );
    });
  });
});
