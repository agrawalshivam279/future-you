import { generateLifeModel } from '../generate-life-model';
import { useSettingsStore } from '@/stores/settings-store';
import { OnboardingData, AISettings } from '@/types';
import OpenAI from 'openai';

jest.mock('openai');

describe('generateLifeModel Orchestrator', () => {
  const mockCreate = jest.fn();

  const mockOnboardingData: OnboardingData = {
    name: 'Alex',
    age: 30,
    goals: {
      shortTerm: ['Ship MVP', 'Run 5k'],
      longTerm: ['Lead an engineering team', 'Financial independence'],
      dreamLife: 'Running a serene remote studio and living healthily',
    },
    habits: {
      sleepHours: 7,
      exerciseFrequency: 'weekly',
      dietQuality: 'good',
      screenTime: 5,
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
      incomeRange: '$75k-$100k',
      savingsRate: 20,
      debtLevel: 'none',
      spendingHabits: 'Disciplined',
      financialGoal: 'Long-term freedom',
    },
    skills: {
      currentSkills: ['TypeScript', 'System Design'],
      learningGoals: ['AI Agents', 'Distributed Systems'],
      careerField: 'Software Engineering',
      careerSatisfaction: 7,
      growthMindset: 8,
    },
    fearsAndValues: {
      biggestFears: ['Stagnation', 'Burnout'],
      coreValues: ['Autonomy', 'Mastery'],
      regrets: 'Not starting earlier',
      motivation: 'internal',
      riskTolerance: 6,
    },
  };

  const validJsonResponse = JSON.stringify({
    currentPath: {
      name: 'Alex in 5 Years (Current Path)',
      age: 35,
      summary: 'A stable but slightly stagnant software developer.',
      personality: 'Pragmatic, somewhat fatigued, reflective.',
      emotionalState: 'Mild contentment with background restless inertia.',
      career: {
        title: 'Senior Software Engineer',
        companyOrContext: 'Same enterprise codebase',
        satisfaction: 5,
        highlights: ['Shipped several feature flags'],
        challenges: ['Limited architectural ownership'],
      },
      health: {
        physicalStatus: 'Fair',
        sleepAverageHours: 6.5,
        energyLevel: 'Medium-low',
        habitsSummary: 'Irregular gym visits',
      },
      finances: {
        savingsRate: 20,
        financialStatus: 'Comfortable cushion',
        freedomLevel: 'Moderate',
      },
      relationships: {
        status: 'Solid core friendships',
        socialCircle: 'Work colleagues and old friends',
        satisfaction: 6,
      },
      skills: ['TypeScript', 'React'],
      achievements: ['Maintained production SLAs'],
      struggles: ['Procrastination on new frameworks'],
      dailyRoutine: 'Wake up, scroll notifications, 8 hours of sprint tickets.',
    },
    improvedPath: {
      name: 'Alex in 5 Years (Improved Path)',
      age: 35,
      summary: 'A thriving engineering leader and autonomous creator.',
      personality: 'Calm, intentional, energetic, purpose-driven.',
      emotionalState: 'Grounded vitality and deep fulfillment.',
      career: {
        title: 'Principal Architect & Founder',
        companyOrContext: 'Modern tech lab',
        satisfaction: 9,
        highlights: ['Launched open-source runtime with 10k stars'],
        challenges: ['Balancing delegation with technical focus'],
      },
      health: {
        physicalStatus: 'Peak physical condition',
        sleepAverageHours: 8,
        energyLevel: 'Consistently high',
        habitsSummary: 'Daily morning kettlebells and whole foods',
      },
      finances: {
        savingsRate: 40,
        financialStatus: 'Compounding portfolio and passive revenue',
        freedomLevel: 'High autonomy',
      },
      relationships: {
        status: 'Deep, reciprocal relationships',
        socialCircle: 'Curated peer masterminds and loved ones',
        satisfaction: 9,
      },
      skills: ['Agentic AI', 'Systems Architecture', 'Public Speaking'],
      achievements: ['Delivered keynote', 'Built debt-free business'],
      struggles: ['Guarding personal downtime against incoming demands'],
      dailyRoutine: 'Morning deep work, midday run, mentorship and strategy.',
    },
    habitLevers: [
      { id: 'sleep-hours', label: 'Nightly Sleep', min: 4, max: 12, step: 0.5, currentValue: 8, unit: 'hrs' },
      { id: 'study-hours', label: 'Weekly Study', min: 0, max: 40, step: 1, currentValue: 10, unit: 'hrs/wk' },
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

    // Configure store with default working settings
    useSettingsStore.setState({
      provider: 'openai',
      apiKey: 'sk-test-valid-key',
      baseURL: 'https://api.openai.com/v1',
      modelName: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4096,
    });
  });

  it('successfully generates and parses a LifeModel from LLM completion', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: validJsonResponse } }],
      usage: {
        prompt_tokens: 250,
        completion_tokens: 800,
        total_tokens: 1050,
      },
    });

    const progressReports: string[] = [];
    let tokenUsageReported: unknown = null;

    const result = await generateLifeModel(mockOnboardingData, {
      onProgress: (msg) => progressReports.push(msg),
      onTokenUsage: (usage) => {
        tokenUsageReported = usage;
      },
    });

    expect(result).toBeDefined();
    expect(result.currentPath.name).toBe('Alex in 5 Years (Current Path)');
    expect(result.currentPath.age).toBe(35);
    expect(result.improvedPath.name).toBe('Alex in 5 Years (Improved Path)');
    expect(result.improvedPath.career.title).toBe('Principal Architect & Founder');
    expect(result.habitLevers).toHaveLength(2);
    expect(result.inputs).toEqual(mockOnboardingData);

    expect(progressReports.length).toBeGreaterThan(0);
    expect(tokenUsageReported).toEqual({
      promptTokens: 250,
      completionTokens: 800,
      totalTokens: 1050,
    });

    // Check system prompt contains the mandatory honesty disclaimer
    expect(mockCreate).toHaveBeenCalledTimes(1);
    const callArgs = mockCreate.mock.calls[0][0];
    const systemMsg = callArgs.messages.find((m: { role: string }) => m.role === 'system');
    expect(systemMsg.content).toContain('You are a reflection tool, not a prediction engine.');
  });

  it('throws an error if AI settings are unconfigured', async () => {
    useSettingsStore.setState({
      provider: 'openai',
      apiKey: '',
    });

    await expect(generateLifeModel(mockOnboardingData)).rejects.toThrow(
      /AI provider is not configured/i
    );
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('allows freellmapi provider without an API key', async () => {
    useSettingsStore.setState({
      provider: 'freellmapi',
      apiKey: '',
      baseURL: 'http://localhost:8000/v1',
      modelName: 'llama-3.1-70b',
    });

    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: validJsonResponse } }],
    });

    const result = await generateLifeModel(mockOnboardingData);
    expect(result).toBeDefined();
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('supports customSettings parameter overriding the store', async () => {
    const customSettings: AISettings = {
      provider: 'openrouter',
      apiKey: 'sk-or-custom-key',
      baseURL: 'https://openrouter.ai/api/v1',
      modelName: 'anthropic/claude-3.5-sonnet',
      temperature: 0.5,
      maxTokens: 3000,
    };

    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: validJsonResponse } }],
    });

    const result = await generateLifeModel(mockOnboardingData, { customSettings });
    expect(result).toBeDefined();
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'anthropic/claude-3.5-sonnet',
        temperature: 0.5,
        max_tokens: 3000,
      }),
      expect.anything()
    );
  });

  it('retries on parse error and succeeds on subsequent attempt', async () => {
    // Attempt 1: Malformed JSON
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'Sorry, I am an AI and cannot help.' } }],
    });
    // Attempt 2: Valid JSON
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: validJsonResponse } }],
    });

    const progressReports: string[] = [];

    const result = await generateLifeModel(mockOnboardingData, {
      maxRetries: 1,
      onProgress: (msg) => progressReports.push(msg),
    });

    expect(result).toBeDefined();
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(progressReports.some((msg) => msg.includes('Retrying'))).toBe(true);
  });

  it('throws error when maxRetries are exhausted on malformed output', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Not valid json at all' } }],
    });

    await expect(
      generateLifeModel(mockOnboardingData, { maxRetries: 1 })
    ).rejects.toThrow(/Failed to parse LLM LifeModel response as JSON/i);

    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('does NOT retry non-retryable 401 Unauthorized errors', async () => {
    mockCreate.mockRejectedValue(new Error('401 Unauthorized: Invalid API key provided'));

    await expect(
      generateLifeModel(mockOnboardingData, { maxRetries: 2 })
    ).rejects.toThrow(/Invalid API key. Please check your credentials/i);

    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('does NOT retry when AbortSignal is cancelled', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      generateLifeModel(mockOnboardingData, { signal: controller.signal })
    ).rejects.toThrow(/Generation cancelled by user/i);

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('handles empty response string from provider with retry', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '   ' } }],
    });
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: validJsonResponse } }],
    });

    const result = await generateLifeModel(mockOnboardingData, { maxRetries: 1 });
    expect(result).toBeDefined();
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });
});
