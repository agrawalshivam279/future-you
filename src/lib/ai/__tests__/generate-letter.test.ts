import { generateLetter, generateLetters } from '../generate-letter';
import { useSettingsStore } from '@/stores/settings-store';
import { OnboardingData, AISettings } from '@/types';
import OpenAI from 'openai';

jest.mock('openai');

describe('generateLetter Orchestrators', () => {
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

  const sampleLetterContent = `Dear Morgan,

I am writing to you from 5 years in your future. You are 31 now, and the small daily choices you made compounded into a life of purpose.

Thank you for showing up on the mornings you did not feel like it.

With love,
Your 5-Year Self`;

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

  describe('generateLetter', () => {
    it('generates a clean future self letter with disclaimer and token tracking', async () => {
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: sampleLetterContent } }],
        usage: {
          prompt_tokens: 120,
          completion_tokens: 280,
          total_tokens: 400,
        },
      });

      const progress: string[] = [];
      let tokenUsage: unknown = null;

      const letter = await generateLetter('improved', mockOnboardingData, {
        personaContext: 'Thriving autonomous developer',
        onProgress: (p) => progress.push(p),
        onTokenUsage: (u) => {
          tokenUsage = u;
        },
      });

      expect(letter).toContain('Dear Morgan');
      expect(letter).toContain('31 now');
      expect(progress.length).toBeGreaterThan(0);
      expect(tokenUsage).toEqual({
        promptTokens: 120,
        completionTokens: 280,
        totalTokens: 400,
      });

      const callArgs = mockCreate.mock.calls[0][0];
      const sys = callArgs.messages.find((m: { role: string }) => m.role === 'system');
      expect(sys.content).toContain('CRITICAL INVARIANT: You are a reflection tool, not a prediction engine.');
    });

    it('cleans markdown code fences from raw letter text', async () => {
      const fencedLetter = `\`\`\`markdown\n${sampleLetterContent}\n\`\`\``;
      mockCreate.mockResolvedValueOnce({
        choices: [{ message: { content: fencedLetter } }],
      });

      const letter = await generateLetter('current', mockOnboardingData);
      expect(letter).toBe(sampleLetterContent);
      expect(letter.startsWith('```')).toBe(false);
    });

    it('throws error when settings are unconfigured', async () => {
      useSettingsStore.setState({ apiKey: '' });

      await expect(generateLetter('current', mockOnboardingData)).rejects.toThrow(
        /AI provider is not configured/i
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('retries on empty response and recovers', async () => {
      mockCreate
        .mockResolvedValueOnce({ choices: [{ message: { content: '   ' } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: sampleLetterContent } }] });

      const letter = await generateLetter('current', mockOnboardingData, { maxRetries: 1 });
      expect(letter).toBe(sampleLetterContent);
      expect(mockCreate).toHaveBeenCalledTimes(2);
    });

    it('halts immediately on 401 Unauthorized without retrying', async () => {
      mockCreate.mockRejectedValueOnce(new Error('401 Unauthorized'));

      await expect(
        generateLetter('current', mockOnboardingData, { maxRetries: 2 })
      ).rejects.toThrow(/Invalid API key/i);

      expect(mockCreate).toHaveBeenCalledTimes(1);
    });

    it('halts immediately when AbortSignal is cancelled', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(
        generateLetter('current', mockOnboardingData, { signal: controller.signal })
      ).rejects.toThrow(/Generation cancelled by user/i);

      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('generateLetters', () => {
    it('generates letters for both paths concurrently', async () => {
      mockCreate
        .mockResolvedValueOnce({
          choices: [{ message: { content: 'Current letter' } }],
          usage: { prompt_tokens: 100, completion_tokens: 200, total_tokens: 300 },
        })
        .mockResolvedValueOnce({
          choices: [{ message: { content: 'Improved letter' } }],
          usage: { prompt_tokens: 100, completion_tokens: 250, total_tokens: 350 },
        });

      let totalReported: unknown = null;

      const result = await generateLetters(mockOnboardingData, {
        onTokenUsage: (u) => {
          totalReported = u;
        },
      });

      expect(result.currentLetter).toBe('Current letter');
      expect(result.improvedLetter).toBe('Improved letter');
      expect(mockCreate).toHaveBeenCalledTimes(2);
      expect(totalReported).toEqual({
        promptTokens: 200,
        completionTokens: 450,
        totalTokens: 650,
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
        .mockResolvedValueOnce({ choices: [{ message: { content: 'Letter 1' } }] })
        .mockResolvedValueOnce({ choices: [{ message: { content: 'Letter 2' } }] });

      const result = await generateLetters(mockOnboardingData, { customSettings });
      expect(result.currentLetter).toBe('Letter 1');
      expect(result.improvedLetter).toBe('Letter 2');
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'llama-3.1' }),
        expect.anything()
      );
    });
  });
});
