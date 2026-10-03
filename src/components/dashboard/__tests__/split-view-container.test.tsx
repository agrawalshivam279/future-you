import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SplitViewContainer } from '../split-view-container';
import { LifeModel, Persona } from '@/types';

describe('SplitViewContainer', () => {
  const mockCurrentPersona: Persona = {
    id: 'current',
    name: 'Jordan (Current)',
    age: 33,
    summary: 'Working at standard capacity with lingering fatigue.',
    personality: 'Pragmatic',
    emotionalState: 'Restless',
    career: {
      title: 'Senior Developer',
      companyOrContext: 'MidCorp',
      satisfaction: 6,
      highlights: [],
      challenges: ['Routine work'],
    },
    health: {
      physicalStatus: 'Fair',
      sleepAverageHours: 6.5,
      energyLevel: 'Moderate',
      habitsSummary: 'Sedentary',
    },
    finances: {
      savingsRate: 15,
      financialStatus: 'Stable',
      freedomLevel: 'Moderate',
    },
    relationships: {
      status: 'Steady',
      socialCircle: 'Small network',
      satisfaction: 6,
    },
    skills: ['TypeScript'],
    achievements: [],
    struggles: ['Doomscrolling'],
    dailyRoutine: 'Work and sleep',
    timeline: [],
    letter: 'Take care.',
    regrets: [],
    gratitudes: [],
  };

  const mockImprovedPersona: Persona = {
    ...mockCurrentPersona,
    id: 'improved',
    name: 'Jordan (Improved)',
    summary: 'Directing technical strategy with energized resilience.',
    emotionalState: 'Empowered',
    career: {
      ...mockCurrentPersona.career,
      title: 'Principal Systems Architect',
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
    achievements: ['Delivered core initiative'],
    struggles: [],
  };

  const mockLifeModel: LifeModel = {
    id: 'model-test-123',
    createdAt: new Date().toISOString(),
    inputs: {
      name: 'Jordan',
      age: 28,
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
        financialGoal: 'Freedom',
      },
      skills: {
        currentSkills: ['TypeScript'],
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

  it('renders both persona cards and the comparison grid', () => {
    render(<SplitViewContainer lifeModel={mockLifeModel} />);

    expect(screen.getByTestId('split-view-container')).toBeInTheDocument();
    expect(screen.getByTestId('persona-card-current')).toBeInTheDocument();
    expect(screen.getByTestId('persona-card-improved')).toBeInTheDocument();
    expect(screen.getByTestId('comparison-stats-grid')).toBeInTheDocument();
  });

  it('forwards persona callbacks with the correct persona id', () => {
    const onChatMock = jest.fn();
    const onLetterMock = jest.fn();
    const onReflectionsMock = jest.fn();

    render(
      <SplitViewContainer
        lifeModel={mockLifeModel}
        onChatClick={onChatMock}
        onLetterClick={onLetterMock}
        onReflectionsClick={onReflectionsMock}
      />
    );

    // Current Path actions
    const currentChatBtn = screen.getByRole('button', {
      name: `Chat with ${mockCurrentPersona.name}`,
    });
    fireEvent.click(currentChatBtn);
    expect(onChatMock).toHaveBeenCalledWith('current');

    const currentLetterBtn = screen.getByRole('button', {
      name: `Read letter from ${mockCurrentPersona.name}`,
    });
    fireEvent.click(currentLetterBtn);
    expect(onLetterMock).toHaveBeenCalledWith('current');

    const currentReflectionsBtn = screen.getByRole('button', {
      name: `View regrets and gratitudes from ${mockCurrentPersona.name}`,
    });
    fireEvent.click(currentReflectionsBtn);
    expect(onReflectionsMock).toHaveBeenCalledWith('current');

    // Improved Path actions
    const improvedChatBtn = screen.getByRole('button', {
      name: `Chat with ${mockImprovedPersona.name}`,
    });
    fireEvent.click(improvedChatBtn);
    expect(onChatMock).toHaveBeenCalledWith('improved');
  });

  it('applies custom className to container', () => {
    render(
      <SplitViewContainer lifeModel={mockLifeModel} className="custom-split-container" />
    );
    expect(screen.getByTestId('split-view-container')).toHaveClass('custom-split-container');
  });
});
