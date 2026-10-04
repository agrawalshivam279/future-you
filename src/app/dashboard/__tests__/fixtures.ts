import { LifeModel, Persona } from '@/types';

export const mockCurrentPersona: Persona = {
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

export const mockImprovedPersona: Persona = {
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

export const mockLifeModel: LifeModel = {
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
  habitLevers: [
    {
      id: 'sleep-hours',
      label: 'Nightly Sleep',
      min: 4,
      max: 10,
      step: 0.5,
      currentValue: 7,
      unit: 'hrs',
    },
  ],
};

describe('dashboard fixtures', () => {
  it('defines valid mockLifeModel with personas and habit levers', () => {
    expect(mockLifeModel.currentPath.id).toBe('current');
    expect(mockLifeModel.improvedPath.id).toBe('improved');
    expect(mockLifeModel.habitLevers.length).toBeGreaterThan(0);
  });
});
