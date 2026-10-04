import {
  useSettingsStore,
  useOnboardingStore,
  useLifeModelStore,
  useChatStore,
} from '@/stores';
import { validateAll } from '@/lib/validation/onboarding-validator';
import { mockLifeModel } from '@/app/dashboard/__tests__/fixtures';
import { deleteAllLocalData } from '@/lib/storage/data-manager';

jest.mock('@/lib/storage/indexed-db', () => ({
  ...jest.requireActual('@/lib/storage/indexed-db'),
  clearIndexedDBDatabase: jest.fn().mockResolvedValue(undefined),
}));

describe('Phase 14: End-to-End User Lifecycle & State Transition Integration', () => {
  beforeEach(async () => {
    localStorage.clear();
    await deleteAllLocalData();
  });

  it('executes the unbroken flow: setup -> onboarding -> simulation -> habit tweak -> chat -> purge', async () => {
    // Stage 1: Configure Settings
    const settingsStore = useSettingsStore.getState();
    settingsStore.setProvider('openai');
    settingsStore.setApiKey('sk-live-test-audit-key');
    expect(useSettingsStore.getState().isConfigured()).toBe(true);

    // Stage 2: Complete Onboarding Flow across all 6 sections
    const onboarding = useOnboardingStore.getState();
    onboarding.updateBasics('Jordan', 29);

    // Step 1: Goals
    onboarding.updateGoals({
      shortTerm: ['Learn system architecture', 'Run a half marathon'],
      longTerm: ['Lead an engineering team', 'Financial independence'],
      dreamLife: 'A calm, balanced life with meaningful work and deep connections.',
    });
    onboarding.nextStep();
    expect(useOnboardingStore.getState().currentStep).toBe(2);

    // Step 2: Habits
    onboarding.updateHabits({
      sleepHours: 8,
      exerciseFrequency: 'daily',
      dietQuality: 'good',
      screenTime: 3,
      meditationOrReflection: true,
    });
    onboarding.nextStep();
    expect(useOnboardingStore.getState().currentStep).toBe(3);

    // Step 3: Time
    onboarding.updateTime({
      workHoursPerWeek: 40,
      studyHoursPerWeek: 6,
      socialHoursPerWeek: 12,
      creativeHoursPerWeek: 5,
      wastedHoursPerWeek: 3,
    });
    onboarding.nextStep();
    expect(useOnboardingStore.getState().currentStep).toBe(4);

    // Step 4: Money
    onboarding.updateMoney({
      incomeRange: '$100k-$150k',
      savingsRate: 25,
      debtLevel: 'low',
      spendingHabits: 'frugal on essentials, deliberate on experiences',
      financialGoal: 'Build a 6-month safety net and invest consistently',
    });
    onboarding.nextStep();
    expect(useOnboardingStore.getState().currentStep).toBe(5);

    // Step 5: Skills
    onboarding.updateSkills({
      currentSkills: ['TypeScript', 'System Design'],
      learningGoals: ['Distributed Systems', 'Mentorship'],
      careerField: 'Software Engineering',
      careerSatisfaction: 7,
      growthMindset: 9,
    });
    onboarding.nextStep();
    expect(useOnboardingStore.getState().currentStep).toBe(6);

    // Step 6: Fears & Values
    onboarding.updateFearsAndValues({
      biggestFears: ['Stagnation', 'Burnout'],
      coreValues: ['Integrity', 'Continuous Learning', 'Presence'],
      regrets: 'Not starting structured habits earlier',
      motivation: 'internal',
      riskTolerance: 6,
    });
    onboarding.setCompleted(true);

    // Stage 3: Validate Onboarding Data Payload
    const collectedData = useOnboardingStore.getState().getOnboardingData();
    const validation = validateAll(collectedData);
    expect(validation.isValid).toBe(true);
    expect(validation.errorsByStep).toEqual({});

    // Stage 4: Simulate Life Model Generation & Dashboard Load
    const testModel = {
      ...mockLifeModel,
      currentPath: {
        ...mockLifeModel.currentPath,
        regrets: ['Waited too long to make decisions.'],
        gratitudes: ['Kept a few dear friendships.'],
      },
      improvedPath: {
        ...mockLifeModel.improvedPath,
        regrets: ['Occasionally pushed too hard.'],
        gratitudes: ['Consistent morning focus built freedom.'],
      },
    };
    useLifeModelStore.getState().setLifeModel(testModel);
    const storedModel = useLifeModelStore.getState().model;
    expect(storedModel).not.toBeNull();
    expect(storedModel?.currentPath.name).toBe(mockLifeModel.currentPath.name);
    expect(storedModel?.improvedPath.name).toBe(mockLifeModel.improvedPath.name);

    // Stage 5: Tweak Habit Levers
    const sleepLever = storedModel?.habitLevers.find((l) => l.id === 'sleep-hours');
    expect(sleepLever).toBeDefined();
    if (sleepLever) {
      useLifeModelStore.getState().updateHabitLever('sleep-hours', 8.5);
      const updatedLever = useLifeModelStore
        .getState()
        .model?.habitLevers.find((l) => l.id === 'sleep-hours');
      expect(updatedLever?.currentValue).toBe(8.5);
    }

    // Stage 6: Chat with Persona
    const chatStore = useChatStore.getState();
    chatStore.addMessage('improved', {
      id: 'msg-e2e-1',
      role: 'user',
      content: 'What advice do you have for my 30s?',
      timestamp: new Date().toISOString(),
    });
    chatStore.addMessage('improved', {
      id: 'msg-e2e-2',
      role: 'assistant',
      content: 'Protect your morning routine and invest in long-term relationships.',
      timestamp: new Date().toISOString(),
    });

    const conversation = useChatStore.getState().conversations.improved;
    expect(conversation.length).toBe(2);
    expect(conversation[1].content).toContain('Protect your morning routine');

    // Stage 7: Letters & Reflections verification
    expect(storedModel?.improvedPath.letter).toBeTruthy();
    expect(storedModel?.improvedPath.regrets.length).toBeGreaterThan(0);
    expect(storedModel?.improvedPath.gratitudes.length).toBeGreaterThan(0);

    // Stage 8: Privacy Purge
    await deleteAllLocalData();
    expect(useLifeModelStore.getState().model).toBeNull();
    expect(useOnboardingStore.getState().isCompleted).toBe(false);
    expect(useChatStore.getState().conversations.improved).toEqual([]);
  });
});
