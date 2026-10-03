'use client';

import React from 'react';
import { Briefcase, BookOpen, Users, Palette, Hourglass, Clock } from 'lucide-react';
import { useOnboardingStore } from '@/stores';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface TimeStepProps {
  className?: string;
}

const TOTAL_WEEK_HOURS = 168;

/**
 * Step 3 form component mapping out weekly 168-hour time distribution across
 * work, learning, relationships, creative projects, and downtime.
 *
 * @param props - TimeStep component properties
 * @returns JSX Element rendering the weekly time allocation section
 */
export function TimeStep({ className }: TimeStepProps): React.JSX.Element {
  const { time, habits, updateTime } = useOnboardingStore();

  const sleepWeekly = Math.round((habits.sleepHours || 7) * 7);
  const activeAllocated =
    (time.workHoursPerWeek || 0) +
    (time.studyHoursPerWeek || 0) +
    (time.socialHoursPerWeek || 0) +
    (time.creativeHoursPerWeek || 0) +
    (time.wastedHoursPerWeek || 0);

  const totalAllocated = sleepWeekly + activeAllocated;
  const remainingHours = TOTAL_WEEK_HOURS - totalAllocated;
  const isOverallocated = remainingHours < 0;

  return (
    <div className={cn('space-y-8 text-left', className)}>
      {/* 168-Hour Budget Summary Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-bg-secondary border border-border-primary space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent-improved" aria-hidden="true" />
            <h4 className="text-sm font-semibold text-text-primary">168-Hour Weekly Budget</h4>
          </div>
          <span
            className={cn(
              'text-xs font-mono font-medium',
              isOverallocated ? 'text-accent-danger font-semibold' : 'text-text-secondary'
            )}
          >
            {isOverallocated
              ? `Overbooked by ${Math.abs(remainingHours)} hrs/wk`
              : `${remainingHours} hrs/wk unscheduled buffer`}
          </span>
        </div>

        {/* Visual Budget Bar */}
        <div
          role="progressbar"
          aria-label="168-hour weekly time allocation"
          aria-valuenow={totalAllocated}
          aria-valuemin={0}
          aria-valuemax={TOTAL_WEEK_HOURS}
          className="w-full h-3 rounded-full bg-bg-tertiary flex overflow-hidden border border-border-primary/50"
        >
          <div
            title={`Sleep: ${sleepWeekly}h`}
            style={{ width: `${Math.min(100, (sleepWeekly / TOTAL_WEEK_HOURS) * 100)}%` }}
            className="h-full bg-accent-current/60"
          />
          <div
            title={`Work: ${time.workHoursPerWeek}h`}
            style={{ width: `${Math.min(100, (time.workHoursPerWeek / TOTAL_WEEK_HOURS) * 100)}%` }}
            className="h-full bg-accent-info"
          />
          <div
            title={`Study: ${time.studyHoursPerWeek}h`}
            style={{ width: `${Math.min(100, (time.studyHoursPerWeek / TOTAL_WEEK_HOURS) * 100)}%` }}
            className="h-full bg-accent-improved"
          />
          <div
            title={`Social: ${time.socialHoursPerWeek}h`}
            style={{ width: `${Math.min(100, (time.socialHoursPerWeek / TOTAL_WEEK_HOURS) * 100)}%` }}
            className="h-full bg-accent-warning"
          />
          <div
            title={`Creative: ${time.creativeHoursPerWeek}h`}
            style={{ width: `${Math.min(100, (time.creativeHoursPerWeek / TOTAL_WEEK_HOURS) * 100)}%` }}
            className="h-full bg-purple-500"
          />
          <div
            title={`Downtime: ${time.wastedHoursPerWeek}h`}
            style={{ width: `${Math.min(100, (time.wastedHoursPerWeek / TOTAL_WEEK_HOURS) * 100)}%` }}
            className="h-full bg-accent-danger/70"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-text-muted pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-current/60" aria-hidden="true" />
            Sleep ({sleepWeekly}h)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-info" aria-hidden="true" />
            Work ({time.workHoursPerWeek}h)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-improved" aria-hidden="true" />
            Study ({time.studyHoursPerWeek}h)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-warning" aria-hidden="true" />
            Social ({time.socialHoursPerWeek}h)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" aria-hidden="true" />
            Creative ({time.creativeHoursPerWeek}h)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-danger/70" aria-hidden="true" />
            Downtime ({time.wastedHoursPerWeek}h)
          </span>
        </div>
      </div>

      <div className="border-t border-border-primary/50" />

      {/* Sliders Container */}
      <div className="space-y-6">
        {/* Career & Work Hours */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-accent-info" aria-hidden="true" />
            <h4 className="text-sm font-semibold text-text-primary">Career &amp; Work Hours</h4>
          </div>
          <p className="text-xs text-text-secondary">
            Primary job, client work, business operations, and commuting.
          </p>
          <Slider
            id="time-work-slider"
            min={0}
            max={80}
            step={1}
            unit=" hrs / wk"
            value={time.workHoursPerWeek}
            onChange={(val) => updateTime({ workHoursPerWeek: val })}
            aria-label="Weekly career and work hours"
            variant="neutral"
            className="pt-2"
          />
        </div>

        {/* Study & Self-Improvement */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-accent-improved" aria-hidden="true" />
            <h4 className="text-sm font-semibold text-text-primary">Study &amp; Skill Acquisition</h4>
          </div>
          <p className="text-xs text-text-secondary">
            Intentional reading, online courses, tutorials, and structured self-improvement.
          </p>
          <Slider
            id="time-study-slider"
            min={0}
            max={40}
            step={1}
            unit=" hrs / wk"
            value={time.studyHoursPerWeek}
            onChange={(val) => updateTime({ studyHoursPerWeek: val })}
            aria-label="Weekly study and learning hours"
            variant="improved"
            className="pt-2"
          />
        </div>

        {/* Social & Relationships */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-accent-warning" aria-hidden="true" />
            <h4 className="text-sm font-semibold text-text-primary">Social &amp; Family Connection</h4>
          </div>
          <p className="text-xs text-text-secondary">
            Time with family, friends, partner, and meaningful community interactions.
          </p>
          <Slider
            id="time-social-slider"
            min={0}
            max={50}
            step={1}
            unit=" hrs / wk"
            value={time.socialHoursPerWeek}
            onChange={(val) => updateTime({ socialHoursPerWeek: val })}
            aria-label="Weekly social and family hours"
            variant="neutral"
            className="pt-2"
          />
        </div>

        {/* Creative & Hobbies */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" aria-hidden="true" />
            <h4 className="text-sm font-semibold text-text-primary">Creative &amp; Passion Projects</h4>
          </div>
          <p className="text-xs text-text-secondary">
            Writing, building side projects, art, music, crafts, or recreational coding.
          </p>
          <Slider
            id="time-creative-slider"
            min={0}
            max={40}
            step={1}
            unit=" hrs / wk"
            value={time.creativeHoursPerWeek}
            onChange={(val) => updateTime({ creativeHoursPerWeek: val })}
            aria-label="Weekly creative and hobby hours"
            variant="improved"
            className="pt-2"
          />
        </div>

        {/* Downtime / Unproductive */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-accent-danger" aria-hidden="true" />
            <h4 className="text-sm font-semibold text-text-primary">Unproductive Downtime</h4>
          </div>
          <p className="text-xs text-text-secondary">
            Passive browsing, procrastination, mindless doomscrolling, or unstructured channel surfing.
          </p>
          <Slider
            id="time-wasted-slider"
            min={0}
            max={50}
            step={1}
            unit=" hrs / wk"
            value={time.wastedHoursPerWeek}
            onChange={(val) => updateTime({ wastedHoursPerWeek: val })}
            aria-label="Weekly unproductive or wasted hours"
            variant="current"
            className="pt-2"
          />
        </div>
      </div>
    </div>
  );
}
