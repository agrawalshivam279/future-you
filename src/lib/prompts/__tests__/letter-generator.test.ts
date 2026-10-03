import { buildLetterSystemPrompt, buildLetterUserPrompt } from '../letter-generator';
import { OnboardingData } from '../../../types/onboarding.types';

const mockInputs: OnboardingData = {
  name: 'Maya Lin',
  age: 31,
  skills: {
    careerField: 'UX Architecture',
    currentSkills: ['Design Systems', 'User Research'],
    learningGoals: ['AI Design Patterns'],
    careerSatisfaction: 5,
    growthMindset: 7,
  },
  goals: {
    shortTerm: ['Lead global design system overhaul'],
    longTerm: ['Establish a boutique design agency'],
    dreamLife: 'Running an intentional creative practice with time for ceramics and travel',
  },
  habits: {
    sleepHours: 6.5,
    exerciseFrequency: 'weekly',
    screenTime: 6,
    dietQuality: 'average',
    meditationOrReflection: false,
  },
  money: {
    incomeRange: '$90k-$120k',
    savingsRate: 15,
    debtLevel: 'moderate',
    spendingHabits: 'Variable',
    financialGoal: 'Debt-free and 1 year emergency fund',
  },
  time: {
    workHoursPerWeek: 45,
    creativeHoursPerWeek: 2,
    studyHoursPerWeek: 3,
    socialHoursPerWeek: 8,
    wastedHoursPerWeek: 7,
  },
  fearsAndValues: {
    biggestFears: ['Remaining comfortable but creatively stagnant'],
    coreValues: ['Craftsmanship', 'Empathy', 'Freedom'],
    regrets: 'Not publishing design writing sooner',
    motivation: 'internal',
    riskTolerance: 6,
  },
};

describe('Letter Generator', () => {
  describe('buildLetterSystemPrompt', () => {
    it('contains the mandatory honesty reflection disclaimer for current path', () => {
      const prompt = buildLetterSystemPrompt('current');
      expect(prompt).toContain('You are a reflection tool, not a prediction engine.');
    });

    it('contains the mandatory honesty reflection disclaimer for improved path', () => {
      const prompt = buildLetterSystemPrompt('improved');
      expect(prompt).toContain('You are a reflection tool, not a prediction engine.');
    });

    it('articulates inertia and affectionate warning for current path', () => {
      const prompt = buildLetterSystemPrompt('current');
      expect(prompt).toContain('Current Path');
      expect(prompt).toContain('inertia');
      expect(prompt).toContain('comfort zone');
    });

    it('articulates gratitude and quiet compounding for improved path', () => {
      const prompt = buildLetterSystemPrompt('improved');
      expect(prompt).toContain('Improved Path');
      expect(prompt).toContain('compounding');
      expect(prompt).toContain('unglamorous');
    });
  });

  describe('buildLetterUserPrompt', () => {
    it('injects user details, current age, and target age (+5)', () => {
      const prompt = buildLetterUserPrompt('current', mockInputs);
      expect(prompt).toContain('Maya Lin');
      expect(prompt).toContain('age 31');
      expect(prompt).toContain('age 36');
      expect(prompt).toContain('UX Architecture');
      expect(prompt).toContain('Establish a boutique design agency');
    });

    it('injects persona context when provided', () => {
      const context = 'Maya has built a thriving design studio with 4 collaborators.';
      const prompt = buildLetterUserPrompt('improved', mockInputs, context);
      expect(prompt).toContain(context);
    });

    it('handles sparse inputs gracefully', () => {
      const prompt = buildLetterUserPrompt('current', {});
      expect(prompt).toContain('Friend');
      expect(prompt).toContain('age 28');
      expect(prompt).toContain('age 33');
    });
  });
});
