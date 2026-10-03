import { renderHook, act } from '@testing-library/react';
import { useGenerationPipeline } from '../use-generation-pipeline';
import * as pipelineModule from '@/lib/ai/generate-pipeline';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useLifeModelStore } from '@/stores/life-model-store';
import { LifeModel, OnboardingData } from '@/types';

jest.mock('@/lib/ai/generate-pipeline');

const mockGeneratePipeline = pipelineModule.generatePipeline as jest.MockedFunction<
  typeof pipelineModule.generatePipeline
>;

const mockInputs: OnboardingData = {
  name: 'Alex',
  age: 30,
  goals: { shortTerm: ['Lead tech'], longTerm: ['Build studio'], dreamLife: 'Freedom' },
  habits: { sleepHours: 7, exerciseFrequency: 'weekly', dietQuality: 'good', screenTime: 4, meditationOrReflection: true },
  time: { workHoursPerWeek: 40, studyHoursPerWeek: 5, socialHoursPerWeek: 8, creativeHoursPerWeek: 4, wastedHoursPerWeek: 3 },
  money: { incomeRange: '$90k', savingsRate: 20, debtLevel: 'none', spendingHabits: 'Disciplined', financialGoal: 'FI' },
  skills: { currentSkills: ['TS'], learningGoals: ['AI'], careerField: 'Tech', careerSatisfaction: 7, growthMindset: 8 },
  fearsAndValues: { biggestFears: ['Stagnation'], coreValues: ['Creativity'], regrets: 'None', motivation: 'internal', riskTolerance: 6 },
};

const mockModel: LifeModel = {
  id: 'test-model-456',
  createdAt: '2026-10-04T00:00:00.000Z',
  inputs: mockInputs,
  currentPath: {} as any,
  improvedPath: {} as any,
  habitLevers: [],
};

describe('useGenerationPipeline Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useOnboardingStore.setState({
      name: mockInputs.name,
      age: mockInputs.age,
      goals: mockInputs.goals,
      habits: mockInputs.habits,
      time: mockInputs.time,
      money: mockInputs.money,
      skills: mockInputs.skills,
      fearsAndValues: mockInputs.fearsAndValues,
      isCompleted: true,
    });
    useLifeModelStore.setState({
      model: null,
      isGenerating: false,
      error: null,
    });
  });

  it('initializes with idle state', () => {
    const { result } = renderHook(() => useGenerationPipeline());
    expect(result.current.status).toBe('idle');
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.progress).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.model).toBeNull();
  });

  it('fails with error if onboarding inputs are missing', async () => {
    useOnboardingStore.setState({
      name: '',
      age: 0,
      isCompleted: false,
    });

    const onErrorSpy = jest.fn();
    const { result } = renderHook(() =>
      useGenerationPipeline({
        customInputs: undefined,
        onError: onErrorSpy,
      })
    );

    let res: LifeModel | null = null;
    await act(async () => {
      res = await result.current.startGeneration();
    });

    expect(res).toBeNull();
    expect(result.current.status).toBe('error');
    expect(result.current.error).toContain('No completed onboarding data found');
    expect(onErrorSpy).toHaveBeenCalled();
    expect(mockGeneratePipeline).not.toHaveBeenCalled();
  });

  it('executes generation successfully and updates stores', async () => {
    mockGeneratePipeline.mockImplementation(async (_inputs, options) => {
      options?.onProgress?.({
        stage: 'personas',
        label: 'Persona Development',
        description: 'Synthesizing...',
        progressPercent: 40,
        stageIndex: 2,
        totalStages: 5,
      });
      return {
        model: mockModel,
        tokenUsage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
      };
    });

    const onCompleteSpy = jest.fn();
    const { result } = renderHook(() =>
      useGenerationPipeline({
        onComplete: onCompleteSpy,
      })
    );

    let returnedModel: LifeModel | null = null;
    await act(async () => {
      returnedModel = await result.current.startGeneration();
    });

    expect(returnedModel).toEqual(mockModel);
    expect(result.current.status).toBe('completed');
    expect(result.current.model).toEqual(mockModel);
    expect(result.current.progress?.stage).toBe('personas');
    expect(onCompleteSpy).toHaveBeenCalledWith(mockModel);
    expect(useLifeModelStore.getState().model).toEqual(mockModel);
  });

  it('handles pipeline errors gracefully', async () => {
    mockGeneratePipeline.mockRejectedValue(new Error('Rate limit exceeded from provider'));

    const onErrorSpy = jest.fn();
    const { result } = renderHook(() =>
      useGenerationPipeline({
        onError: onErrorSpy,
      })
    );

    await act(async () => {
      await result.current.startGeneration();
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toContain('Rate limit');
    expect(onErrorSpy).toHaveBeenCalled();
    expect(useLifeModelStore.getState().isGenerating).toBe(false);
  });

  it('resets state to idle upon cancellation', async () => {
    const { result } = renderHook(() => useGenerationPipeline());

    act(() => {
      result.current.cancelGeneration();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.progress).toBeNull();
  });

  it('retries generation after error', async () => {
    mockGeneratePipeline
      .mockRejectedValueOnce(new Error('Transient network error'))
      .mockResolvedValueOnce({
        model: mockModel,
        tokenUsage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
      });

    const { result } = renderHook(() => useGenerationPipeline());

    await act(async () => {
      await result.current.startGeneration();
    });
    expect(result.current.status).toBe('error');

    await act(async () => {
      await result.current.retry();
    });
    expect(result.current.status).toBe('completed');
    expect(result.current.model).toEqual(mockModel);
  });
});
