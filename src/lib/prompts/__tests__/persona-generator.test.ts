import {
  buildPersonaSystemPrompt,
  buildPersonaUserPrompt,
  parsePersonaResponse,
} from '../persona-generator';
import { OnboardingData, Persona } from '@/types';

describe('Persona Prompt Generator & Parser', () => {
  const mockOnboardingData: OnboardingData = {
    name: 'Taylor',
    age: 29,
    goals: {
      shortTerm: ['Ship project'],
      longTerm: ['Lead company'],
      dreamLife: 'Peaceful coastal living with deep creative work',
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
      creativeHoursPerWeek: 3,
      wastedHoursPerWeek: 4,
    },
    money: {
      incomeRange: '$80k',
      savingsRate: 20,
      debtLevel: 'none',
      spendingHabits: 'Mindful',
      financialGoal: 'Financial freedom',
    },
    skills: {
      currentSkills: ['TypeScript', 'Architecture'],
      learningGoals: ['AI', 'Leadership'],
      careerField: 'Technology',
      careerSatisfaction: 7,
      growthMindset: 8,
    },
    fearsAndValues: {
      biggestFears: ['Stagnation'],
      coreValues: ['Autonomy', 'Creativity'],
      regrets: 'Not moving faster',
      motivation: 'internal',
      riskTolerance: 6,
    },
  };

  const validPersonaJson = JSON.stringify({
    name: 'Taylor in 5 Years (Current Path)',
    age: 34,
    summary: 'A seasoned engineer who stayed comfortable.',
    personality: 'Pragmatic and reflective.',
    emotionalState: 'Calm but with unexpressed ambition.',
    career: {
      title: 'Senior Engineer',
      companyOrContext: 'Enterprise Corp',
      satisfaction: 6,
      highlights: ['Promoted once'],
      challenges: ['Bureaucracy'],
    },
    health: {
      physicalStatus: 'Moderate',
      sleepAverageHours: 7,
      energyLevel: 'Steady',
      habitsSummary: 'Occasional workouts',
    },
    finances: {
      savingsRate: 20,
      financialStatus: 'Comfortable',
      freedomLevel: 'Moderate',
    },
    relationships: {
      status: 'Stable friendships',
      socialCircle: 'Close friends',
      satisfaction: 7,
    },
    skills: ['TypeScript', 'React'],
    achievements: ['Delivered systems'],
    struggles: ['Finding deep inspiration'],
    dailyRoutine: 'Standard day of engineering sprints.',
  });

  it('includes mandatory reflection disclaimer in system prompts for both paths', () => {
    const currentSys = buildPersonaSystemPrompt('current');
    const improvedSys = buildPersonaSystemPrompt('improved');

    expect(currentSys).toContain('You are a reflection tool, not a prediction engine.');
    expect(improvedSys).toContain('You are a reflection tool, not a prediction engine.');
  });

  it('differentiates tone guidance between current and improved paths', () => {
    const currentSys = buildPersonaSystemPrompt('current');
    const improvedSys = buildPersonaSystemPrompt('improved');

    expect(currentSys).toContain('Current Path');
    expect(currentSys).toContain('inertia');
    expect(improvedSys).toContain('Improved Path');
    expect(improvedSys).toContain('compounding');
  });

  it('builds a detailed user prompt containing demographics, survey inputs and levers', () => {
    const userPrompt = buildPersonaUserPrompt('current', mockOnboardingData, undefined, [
      { id: 'sleep', label: 'Nightly Sleep', min: 4, max: 12, step: 0.5, currentValue: 8, unit: 'hrs' },
    ]);

    expect(userPrompt).toContain('Taylor');
    expect(userPrompt).toContain('Target 5-Year Age: 34');
    expect(userPrompt).toContain('Nightly Sleep: 8 hrs');
  });

  it('parses valid JSON response into typed Persona model', () => {
    const persona = parsePersonaResponse(validPersonaJson, 'current', mockOnboardingData);

    expect(persona.id).toBe('current');
    expect(persona.name).toBe('Taylor in 5 Years (Current Path)');
    expect(persona.age).toBe(34);
    expect(persona.career.title).toBe('Senior Engineer');
    expect(persona.health.sleepAverageHours).toBe(7);
  });

  it('handles markdown code fences in LLM output', () => {
    const fenced = `\`\`\`json\n${validPersonaJson}\n\`\`\``;
    const persona = parsePersonaResponse(fenced, 'current', mockOnboardingData);

    expect(persona.name).toBe('Taylor in 5 Years (Current Path)');
    expect(persona.id).toBe('current');
  });

  it('preserves existing persona fields when refining', () => {
    const existingPersona: Partial<Persona> = {
      timeline: [{ year: 1, title: 'Year 1 Step', description: 'desc', mood: 'positive' }],
      letter: 'Dear Past Self...',
    };

    const persona = parsePersonaResponse(validPersonaJson, 'current', mockOnboardingData, existingPersona);

    expect(persona.timeline).toHaveLength(1);
    expect(persona.timeline[0].title).toBe('Year 1 Step');
    expect(persona.letter).toBe('Dear Past Self...');
  });

  it('throws an error if response cannot be parsed as JSON', () => {
    expect(() => {
      parsePersonaResponse('Not JSON at all', 'current', mockOnboardingData);
    }).toThrow(/Failed to parse LLM Persona response as JSON/i);
  });
});
