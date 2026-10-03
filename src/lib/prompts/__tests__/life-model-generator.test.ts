import {
  buildLifeModelSystemPrompt,
  buildLifeModelUserPrompt,
  parseLifeModelResponse,
} from '../life-model-generator';
import { OnboardingData } from '@/types';

const mockInputs: OnboardingData = {
  name: 'Maya',
  age: 30,
  goals: {
    shortTerm: ['Launch podcast'],
    longTerm: ['Publish nonfiction book'],
    dreamLife: 'Quiet studio, deep creative immersion.',
  },
  habits: {
    sleepHours: 7.5,
    exerciseFrequency: 'weekly',
    dietQuality: 'good',
    screenTime: 3.5,
    meditationOrReflection: true,
  },
  time: {
    workHoursPerWeek: 45,
    studyHoursPerWeek: 8,
    socialHoursPerWeek: 12,
    creativeHoursPerWeek: 6,
    wastedHoursPerWeek: 6,
  },
  money: {
    incomeRange: '$100k - $150k',
    savingsRate: 25,
    debtLevel: 'low',
    spendingHabits: 'Balanced & Conscious',
    financialGoal: 'Debt-free home purchase',
  },
  skills: {
    currentSkills: ['Content Strategy', 'Audio Editing'],
    learningGoals: ['Audio Engineering', 'Narrative Writing'],
    careerField: 'Media & Publishing',
    careerSatisfaction: 7,
    growthMindset: 8,
  },
  fearsAndValues: {
    biggestFears: ['Creative Stagnation', 'Financial Anxiety'],
    coreValues: ['Authenticity', 'Craft Mastery'],
    regrets: 'Delayed creative risks',
    motivation: 'internal',
    riskTolerance: 6,
  },
};

describe('life-model-generator', () => {
  describe('buildLifeModelSystemPrompt', () => {
    it('contains the mandatory honesty reflection disclaimer', () => {
      const prompt = buildLifeModelSystemPrompt();
      expect(prompt).toContain('You are a reflection tool, not a prediction engine.');
    });

    it('defines distinct tone profiles for current and improved paths', () => {
      const prompt = buildLifeModelSystemPrompt();
      expect(prompt).toContain('"Current Path"');
      expect(prompt).toContain('"Improved Path"');
      expect(prompt).toContain('current age + 5');
    });
  });

  describe('buildLifeModelUserPrompt', () => {
    it('interpolates user onboarding profile and computes target age', () => {
      const prompt = buildLifeModelUserPrompt(mockInputs);
      expect(prompt).toContain('Callsign: Maya');
      expect(prompt).toContain('Current Age: 30 (Target Age: 35)');
      expect(prompt).toContain('Launch podcast');
      expect(prompt).toContain('Publish nonfiction book');
      expect(prompt).toContain('Media & Publishing');
      expect(prompt).toContain('Debt-free home purchase');
    });
  });

  describe('parseLifeModelResponse', () => {
    it('parses pure JSON string into a structured LifeModel', () => {
      const sampleJSON = JSON.stringify({
        currentPath: {
          name: 'Maya in 5 Years (Current Path)',
          summary: 'Steady output with persistent creative itch.',
          personality: 'Reflective, slightly tired, observant.',
          emotionalState: 'Quietly restless',
          career: {
            title: 'Senior Content Strategist',
            companyOrContext: 'Agency',
            satisfaction: 5,
            highlights: ['Led audio rebrand'],
            challenges: ['Creative burnout'],
          },
        },
        improvedPath: {
          name: 'Maya in 5 Years (Improved Path)',
          summary: 'Autonomous author and podcast studio director.',
          personality: 'Energized, focused, disciplined.',
          emotionalState: 'Grounded vitality',
          career: {
            title: 'Independent Publisher',
            companyOrContext: 'Self-employed Studio',
            satisfaction: 9,
            highlights: ['Published bestselling book'],
            challenges: ['Scaling operations'],
          },
        },
        habitLevers: [
          {
            id: 'sleep-hours',
            label: 'Nightly Sleep',
            min: 4,
            max: 12,
            step: 0.5,
            currentValue: 8,
            unit: 'hrs',
          },
        ],
      });

      const model = parseLifeModelResponse(sampleJSON, mockInputs);
      expect(model.id).toMatch(/^life-model-/);
      expect(model.inputs.name).toBe('Maya');
      expect(model.currentPath.age).toBe(35);
      expect(model.improvedPath.age).toBe(35);
      expect(model.currentPath.career.title).toBe('Senior Content Strategist');
      expect(model.improvedPath.career.title).toBe('Independent Publisher');
      expect(model.habitLevers).toHaveLength(1);
    });

    it('strips markdown code blocks and handles surrounding text', () => {
      const rawWithFences = `
Here is the projection you requested:
\`\`\`json
{
  "currentPath": { "summary": "Current path summary." },
  "improvedPath": { "summary": "Improved path summary." }
}
\`\`\`
Hope this helps!`;

      const model = parseLifeModelResponse(rawWithFences, mockInputs);
      expect(model.currentPath.summary).toBe('Current path summary.');
      expect(model.improvedPath.summary).toBe('Improved path summary.');
      // Should populate fallback levers when not provided in JSON
      expect(model.habitLevers.length).toBeGreaterThanOrEqual(4);
    });

    it('throws descriptive error on malformed JSON', () => {
      expect(() => {
        parseLifeModelResponse('This is not json at all', mockInputs);
      }).toThrow(/Failed to parse LLM LifeModel response/i);
    });

    it('throws error on empty string', () => {
      expect(() => {
        parseLifeModelResponse('', mockInputs);
      }).toThrow(/empty or invalid/i);
    });
  });
});
