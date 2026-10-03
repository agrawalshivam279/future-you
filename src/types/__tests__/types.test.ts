import {
  OnboardingData,
  TimelineMilestone,
  Persona,
  LifeModel,
  ChatMessage,
  AISettings,
  ProviderPreset,
} from '../index';

describe('Core Domain Types', () => {
  it('validates a complete OnboardingData structure', () => {
    const onboarding: OnboardingData = {
      name: 'Alex Rivera',
      age: 28,
      goals: {
        shortTerm: ['Ship MVP', 'Run half marathon'],
        longTerm: ['Lead tech team', 'Financial independence'],
        dreamLife: 'Living near nature while working on impactful tools.',
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
        wastedHoursPerWeek: 6,
      },
      money: {
        incomeRange: '$75,000 - $100,000',
        savingsRate: 20,
        debtLevel: 'low',
        spendingHabits: 'Disciplined with occasional travel splurge',
        financialGoal: 'Buy a home with minimal mortgage',
      },
      skills: {
        currentSkills: ['TypeScript', 'System Architecture'],
        learningGoals: ['AI Agents', 'Public Speaking'],
        careerField: 'Software Engineering',
        careerSatisfaction: 7,
        growthMindset: 8,
      },
      fearsAndValues: {
        biggestFears: ['Stagnation', 'Burnout'],
        coreValues: ['Integrity', 'Continuous Learning', 'Health'],
        regrets: 'Wish I started exercising earlier',
        motivation: 'internal',
        riskTolerance: 6,
      },
    };

    expect(onboarding.name).toBe('Alex Rivera');
    expect(onboarding.age).toBe(28);
    expect(onboarding.habits.exerciseFrequency).toBe('weekly');
    expect(onboarding.money.savingsRate).toBe(20);
  });

  it('validates a TimelineMilestone structure', () => {
    const milestone: TimelineMilestone = {
      year: 1,
      title: 'Promoted to Senior Engineer',
      description: 'Built and scaled core infrastructure.',
      mood: 'positive',
      metrics: { salary: 120000 },
    };

    expect(milestone.year).toBe(1);
    expect(milestone.mood).toBe('positive');
  });

  it('validates a complete Persona and LifeModel structure', () => {
    const milestone: TimelineMilestone = {
      year: 5,
      title: 'Founded Studio',
      description: 'Launched independent design practice.',
      mood: 'positive',
    };

    const persona: Persona = {
      id: 'improved',
      name: 'Alex in 2031 — Improved Path',
      age: 33,
      summary: 'Thriving, energized, and leading with purpose.',
      personality: 'Warm, calm, visionary mentor.',
      emotionalState: 'Grounded and confident.',
      career: {
        title: 'Founder & Principal',
        companyOrContext: 'Rivera Labs',
        satisfaction: 9,
        highlights: ['Shipped 3 open-source frameworks'],
        challenges: ['Balancing delegation with craft'],
      },
      health: {
        physicalStatus: 'Peak endurance and healthy bloodwork.',
        sleepAverageHours: 8,
        energyLevel: 'Consistent high energy throughout the day.',
        habitsSummary: 'Daily 45-min running and whole foods diet.',
      },
      finances: {
        savingsRate: 35,
        financialStatus: 'Debt-free with 2-year emergency buffer.',
        freedomLevel: 'High autonomy.',
      },
      relationships: {
        status: 'Committed, mutually uplifting partnership.',
        socialCircle: 'Tight-knit group of lifelong friends.',
        satisfaction: 9,
      },
      skills: ['Strategic Leadership', 'TypeScript'],
      achievements: ['Ran first marathon', 'Achieved financial stability'],
      struggles: ['Letting go of small control points'],
      dailyRoutine: 'Morning run at 6 AM, deep work block, family dinner.',
      timeline: [milestone],
      letter: 'Dear Alex, trust the daily habits you set in motion...',
      regrets: [],
      gratitudes: ['Thank you for prioritizing sleep when it felt hard.'],
    };

    const lifeModel: LifeModel = {
      id: 'model-123',
      createdAt: new Date().toISOString(),
      inputs: {} as any,
      currentPath: persona,
      improvedPath: persona,
      habitLevers: [
        {
          id: 'sleep-hours',
          label: 'Sleep Hours',
          min: 4,
          max: 10,
          step: 0.5,
          currentValue: 8,
          unit: 'hours',
        },
      ],
    };

    expect(lifeModel.id).toBe('model-123');
    expect(lifeModel.improvedPath.id).toBe('improved');
    expect(lifeModel.habitLevers).toHaveLength(1);
    expect(lifeModel.habitLevers[0].unit).toBe('hours');
  });

  it('validates ChatMessage and AISettings structures', () => {
    const chatMsg: ChatMessage = {
      id: 'msg-1',
      personaId: 'improved',
      role: 'assistant',
      content: 'Hello from 2031!',
      timestamp: new Date().toISOString(),
      isStreaming: false,
    };

    const settings: AISettings = {
      provider: 'openai',
      apiKey: 'sk-test',
      baseURL: 'https://api.openai.com/v1',
      modelName: 'gpt-4o',
      temperature: 0.7,
    };

    const preset: ProviderPreset = {
      id: 'openai',
      name: 'OpenAI',
      defaultBaseURL: 'https://api.openai.com/v1',
      defaultModel: 'gpt-4o',
      requiresKey: true,
    };

    expect(chatMsg.role).toBe('assistant');
    expect(settings.provider).toBe('openai');
    expect(preset.requiresKey).toBe(true);
  });
});
