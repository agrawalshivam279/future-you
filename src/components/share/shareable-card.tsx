import React from 'react';
import { Sparkles, Quote, Shield, Activity, Compass, ArrowRight } from 'lucide-react';
import {
  ShareCardConfig,
  ShareCardData,
  ShareCardTheme,
  CardAspectRatio,
} from '@/types/share.types';

export interface ShareableCardProps {
  /** Simulation snapshot to display */
  data: ShareCardData;
  /** Active card styling and privacy configuration */
  config: ShareCardConfig;
  /** Optional container style override */
  className?: string;
  /** Optional forwarded ref for canvas capture */
  cardRef?: React.Ref<HTMLDivElement>;
}

/** Theme-specific background and border styling tokens */
const THEME_CLASSES: Record<ShareCardTheme, {
  container: string;
  cardBg: string;
  accentText: string;
  border: string;
  badge: string;
}> = {
  midnight: {
    container: 'bg-zinc-950 text-zinc-100 border-zinc-800',
    cardBg: 'bg-zinc-900/70 border-zinc-800/90',
    accentText: 'text-emerald-400',
    border: 'border-zinc-800',
    badge: 'bg-zinc-800/80 text-zinc-300 border-zinc-700',
  },
  emerald: {
    container: 'bg-[#031d13] text-emerald-50 border-emerald-800/60',
    cardBg: 'bg-emerald-950/60 border-emerald-800/70',
    accentText: 'text-emerald-300',
    border: 'border-emerald-800/50',
    badge: 'bg-emerald-900/60 text-emerald-200 border-emerald-700',
  },
  amber: {
    container: 'bg-[#1c1206] text-amber-50 border-amber-800/60',
    cardBg: 'bg-amber-950/60 border-amber-800/70',
    accentText: 'text-amber-300',
    border: 'border-amber-800/50',
    badge: 'bg-amber-900/60 text-amber-200 border-amber-700',
  },
  monochrome: {
    container: 'bg-black text-white border-zinc-800',
    cardBg: 'bg-zinc-950 border-zinc-800',
    accentText: 'text-zinc-200',
    border: 'border-zinc-800',
    badge: 'bg-zinc-900 text-zinc-300 border-zinc-700',
  },
};

/** Aspect ratio container class mappings */
const ASPECT_CLASSES: Record<CardAspectRatio, string> = {
  square: 'aspect-square max-w-[540px]',
  portrait: 'aspect-[4/5] max-w-[480px]',
  landscape: 'aspect-[16/9] max-w-[680px]',
};

/**
 * Shareable visual card preview summarizing simulated futures.
 * Pure presentation component supporting themeing, masking, and export capture.
 */
export function ShareableCard({
  data,
  config,
  className = '',
  cardRef,
}: ShareableCardProps): JSX.Element {
  const theme = THEME_CLASSES[config.theme] || THEME_CLASSES.midnight;
  const aspectClass = ASPECT_CLASSES[config.aspectRatio] || ASPECT_CLASSES.square;
  const { privacy, personaMode } = config;

  /** Format values with financial masking if enabled */
  const formatHabitValue = (value: string | number, isFinancial?: boolean): string => {
    if (privacy.maskFinances && (isFinancial || String(value).includes('$'))) {
      return '••••••';
    }
    return String(value);
  };

  return (
    <div
      ref={cardRef}
      role="region"
      aria-label="Shareable Result Card Preview"
      className={`relative w-full rounded-2xl border p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 select-none ${theme.container} ${aspectClass} ${className}`}
    >
      {/* Background ambient accents */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-white/90">
              Future You
            </span>
            <span className="block text-[10px] text-zinc-400 tracking-wider">
              5-Year Simulation
            </span>
          </div>
        </div>

        {privacy.includeAlignmentScore && data.alignmentScore !== undefined && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${theme.badge}`}
            aria-label={`Alignment Score: ${data.alignmentScore}%`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{data.alignmentScore}% Aligned</span>
          </div>
        )}
      </div>

      {/* Primary Goal / Trajectory North Star */}
      <div className="relative z-10 my-3">
        <span className="text-[11px] font-medium tracking-wide uppercase text-zinc-400">
          Target Trajectory
        </span>
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5 line-clamp-2">
          {data.primaryGoal}
        </h3>
      </div>

      {/* Persona Contrast Section */}
      <div className="relative z-10 my-auto space-y-2.5">
        {(personaMode === 'split' || personaMode === 'improved') && (
          <div className={`p-3.5 rounded-xl border ${theme.cardBg} relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Improved Path (Year 5)
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-200 line-clamp-2">
              {data.improvedHeadline}
            </p>
          </div>
        )}

        {(personaMode === 'split' || personaMode === 'current') && data.currentHeadline && (
          <div className={`p-3.5 rounded-xl border ${theme.cardBg} relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Current Path (Year 5)
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-300 line-clamp-2">
              {data.currentHeadline}
            </p>
          </div>
        )}

        {/* Future Self Quote (if enabled) */}
        {privacy.includeLetterQuote && data.improvedQuote && (
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
            <Quote className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs italic text-zinc-300 line-clamp-2">
              &ldquo;{data.improvedQuote}&rdquo;
            </p>
          </div>
        )}

        {/* Key Habits Comparison (if enabled) */}
        {privacy.includeHabits && data.habits && data.habits.length > 0 && (
          <div className="pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
              Habit Levers
            </span>
            <div className="grid grid-cols-2 gap-2">
              {data.habits.slice(0, 4).map((habit, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px]"
                >
                  <span className="text-zinc-400 truncate mr-2">{habit.label}</span>
                  <div className="flex items-center gap-1 font-mono text-zinc-200 flex-shrink-0">
                    <span className="text-zinc-500">
                      {formatHabitValue(habit.baseline, habit.isFinancial)}
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 text-zinc-600" />
                    <span className="text-emerald-400 font-semibold">
                      {formatHabitValue(habit.target, habit.isFinancial)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anxieties Friction Points (if privacy mask disabled) */}
        {!privacy.maskAnxieties && data.anxieties && data.anxieties.length > 0 && (
          <div className="pt-1 text-[11px] text-zinc-400">
            <span className="text-[10px] uppercase font-semibold text-zinc-500 block mb-0.5">
              Private Anxieties Reflected
            </span>
            <p className="line-clamp-1 italic text-zinc-300">{data.anxieties.join(', ')}</p>
          </div>
        )}
      </div>

      {/* Mandatory Reflection Disclaimer Footer */}
      <div className="relative z-10 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] text-zinc-400">
        <span className="tracking-wide text-zinc-400">
          futureyou.app
        </span>
        <span className="italic text-zinc-400 text-center sm:text-right">
          A reflection tool, not a prediction engine
        </span>
      </div>
    </div>
  );
}
