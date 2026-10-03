import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  OnboardingData,
  GoalsData,
  HabitsData,
  TimeData,
  MoneyData,
  SkillsData,
  FearsAndValuesData,
} from '@/types';
import { STORAGE_PREFIX } from '@/lib/constants';

const DEFAULT_GOALS: GoalsData = {
  shortTerm: [],
  longTerm: [],
  dreamLife: '',
};

const DEFAULT_HABITS: HabitsData = {
  sleepHours: 7,
  exerciseFrequency: 'weekly',
  dietQuality: 'average',
  screenTime: 4,
  meditationOrReflection: false,
};

const DEFAULT_TIME: TimeData = {
  workHoursPerWeek: 40,
  studyHoursPerWeek: 5,
  socialHoursPerWeek: 10,
  creativeHoursPerWeek: 3,
  wastedHoursPerWeek: 5,
};

const DEFAULT_MONEY: MoneyData = {
  incomeRange: '',
  savingsRate: 15,
  debtLevel: 'none',
  spendingHabits: '',
  financialGoal: '',
};

const DEFAULT_SKILLS: SkillsData = {
  currentSkills: [],
  learningGoals: [],
  careerField: '',
  careerSatisfaction: 5,
  growthMindset: 7,
};

const DEFAULT_FEARS_VALUES: FearsAndValuesData = {
  biggestFears: [],
  coreValues: [],
  regrets: '',
  motivation: 'mixed',
  riskTolerance: 5,
};

export interface OnboardingState {
  /** Active wizard step index (1 to 6) */
  currentStep: number;
  /** Whether the user has completed the onboarding flow */
  isCompleted: boolean;

  /** User identity attributes */
  name: string;
  age: number;

  /** Section 1: Goals and ideal life vision */
  goals: GoalsData;
  /** Section 2: Physical & mental habits */
  habits: HabitsData;
  /** Section 3: Time distribution per week */
  time: TimeData;
  /** Section 4: Finances & capital */
  money: MoneyData;
  /** Section 5: Skills & career growth */
  skills: SkillsData;
  /** Section 6: Fears, values, and regrets */
  fearsAndValues: FearsAndValuesData;

  /** Set current active step explicitly (bounded 1 to 6) */
  setCurrentStep: (step: number) => void;
  /** Advance to next step */
  nextStep: () => void;
  /** Retreat to previous step */
  prevStep: () => void;

  /** Update demographic basics */
  updateBasics: (name: string, age: number) => void;
  /** Update goals section */
  updateGoals: (goals: Partial<GoalsData>) => void;
  /** Update habits section */
  updateHabits: (habits: Partial<HabitsData>) => void;
  /** Update weekly time section */
  updateTime: (time: Partial<TimeData>) => void;
  /** Update money & finances section */
  updateMoney: (money: Partial<MoneyData>) => void;
  /** Update professional skills section */
  updateSkills: (skills: Partial<SkillsData>) => void;
  /** Update fears, values, and regrets section */
  updateFearsAndValues: (data: Partial<FearsAndValuesData>) => void;

  /** Set completion flag */
  setCompleted: (completed: boolean) => void;
  /** Reset onboarding wizard and data to initial state */
  resetOnboarding: () => void;
  /** Extract clean OnboardingData payload for AI generation */
  getOnboardingData: () => OnboardingData;
}

const INITIAL_STATE = {
  currentStep: 1,
  isCompleted: false,
  name: '',
  age: 28,
  goals: DEFAULT_GOALS,
  habits: DEFAULT_HABITS,
  time: DEFAULT_TIME,
  money: DEFAULT_MONEY,
  skills: DEFAULT_SKILLS,
  fearsAndValues: DEFAULT_FEARS_VALUES,
};

/**
 * Zustand store managing the multi-step onboarding wizard.
 * Persists locally to browser localStorage under future-you:onboarding.
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setCurrentStep: (step: number) =>
        set({ currentStep: Math.max(1, Math.min(6, step)) }),

      nextStep: () =>
        set((state) => ({ currentStep: Math.min(6, state.currentStep + 1) })),

      prevStep: () =>
        set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

      updateBasics: (name: string, age: number) =>
        set({ name: name.trim(), age }),

      updateGoals: (goalsUpdate: Partial<GoalsData>) =>
        set((state) => ({ goals: { ...state.goals, ...goalsUpdate } })),

      updateHabits: (habitsUpdate: Partial<HabitsData>) =>
        set((state) => ({ habits: { ...state.habits, ...habitsUpdate } })),

      updateTime: (timeUpdate: Partial<TimeData>) =>
        set((state) => ({ time: { ...state.time, ...timeUpdate } })),

      updateMoney: (moneyUpdate: Partial<MoneyData>) =>
        set((state) => ({ money: { ...state.money, ...moneyUpdate } })),

      updateSkills: (skillsUpdate: Partial<SkillsData>) =>
        set((state) => ({ skills: { ...state.skills, ...skillsUpdate } })),

      updateFearsAndValues: (fearsValuesUpdate: Partial<FearsAndValuesData>) =>
        set((state) => ({
          fearsAndValues: { ...state.fearsAndValues, ...fearsValuesUpdate },
        })),

      setCompleted: (isCompleted: boolean) => set({ isCompleted }),

      resetOnboarding: () => set(INITIAL_STATE),

      getOnboardingData: () => {
        const s = get();
        return {
          name: s.name,
          age: s.age,
          goals: s.goals,
          habits: s.habits,
          time: s.time,
          money: s.money,
          skills: s.skills,
          fearsAndValues: s.fearsAndValues,
        };
      },
    }),
    {
      name: `${STORAGE_PREFIX}onboarding`,
    }
  )
);
