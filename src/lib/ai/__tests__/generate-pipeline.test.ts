import { generatePipeline, PipelineProgress } from '../generate-pipeline';
import { OnboardingData, LifeModel, Persona, TimelineMilestone } from '@/types';
import { generateLifeModel } from '../generate-life-model';
import { generatePersonas } from '../generate-personas';
import { generateTimelines } from '../generate-timeline';
import { generateLetters } from '../generate-letter';
import { generateDualRegretGratitude } from '../generate-regret-gratitude';

jest.mock('../generate-life-model');
jest.mock('../generate-personas');
jest.mock('../generate-timeline');
jest.mock('../generate-letter');
jest.mock('../generate-regret-gratitude');

const mockGenerateLifeModel = generateLifeModel as jest.MockedFunction<typeof generateLifeModel>;
const mockGeneratePersonas = generatePersonas as jest.MockedFunction<typeof generatePersonas>;
const mockGenerateTimelines = generateTimelines as jest.MockedFunction<typeof generateTimelines>;
const mockGenerateLetters = generateLetters as jest.MockedFunction<typeof generateLetters>;
const mockGenerateDualRegretGratitude = generateDualRegretGratitude as jest.MockedFunction<
  typeof generateDualRegretGratitude
>;

const mockInputs: OnboardingData = {
  name: 'Casey',
  age: 28,
  goals: { shortTerm: ['Ship MVP'], longTerm: ['Lead Systems Engineering'], dreamLife: 'Autonomous and creative' },
  habits: { sleepHours: 7, exerciseFrequency: 'weekly', dietQuality: 'good', screenTime: 4, meditationOrReflection: true },
  time: { workHoursPerWeek: 45, studyHoursPerWeek: 5, socialHoursPerWeek: 8, creativeHoursPerWeek: 4, wastedHoursPerWeek: 3 },
  money: { incomeRange: '$90k', savingsRate: 20, debtLevel: 'none', spendingHabits: 'Frugal', financialGoal: 'FI' },
  skills: { currentSkills: ['TypeScript'], learningGoals: ['AI Agents'], careerField: 'Software', careerSatisfaction: 7, growthMindset: 8 },
  fearsAndValues: { biggestFears: ['Stagnation'], coreValues: ['Craftsmanship'], regrets: 'None', motivation: 'internal', riskTolerance: 7 },
};

const mockTimeline: TimelineMilestone[] = [
  { year: 1, title: 'Year 1 Milestone', description: 'Foundation', mood: 'positive', metrics: { savingsRate: '20%' } },
];

const mockPersonaBase: Persona = {
  id: 'current',
  name: 'Current Self',
  age: 33,
  summary: 'A current path summary',
  personality: 'Pragmatic',
  emotionalState: 'Neutral',
  career: { title: 'Software Engineer', companyOrContext: 'Tech Corp', satisfaction: 6, highlights: ['Ship features'], challenges: ['Routine work'] },
  health: { physicalStatus: 'Fair', sleepAverageHours: 7, energyLevel: 'Moderate', habitsSummary: 'Irregular routines' },
  finances: { savingsRate: 15, financialStatus: 'Stable', freedomLevel: 'Moderate' },
  relationships: { status: 'Single', socialCircle: 'Small circle', satisfaction: 6 },
  skills: ['TypeScript'],
  achievements: ['Delivered V1'],
  struggles: ['Distraction'],
  dailyRoutine: 'Work then unwind',
  timeline: [],
  letter: '',
  regrets: [],
  gratitudes: [],
};

const mockBaseModel: LifeModel = {
  id: 'model-123',
  createdAt: '2026-10-04T00:00:00.000Z',
  inputs: mockInputs,
  currentPath: { ...mockPersonaBase, id: 'current', name: 'Current Self' },
  improvedPath: { ...mockPersonaBase, id: 'improved', name: 'Improved Self' },
  habitLevers: [
    {
      id: 'sleep',
      label: 'Sleep Hours',
      min: 4,
      max: 10,
      step: 0.5,
      currentValue: 7,
      unit: 'hrs',
    },
  ],
};

