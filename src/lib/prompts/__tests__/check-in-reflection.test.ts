import {
  buildCheckInReflectionSystemPrompt,
  buildCheckInReflectionUserPrompt,
  parseCheckInReflectionResponse,
} from '../check-in-reflection';
import { CheckInLog, HabitDriftVector, OnboardingData, Persona } from '@/types';

const mockLog: CheckInLog = {
  id: 'test-log-1',
  loggedAt: '2026-10-06T00:00:00.000Z',
  sleepHours: 7.5,
  exerciseFrequency: 'weekly',
  deepWorkHoursPerWeek: 30,
  screenTimeHoursPerDay: 3.5,
  savingsRatePercentage: 25,
  notes: 'Felt tired mid-week but protected sleep on Friday.',
};

const mockVectors: HabitDriftVector[] = [
  {
    habitId: 'sleep-hours',
    label: 'Nightly Sleep',
    baselineValue: 6.5,
    targetValue: 8.0,
    actualValue: 7.5,
    unit: 'hrs',
    driftPercentage: 66.7,
    status: 'drifting_current',
  },
  {
    habitId: 'exercise-frequency',
    label: 'Physical Exercise',
    baselineValue: 1,
    targetValue: 5,
    actualValue: 3,
    unit: 'days/wk',
    driftPercentage: 50,
    status: 'drifting_current',
  },
  {
    habitId: 'screen-time',
    label: 'Digital Screen Time',
    baselineValue: 5.0,
    targetValue: 2.0,
    actualValue: 3.5,
    unit: 'hrs/day',
    driftPercentage: 50,
    status: 'drifting_current',
  },
  {
    habitId: 'deep-work',
    label: 'Deep Focus Work',
    baselineValue: 15,
    targetValue: 35,
    actualValue: 30,
    unit: 'hrs/wk',
    driftPercentage: 75,
    status: 'aligned',
  },
  {
    habitId: 'savings-rate',
    label: 'Savings Rate',
    baselineValue: 10,
    targetValue: 30,
    actualValue: 25,
    unit: '%',
    driftPercentage: 75,
    status: 'aligned',
  },
];

describe('check-in-reflection Prompt Generator & Parser', () => {
  describe('buildCheckInReflectionSystemPrompt', () => {
    it('mandates the core reflection honesty disclaimer', () => {
      const prompt = buildCheckInReflectionSystemPrompt();
      expect(prompt).toContain('You are a reflection tool, not a prediction engine');
    });

    it('instructs Improved Path 5-year persona tone without toxic positivity', () => {
      const prompt = buildCheckInReflectionSystemPrompt();
      expect(prompt).toContain('Future Self (Improved Path, 5 years ahead)');
      expect(prompt).toContain('Anti-Toxic Positivity');
      expect(prompt).toContain('futureSelfReflection');
      expect(prompt).toContain('recommendedAdjustment');
      expect(prompt).toContain('encouragement');
    });
  });

  describe('buildCheckInReflectionUserPrompt', () => {
    it('formats user profile, alignment score, and habit drift vectors', () => {
      const mockInputs: Partial<OnboardingData> = {
        name: 'Jordan',
        age: 30,
        skills: {
          currentSkills: ['TypeScript', 'Design'],
          learningGoals: ['Architecture'],
          careerField: 'Software Engineering',
          careerSatisfaction: 8,
          growthMindset: 9,
        },
      };

      const mockImprovedPersona: Partial<Persona> = {
        summary: 'The Compounding Creator',
      };

      const prompt = buildCheckInReflectionUserPrompt(
        mockLog,
        mockVectors,
        63,
        mockInputs,
        mockImprovedPersona
      );

      expect(prompt).toContain('Jordan');
      expect(prompt).toContain('30');
      expect(prompt).toContain('Software Engineering');
      expect(prompt).toContain('The Compounding Creator');
      expect(prompt).toContain('63%');
      expect(prompt).toContain('Nightly Sleep: Logged 7.5 hrs');
      expect(prompt).toContain('Deep Focus Work: Logged 30 hrs/wk');
      expect(prompt).toContain('Felt tired mid-week but protected sleep on Friday.');
    });

    it('gracefully handles missing optional user profile and notes', () => {
      const minimalLog: CheckInLog = {
        id: 'min-log',
        loggedAt: '2026-10-06T00:00:00.000Z',
        sleepHours: 8,
        exerciseFrequency: 'daily',
        deepWorkHoursPerWeek: 40,
        screenTimeHoursPerDay: 2,
        savingsRatePercentage: 30,
      };

      const prompt = buildCheckInReflectionUserPrompt(minimalLog, [], 100);
      expect(prompt).toContain('friend');
      expect(prompt).toContain('100%');
      expect(prompt).toContain('No additional qualitative notes provided.');
    });
  });

  describe('parseCheckInReflectionResponse', () => {
    it('parses clean valid JSON response', () => {
      const raw = JSON.stringify({
        futureSelfReflection: 'I see how hard you tried this week. Sleep came first and it saved your momentum.',
        recommendedAdjustment: 'Wind down 15 minutes earlier without screens.',
        encouragement: 'One step at a time.',
      });

      const parsed = parseCheckInReflectionResponse(raw);
      expect(parsed.futureSelfReflection).toBe(
        'I see how hard you tried this week. Sleep came first and it saved your momentum.'
      );
      expect(parsed.recommendedAdjustment).toBe('Wind down 15 minutes earlier without screens.');
      expect(parsed.encouragement).toBe('One step at a time.');
    });

    it('extracts JSON from markdown code blocks', () => {
      const raw = `\`\`\`json
{
  "futureSelfReflection": "Looking back, this was a pivotal week.",
  "recommendedAdjustment": "Schedule exercise in your morning calendar.",
  "encouragement": "Trust the compounding process."
}
\`\`\``;

      const parsed = parseCheckInReflectionResponse(raw);
      expect(parsed.futureSelfReflection).toBe('Looking back, this was a pivotal week.');
      expect(parsed.recommendedAdjustment).toBe('Schedule exercise in your morning calendar.');
      expect(parsed.encouragement).toBe('Trust the compounding process.');
    });

    it('applies defaults when partial fields are present in response', () => {
      const raw = JSON.stringify({
        futureSelfReflection: 'A steady foundation is forming.',
      });

      const parsed = parseCheckInReflectionResponse(raw);
      expect(parsed.futureSelfReflection).toBe('A steady foundation is forming.');
      expect(parsed.recommendedAdjustment).toBeTruthy();
      expect(parsed.encouragement).toBeTruthy();
    });

    it('throws descriptive error on invalid or empty JSON string', () => {
      expect(() => parseCheckInReflectionResponse('')).toThrow('Empty or invalid response string');
      expect(() => parseCheckInReflectionResponse('not json at all')).toThrow(
        'Unable to parse JSON response'
      );
    });
  });
});
