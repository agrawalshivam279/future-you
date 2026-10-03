'use client';

import React from 'react';
import { Moon, Dumbbell, Utensils, Smartphone, Brain } from 'lucide-react';
import { useOnboardingStore } from '@/stores';
import { Slider } from '@/components/ui/slider';
import { ExerciseFrequency, DietQuality } from '@/types';
import { cn } from '@/lib/utils';

export interface HabitsStepProps {
  className?: string;
}

const EXERCISE_OPTIONS: { id: ExerciseFrequency; label: string; desc: string }[] = [
  { id: 'never', label: 'Never', desc: 'Sedentary' },
  { id: 'rarely', label: 'Rarely', desc: '1-2x / month' },
  { id: 'weekly', label: 'Weekly', desc: '1-3x / week' },
  { id: 'daily', label: 'Daily', desc: '4+ days / week' },
];

const DIET_OPTIONS: { id: DietQuality; label: string; desc: string }[] = [
  { id: 'poor', label: 'Poor', desc: 'Mostly processed' },
  { id: 'average', label: 'Average', desc: 'Balanced / takeout' },
  { id: 'good', label: 'Good', desc: 'Mostly whole foods' },
  { id: 'excellent', label: 'Excellent', desc: 'Nutrient-dense' },
];

/**
 * Step 2 form component capturing physical and mental health habits:
 * sleep, exercise frequency, nutrition quality, screen time, and mindfulness.
 *
 * @param props - HabitsStep component properties
 * @returns JSX Element rendering the habits onboarding section
 */
export function HabitsStep({ className }: HabitsStepProps): React.JSX.Element {
  const { habits, updateHabits } = useOnboardingStore();

  return (
    <div className={cn('space-y-8 text-left', className)}>
      {/* Sleep Hours Slider */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Nightly Sleep Duration</h4>
        </div>
        <p className="text-xs text-text-secondary">
          How many hours of restorative sleep do you typically get per night?
        </p>
        <Slider
          id="habits-sleep-slider"
          min={4}
          max={12}
          step={0.5}
          unit=" hrs / night"
          value={habits.sleepHours}
          onChange={(val) => updateHabits({ sleepHours: val })}
          aria-label="Nightly sleep duration in hours"
          variant="improved"
          className="pt-2"
        />
      </div>

      <div className="border-t border-border-primary/50" />

      {/* Exercise Frequency */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Physical Exercise Frequency</h4>
        </div>
        <p className="text-xs text-text-secondary">
          Intentional cardio, strength training, sports, or movement sessions.
        </p>

        <div
          role="radiogroup"
          aria-label="Physical exercise frequency"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1"
        >
          {EXERCISE_OPTIONS.map((opt) => {
            const isSelected = habits.exerciseFrequency === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateHabits({ exerciseFrequency: opt.id })}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150',
                  isSelected
                    ? 'border-accent-improved bg-accent-improved/10 text-accent-improved shadow-sm'
                    : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                )}
              >
                <span className="text-xs font-semibold">{opt.label}</span>
                <span className="text-[10px] text-text-muted mt-0.5">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border-primary/50" />

      {/* Nutritional Quality */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Nutrition & Diet Quality</h4>
        </div>
        <p className="text-xs text-text-secondary">
          How would you honestly rate the overall nutritional value of your regular meals?
        </p>

        <div
          role="radiogroup"
          aria-label="Nutrition and diet quality"
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1"
        >
          {DIET_OPTIONS.map((opt) => {
            const isSelected = habits.dietQuality === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => updateHabits({ dietQuality: opt.id })}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-150',
                  isSelected
                    ? 'border-accent-improved bg-accent-improved/10 text-accent-improved shadow-sm'
                    : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                )}
              >
                <span className="text-xs font-semibold">{opt.label}</span>
                <span className="text-[10px] text-text-muted mt-0.5">{opt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border-primary/50" />

      {/* Screen Time Slider */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">Recreational Screen Time</h4>
        </div>
        <p className="text-xs text-text-secondary">
          Daily hours on non-work social media, passive entertainment, or algorithmic feeds.
        </p>
        <Slider
          id="habits-screen-slider"
          min={0}
          max={16}
          step={1}
          unit=" hrs / day"
          value={habits.screenTime}
          onChange={(val) => updateHabits({ screenTime: val })}
          aria-label="Daily recreational screen time in hours"
          variant="current"
          className="pt-2"
        />
      </div>

      <div className="border-t border-border-primary/50" />

      {/* Daily Meditation or Reflection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-accent-improved" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-text-primary">
            Daily Meditation or Reflection Practice
          </h4>
        </div>
        <p className="text-xs text-text-secondary">
          Do you maintain a dedicated daily habit of meditation, journaling, or quiet contemplation?
        </p>

        <div
          role="radiogroup"
          aria-label="Daily meditation or reflection practice"
          className="grid grid-cols-2 gap-3 pt-1"
        >
          <button
            type="button"
            role="radio"
            aria-checked={!habits.meditationOrReflection}
            onClick={() => updateHabits({ meditationOrReflection: false })}
            className={cn(
              'p-3.5 rounded-xl border text-center font-medium text-xs transition-all duration-150',
              !habits.meditationOrReflection
                ? 'border-accent-current bg-accent-current/10 text-accent-current shadow-sm'
                : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-hover hover:text-text-primary'
            )}
          >
            No / Irregular
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={habits.meditationOrReflection}
            onClick={() => updateHabits({ meditationOrReflection: true })}
            className={cn(
              'p-3.5 rounded-xl border text-center font-medium text-xs transition-all duration-150',
              habits.meditationOrReflection
                ? 'border-accent-improved bg-accent-improved/10 text-accent-improved shadow-sm'
                : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-hover hover:text-text-primary'
            )}
          >
            Yes, Daily Habit
          </button>
        </div>
      </div>
    </div>
  );
}
