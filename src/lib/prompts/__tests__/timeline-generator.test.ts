import {
  buildTimelineSystemPrompt,
  buildTimelineUserPrompt,
  buildSinglePathTimelineUserPrompt,
  parseTimelineResponse,
  parseSinglePathTimelineResponse,
} from '../timeline-generator';
import { OnboardingData } from '../../../types/onboarding.types';

const mockInputs: OnboardingData = {
  name: 'Alex Rivera',
  age: 29,
  skills: {
    careerField: 'Software Engineering',
    currentSkills: ['TypeScript', 'React'],
    learningGoals: ['Rust', 'Distributed Systems'],
    careerSatisfaction: 6,
    growthMindset: 8,
  },
  goals: {
    shortTerm: ['Ship MVP', 'Run half marathon'],
    longTerm: ['Become a Staff Architect and publish open-source tools'],
    dreamLife: 'Leading high-impact technology initiatives with location freedom',
  },
  habits: {
    sleepHours: 7,
    exerciseFrequency: 'weekly',
    screenTime: 5,
    dietQuality: 'good',
    meditationOrReflection: true,
  },
  money: {
    incomeRange: '$100k-$150k',
    savingsRate: 20,
    debtLevel: 'low',
    spendingHabits: 'Disciplined',
    financialGoal: 'Achieve financial autonomy',
  },
  time: {
    workHoursPerWeek: 45,
    creativeHoursPerWeek: 4,
    studyHoursPerWeek: 6,
    socialHoursPerWeek: 10,
    wastedHoursPerWeek: 5,
  },
  fearsAndValues: {
    biggestFears: ['Stagnation', 'Unfulfilled potential'],
    coreValues: ['Craftsmanship', 'Autonomy'],
    regrets: 'Not starting side projects earlier',
    motivation: 'internal',
    riskTolerance: 7,
  },
};

