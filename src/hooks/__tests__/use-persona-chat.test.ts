import { renderHook, act } from '@testing-library/react';
import { usePersonaChat } from '../use-persona-chat';
import * as chatModule from '@/lib/ai/chat-with-persona';
import { useChatStore } from '@/stores/chat-store';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Persona, LifeModel, OnboardingData } from '@/types';

jest.mock('@/lib/ai/chat-with-persona');

const mockChatWithPersona = chatModule.chatWithPersona as jest.MockedFunction<
  typeof chatModule.chatWithPersona
>;

const mockPersona: Persona = {
  id: 'improved',
  name: 'Taylor (Improved)',
  age: 35,
  summary: 'A flourishing life built on daily routines.',
  personality: 'Grounded and optimistic',
  emotionalState: 'Calm and fulfilled',
  career: {
    title: 'Principal Engineer',
    companyOrContext: 'Tech Studio',
    satisfaction: 9,
    highlights: ['Launched global system'],
    challenges: ['Managing competing priorities'],
  },
  health: {
    physicalStatus: 'Excellent',
    sleepAverageHours: 8,
    energyLevel: 'High',
    habitsSummary: 'Daily exercise and clean diet',
  },
  finances: {
    savingsRate: 35,
    financialStatus: 'Comfortable with emergency cushion',
    freedomLevel: 'High',
  },
  relationships: {
    status: 'Connected',
    socialCircle: 'Close friends and community',
    satisfaction: 9,
  },
  skills: ['System Design', 'AI Strategy'],
  achievements: ['Published tech monograph'],
  struggles: [],
  dailyRoutine: 'Morning walk, deep focus, family dinner',
  timeline: [],
  letter: 'Discipline is peace.',
  regrets: [],
  gratitudes: ['Morning routines'],
};

const mockModel: LifeModel = {
  id: 'model-123',
  createdAt: '2026-10-04T00:00:00.000Z',
  inputs: {} as OnboardingData,
  currentPath: { ...mockPersona, id: 'current', name: 'Taylor (Current)' },
  improvedPath: mockPersona,
  habitLevers: [],
};

describe('usePersonaChat Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useChatStore.getState().resetChat();
    useLifeModelStore.setState({ model: mockModel });
    useOnboardingStore.setState({ isCompleted: true });

    // Mock browser speech synthesis
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: jest.fn(),
        cancel: jest.fn(),
      },
      writable: true,
    });

    (global as any).SpeechSynthesisUtterance = jest.fn().mockImplementation((text: string) => ({
      text,
      onend: null,
      onerror: null,
    }));
  });

  it('initializes with default improved persona', () => {
    const { result } = renderHook(() => usePersonaChat());

    expect(result.current.activePersona).toBe('improved');
    expect(result.current.currentPersonaData?.name).toBe('Taylor (Improved)');
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it('initializes with custom initialPersonaId', () => {
    const { result } = renderHook(() =>
      usePersonaChat({ initialPersonaId: 'current' })
    );

    expect(result.current.activePersona).toBe('current');
    expect(result.current.currentPersonaData?.name).toBe('Taylor (Current)');
  });

  it('switches persona trajectory and updates currentPersonaData', () => {
    const { result } = renderHook(() => usePersonaChat());

    act(() => {
      result.current.setActivePersona('current');
    });

    expect(result.current.activePersona).toBe('current');
    expect(result.current.currentPersonaData?.name).toBe('Taylor (Current)');
  });

  it('sends message, handles real-time token streaming, and finishes streaming', async () => {
    mockChatWithPersona.mockImplementation(
      async (_id, _msg, _persona, _inputs, options) => {
        options?.onToken?.('Hello ');
        options?.onToken?.('from the future!');
        return 'Hello from the future!';
      }
    );

    const { result } = renderHook(() => usePersonaChat());

    await act(async () => {
      await result.current.sendMessage('What should I focus on?');
    });

    const messages = result.current.messages;
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe('user');
    expect(messages[0].content).toBe('What should I focus on?');
    expect(messages[1].role).toBe('assistant');
    expect(messages[1].content).toBe('Hello from the future!');
    expect(messages[1].isStreaming).toBe(false);
  });

  it('handles streaming errors gracefully and records error in store', async () => {
    mockChatWithPersona.mockRejectedValue(new Error('Rate limit exceeded'));

    const { result } = renderHook(() => usePersonaChat());

    await act(async () => {
      await result.current.sendMessage('Hello?');
    });

    expect(result.current.error).toBe('Rate limit exceeded');
    expect(result.current.isLoading).toBe(false);

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });

  it('clears active persona chat history', () => {
    const { result } = renderHook(() => usePersonaChat());

    act(() => {
      useChatStore.getState().addMessage('improved', {
        role: 'user',
        content: 'Test message',
      });
    });

    expect(result.current.messages).toHaveLength(1);

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toHaveLength(0);
  });

  it('controls speech synthesis playback', () => {
    const { result } = renderHook(() => usePersonaChat());

    act(() => {
      result.current.speakMessage('Reading aloud', 'msg-123');
    });

    expect(window.speechSynthesis.speak).toHaveBeenCalled();
    expect(result.current.speakingMessageId).toBe('msg-123');

    act(() => {
      result.current.stopSpeaking();
    });

    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(result.current.speakingMessageId).toBeNull();
  });
});
