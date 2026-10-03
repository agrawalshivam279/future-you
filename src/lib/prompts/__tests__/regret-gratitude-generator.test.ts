import {
  buildRegretGratitudeSystemPrompt,
  buildRegretGratitudeUserPrompt,
  parseRegretGratitudeResponse,
} from '../regret-gratitude-generator';
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

describe('Regret and Gratitude Generator', () => {
  describe('buildRegretGratitudeSystemPrompt', () => {
    it('contains the mandatory honesty reflection disclaimer for current path', () => {
      const prompt = buildRegretGratitudeSystemPrompt('current');
      expect(prompt).toContain('You are a reflection tool, not a prediction engine.');
    });

    it('contains the mandatory honesty reflection disclaimer for improved path', () => {
      const prompt = buildRegretGratitudeSystemPrompt('improved');
      expect(prompt).toContain('You are a reflection tool, not a prediction engine.');
    });

    it('emphasizes regrets for current path', () => {
      const prompt = buildRegretGratitudeSystemPrompt('current');
      expect(prompt).toContain('Current Path');
      expect(prompt).toContain('REGRETS born of procrastination');
    });

    it('emphasizes gratitudes for improved path', () => {
      const prompt = buildRegretGratitudeSystemPrompt('improved');
      expect(prompt).toContain('Improved Path');
      expect(prompt).toContain('GRATITUDES toward the younger self');
    });
  });

  describe('buildRegretGratitudeUserPrompt', () => {
    it('injects user name, age horizons, and domain context', () => {
      const prompt = buildRegretGratitudeUserPrompt('improved', mockInputs);
      expect(prompt).toContain('Maya Lin');
      expect(prompt).toContain('age 36 looking back at age 31');
      expect(prompt).toContain('UX Architecture');
    });

    it('handles sparse inputs gracefully', () => {
      const prompt = buildRegretGratitudeUserPrompt('current', {});
      expect(prompt).toContain('User');
      expect(prompt).toContain('age 33 looking back at age 28');
    });
  });

  describe('parseRegretGratitudeResponse', () => {
    it('parses valid JSON response cleanly', () => {
      const mockRaw = JSON.stringify({
        regrets: ['Regret 1', 'Regret 2'],
        gratitudes: ['Gratitude 1', 'Gratitude 2'],
      });

      const result = parseRegretGratitudeResponse(mockRaw, 'improved', mockInputs);
      expect(result.regrets).toEqual(['Regret 1', 'Regret 2']);
      expect(result.gratitudes).toEqual(['Gratitude 1', 'Gratitude 2']);
    });

    it('strips markdown code fencing', () => {
      const fenced = '```json\n{"regrets":["R1"],"gratitudes":["G1"]}\n```';
      const result = parseRegretGratitudeResponse(fenced, 'current', mockInputs);
      expect(result.regrets).toEqual(['R1']);
      expect(result.gratitudes).toEqual(['G1']);
    });

    it('filters out non-string or empty elements', () => {
      const dirty = JSON.stringify({
        regrets: ['Valid regret', '  ', 123, null],
        gratitudes: ['Valid gratitude'],
      });
      const result = parseRegretGratitudeResponse(dirty, 'current', mockInputs);
      expect(result.regrets).toEqual(['Valid regret']);
      expect(result.gratitudes).toEqual(['Valid gratitude']);
    });

    it('falls back to default reflections on JSON parse failure', () => {
      const result = parseRegretGratitudeResponse('invalid json text', 'current', mockInputs);
      expect(result.regrets.length).toBeGreaterThanOrEqual(1);
      expect(result.gratitudes.length).toBeGreaterThanOrEqual(1);
      expect(result.regrets[0]).toContain('UX Architecture');
    });
  });
});