describe('Timeline Generator', () => {
  describe('buildTimelineSystemPrompt', () => {
    it('contains the mandatory honesty reflection disclaimer', () => {
      const prompt = buildTimelineSystemPrompt();
      expect(prompt).toContain('You are a reflection tool, not a prediction engine.');
    });

    it('specifies Year 1, Year 3, and Year 5 milestone horizons', () => {
      const prompt = buildTimelineSystemPrompt();
      expect(prompt).toContain('Year 1');
      expect(prompt).toContain('Year 3');
      expect(prompt).toContain('Year 5');
    });

    it('restricts mood values to positive, neutral, and negative', () => {
      const prompt = buildTimelineSystemPrompt();
      expect(prompt).toContain('"positive"');
      expect(prompt).toContain('"neutral"');
      expect(prompt).toContain('"negative"');
    });
  });

  describe('buildTimelineUserPrompt', () => {
    it('injects user name, age, career, and primary goal', () => {
      const prompt = buildTimelineUserPrompt(mockInputs);
      expect(prompt).toContain('Alex Rivera');
      expect(prompt).toContain('age 29');
      expect(prompt).toContain('Software Engineering');
      expect(prompt).toContain('Become a Staff Architect');
    });

    it('embeds persona summaries when provided', () => {
      const prompt = buildTimelineUserPrompt(
        mockInputs,
        'Alex stays at senior engineer level with lingering fatigue.',
        'Alex leads high-impact platform initiatives with boundless clarity.'
      );
      expect(prompt).toContain('Alex stays at senior engineer level with lingering fatigue.');
      expect(prompt).toContain('Alex leads high-impact platform initiatives with boundless clarity.');
    });

    it('handles sparse inputs gracefully', () => {
      const sparsePrompt = buildTimelineUserPrompt({});
      expect(sparsePrompt).toContain('User');
      expect(sparsePrompt).toContain('age 28');
    });
  });

  describe('buildSinglePathTimelineUserPrompt', () => {
    it('generates prompt tailored to current path', () => {
      const prompt = buildSinglePathTimelineUserPrompt('current', mockInputs, 'Context summary');
      expect(prompt).toContain('Current Path');
      expect(prompt).toContain('Age 29 to 34');
      expect(prompt).toContain('Context summary');
    });

    it('generates prompt tailored to improved path', () => {
      const prompt = buildSinglePathTimelineUserPrompt('improved', mockInputs);
      expect(prompt).toContain('Improved Path');
      expect(prompt).toContain('Age 29 to 34');
    });
  });

  describe('parseTimelineResponse', () => {
    it('correctly parses clean valid JSON', () => {
      const mockRaw = JSON.stringify({
        currentTimeline: [
          { year: 1, title: 'Same Desk, Same Routine', description: 'Year 1 passes with minimal change.', mood: 'neutral', metrics: { satisfaction: 5 } },
          { year: 3, title: 'Mounting Frustration', description: 'Year 3 brings increasing fatigue.', mood: 'negative', metrics: { satisfaction: 4 } },
          { year: 5, title: 'Comfortable Drift', description: 'Year 5 settles into status quo.', mood: 'negative', metrics: { satisfaction: 4 } },
        ],
        improvedTimeline: [
          { year: 1, title: 'First Momentum', description: 'Consistent habits establish deep work blocks.', mood: 'positive', metrics: { satisfaction: 7 } },
          { year: 3, title: 'Major Promotion', description: 'Staff architect milestone reached.', mood: 'positive', metrics: { satisfaction: 8 } },
          { year: 5, title: 'Flourishing Autonomy', description: 'Full mastery and deep fulfillment.', mood: 'positive', metrics: { satisfaction: 9 } },
        ],
      });

      const result = parseTimelineResponse(mockRaw, mockInputs);
      expect(result.currentTimeline).toHaveLength(3);
      expect(result.improvedTimeline).toHaveLength(3);
      expect(result.currentTimeline[0].year).toBe(1);
      expect(result.currentTimeline[1].year).toBe(3);
      expect(result.currentTimeline[2].year).toBe(5);
      expect(result.currentTimeline[0].mood).toBe('neutral');
      expect(result.improvedTimeline[0].mood).toBe('positive');
      expect(result.improvedTimeline[1].title).toBe('Major Promotion');
    });

    it('strips markdown code fencing blocks', () => {
      const fenced = '```json\n{"currentTimeline":[], "improvedTimeline":[]}\n```';
      const result = parseTimelineResponse(fenced, mockInputs);
      // Empty lists are normalized to default 3 milestones
      expect(result.currentTimeline).toHaveLength(3);
      expect(result.improvedTimeline).toHaveLength(3);
    });

    it('normalizes non-standard mood strings', () => {
      const mockRaw = JSON.stringify({
        currentTimeline: [
          { year: 1, title: 'Y1', description: 'D1', mood: 'bad' },
          { year: 3, title: 'Y3', description: 'D3', mood: 'difficult' },
          { year: 5, title: 'Y5', description: 'D5', mood: 'low' },
        ],
        improvedTimeline: [
          { year: 1, title: 'Y1', description: 'D1', mood: 'optimistic' },
          { year: 3, title: 'Y3', description: 'D3', mood: 'great' },
          { year: 5, title: 'Y5', description: 'D5', mood: 'high' },
        ],
      });

      const result = parseTimelineResponse(mockRaw, mockInputs);
      expect(result.currentTimeline[0].mood).toBe('negative');
      expect(result.improvedTimeline[0].mood).toBe('positive');
    });

    it('handles missing years by filling with fallback milestones for that year', () => {
      const partialRaw = JSON.stringify({
        currentTimeline: [
          { year: 1, title: 'Only Year 1', description: 'Missing Y3 and Y5', mood: 'neutral' },
        ],
        improvedTimeline: [
          { year: 5, title: 'Only Year 5', description: 'Missing Y1 and Y3', mood: 'positive' },
        ],
      });

      const result = parseTimelineResponse(partialRaw, mockInputs);
      expect(result.currentTimeline).toHaveLength(3);
      expect(result.currentTimeline[0].title).toBe('Only Year 1');
      expect(result.currentTimeline[1].year).toBe(3);
      expect(result.currentTimeline[2].year).toBe(5);

      expect(result.improvedTimeline).toHaveLength(3);
      expect(result.improvedTimeline[0].year).toBe(1);
      expect(result.improvedTimeline[1].year).toBe(3);
      expect(result.improvedTimeline[2].title).toBe('Only Year 5');
    });

    it('falls back cleanly when input is complete garbage or truncated', () => {
      const result = parseTimelineResponse('This is not json at all {{{', mockInputs);
      expect(result.currentTimeline).toHaveLength(3);
      expect(result.improvedTimeline).toHaveLength(3);
      expect(result.currentTimeline[0].year).toBe(1);
      expect(result.improvedTimeline[2].year).toBe(5);
    });
  });

  describe('parseSinglePathTimelineResponse', () => {
    it('parses single path timeline payload', () => {
      const mockRaw = JSON.stringify({
        timeline: [
          { year: 1, title: 'Single Y1', description: 'Desc 1', mood: 'positive' },
          { year: 3, title: 'Single Y3', description: 'Desc 3', mood: 'positive' },
          { year: 5, title: 'Single Y5', description: 'Desc 5', mood: 'positive' },
        ],
      });

      const list = parseSinglePathTimelineResponse(mockRaw, 'improved', mockInputs);
      expect(list).toHaveLength(3);
      expect(list[0].title).toBe('Single Y1');
      expect(list[2].year).toBe(5);
    });

    it('handles raw array directly', () => {
      const mockRaw = JSON.stringify([
        { year: 1, title: 'Array Y1', description: 'Desc 1', mood: 'neutral' },
        { year: 3, title: 'Array Y3', description: 'Desc 3', mood: 'negative' },
        { year: 5, title: 'Array Y5', description: 'Desc 5', mood: 'negative' },
      ]);

      const list = parseSinglePathTimelineResponse(mockRaw, 'current', mockInputs);
      expect(list).toHaveLength(3);
      expect(list[0].title).toBe('Array Y1');
    });

    it('falls back on malformed input', () => {
      const list = parseSinglePathTimelineResponse('invalid', 'current', mockInputs);
      expect(list).toHaveLength(3);
      expect(list[0].year).toBe(1);
    });
  });
});
