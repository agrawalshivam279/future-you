'use client';

/**
 * GenerationStepper Component.
 * Visual multi-stage progress indicator with animated progress bar, status icons,
 * and WCAG AA accessible progress reporting.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { PipelineProgress, PipelineStage } from '@/lib/ai/generate-pipeline';
import { Spinner } from '@/components/ui/spinner';

export interface GenerationStepperProps {
  /** Active progress payload from pipeline */
  progress: PipelineProgress | null;
  /** Optional container class names */
  className?: string;
}

interface StepItem {
  stage: Exclude<PipelineStage, 'complete'>;
  title: string;
  detail: string;
}

const STAGES: StepItem[] = [
  {
    stage: 'life-model',
    title: 'Baseline Synthesis',
    detail: 'Analyzing habits, goals, and initial trajectories',
  },
  {
    stage: 'personas',
    title: 'Persona Development',
    detail: 'Deepening career, health, and relationship paths',
  },
  {
    stage: 'timelines',
    title: 'Timeline Projection',
    detail: 'Projecting 1, 3, and 5-year chronological markers',
  },
  {
    stage: 'letters',
    title: 'Letters From Future Self',
    detail: 'Drafting introspective letters across both futures',
  },
  {
    stage: 'reflections',
    title: 'Reflective Insights',
    detail: 'Distilling future regrets and grateful reflections',
  },
];

/**
 * Visual multi-stage progress indicator for the generation flow.
 */
export function GenerationStepper({
  progress,
  className = '',
}: GenerationStepperProps): React.JSX.Element {
  const currentStageIndex = progress?.stageIndex ?? 1;
  const progressPercent = progress?.progressPercent ?? 0;
  const isComplete = progress?.stage === 'complete' || progressPercent >= 100;

  return (
    <div
      className={`w-full max-w-xl mx-auto space-y-8 p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm ${className}`}
      data-testid="generation-stepper"
    >
      {/* Header and percentage */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {isComplete ? 'Synthesis Complete' : `Stage ${currentStageIndex} of 5`}
          </span>
          <span
            className="text-sm font-mono font-medium text-neutral-200"
            data-testid="progress-percent"
          >
            {Math.round(progressPercent)}%
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {progress?.label || 'Initializing Simulation...'}
        </h2>
        <p className="text-sm text-neutral-400 min-h-[1.5rem]">
          {progress?.description || 'Gathering responses and establishing generation parameters.'}
        </p>
      </div>

      {/* Accessible Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Future generation progress"
        className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden relative"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-neutral-200 via-white to-neutral-300 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Stage Checklist */}
      <div className="space-y-3 pt-2">
        {STAGES.map((item, index) => {
          const stepNumber = index + 1;
          const isFinished = isComplete || currentStageIndex > stepNumber;
          const isCurrent = !isComplete && currentStageIndex === stepNumber;
          const isPending = !isComplete && currentStageIndex < stepNumber;

          return (
            <div
              key={item.stage}
              data-testid={`stage-item-${item.stage}`}
              className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-neutral-800/80 border border-neutral-700 shadow-sm'
                  : 'bg-transparent border border-transparent'
              }`}
            >
              {/* Stage Status Icon */}
              <div className="mt-0.5 flex-shrink-0">
                {isFinished ? (
                  <div
                    aria-label={`${item.title} completed`}
                    className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isCurrent ? (
                  <div
                    aria-label={`${item.title} in progress`}
                    className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/30"
                  >
                    <Spinner size="sm" aria-label="Loading stage" />
                  </div>
                ) : (
                  <div
                    aria-label={`${item.title} pending`}
                    className="w-6 h-6 rounded-full bg-neutral-800/60 text-neutral-500 flex items-center justify-center border border-neutral-700/50 text-xs font-mono font-medium"
                  >
                    {stepNumber}
                  </div>
                )}
              </div>

              {/* Stage Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm font-medium ${
                      isFinished
                        ? 'text-neutral-300'
                        : isCurrent
                        ? 'text-white font-semibold'
                        : 'text-neutral-500'
                    }`}
                  >
                    {item.title}
                  </h3>
                  {isCurrent && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-neutral-200">
                      Processing
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    isCurrent ? 'text-neutral-300' : 'text-neutral-500'
                  }`}
                >
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
