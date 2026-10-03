import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardPage from '../page';
import { useLifeModelStore } from '@/stores/life-model-store';
import { LifeModel, Persona } from '@/types';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

describe('DashboardPage Component', () => {
  const mockCurrentPersona: Persona = {
    id: 'current',
    name: 'Taylor in 2031 (Current)',
    age: 34,
    summary: 'Navigating routine with quiet dissatisfaction.',
    personality: 'Pragmatic',
    emotionalState: 'Unfulfilled',
    career: {
      title: 'Senior Engineer',
      companyOrContext: 'Tech Corp',
      satisfaction: 6,
      highlights: [],
      challenges: ['Routine work'],
    },
    health: {
      physicalStatus: 'Fair',
      sleepAverageHours: 6.5,
      energyLevel: 'Low',
      habitsSummary: 'Sedentary',
    },
    finances: {
      savingsRate: 15,
      financialStatus: 'Comfortable',
      freedomLevel: 'Moderate',
    },
    relationships: {
      status: 'Steady',
      socialCircle: 'Work peers',
      satisfaction: 6,
    },
    skills: ['JavaScript'],
    achievements: [],
    struggles: ['Distraction'],
    dailyRoutine: 'Work all day',
    timeline: [],
    letter: 'Prioritize balance.',
    regrets: [],
    gratitudes: [],
  };

  const mockImprovedPersona: Persona = {
    ...mockCurrentPersona,
    id: 'improved',
    name: 'Taylor in 2031 (Improved)',
    summary: 'Leading engineering research with boundless energy.',
    emotionalState: 'Energized',
    career: {
      ...mockCurrentPersona.career,
      title: 'Principal Architect',
      satisfaction: 9,
    },
    health: {
      ...mockCurrentPersona.health,
      sleepAverageHours: 8,
      energyLevel: 'High',
    },
    finances: {
      ...mockCurrentPersona.finances,
      savingsRate: 35,
      freedomLevel: 'High',
    },
    achievements: ['Published paper'],
    struggles: [],
  };

  const mockLifeModel: LifeModel = {
    id: 'test-model-1',
    createdAt: new Date().toISOString(),
    inputs: {
      name: 'Taylor',
      age: 29,
      goals: { shortTerm: [], longTerm: [], dreamLife: '' },
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
        socialHoursPerWeek: 5,
        creativeHoursPerWeek: 2,
        wastedHoursPerWeek: 4,
      },
      money: {
        incomeRange: '$90k',
        savingsRate: 15,
        debtLevel: 'none',
        spendingHabits: 'Moderate',
        financialGoal: 'Independence',
      },
      skills: {
        currentSkills: ['JavaScript'],
        learningGoals: [],
        careerField: 'Engineering',
        careerSatisfaction: 6,
        growthMindset: 7,
      },
      fearsAndValues: {
        biggestFears: [],
        coreValues: [],
        regrets: '',
        motivation: 'internal',
        riskTolerance: 6,
      },
    },
    currentPath: mockCurrentPersona,
    improvedPath: mockImprovedPersona,
    habitLevers: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useLifeModelStore.setState({ model: null });
  });

  it('renders empty state when life model is null', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('empty-dashboard-card')).toBeInTheDocument();
    expect(screen.getByText('No Simulation Yet')).toBeInTheDocument();

    const onboardingBtn = screen.getByRole('button', { name: 'Begin Onboarding' });
    fireEvent.click(onboardingBtn);
    expect(mockPush).toHaveBeenCalledWith('/onboarding');
  });

  it('renders dashboard with both personas and timeline when life model is loaded', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    expect(screen.getByText('Your Two Futures')).toBeInTheDocument();
    expect(screen.getByTestId('split-view-container')).toBeInTheDocument();
    expect(screen.getByTestId('dual-timeline')).toBeInTheDocument();
    expect(screen.getByText('Taylor in 2031 (Current)')).toBeInTheDocument();
    expect(screen.getByText('Taylor in 2031 (Improved)')).toBeInTheDocument();
  });

  it('navigates to settings when Settings button is clicked', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const settingsBtn = screen.getByRole('button', { name: 'Settings' });
    fireEvent.click(settingsBtn);
    expect(mockPush).toHaveBeenCalledWith('/settings');
  });

  it('opens regenerate modal and handles cancel and confirmation', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const regenerateBtn = screen.getByRole('button', { name: 'Regenerate Futures' });
    fireEvent.click(regenerateBtn);

    expect(screen.getByText('Regenerate Your Futures?')).toBeInTheDocument();

    // Cancel
    const cancelBtn = screen.getByRole('button', { name: 'Cancel regeneration' });
    fireEvent.click(cancelBtn);
    expect(screen.queryByText('Regenerate Your Futures?')).not.toBeInTheDocument();

    // Reopen and confirm
    fireEvent.click(regenerateBtn);
    const confirmBtn = screen.getByRole('button', { name: 'Confirm regeneration' });
    fireEvent.click(confirmBtn);
    expect(mockPush).toHaveBeenCalledWith('/generate');
  });

  it('navigates to chat when clicking Talk to Persona', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const chatBtn = screen.getByRole('button', {
      name: `Chat with ${mockCurrentPersona.name}`,
    });
    fireEvent.click(chatBtn);
    expect(mockPush).toHaveBeenCalledWith('/chat?persona=current');
  });

  it('navigates to letter when clicking Letter', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const letterBtn = screen.getByRole('button', {
      name: `Read letter from ${mockCurrentPersona.name}`,
    });
    fireEvent.click(letterBtn);
    expect(mockPush).toHaveBeenCalledWith('/letter?persona=current');
  });

  it('navigates to reflections when clicking Reflections', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    const reflectionsBtn = screen.getByRole('button', {
      name: `View regrets and gratitudes from ${mockCurrentPersona.name}`,
    });
    fireEvent.click(reflectionsBtn);
    expect(mockPush).toHaveBeenCalledWith('/reflections?persona=current');
  });

  it('displays the honesty disclaimer text in footer', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    render(<DashboardPage />);

    expect(
      screen.getByText(/Future You is a reflection tool, not a prediction engine/i)
    ).toBeInTheDocument();
  });
});
