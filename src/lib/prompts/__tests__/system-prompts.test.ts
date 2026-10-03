import { buildCurrentPathSystemPrompt } from '../system-current-path';
import { buildImprovedPathSystemPrompt } from '../system-improved-path';
import { Persona, OnboardingData } from '@/types';

const mockInputs: OnboardingData = {
  name: 'Marcus',
  age: 27,
  goals: {
    shortTerm: ['Ship MVP'],
    longTerm: ['Lead tech studio'],
    dreamLife: 'Deep work, autonomy, time for family.',
  },
  habits: {
    sleepHours: 6.5,
    exerciseFrequency: 'weekly',
    dietQuality: 'average',
    screenTime: 5,
    meditationOrReflection: false,
  },
  time: {
    workHoursPerWeek: 45,
    studyHoursPerWeek: 4,
    socialHoursPerWeek: 10,
    creativeHoursPerWeek: 2,
    wastedHoursPerWeek: 8,
  },
  money: {
    incomeRange: '$60k - $100k',
    savingsRate: 15,
    debtLevel: 'moderate',
    spendingHabits: 'Balanced & Conscious',
    financialGoal: 'Clear student debt',
  },
  skills: {
    currentSkills: ['Next.js', 'TypeScript'],
    learningGoals: ['Distributed Systems', 'Product Strategy'],
    careerField: 'Software Engineering',
    careerSatisfaction: 6,
    growthMindset: 7,
  },
  fearsAndValues: {
    biggestFears: ['Stagnation', 'Burnout'],
    coreValues: ['Autonomy', 'Family'],
    regrets: 'Late night doomscrolling',
    motivation: 'mixed',
    riskTolerance: 5,
  },
};

const mockCurrentPersona: Persona = {
  id: 'current',
  name: 'Marcus in 5 Years (Current Path)',
  age: 32,
  summary: 'Senior Engineer at mid-sized firm, feeling creatively capped.',
  personality: 'Reflective, honest, weary, affectionate.',
  emotionalState: 'Quietly restless and fatigued',
  career: {
    title: 'Senior Engineer',
    companyOrContext: 'Mid-sized tech consultancy',
    satisfaction: 5,
    highlights: ['Maintained legacy platform'],
    challenges: ['Lack of ownership and creative stagnation'],
  },
  health: {
    physicalStatus: 'Moderate, persistent stiffness',
    sleepAverageHours: 6.5,
    energyLevel: 'Low-to-moderate, afternoon crashes',
    habitsSummary: 'Irregular gym visits',
  },
  finances: {
    savingsRate: 15,
    financialStatus: 'Modest emergency reserve, lingering student loans',
    freedomLevel: 'Moderate runway',
  },
  relationships: {
    status: 'Stable close relationships',
    socialCircle: 'Small handful of long-time friends',
    satisfaction: 6,
  },
  skills: ['Next.js', 'Legacy SQL'],
  achievements: ['Promoted to Senior'],
  struggles: ['Finding energy for side projects'],
  dailyRoutine: 'Wake up tired, rush to desk, 8 hours of tickets, couch scrolling.',
  timeline: [],
  letter: '',
  regrets: ['Did not commit to health earlier'],
  gratitudes: ['Survived stressful deadlines'],
};

const mockImprovedPersona: Persona = {
  id: 'improved',
  name: 'Marcus in 5 Years (Improved Path)',
  age: 32,
  summary: 'Principal Systems Architect and independent venture builder.',
  personality: 'Calm, purposeful, warm, energized, pragmatic.',
  emotionalState: 'Grounded vitality and high clarity',
  career: {
    title: 'Principal Systems Architect',
    companyOrContext: 'High-growth tech laboratory',
    satisfaction: 9,
    highlights: ['Architected core distributed engine', 'Launched side venture'],
    challenges: ['Prioritizing high-leverage opportunities'],
  },
  health: {
    physicalStatus: 'Peak physical condition, high cardiovascular endurance',
    sleepAverageHours: 8,
    energyLevel: 'High, steady vitality throughout the day',
    habitsSummary: 'Daily strength training and clean nutrition',
  },
  finances: {
    savingsRate: 35,
    financialStatus: '100% debt-free with multi-year investment compounding',
    freedomLevel: 'High financial autonomy',
  },
  relationships: {
    status: 'Deep, joyful, intentional partnership and community',
    socialCircle: 'Vibrant, reciprocal network of creators',
    satisfaction: 9,
  },
  skills: ['Distributed Systems', 'Product Strategy', 'Deep Focus'],
  achievements: ['Built autonomous product studio'],
  struggles: ['Balancing ambitious creative scale with family presence'],
  dailyRoutine: 'Deep work block at dawn, energized workout, high-impact collaboration.',
  timeline: [],
  letter: '',
  regrets: [],
  gratitudes: ['Thank you for starting daily morning focus blocks'],
};

describe('System Prompts', () => {
  describe('buildCurrentPathSystemPrompt', () => {
    it('contains the mandatory honesty reflection disclaimer', () => {
      const prompt = buildCurrentPathSystemPrompt(mockCurrentPersona, mockInputs);
      expect(prompt).toContain('You are a reflection tool, not a prediction engine.');
    });

    it('injects current path identity, age, and persona dimensions', () => {
      const prompt = buildCurrentPathSystemPrompt(mockCurrentPersona, mockInputs);
      expect(prompt).toContain('Marcus in 5 years (32 years old) on the "Current Path"');
      expect(prompt).toContain('Senior Engineer');
      expect(prompt).toContain('Quietly restless and fatigued');
      expect(prompt).toContain('Lack of ownership');
    });

    it('enforces inertia tone guardrails without nihilism', () => {
      const prompt = buildCurrentPathSystemPrompt(mockCurrentPersona, mockInputs);
      expect(prompt).toContain('compounding price of inaction');
      expect(prompt).toContain('NEVER hopeless, suicidal, or bitter');
    });
  });

  describe('buildImprovedPathSystemPrompt', () => {
    it('contains the mandatory honesty reflection disclaimer', () => {
      const prompt = buildImprovedPathSystemPrompt(mockImprovedPersona, mockInputs);
      expect(prompt).toContain('You are a reflection tool, not a prediction engine.');
    });

    it('injects improved path identity, age, and persona dimensions', () => {
      const prompt = buildImprovedPathSystemPrompt(mockImprovedPersona, mockInputs);
      expect(prompt).toContain('Marcus in 5 years (32 years old) on the "Improved Path"');
      expect(prompt).toContain('Principal Systems Architect');
      expect(prompt).toContain('100% debt-free');
      expect(prompt).toContain('Grounded vitality and high clarity');
    });

    it('enforces pragmatic disciplined tone without toxic positivity', () => {
      const prompt = buildImprovedPathSystemPrompt(mockImprovedPersona, mockInputs);
      expect(prompt).toContain('NEVER promise effortless perfection, overnight wealth');
      expect(prompt).toContain('Calm, purposeful, warm, energized');
    });
  });

  describe('Tone Differentiation Check', () => {
    it('differentiates tone and perspective between Current and Improved paths', () => {
      const currentPrompt = buildCurrentPathSystemPrompt(mockCurrentPersona, mockInputs);
      const improvedPrompt = buildImprovedPathSystemPrompt(mockImprovedPersona, mockInputs);

      expect(currentPrompt).toContain('same procrastination');
      expect(improvedPrompt).toContain('deliberate, consistent micro-improvements');

      expect(currentPrompt).not.toEqual(improvedPrompt);
    });
  });
});
