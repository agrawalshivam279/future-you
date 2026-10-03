import { regenerateFutures, applyLeverUpdates } from '../regenerate-futures';
import { generatePersona } from '../generate-personas';
import { generateSingleTimeline } from '../generate-timeline';
import { LifeModel, HabitLever, Persona, TimelineMilestone } from '@/types';

jest.mock('../generate-personas');
jest.mock('../generate-timeline');

describe('regenerateFutures Orchestrator', () => {
  const mockGeneratePersona = generatePersona as jest.MockedFunction<typeof generatePersona>;
  const mockGenerateSingleTimeline = generateSingleTimeline as jest.MockedFunction<typeof generateSingleTimeline>;

  const initialLevers: HabitLever[] = [
    { id: 'sleep-hours', label: 'Nightly Sleep', min: 4, max: 12, step: 0.5, currentValue: 7, unit: 'hrs' },
    { id: 'savings-rate', label: 'Savings Rate', min: 0, max: 100, step: 1, currentValue: 20, unit: '%' },
    { id: 'study-hours', label: 'Weekly Study', min: 0, max: 40, step: 1, currentValue: 5, unit: 'hrs/wk' },
  ];

  const mockExistingModel: LifeModel = {
    id: 'model-123',
    createdAt: '2026-10-04T00:00:00.000Z',
    inputs: {
      name: 'Casey',
      age: 29,
      goals: { shortTerm: ['Launch'], longTerm: ['Lead'], dreamLife: 'Freedom' },
      habits: { sleepHours: 7, exerciseFrequency: 'weekly', dietQuality: 'good', screenTime: 4, meditationOrReflection: true },
      time: { workHoursPerWeek: 40, studyHoursPerWeek: 5, socialHoursPerWeek: 8, creativeHoursPerWeek: 3, wastedHoursPerWeek: 4 },
      money: { incomeRange: '$80k', savingsRate: 20, debtLevel: 'none', spendingHabits: 'Disciplined', financialGoal: 'Freedom' },
      skills: { currentSkills: ['Code'], learningGoals: ['AI'], careerField: 'Software', careerSatisfaction: 7, growthMindset: 8 },
      fearsAndValues: { biggestFears: ['Stagnation'], coreValues: ['Autonomy'], regrets: 'None', motivation: 'internal', riskTolerance: 6 },
    },
    currentPath: {
      id: 'current',
      name: 'Casey (Current)',
      age: 34,
      summary: 'Current inertia trajectory.',
      personality: 'Reflective',
      emotionalState: 'Restless',
      career: { title: 'Engineer', companyOrContext: 'Corp', satisfaction: 6, highlights: [], challenges: [] },
      health: { physicalStatus: 'Moderate', sleepAverageHours: 7, energyLevel: 'Moderate', habitsSummary: 'Routine' },
      finances: { savingsRate: 20, financialStatus: 'Stable', freedomLevel: 'Moderate' },
      relationships: { status: 'Good', socialCircle: 'Friends', satisfaction: 7 },
      skills: ['Code'],
      achievements: [],
      struggles: [],
      dailyRoutine: 'Usual day',
      timeline: [],
      letter: '',
      regrets: [],
      gratitudes: [],
    },
    improvedPath: {
      id: 'improved',
      name: 'Casey (Improved)',
      age: 34,
      summary: 'Baseline improved path.',
      personality: 'Calm and focused',
      emotionalState: 'Vital',
      career: { title: 'Principal Architect', companyOrContext: 'Lab', satisfaction: 9, highlights: [], challenges: [] },
      health: { physicalStatus: 'Strong', sleepAverageHours: 8, energyLevel: 'High', habitsSummary: 'Fitness' },
      finances: { savingsRate: 35, financialStatus: 'Compounding', freedomLevel: 'High' },
      relationships: { status: 'Connected', socialCircle: 'Community', satisfaction: 9 },
      skills: ['Code', 'Architecture'],
      achievements: ['Launched'],
      struggles: [],
      dailyRoutine: 'Morning deep work',
      timeline: [{ year: 1, title: 'Old Milestone', description: 'Desc', mood: 'positive' }],
      letter: 'Old letter',
      regrets: [],
      gratitudes: [],
    },
    habitLevers: initialLevers,
  };

  const recalculatedPersona: Persona = {
    ...mockExistingModel.improvedPath,
    summary: 'Newly recalculated improved path with 8.5h sleep and 35% savings.',
    health: { ...mockExistingModel.improvedPath.health, sleepAverageHours: 8.5 },
    finances: { ...mockExistingModel.improvedPath.finances, savingsRate: 35 },
  };

  const recalculatedTimeline: TimelineMilestone[] = [
    { year: 1, title: 'Year 1 Shift', description: 'Sleeping 8.5h', mood: 'positive' },
    { year: 3, title: 'Year 3 Shift', description: 'Compound acceleration', mood: 'positive' },
    { year: 5, title: 'Year 5 Shift', description: 'Maximum freedom', mood: 'positive' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGeneratePersona.mockResolvedValue(recalculatedPersona);
    mockGenerateSingleTimeline.mockResolvedValue(recalculatedTimeline);
  });

  describe('applyLeverUpdates', () => {
    it('updates levers via dictionary and clamps to limits', () => {
      const updates = {
        'sleep-hours': 14, // max is 12 -> clamp to 12
        'savings-rate': 30, // within 0-100 -> 30
      };

      const result = applyLeverUpdates(initialLevers, updates);

      const sleep = result.find((l) => l.id === 'sleep-hours');
      const savings = result.find((l) => l.id === 'savings-rate');
      const study = result.find((l) => l.id === 'study-hours');

      expect(sleep?.currentValue).toBe(12);
      expect(savings?.currentValue).toBe(30);
      expect(study?.currentValue).toBe(5); // unchanged
    });

    it('updates levers via HabitLever array and clamps values below min', () => {
      const updates: HabitLever[] = [
        { ...initialLevers[0], currentValue: 2 }, // min is 4 -> clamp to 4
      ];

      const result = applyLeverUpdates(initialLevers, updates);
      const sleep = result.find((l) => l.id === 'sleep-hours');

      expect(sleep?.currentValue).toBe(4);
    });
  });

  describe('regenerateFutures', () => {
    it('recalculates improved persona and timeline while preserving Current Path', async () => {
      const progress: string[] = [];

      const result = await regenerateFutures(
        mockExistingModel,
        { 'sleep-hours': 8.5, 'savings-rate': 35 },
        { onProgress: (p) => progress.push(p) }
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('model-123');
      expect(result.createdAt).toBe('2026-10-04T00:00:00.000Z');
      expect(result.currentPath).toBe(mockExistingModel.currentPath); // preserved
      expect(result.improvedPath.summary).toContain('Newly recalculated');
      expect(result.improvedPath.timeline).toEqual(recalculatedTimeline);

      const sleepLever = result.habitLevers.find((l) => l.id === 'sleep-hours');
      expect(sleepLever?.currentValue).toBe(8.5);

      expect(mockGeneratePersona).toHaveBeenCalledTimes(1);
      expect(mockGenerateSingleTimeline).toHaveBeenCalledTimes(1);
      expect(progress.length).toBeGreaterThan(0);
    });

    it('skips timeline recalculation when regenerateTimeline is false', async () => {
      const result = await regenerateFutures(
        mockExistingModel,
        { 'study-hours': 15 },
        { regenerateTimeline: false }
      );

      expect(result.improvedPath.summary).toContain('Newly recalculated');
      expect(result.improvedPath.timeline).toEqual(mockExistingModel.improvedPath.timeline);
      expect(mockGeneratePersona).toHaveBeenCalledTimes(1);
      expect(mockGenerateSingleTimeline).not.toHaveBeenCalled();
    });

    it('throws error when existingModel is invalid or missing', async () => {
      await expect(
        regenerateFutures(null as unknown as LifeModel, {})
      ).rejects.toThrow(/valid existing LifeModel is required/i);
    });

    it('halts immediately when AbortSignal is cancelled', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(
        regenerateFutures(mockExistingModel, {}, { signal: controller.signal })
      ).rejects.toThrow(/Generation cancelled by user/i);

      expect(mockGeneratePersona).not.toHaveBeenCalled();
    });

    it('accumulates and reports token usage from persona and timeline calls', async () => {
      mockGeneratePersona.mockImplementationOnce(async (_path, _inputs, options) => {
        options?.onTokenUsage?.({ promptTokens: 100, completionTokens: 200, totalTokens: 300 });
        return recalculatedPersona;
      });

      mockGenerateSingleTimeline.mockImplementationOnce(async (_path, _inputs, options) => {
        options?.onTokenUsage?.({ promptTokens: 50, completionTokens: 100, totalTokens: 150 });
        return recalculatedTimeline;
      });

      let finalUsage: unknown = null;

      await regenerateFutures(
        mockExistingModel,
        { 'sleep-hours': 8 },
        {
          onTokenUsage: (usage) => {
            finalUsage = usage;
          },
        }
      );

      expect(finalUsage).toEqual({
        promptTokens: 150,
        completionTokens: 300,
        totalTokens: 450,
      });
    });
  });
});
