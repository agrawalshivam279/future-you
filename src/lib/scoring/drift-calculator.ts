/**
 * Trajectory Drift & Alignment Calculator for Future You.
 * Pure client-side mathematical scoring engine computing habit vectors and composite scores.
 */

import {
  CheckInLog,
  HabitDriftVector,
  DriftStatus,
  ExerciseFrequency,
  HabitsData,
  TimeData,
  MoneyData,
  HabitLever,
} from '@/types';

/**
 * Flexible baseline inputs structure supporting partial or full onboarding data.
 */
export interface BaselineHabitInputs {
  habits?: Partial<HabitsData>;
  time?: Partial<TimeData>;
  money?: Partial<MoneyData>;
}

/**
 * Numeric weekly days conversion for categorical exercise frequencies.
 */
export function frequencyToDays(freq: ExerciseFrequency): number {
  switch (freq) {
    case 'daily':
      return 6;
    case 'weekly':
      return 3;
    case 'rarely':
      return 1;
    case 'never':
    default:
      return 0;
  }
}

/**
 * Computes directional progress ratio from baseline to target.
 *
 * @param actual - Recorded user value
 * @param baseline - Starting baseline value
 * @param target - Desired goal value from Improved Path
 * @param isLowerBetter - Inverted metric flag (e.g., screen time where less is better)
 * @returns Normalized progress multiplier (1.0 = target, 0.0 = baseline)
 */
export function computeProgress(
  actual: number,
  baseline: number,
  target: number,
  isLowerBetter = false
): number {
  if (target === baseline) {
    if (isLowerBetter) {
      return actual <= target ? 1.0 : 0.0;
    }
    return actual >= target ? 1.0 : 0.0;
  }

  if (isLowerBetter) {
    return (baseline - actual) / (baseline - target);
  }

  return (actual - baseline) / (target - baseline);
}

/**
 * Categorizes a drift percentage into discrete alignment statuses.
 */
export function determineStatus(percentage: number): DriftStatus {
  if (percentage > 110) {
    return 'surpassing';
  }
  if (percentage >= 75) {
    return 'aligned';
  }
  return 'drifting_current';
}

/**
 * Calculates per-habit drift vectors comparing a check-in log against baseline and target values.
 *
 * @param log - The user checkpoint log
 * @param baselineInputs - Optional onboarding survey inputs for baseline references
 * @param habitLevers - Optional habit levers from the LifeModel for dynamic targets
 * @returns Array of evaluated HabitDriftVectors
 */
