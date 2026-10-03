import { chatWithPersona, buildChatMessages } from '../chat-with-persona';
import { useSettingsStore } from '@/stores/settings-store';
import { Persona, OnboardingData, ChatMessage } from '@/types';
import OpenAI from 'openai';

jest.mock('openai');

describe('chatWithPersona Orchestrator', () => {
  const mockCreate = jest.fn();

  const mockPersona: Persona = {
    id: 'improved',
    name: 'Riley in 5 Years (Improved Path)',
    age: 33,
    summary: 'A disciplined software engineer and mentor.',
    personality: 'Calm, focused, purposeful, encouraging.',
    emotionalState: 'Grounded vitality',
    career: {
      title: 'Staff Architect',
      companyOrContext: 'Modern tech studio',
      satisfaction: 9,
      highlights: ['Promoted', 'Mentored juniors'],
      challenges: ['Balancing deep work with meetings'],
    },
    health: {
      physicalStatus: 'Strong and agile',
      sleepAverageHours: 8,
      energyLevel: 'Consistently high',
      habitsSummary: 'Morning kettlebells',
    },
    finances: {
      savingsRate: 35,
      financialStatus: 'Comfortable compounding',
      freedomLevel: 'High autonomy',
    },
    relationships: {
      status: 'Deep friendships',
      socialCircle: 'Core community',
      satisfaction: 8,
    },
    skills: ['System Design', 'AI Engineering'],
    achievements: ['Delivered systems'],
    struggles: ['Guardrails'],
    dailyRoutine: 'Morning run, deep work blocks.',
    timeline: [],
    letter: '',
    regrets: [],
    gratitudes: [],
  };

  const mockOnboardingData: OnboardingData = {
    name: 'Riley',
    age: 28,
    goals: {
      shortTerm: ['Ship project'],
      longTerm: ['Staff Architect'],
      dreamLife: 'Autonomous creative life',
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
      incomeRange: '$90k',
      savingsRate: 20,
      debtLevel: 'none',
      spendingHabits: 'Conscious',
      financialGoal: 'Freedom',
    },
    skills: {
      currentSkills: ['TypeScript'],
      learningGoals: ['AI'],
      careerField: 'Software Engineering',
      careerSatisfaction: 7,
      growthMindset: 8,
    },
    fearsAndValues: {
      biggestFears: ['Stagnation'],
      coreValues: ['Autonomy', 'Craft'],
      regrets: 'None',
      motivation: 'internal',
      riskTolerance: 6,
    },
  };

  async function* mockStreamGenerator(tokens: string[]) {
    for (const token of tokens) {
      yield {
        choices: [{ delta: { content: token } }],
      };
    }
  }

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

  describe('buildChatMessages', () => {
    it('assembles system prompt containing reflection disclaimer and formats user message', () => {
      const messages = buildChatMessages(
        'improved',
        'How did you start compounding your habits?',
        mockPersona,
        mockOnboardingData
      );

      expect(messages).toHaveLength(2);
      expect(messages[0].role).toBe('system');
      expect(messages[0].content).toContain('You are a reflection tool, not a prediction engine.');
      expect(messages[0].content).toContain('Riley');
      expect(messages[1].role).toBe('user');
      expect(messages[1].content).toBe('How did you start compounding your habits?');
    });

    it('caps chat history to maxContextMessages and ignores streaming items', () => {
      const history: ChatMessage[] = Array.from({ length: 25 }, (_, i) => ({
        id: `msg-${i}`,
        personaId: 'improved',
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i}`,
        timestamp: new Date().toISOString(),
      }));

      // Add a streaming placeholder which should be filtered out
      history.push({
        id: 'msg-stream',
        personaId: 'improved',
        role: 'assistant',
        content: 'streaming...',
        isStreaming: true,
        timestamp: new Date().toISOString(),
      });

      const messages = buildChatMessages(
        'improved',
        'Next question',
        mockPersona,
        mockOnboardingData,
        history,
        10
      );

      // System (1) + 10 history + User (1) = 12 total
      expect(messages).toHaveLength(12);
      expect(messages[0].role).toBe('system');
      expect(messages[messages.length - 1].content).toBe('Next question');
      expect(messages.some((m) => m.content === 'streaming...')).toBe(false);
    });

    it('throws an error if user message is empty or whitespace only', () => {
      expect(() => {
        buildChatMessages('improved', '   ', mockPersona, mockOnboardingData);
      }).toThrow(/Message content cannot be empty/i);
    });
  });

  describe('chatWithPersona', () => {
    it('streams tokens progressively and returns full accumulated response', async () => {
      const tokens = ['Hello ', 'Riley. ', 'I ', 'remember ', 'that day.'];
      mockCreate.mockResolvedValueOnce(mockStreamGenerator(tokens));

      const receivedTokens: string[] = [];

      const fullResponse = await chatWithPersona(
        'improved',
        'Do you remember where we started?',
        mockPersona,
        mockOnboardingData,
        {
          onToken: (t) => receivedTokens.push(t),
        }
      );

      expect(receivedTokens).toEqual(tokens);
      expect(fullResponse).toBe('Hello Riley. I remember that day.');
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ stream: true }),
        expect.anything()
      );
    });

    it('uses Current Path system prompt when personaId is current', async () => {
      const tokens = ['It ', 'took ', 'longer ', 'than expected.'];
      mockCreate.mockResolvedValueOnce(mockStreamGenerator(tokens));

      await chatWithPersona(
        'current',
        'Why did we hesitate?',
        { ...mockPersona, id: 'current' },
        mockOnboardingData
      );

      const callArgs = mockCreate.mock.calls[0][0];
      const sysMessage = callArgs.messages[0];
      expect(sysMessage.content).toContain('Current Path');
      expect(sysMessage.content).toContain('inertia');
    });

    it('throws error when settings are unconfigured', async () => {
      useSettingsStore.setState({ apiKey: '' });

      await expect(
        chatWithPersona('improved', 'Hello', mockPersona, mockOnboardingData)
      ).rejects.toThrow(/AI provider is not configured/i);

      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('halts immediately when AbortSignal is cancelled', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(
        chatWithPersona('improved', 'Hello', mockPersona, mockOnboardingData, {
          signal: controller.signal,
        })
      ).rejects.toThrow(/Generation cancelled by user/i);

      expect(mockCreate).not.toHaveBeenCalled();
    });

    it('formats 401 Unauthorized API error gracefully', async () => {
      mockCreate.mockRejectedValueOnce(new Error('401 Unauthorized'));

      await expect(
        chatWithPersona('improved', 'Hello', mockPersona, mockOnboardingData)
      ).rejects.toThrow(/Invalid API key/i);
    });
  });
});
