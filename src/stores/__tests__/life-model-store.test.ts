import { useLifeModelStore } from '../life-model-store';
import { LifeModel, Persona } from '@/types';
import { STORAGE_PREFIX } from '@/lib/constants';

const createMockPersona = (id: 'current' | 'improved'): Persona => ({
  id,
  name: `Mock Persona ${id}`,
  age: 33,
  summary: 'Mock summary',
  personality: 'Mock personality',
  emotionalState: 'Calm',
  career: {
    title: 'Engineer',
    companyOrContext: 'Tech',
    satisfaction: 8,
    highlights: [],
    challenges: [],
  },
  health: {
    physicalStatus: 'Good',
    sleepAverageHours: 7,
    energyLevel: 'Medium',
    habitsSummary: 'Moderate',
  },
  finances: {
    savingsRate: 20,
    financialStatus: 'Stable',
    freedomLevel: 'Medium',
  },
  relationships: {
    status: 'Single',
    socialCircle: 'Close friends',
    satisfaction: 7,
  },
  skills: ['TypeScript'],
  achievements: [],
  struggles: [],
  dailyRoutine: 'Routine',
  timeline: [],
  letter: 'Letter text',
  regrets: [],
  gratitudes: [],
});

const mockLifeModel: LifeModel = {
  id: 'model-xyz',
  createdAt: '2026-10-03T12:00:00Z',
  inputs: {} as any,
  currentPath: createMockPersona('current'),
  improvedPath: createMockPersona('improved'),
  habitLevers: [
    {
      id: 'sleep-hours',
      label: 'Sleep Hours',
      min: 4,
      max: 10,
      step: 0.5,
      currentValue: 7,
      unit: 'hours',
    },
    {
      id: 'exercise-freq',
      label: 'Exercise Frequency',
      min: 0,
      max: 7,
      step: 1,
      currentValue: 3,
      unit: 'days/week',
    },
  ],
};

describe('useLifeModelStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useLifeModelStore.getState().resetLifeModel();
  });

  it('initializes with null model and default flags', () => {
    const state = useLifeModelStore.getState();
    expect(state.model).toBeNull();
    expect(state.isGenerating).toBe(false);
    expect(state.error).toBeNull();
    expect(state.lastGeneratedAt).toBeNull();
    expect(state.hasModel()).toBe(false);
  });

  it('sets a generated LifeModel and updates timestamps', () => {
    const store = useLifeModelStore.getState();
    store.setLifeModel(mockLifeModel);

    const state = useLifeModelStore.getState();
    expect(state.model).toEqual(mockLifeModel);
    expect(state.hasModel()).toBe(true);
    expect(state.isGenerating).toBe(false);
    expect(state.error).toBeNull();
    expect(state.lastGeneratedAt).not.toBeNull();
  });

  it('manages generation lifecycle and error states', () => {
    const store = useLifeModelStore.getState();

    store.setError('Previous error');
    expect(useLifeModelStore.getState().error).toBe('Previous error');

    // Starting generation clears error
    store.setGenerating(true);
    expect(useLifeModelStore.getState().isGenerating).toBe(true);
    expect(useLifeModelStore.getState().error).toBeNull();

    // Catching error halts generation
    store.setError('API Timeout');
    expect(useLifeModelStore.getState().isGenerating).toBe(false);
    expect(useLifeModelStore.getState().error).toBe('API Timeout');
  });

  it('updates habit lever values immutably', () => {
    const store = useLifeModelStore.getState();
    store.setLifeModel(mockLifeModel);

    store.updateHabitLever('sleep-hours', 8.5);

    const state = useLifeModelStore.getState();
    const sleepLever = state.model?.habitLevers.find((l) => l.id === 'sleep-hours');
    expect(sleepLever?.currentValue).toBe(8.5);

    // Other levers remain untouched
    const exerciseLever = state.model?.habitLevers.find((l) => l.id === 'exercise-freq');
    expect(exerciseLever?.currentValue).toBe(3);
  });

  it('handles updateHabitLever gracefully when model is null', () => {
    const store = useLifeModelStore.getState();
    store.updateHabitLever('sleep-hours', 9);
    expect(useLifeModelStore.getState().model).toBeNull();
  });

  it('updates persona sub-properties immutably', () => {
    const store = useLifeModelStore.getState();
    store.setLifeModel(mockLifeModel);

    store.updatePersona('improved', {
      summary: 'Updated improved vision',
      emotionalState: 'Radiant',
    });

    const state = useLifeModelStore.getState();
    expect(state.model?.improvedPath.summary).toBe('Updated improved vision');
    expect(state.model?.improvedPath.emotionalState).toBe('Radiant');
    expect(state.model?.currentPath.summary).toBe('Mock summary');
  });

  it('handles updatePersona gracefully when model is null', () => {
    const store = useLifeModelStore.getState();
    store.updatePersona('current', { summary: 'New summary' });
    expect(useLifeModelStore.getState().model).toBeNull();
  });

  it('resets life model to initial state', () => {
    const store = useLifeModelStore.getState();
    store.setLifeModel(mockLifeModel);
    store.resetLifeModel();

    const state = useLifeModelStore.getState();
    expect(state.model).toBeNull();
    expect(state.hasModel()).toBe(false);
  });

  it('persists data to localStorage under future-you:life-model', () => {
    const store = useLifeModelStore.getState();
    store.setLifeModel(mockLifeModel);

    const raw = localStorage.getItem(`${STORAGE_PREFIX}life-model`);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.model.id).toBe('model-xyz');
  });
});
