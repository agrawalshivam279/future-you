import { validateStep, validateAll } from '../onboarding-validator';
import { OnboardingData } from '@/types';

const mockCompleteData: OnboardingData = {
  name: 'Alex',
  age: 29,
  goals: {
    shortTerm: ['Launch MVP'],
    longTerm: ['Reach financial independence'],
    dreamLife: 'A calm, focused, and creative existence.',
  },
  habits: {
    sleepHours: 8,
    exerciseFrequency: 'daily',
    dietQuality: 'good',
    screenTime: 3,
    meditationOrReflection: true,
  },
  time: {
    workHoursPerWeek: 40,
    studyHoursPerWeek: 10,
    socialHoursPerWeek: 10,
    creativeHoursPerWeek: 5,
    wastedHoursPerWeek: 5,
  },
  money: {
    incomeRange: '$100k - $150k',
    savingsRate: 30,
    debtLevel: 'none',
    spendingHabits: 'Balanced & Conscious',
    financialGoal: 'Save $100k liquid reserves',
  },
  skills: {
    currentSkills: ['TypeScript', 'System Architecture'],
    learningGoals: ['Machine Learning'],
    careerField: 'Software Engineering',
    careerSatisfaction: 8,
    growthMindset: 9,
  },
  fearsAndValues: {
    biggestFears: ['Stagnation'],
    coreValues: ['Autonomy', 'Truth'],
    regrets: 'None',
    motivation: 'internal',
    riskTolerance: 7,
  },
};

describe('onboarding-validator', () => {
  describe('validateStep', () => {
    it('validates Step 1 requirements', () => {
      const invalidData = {
        ...mockCompleteData,
        name: ' ',
        age: 12,
        goals: { shortTerm: [], longTerm: [], dreamLife: '' },
      };
      const res = validateStep(1, invalidData);
      expect(res.isValid).toBe(false);
      expect(res.errors.length).toBe(3);

      const validRes = validateStep(1, mockCompleteData);
      expect(validRes.isValid).toBe(true);
      expect(validRes.errors).toHaveLength(0);
    });

    it('validates Step 2 requirements', () => {
      const invalidData = {
        ...mockCompleteData,
        habits: { ...mockCompleteData.habits, sleepHours: 2 },
      };
      const res = validateStep(2, invalidData);
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toMatch(/nightly sleep duration/i);

      const validRes = validateStep(2, mockCompleteData);
      expect(validRes.isValid).toBe(true);
    });

    it('validates Step 3 168-hour weekly budget', () => {
      const overbookedData = {
        ...mockCompleteData,
        habits: { ...mockCompleteData.habits, sleepHours: 8 }, // 56h
        time: {
          workHoursPerWeek: 60,
          studyHoursPerWeek: 20,
          socialHoursPerWeek: 20,
          creativeHoursPerWeek: 20,
          wastedHoursPerWeek: 10, // Total = 56 + 130 = 186h
        },
      };
      const res = validateStep(3, overbookedData);
      expect(res.isValid).toBe(false);
      expect(res.errors[0]).toMatch(/exceeds the 168 hours/i);

      const validRes = validateStep(3, mockCompleteData);
      expect(validRes.isValid).toBe(true);
    });

    it('validates Step 4 requirements', () => {
      const invalidData = {
        ...mockCompleteData,
        money: { ...mockCompleteData.money, incomeRange: '', financialGoal: '' },
      };
      const res = validateStep(4, invalidData);
      expect(res.isValid).toBe(false);
      expect(res.errors).toHaveLength(2);

      const validRes = validateStep(4, mockCompleteData);
      expect(validRes.isValid).toBe(true);
    });

    it('validates Step 5 requirements', () => {
      const invalidData = {
        ...mockCompleteData,
        skills: { ...mockCompleteData.skills, currentSkills: [], careerField: '' },
      };
      const res = validateStep(5, invalidData);
      expect(res.isValid).toBe(false);
      expect(res.errors).toHaveLength(2);

      const validRes = validateStep(5, mockCompleteData);
      expect(validRes.isValid).toBe(true);
    });

    it('validates Step 6 requirements', () => {
      const invalidData = {
        ...mockCompleteData,
        fearsAndValues: {
          ...mockCompleteData.fearsAndValues,
          coreValues: [],
          biggestFears: [],
        },
      };
      const res = validateStep(6, invalidData);
      expect(res.isValid).toBe(false);
      expect(res.errors).toHaveLength(2);

      const validRes = validateStep(6, mockCompleteData);
      expect(validRes.isValid).toBe(true);
    });
  });

  describe('validateAll', () => {
    it('returns overall validity true for complete valid data', () => {
      const res = validateAll(mockCompleteData);
      expect(res.isValid).toBe(true);
      expect(Object.keys(res.errorsByStep)).toHaveLength(0);
    });

    it('returns overall validity false and aggregates errors by step', () => {
      const invalidData: OnboardingData = {
        ...mockCompleteData,
        name: '',
        money: { ...mockCompleteData.money, incomeRange: '' },
      };
      const res = validateAll(invalidData);
      expect(res.isValid).toBe(false);
      expect(res.errorsByStep[1]).toBeDefined();
      expect(res.errorsByStep[4]).toBeDefined();
    });
  });
});
