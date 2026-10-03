import { useOnboardingStore } from '../onboarding-store';
import { STORAGE_PREFIX } from '@/lib/constants';

describe('useOnboardingStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useOnboardingStore.getState().resetOnboarding();
  });

  it('initializes with default wizard step and neutral data', () => {
    const state = useOnboardingStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.isCompleted).toBe(false);
    expect(state.habits.sleepHours).toBe(7);
    expect(state.habits.exerciseFrequency).toBe('weekly');
  });

  it('navigates steps within 1 to 6 boundary', () => {
    const store = useOnboardingStore.getState();

    // Step navigation forwards
    store.nextStep();
    expect(useOnboardingStore.getState().currentStep).toBe(2);

    // Explicit valid jump
    store.setCurrentStep(5);
    expect(useOnboardingStore.getState().currentStep).toBe(5);

    // Upper clamp
    store.setCurrentStep(10);
    expect(useOnboardingStore.getState().currentStep).toBe(6);
    store.nextStep();
    expect(useOnboardingStore.getState().currentStep).toBe(6);

    // Lower clamp
    store.setCurrentStep(-2);
    expect(useOnboardingStore.getState().currentStep).toBe(1);
    store.prevStep();
    expect(useOnboardingStore.getState().currentStep).toBe(1);
  });

  it('updates demographic basics', () => {
    const store = useOnboardingStore.getState();
    store.updateBasics('  Maya Chen  ', 29);

    const updated = useOnboardingStore.getState();
    expect(updated.name).toBe('Maya Chen');
    expect(updated.age).toBe(29);
  });

  it('partially updates goals section', () => {
    const store = useOnboardingStore.getState();
    store.updateGoals({
      shortTerm: ['Publish first paper'],
      dreamLife: 'Leading an AI ethics research group.',
    });

    const updated = useOnboardingStore.getState();
    expect(updated.goals.shortTerm).toEqual(['Publish first paper']);
    expect(updated.goals.dreamLife).toBe('Leading an AI ethics research group.');
    expect(updated.goals.longTerm).toEqual([]);
  });

  it('partially updates habits, time, money, and skills sections', () => {
    const store = useOnboardingStore.getState();
    store.updateHabits({ sleepHours: 8, exerciseFrequency: 'daily' });
    store.updateTime({ workHoursPerWeek: 45, studyHoursPerWeek: 10 });
    store.updateMoney({ savingsRate: 25, debtLevel: 'low' });
    store.updateSkills({ careerField: 'Neuroscience', careerSatisfaction: 8 });
    store.updateFearsAndValues({ motivation: 'internal', riskTolerance: 7 });

    const state = useOnboardingStore.getState();
    expect(state.habits.sleepHours).toBe(8);
    expect(state.habits.exerciseFrequency).toBe('daily');
    expect(state.time.workHoursPerWeek).toBe(45);
    expect(state.money.savingsRate).toBe(25);
    expect(state.skills.careerField).toBe('Neuroscience');
    expect(state.fearsAndValues.motivation).toBe('internal');
  });

  it('extracts clean OnboardingData matching domain schema', () => {
    const store = useOnboardingStore.getState();
    store.updateBasics('Devin', 31);
    store.updateHabits({ sleepHours: 6 });

    const payload = store.getOnboardingData();
    expect(payload.name).toBe('Devin');
    expect(payload.age).toBe(31);
    expect(payload.habits.sleepHours).toBe(6);
    expect(payload.goals).toBeDefined();
    expect(payload.time).toBeDefined();
    expect(payload.money).toBeDefined();
    expect(payload.skills).toBeDefined();
    expect(payload.fearsAndValues).toBeDefined();
  });

  it('marks completion and resets completely', () => {
    const store = useOnboardingStore.getState();
    store.setCompleted(true);
    store.setCurrentStep(6);
    expect(useOnboardingStore.getState().isCompleted).toBe(true);

    store.resetOnboarding();
    const reset = useOnboardingStore.getState();
    expect(reset.currentStep).toBe(1);
    expect(reset.isCompleted).toBe(false);
    expect(reset.name).toBe('');
  });

  it('persists data to localStorage with the future-you: prefix', () => {
    const store = useOnboardingStore.getState();
    store.updateBasics('Elena', 26);

    const raw = localStorage.getItem(`${STORAGE_PREFIX}onboarding`);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.name).toBe('Elena');
    expect(parsed.state.age).toBe(26);
  });
});