export function calculateHabitDriftVectors(
  log: CheckInLog,
  baselineInputs?: BaselineHabitInputs,
  habitLevers?: HabitLever[]
): HabitDriftVector[] {
  // Find dynamic lever targets if present, otherwise default to grounded standards
  const findLever = (id: string) => habitLevers?.find((l) => l.id.includes(id));

  // 1. Sleep Hours (Higher is better)
  const sleepBaseline = baselineInputs?.habits?.sleepHours ?? 6.5;
  const sleepTarget = findLever('sleep')?.max ?? 8.0;
  const sleepProgress = computeProgress(log.sleepHours, sleepBaseline, sleepTarget);
  const sleepDriftPct = Math.round(sleepProgress * 1000) / 10;

  // 2. Physical Exercise (Higher is better)
  const exerciseBaselineFreq = baselineInputs?.habits?.exerciseFrequency ?? 'rarely';
  const exerciseBaseline = frequencyToDays(exerciseBaselineFreq);
  const exerciseTarget = 5.0; // Standard compounding target: ~5 days/week
  const exerciseActual = frequencyToDays(log.exerciseFrequency);
  const exerciseProgress = computeProgress(exerciseActual, exerciseBaseline, exerciseTarget);
  const exerciseDriftPct = Math.round(exerciseProgress * 1000) / 10;

  // 3. Screen Time (Lower is better)
  const screenBaseline = baselineInputs?.habits?.screenTime ?? 5.0;
  const screenTarget = findLever('screen')?.min ?? 2.0;
  const screenProgress = computeProgress(log.screenTimeHoursPerDay, screenBaseline, screenTarget, true);
  const screenDriftPct = Math.round(screenProgress * 1000) / 10;

  // 4. Deep Work (Higher is better)
  const studyHrs = baselineInputs?.time?.studyHoursPerWeek ?? 5;
  const workHrs = baselineInputs?.time?.workHoursPerWeek ?? 35;
  const deepWorkBaseline = Math.min(25, Math.max(10, studyHrs + Math.round(workHrs * 0.3)));
  const deepWorkTarget = findLever('work')?.max ?? 35.0;
  const deepWorkProgress = computeProgress(log.deepWorkHoursPerWeek, deepWorkBaseline, deepWorkTarget);
  const deepWorkDriftPct = Math.round(deepWorkProgress * 1000) / 10;

  // 5. Savings Rate Percentage (Higher is better)
  const savingsBaseline = baselineInputs?.money?.savingsRate ?? 10;
  const savingsTarget = findLever('savings')?.max ?? 30.0;
  const savingsProgress = computeProgress(log.savingsRatePercentage, savingsBaseline, savingsTarget);
  const savingsDriftPct = Math.round(savingsProgress * 1000) / 10;

  return [
    {
      habitId: 'sleep-hours',
      label: 'Nightly Sleep',
      baselineValue: sleepBaseline,
      targetValue: sleepTarget,
      actualValue: log.sleepHours,
      unit: 'hrs',
      driftPercentage: sleepDriftPct,
      status: determineStatus(sleepDriftPct),
    },
    {
      habitId: 'exercise-frequency',
      label: 'Physical Exercise',
      baselineValue: exerciseBaseline,
      targetValue: exerciseTarget,
      actualValue: exerciseActual,
      unit: 'days/wk',
      driftPercentage: exerciseDriftPct,
      status: determineStatus(exerciseDriftPct),
    },
    {
      habitId: 'screen-time',
      label: 'Digital Screen Time',
      baselineValue: screenBaseline,
      targetValue: screenTarget,
      actualValue: log.screenTimeHoursPerDay,
      unit: 'hrs/day',
      driftPercentage: screenDriftPct,
      status: determineStatus(screenDriftPct),
    },
    {
      habitId: 'deep-work',
      label: 'Deep Focus Work',
      baselineValue: deepWorkBaseline,
      targetValue: deepWorkTarget,
      actualValue: log.deepWorkHoursPerWeek,
      unit: 'hrs/wk',
      driftPercentage: deepWorkDriftPct,
      status: determineStatus(deepWorkDriftPct),
    },
    {
      habitId: 'savings-rate',
      label: 'Savings Rate',
      baselineValue: savingsBaseline,
      targetValue: savingsTarget,
      actualValue: log.savingsRatePercentage,
      unit: '%',
      driftPercentage: savingsDriftPct,
      status: determineStatus(savingsDriftPct),
    },
  ];
}

/**
 * Calculates a composite 0-100% alignment score across evaluated drift vectors.
 * Clamps individual habit contributions to [0, 100] to prevent single outliers from skewing the composite.
 *
 * @param vectors - Array of habit drift vectors
 * @returns Integer alignment percentage between 0 and 100
 */
export function calculateOverallAlignmentScore(vectors: HabitDriftVector[]): number {
  if (vectors.length === 0) return 0;

  const totalClamped = vectors.reduce((acc, v) => {
    const clamped = Math.max(0, Math.min(100, v.driftPercentage));
    return acc + clamped;
  }, 0);

  return Math.round(totalClamped / vectors.length);
}

/**
 * Evaluates both drift vectors and overall alignment score for a check-in log.
 */
export function evaluateCheckInDrift(
  log: CheckInLog,
  baselineInputs?: BaselineHabitInputs,
  habitLevers?: HabitLever[]
): { alignmentScore: number; driftVectors: HabitDriftVector[] } {
  const driftVectors = calculateHabitDriftVectors(log, baselineInputs, habitLevers);
  const alignmentScore = calculateOverallAlignmentScore(driftVectors);
  return { alignmentScore, driftVectors };
}
