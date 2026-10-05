/**
 * Type definitions for Version 3: Check-in Mode (Trajectory Drift & Habits).
 * Defines habit log entries, drift vectors, and alignment evaluations.
 */

import { ExerciseFrequency } from './onboarding.types';

/**
 * Alignment status of a tracked habit vector relative to target goals.
 */
export type DriftStatus = 'aligned' | 'drifting_current' | 'surpassing';

/**
 * A user-recorded checkpoint capturing current daily and weekly habit metrics.
 */
export interface CheckInLog {
  /** Unique log entry identifier */
  id: string;
  /** ISO 8601 timestamp when log was recorded */
  loggedAt: string;
  /** Average hours of sleep per night (0-12) */
  sleepHours: number;
  /** Physical exercise cadence */
  exerciseFrequency: ExerciseFrequency;
  /** Deep, focused work hours per week */
  deepWorkHoursPerWeek: number;
  /** Discretionary screen/entertainment hours per day */
  screenTimeHoursPerDay: number;
  /** Monthly savings rate percentage (0-100) */
  savingsRatePercentage: number;
  /** Optional qualitative notes or friction reflections */
  notes?: string;
}

/**
 * Vector representation comparing an actual habit measurement against baseline and target goals.
 */
export interface HabitDriftVector {
  /** Unique identifier corresponding to habit lever or tracked metric */
  habitId: string;
  /** Human-readable habit label (e.g., "Nightly Sleep") */
  label: string;
  /** Starting baseline from onboarding survey */
  baselineValue: number;
  /** Compounding goal value from Improved Path simulation */
  targetValue: number;
  /** Actual value logged by user in this checkpoint */
  actualValue: number;
  /** Unit of measurement (e.g., "hrs", "days/wk", "%") */
  unit: string;
  /** Percentage drift: positive moves towards target, negative towards baseline */
  driftPercentage: number;
  /** Evaluated alignment status */
  status: DriftStatus;
}

/**
 * Comprehensive client-side evaluation of a check-in checkpoint.
 */
export interface CheckInEvaluation {
  /** ID of corresponding CheckInLog */
  logId: string;
  /** ISO 8601 timestamp of evaluation calculation */
  evaluatedAt: string;
  /** Composite trajectory alignment score (0 - 100%) */
  overallAlignmentScore: number;
  /** Array of individual habit drift vectors */
  driftVectors: HabitDriftVector[];
  /** Grounded 2-3 sentence reflection note from the Future Self */
  futureSelfReflection: string;
}