describe('generatePipeline Orchestrator', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGenerateLifeModel.mockImplementation(async (_inputs, options) => {
      options?.onTokenUsage?.({ promptTokens: 100, completionTokens: 50, totalTokens: 150 });
      return mockBaseModel;
    });

    mockGeneratePersonas.mockImplementation(async (_inputs, options) => {
      options?.onTokenUsage?.({ promptTokens: 120, completionTokens: 60, totalTokens: 180 });
      return {
        currentPath: { ...mockPersonaBase, id: 'current', summary: 'Enriched Current' },
        improvedPath: { ...mockPersonaBase, id: 'improved', summary: 'Enriched Improved' },
      };
    });

    mockGenerateTimelines.mockImplementation(async (_inputs, options) => {
      options?.onTokenUsage?.({ promptTokens: 80, completionTokens: 40, totalTokens: 120 });
      return {
        currentTimeline: mockTimeline,
        improvedTimeline: mockTimeline,
      };
    });

    mockGenerateLetters.mockImplementation(async (_inputs, options) => {
      options?.onTokenUsage?.({ promptTokens: 90, completionTokens: 70, totalTokens: 160 });
      return {
        currentLetter: 'Letter from current future',
        improvedLetter: 'Letter from improved future',
      };
    });

    mockGenerateDualRegretGratitude.mockImplementation(async (_inputs, options) => {
      options?.onTokenUsage?.({ promptTokens: 50, completionTokens: 30, totalTokens: 80 });
      return {
        current: {
          regrets: ['Current regret 1'],
          gratitudes: ['Current gratitude 1'],
        },
        improved: {
          regrets: ['Improved regret 1'],
          gratitudes: ['Improved gratitude 1'],
        },
      };
    });
  });

  it('successfully runs all 5 generation stages and assembles complete LifeModel', async () => {
    const progressList: PipelineProgress[] = [];

    const result = await generatePipeline(mockInputs, {
      onProgress: (p) => progressList.push(p),
    });

    expect(mockGenerateLifeModel).toHaveBeenCalledWith(
      mockInputs,
      expect.objectContaining({ signal: undefined })
    );
    expect(mockGeneratePersonas).toHaveBeenCalledWith(
      mockInputs,
      expect.objectContaining({
        baseModel: mockBaseModel,
        signal: undefined,
      })
    );
    expect(mockGenerateTimelines).toHaveBeenCalledWith(
      mockInputs,
      expect.objectContaining({
        currentSummary: 'Enriched Current',
        improvedSummary: 'Enriched Improved',
        signal: undefined,
      })
    );
    expect(mockGenerateLetters).toHaveBeenCalledWith(
      mockInputs,
      expect.objectContaining({
        currentContext: 'Enriched Current',
        improvedContext: 'Enriched Improved',
        signal: undefined,
      })
    );
    expect(mockGenerateDualRegretGratitude).toHaveBeenCalledWith(
      mockInputs,
      expect.objectContaining({
        currentContext: 'Enriched Current',
        improvedContext: 'Enriched Improved',
        signal: undefined,
      })
    );

    // Verify model assembly
    expect(result.model.id).toBe('model-123');
    expect(result.model.currentPath.summary).toBe('Enriched Current');
    expect(result.model.currentPath.timeline).toEqual(mockTimeline);
    expect(result.model.currentPath.letter).toBe('Letter from current future');
    expect(result.model.currentPath.regrets).toEqual(['Current regret 1']);
    expect(result.model.currentPath.gratitudes).toEqual(['Current gratitude 1']);

    expect(result.model.improvedPath.summary).toBe('Enriched Improved');
    expect(result.model.improvedPath.timeline).toEqual(mockTimeline);
    expect(result.model.improvedPath.letter).toBe('Letter from improved future');
    expect(result.model.improvedPath.regrets).toEqual(['Improved regret 1']);
    expect(result.model.improvedPath.gratitudes).toEqual(['Improved gratitude 1']);

    // Verify token accumulation: 150 + 180 + 120 + 160 + 80 = 690
    expect(result.tokenUsage.promptTokens).toBe(100 + 120 + 80 + 90 + 50);
    expect(result.tokenUsage.completionTokens).toBe(50 + 60 + 40 + 70 + 30);
    expect(result.tokenUsage.totalTokens).toBe(690);

    // Verify progress progression
    expect(progressList.length).toBe(6);
    expect(progressList.map((p) => p.stage)).toEqual([
      'life-model',
      'personas',
      'timelines',
      'letters',
      'reflections',
      'complete',
    ]);
    expect(progressList.map((p) => p.progressPercent)).toEqual([20, 40, 60, 80, 95, 100]);
  });

  it('handles invocation without options or onProgress callback', async () => {
    const result = await generatePipeline(mockInputs);
    expect(result.model).toBeDefined();
    expect(result.tokenUsage.totalTokens).toBe(690);
  });

  it('throws an error if inputs are missing', async () => {
    await expect(generatePipeline(null as unknown as OnboardingData)).rejects.toThrow(
      'Missing required onboarding inputs for pipeline generation.'
    );
  });

  it('halts immediately when pre-aborted signal is provided', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(generatePipeline(mockInputs, { signal: controller.signal })).rejects.toThrow(
      'Pipeline generation was aborted'
    );
    expect(mockGenerateLifeModel).not.toHaveBeenCalled();
  });

  it('halts mid-pipeline and does not call later stages if aborted during execution', async () => {
    const controller = new AbortController();

    mockGeneratePersonas.mockImplementation(async () => {
      controller.abort();
      return {
        currentPath: { ...mockPersonaBase, id: 'current' },
        improvedPath: { ...mockPersonaBase, id: 'improved' },
      };
    });

    await expect(generatePipeline(mockInputs, { signal: controller.signal })).rejects.toThrow(
      'Pipeline generation was aborted'
    );
    expect(mockGenerateLifeModel).toHaveBeenCalled();
    expect(mockGeneratePersonas).toHaveBeenCalled();
    expect(mockGenerateTimelines).not.toHaveBeenCalled();
    expect(mockGenerateLetters).not.toHaveBeenCalled();
  });

  it('propagates errors when any intermediate stage fails', async () => {
    mockGenerateTimelines.mockRejectedValue(new Error('Timeline generation timed out'));

    await expect(generatePipeline(mockInputs)).rejects.toThrow(
      'Timeline generation timed out'
    );
    expect(mockGenerateLetters).not.toHaveBeenCalled();
    expect(mockGenerateDualRegretGratitude).not.toHaveBeenCalled();
  });
});
