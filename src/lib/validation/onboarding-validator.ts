/**
 * Client-side validation logic for each step of the Future You onboarding flow.
 */

import { OnboardingData } from '@/types';

export interface StepValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FullValidationResult {
  isValid: boolean;
  errorsByStep: Record<number, string[]>;
}

/**
 * Validates a specific onboarding step against domain requirements.
 *
 * @param step - The current step number (1 to 6)
 * @param data - The complete or partial onboarding survey data
 * @returns StepValidationResult containing validity boolean and array of error messages
 */
export function validateStep(
  step: number,
  data: OnboardingData
): StepValidationResult {
  const errors: string[] = [];

  switch (step) {
    case 1: {
      if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter your name or callsign (at least 2 characters).');
      }
      if (typeof data.age !== 'number' || data.age < 16 || data.age > 100) {
        errors.push('Age must be between 16 and 100.');
      }
      const hasShortTerm = data.goals?.shortTerm?.length > 0;
      const hasLongTerm = data.goals?.longTerm?.length > 0;
      if (!hasShortTerm && !hasLongTerm) {
        errors.push('Please add at least one short-term or 5-year goal.');
      }
      break;
    }

    case 2: {
      if (typeof data.habits?.sleepHours !== 'number' || data.habits.sleepHours < 4 || data.habits.sleepHours > 14) {
        errors.push('Please specify a nightly sleep duration between 4 and 14 hours.');
      }
      if (typeof data.habits?.screenTime !== 'number' || data.habits.screenTime < 0 || data.habits.screenTime > 24) {
        errors.push('Recreational screen time must be between 0 and 24 hours.');
      }
      break;
    }

    case 3: {
      const sleepWeekly = Math.round((data.habits?.sleepHours || 7) * 7);
      const activeAllocated =
        (data.time?.workHoursPerWeek || 0) +
        (data.time?.studyHoursPerWeek || 0) +
        (data.time?.socialHoursPerWeek || 0) +
        (data.time?.creativeHoursPerWeek || 0) +
        (data.time?.wastedHoursPerWeek || 0);

      const totalAllocated = sleepWeekly + activeAllocated;
      if (totalAllocated > 168) {
        errors.push(
          `Your total allocated time (${totalAllocated}h) exceeds the 168 hours available in a week by ${totalAllocated - 168}h.`
        );
      }
      break;
    }

    case 4: {
      if (!data.money?.incomeRange || data.money.incomeRange.trim().length === 0) {
        errors.push('Please select your current annual income bracket.');
      }
      if (!data.money?.financialGoal || data.money.financialGoal.trim().length < 3) {
        errors.push('Please specify your primary 5-year financial milestone target.');
      }
      break;
    }

    case 5: {
      if (!data.skills?.currentSkills || data.skills.currentSkills.length === 0) {
        errors.push('Please add at least one current strength or capability.');
      }
      if (!data.skills?.careerField || data.skills.careerField.trim().length < 2) {
        errors.push('Please enter or select your primary career domain or discipline.');
      }
      break;
    }

    case 6: {
      if (!data.fearsAndValues?.coreValues || data.fearsAndValues.coreValues.length === 0) {
        errors.push('Please add at least one core value to anchor your future path.');
      }
      if (!data.fearsAndValues?.biggestFears || data.fearsAndValues.biggestFears.length === 0) {
        errors.push('Please add at least one primary fear or potential regret you wish to avoid.');
      }
      break;
    }

    default:
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates all 6 steps of the onboarding survey for complete submission.
 *
 * @param data - The complete onboarding survey data
 * @returns FullValidationResult with overall validity and mapping of errors per step
 */
export function validateAll(data: OnboardingData): FullValidationResult {
  const errorsByStep: Record<number, string[]> = {};
  let overallValid = true;

  for (let step = 1; step <= 6; step++) {
    const res = validateStep(step, data);
    if (!res.isValid) {
      overallValid = false;
      errorsByStep[step] = res.errors;
    }
  }

  return {
    isValid: overallValid,
    errorsByStep,
  };
}
