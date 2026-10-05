import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ExerciseFrequency } from '@/types';
import { useCheckInStore, useOnboardingStore } from '@/stores';
import { cn } from '@/lib/utils';

export interface CheckInFormData {
  sleepHours: number;
  exerciseFrequency: ExerciseFrequency;
  deepWorkHoursPerWeek: number;
  screenTimeHoursPerDay: number;
  savingsRatePercentage: number;
  notes?: string;
}

export interface CheckInFormProps {
  initialValues?: Partial<CheckInFormData>;
  onSubmit: (data: CheckInFormData) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const FREQUENCY_OPTIONS: { id: ExerciseFrequency; label: string; subtext: string }[] = [
  { id: 'daily', label: 'Daily', subtext: '5–7 days/wk' },
  { id: 'weekly', label: 'Weekly', subtext: '2–4 days/wk' },
  { id: 'rarely', label: 'Rarely', subtext: '1–3 days/mo' },
  { id: 'never', label: 'Never', subtext: 'Sedentary' },
];

/**
 * Habit Check-in Form allowing users to capture weekly habit metrics and reflections.
 * Pre-populates with previous check-ins or baseline onboarding data.
 */
export function CheckInForm({
  initialValues,
  onSubmit,
  isLoading = false,
  className,
}: CheckInFormProps): React.JSX.Element {
  const latestLog = useCheckInStore((state) => state.getLatestLog());
  const onboardingData = useOnboardingStore((state) => state.getOnboardingData());

  const defaultSleep =
    initialValues?.sleepHours ??
    latestLog?.sleepHours ??
    onboardingData?.habits?.sleepHours ??
    7.5;

  const defaultExercise: ExerciseFrequency =
    initialValues?.exerciseFrequency ??
    latestLog?.exerciseFrequency ??
    onboardingData?.habits?.exerciseFrequency ??
    'weekly';

  const defaultDeepWork =
    initialValues?.deepWorkHoursPerWeek ??
    latestLog?.deepWorkHoursPerWeek ??
    (onboardingData?.time?.studyHoursPerWeek ?? 20);

  const defaultScreenTime =
    initialValues?.screenTimeHoursPerDay ??
    latestLog?.screenTimeHoursPerDay ??
    onboardingData?.habits?.screenTime ??
    4.0;

  const defaultSavingsRate =
    initialValues?.savingsRatePercentage ??
    latestLog?.savingsRatePercentage ??
    onboardingData?.money?.savingsRate ??
    15;

  const defaultNotes = initialValues?.notes ?? '';

  const [sleepHours, setSleepHours] = useState<number>(defaultSleep);
  const [exerciseFrequency, setExerciseFrequency] = useState<ExerciseFrequency>(defaultExercise);
  const [deepWorkHours, setDeepWorkHours] = useState<number>(defaultDeepWork);
  const [screenTimeHours, setScreenTimeHours] = useState<number>(defaultScreenTime);
  const [savingsRate, setSavingsRate] = useState<number>(defaultSavingsRate);
  const [notes, setNotes] = useState<string>(defaultNotes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    onSubmit({
      sleepHours,
      exerciseFrequency,
      deepWorkHoursPerWeek: deepWorkHours,
      screenTimeHoursPerDay: screenTimeHours,
      savingsRatePercentage: savingsRate,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Card className={cn('w-full border-border bg-bg-card', className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-text-primary">
          Record Habit Checkpoint
        </CardTitle>
        <CardDescription className="text-sm text-text-secondary">
          Track this week&apos;s daily rhythms. Your Future Self will measure trajectory drift against your compounding goals.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Sleep Hours */}
          <div className="space-y-2">
            <Slider
              id="checkin-sleep-slider"
              label="Nightly Sleep"
              value={sleepHours}
              min={4}
              max={12}
              step={0.5}
              unit="hrs"
              disabled={isLoading}
              onChange={setSleepHours}
              aria-label="Nightly Sleep Hours"
            />
          </div>

          {/* 2. Physical Exercise */}
          <div className="space-y-2 text-left">
            <label className="block text-sm font-medium text-text-secondary select-none">
              Physical Exercise Cadence
            </label>
            <div
              role="radiogroup"
              aria-label="Physical Exercise Cadence"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {FREQUENCY_OPTIONS.map((opt) => {
                const isSelected = exerciseFrequency === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${opt.label}: ${opt.subtext}`}
                    disabled={isLoading}
                    onClick={() => setExerciseFrequency(opt.id)}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-colors',
                      isSelected
                        ? 'border-accent-improved bg-accent-improved/10 text-text-primary'
                        : 'border-border bg-bg-surface text-text-secondary hover:border-border-hover'
                    )}
                  >
                    <span className="text-sm font-medium">{opt.label}</span>
                    <span className="text-xs text-text-muted mt-0.5">{opt.subtext}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Deep Work Hours */}
          <div className="space-y-2">
            <Slider
              id="checkin-deepwork-slider"
              label="Deep Focus Work"
              value={deepWorkHours}
              min={0}
              max={60}
              step={1}
              unit="hrs/wk"
              disabled={isLoading}
              onChange={setDeepWorkHours}
              aria-label="Deep Focus Work Hours per Week"
            />
          </div>

          {/* 4. Screen Time */}
          <div className="space-y-2">
            <Slider
              id="checkin-screentime-slider"
              label="Digital Screen Time"
              value={screenTimeHours}
              min={0}
              max={16}
              step={0.5}
              unit="hrs/day"
              disabled={isLoading}
              onChange={setScreenTimeHours}
              aria-label="Digital Screen Time Hours per Day"
            />
          </div>

          {/* 5. Savings Rate */}
          <div className="space-y-2">
            <Slider
              id="checkin-savings-slider"
              label="Savings Rate"
              value={savingsRate}
              min={0}
              max={100}
              step={1}
              unit="%"
              disabled={isLoading}
              onChange={setSavingsRate}
              aria-label="Monthly Savings Rate Percentage"
            />
          </div>

          {/* 6. Notes & Friction Reflections */}
          <div className="space-y-2">
            <Textarea
              id="checkin-notes"
              label="Friction & Weekly Observations (Optional)"
              value={notes}
              disabled={isLoading}
              rows={3}
              placeholder="What derailed or supported your habits this week? E.g. travel, illness, intense project..."
              onChange={(e) => setNotes(e.target.value)}
              aria-label="Friction and Weekly Observations"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
              aria-label="Evaluate Checkpoint"
            >
              Evaluate Trajectory Alignment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
