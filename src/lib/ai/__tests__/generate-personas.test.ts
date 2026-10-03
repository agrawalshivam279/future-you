import { generatePersona, generatePersonas } from '../generate-personas';
import { useSettingsStore } from '@/stores/settings-store';
import { OnboardingData, AISettings } from '@/types';
import OpenAI from 'openai';

jest.mock('openai');

describe('generatePersonas Orchestrator', () => {
  const mockCreate = jest.fn();

  const mockOnboardingData: OnboardingData = {
    name: 'Taylor',
    age: 29,
    goals: {
      shortTerm: ['Ship project'],
      longTerm: ['Lead company'],
      dreamLife: 'Peaceful coastal living with deep creative work',
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
      creativeHoursPerWeek: 3,
      wastedHoursPerWeek: 4,
    },
    money: {
      incomeRange: '$80k',
      savingsRate: 20,
      debtLevel: 'none',
      spendingHabits: 'Mindful',
      financialGoal: 'Financial freedom',
    },
    skills: {
      currentSkills: ['TypeScript', 'Architecture'],
      learningGoals: ['AI', 'Leadership'],
      careerField: 'Technology',
      careerSatisfaction: 7,
      growthMindset: 8,
    },
    fearsAndValues: {
      biggestFears: ['Stagnation'],
      coreValues: ['Autonomy', 'Creativity'],
      regrets: 'Not moving faster',
      motivation: 'internal',
      riskTolerance: 6,
    },
  };

  const createPersonaJson = (id: 'current' | 'improved') =>
    JSON.stringify({
      name: `Taylor in 5 Years (${id === 'current' ? 'Current Path' : 'Improved Path'})`,
      age: 34,
      summary: `5-year ${id} simulation.`,
      personality: id === 'current' ? 'Pragmatic and reflective.' : 'Calm, focused, purposeful.',
      emotionalState: id === 'current' ? 'Quietly restless.' : 'Grounded vitality.',
      career: {
        title: id === 'current' ? 'Senior Engineer' : 'Principal Architect',
        companyOrContext: 'Tech Domain',
        satisfaction: id === 'current' ? 6 : 9,
        highlights: ['Shipped systems'],
        challenges: ['Friction'],
      },
      health: {
        physicalStatus: id === 'current' ? 'Moderate' : 'Resilient',
        sleepAverageHours: id === 'current' ? 7 : 8,
        energyLevel: id === 'current' ? 'Moderate' : 'High',
        habitsSummary: 'Standard routine',
      },
      finances: {
        savingsRate: id === 'current' ? 20 : 35,
        financialStatus: 'Comfortable',
        freedomLevel: id === 'current' ? 'Moderate' : 'High',
      },
      relationships: {
        status: 'Solid',
        socialCircle: 'Friends',
        satisfaction: id === 'current' ? 6 : 8,
      },
      skills: ['TypeScript'],
      achievements: ['Launched project'],
      struggles: ['Tradeoffs'],
      dailyRoutine: 'Typical day in the life.',
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

  describe('generatePersona', () => {
    it('generates a single persona with progress and token tracking', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: createPersonaJson('current') } }],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 400,
          total_tokens: 500,
        },
      });

      const progress: string[] = [];
      let tokenUsage: unknown = null;

      const persona = await generatePersona('current', mockOnboardingData, {
        onProgress: (p) => progress.push(p),
        onTokenUsage: (u) => {
          tokenUsage = u;
        },
      });

      expect(persona.id).toBe('current');
      expect(persona.name).toBe('Taylor in 5 Years (Current Path)');
      expect(progress.length).toBeGreaterThan(0);
      expect(tokenUsage).toEqual({
        promptTokens: 100,
        completionTokens: 400,
        totalTokens: 500,
      });

      const callArgs = mockCreate.mock.calls[0][0];
      const sys = callArgs.messages.find((m: { role: string }) => m.role === 'system');
      expect(sys.content).toContain('You are a reflection tool, not a prediction engine.');
    });

    it('throws error when unconfigured', async () => {
      useSettingsStore.setState({ apiKey: '' });

      await expect(generatePersona('current', mockOnboardingData)).rejects.toThrow(
        /AI provider is not configured/i
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('retries on malformed JSON and recovers', async () => {
      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: 'Bad JSON' } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: createPersonaJson('improved') } }] });

      const persona = await generatePersona('improved', mockOnboardingData, { maxRetries: 1 });
      expect(persona.id).toBe('improved');
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it('halts on 401 Unauthorized without retrying', async () => {
      mockCreate.mockRejectedValueOnce(new Error('401 Unauthorized'));

      await expect(
        generatePersona('current', mockOnboardingData, { maxRetries: 2 })
      ).rejects.toThrow(/Invalid API key/i);

      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it('halts on aborted signal', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(
        generatePersona('current', mockOnboardingData, { signal: controller.signal })
      ).rejects.toThrow(/Generation cancelled by user/i);

      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('generatePersonas', () => {
    it('generates both Current and Improved personas concurrently', async () => {
      mockCreate
        .mockResolvedValueOnce({
          choices: [{ message: { content: createPersonaJson('current') } }],
          usage: { prompt_tokens: 100, completion_tokens: 300, total_tokens: 400 },
        })
        .mockResolvedValueOnce({
          choices: [{ message: { content: createPersonaJson('improved') } }],
          usage: { prompt_tokens: 100, completion_tokens: 350, total_tokens: 450 },
        });

      const progressMap: Record<string, string[]> = { current: [], improved: [] };
      let lastTokenUsage: unknown = null;

      const result = await generatePersonas(mockOnboardingData, {
        onProgress: (pathId, status) => {
          progressMap[pathId].push(status);
        },
        onTokenUsage: (usage) => {
          lastTokenUsage = usage;
        },
      });

      expect(result.currentPath.id).toBe('current');
      expect(result.improvedPath.id).toBe('improved');
      expect(mockCreate).toHaveBeenCalledTimes(2);
      expect(progressMap.current.length).toBeGreaterThan(0);
      expect(progressMap.improved.length).toBeGreaterThan(0);
      expect(lastTokenUsage).toEqual({
        promptTokens: 200,
        completionTokens: 650,
        totalTokens: 850,
      });
    });

    it('supports customSettings parameter', async () => {
      const customSettings: AISettings = {
        provider: 'openai',
        apiKey: 'custom-key',
        baseURL: 'https://custom.api/v1',
        modelName: 'custom-gpt',
      };

      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: createPersonaJson('current') } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: createPersonaJson('improved') } }] });

      const result = await generatePersonas(mockOnboardingData, { customSettings });
      expect(result.currentPath).toBeDefined();
      expect(result.improvedPath).toBeDefined();
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'custom-gpt' }),
        expect.anything()
      );
    });
  });
});
