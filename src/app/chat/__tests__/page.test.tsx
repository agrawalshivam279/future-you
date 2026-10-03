import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPage from '../page';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useChatStore } from '@/stores/chat-store';
import * as chatModule from '@/lib/ai/chat-with-persona';
import { LifeModel, Persona } from '@/types';

const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

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
  inputs: {} as any,
  currentPath: { ...mockPersona, id: 'current', name: 'Taylor (Current)' },
  improvedPath: mockPersona,
  habitLevers: [],
};

describe('ChatPage Component', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    useChatStore.getState().resetChat();
    useLifeModelStore.setState({ model: null });
  });

  it('renders empty-state card when no life model exists in memory', () => {
    render(<ChatPage />);

    expect(screen.getByTestId('empty-chat-card')).toBeInTheDocument();
    expect(screen.getByText('No Simulation Found')).toBeInTheDocument();

    const onboardingBtn = screen.getByRole('button', { name: 'Go to Onboarding' });
    fireEvent.click(onboardingBtn);
    expect(mockPush).toHaveBeenCalledWith('/onboarding');
  });

  it('renders full chat page when life model is loaded', () => {
    useLifeModelStore.setState({ model: mockModel });
    render(<ChatPage />);

    expect(screen.getByTestId('chat-page-container')).toBeInTheDocument();
    expect(screen.getByTestId('chat-header')).toBeInTheDocument();
    expect(screen.getByTestId('chat-message-list')).toBeInTheDocument();
    expect(screen.getByTestId('chat-input-container')).toBeInTheDocument();
  });

  it('initializes with Current Path when search params specify persona=current', () => {
    mockSearchParams = new URLSearchParams('persona=current');
    useLifeModelStore.setState({ model: mockModel });

    render(<ChatPage />);

    const currentTab = screen.getByTestId('persona-tab-current');
    expect(currentTab).toHaveAttribute('aria-selected', 'true');
  });

  it('switches persona tabs and calls router.replace', () => {
    useLifeModelStore.setState({ model: mockModel });
    render(<ChatPage />);

    const currentTab = screen.getByTestId('persona-tab-current');
    fireEvent.click(currentTab);

    expect(mockReplace).toHaveBeenCalledWith('/chat?persona=current', { scroll: false });
  });

  it('navigates back to dashboard when back button is clicked', () => {
    useLifeModelStore.setState({ model: mockModel });
    render(<ChatPage />);

    const backBtn = screen.getByRole('button', { name: 'Back to dashboard' });
    fireEvent.click(backBtn);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('opens confirmation modal on clear button and clears chat when confirmed', () => {
    useLifeModelStore.setState({ model: mockModel });
    useChatStore.getState().addMessage('improved', {
      role: 'user',
      content: 'Existing question',
    });

    render(<ChatPage />);
    expect(screen.getByText('Existing question')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: 'Clear chat history' });
    fireEvent.click(clearBtn);

    expect(screen.getByText('Clear Conversation History?')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: 'Confirm clear chat' });
    fireEvent.click(confirmBtn);

    expect(screen.queryByText('Existing question')).not.toBeInTheDocument();
  });

  it('sends message via ChatInput and updates transcript', async () => {
    mockChatWithPersona.mockResolvedValue('I am flourishing in 5 years.');
    useLifeModelStore.setState({ model: mockModel });

    render(<ChatPage />);

    const textarea = screen.getByPlaceholderText(/Ask .* anything.../i);
    const sendBtn = screen.getByRole('button', { name: 'Send message' });

    fireEvent.change(textarea, { target: { value: 'How is your work life balance?' } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText('How is your work life balance?')).toBeInTheDocument();
    });
  });
});
