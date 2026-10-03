/**
 * Onboarding input data models for Future You.
 */

export type ExerciseFrequency = 'never' | 'rarely' | 'weekly' | 'daily';

export type DietQuality = 'poor' | 'average' | 'good' | 'excellent';

export type DebtLevel = 'none' | 'low' | 'moderate' | 'high';

export type MotivationType = 'external' | 'internal' | 'mixed';

/**
 * Step 1: User aspirations and future vision.
 */
export interface GoalsData {
  /** 1-year goals list */
  shortTerm: string[];
  /** 5-year goals list */
  longTerm: string[];
  /** Free-text description of ideal future life */
  dreamLife: string;
}

/**
 * Step 2: Daily physical and mental lifestyle habits.
 */
export interface HabitsData {
  /** Typical sleep hours per day (0-14) */
  sleepHours: number;
  /** Frequency of physical exercise */
  exerciseFrequency: ExerciseFrequency;
  /** Self-assessed nutritional quality */
  dietQuality: DietQuality;
  /** Daily recreational screen time in hours */
  screenTime: number;
  /** Daily practice of meditation or reflection */
  meditationOrReflection: boolean;
}

/**
 * Step 3: Weekly time allocation breakdown.
 */
export interface TimeData {
  /** Hours spent working per week */
  workHoursPerWeek: number;
  /** Hours spent studying or self-improving per week */
  studyHoursPerWeek: number;
  /** Hours spent socializing and with family per week */
  socialHoursPerWeek: number;
  /** Hours spent on creative or hobby pursuits per week */
  creativeHoursPerWeek: number;
  /** Self-assessed unproductive or wasted hours per week */
  wastedHoursPerWeek: number;
}

/**
 * Step 4: Financial habits and trajectories.
 */
export interface MoneyData {
  /** Current income bracket description */
  incomeRange: string;
  /** Approximate monthly savings percentage (0-100) */
  savingsRate: number;
  /** Current debt burden level */
  debtLevel: DebtLevel;
  /** Qualitative spending habits reflection */
  spendingHabits: string;
  /** Core financial freedom or milestone target */
  financialGoal: string;
}

/**
 * Step 5: Professional skills, career, and growth mindset.
 */
export interface SkillsData {
  /** Existing key strengths and skills */
  currentSkills: string[];
  /** Skills currently targeted for learning */
  learningGoals: string[];
  /** Primary professional discipline or industry */
  careerField: string;
  /** Current career satisfaction rating (1-10) */
  careerSatisfaction: number;
  /** Self-assessed growth mindset rating (1-10) */
  growthMindset: number;
}

/**
 * Step 6: Emotional drivers, anxieties, and values.
 */
export interface FearsAndValuesData {
  /** Primary anxieties and worst-case fears */
  biggestFears: string[];
  /** Non-negotiable core life values */
  coreValues: string[];
  /** Past habits or choices causing current regret */
  regrets: string;
  /** Underlying motivation origin */
  motivation: MotivationType;
  /** Propensity for career or personal risk (1-10) */
  riskTolerance: number;
}

/**
 * Complete self-reported onboarding survey dataset.
 */
export interface OnboardingData {
  /** User's preferred name */
  name: string;
  /** Current chronological age */
  age: number;
  /** Goals section data */
  goals: GoalsData;
  /** Habits section data */
  habits: HabitsData;
  /** Time allocation data */
  time: TimeData;
  /** Financial health data */
  money: MoneyData;
  /** Skills and career data */
  skills: SkillsData;
  /** Fears, regrets, and core values data */
  fearsAndValues: FearsAndValuesData;
}
