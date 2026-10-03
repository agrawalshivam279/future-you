/**
 * Master generation pipeline orchestrator.
 * Sequentially executes life model, persona, timeline, letter, and reflection generation,
 * assembling a complete LifeModel with granular progress callbacks and AbortSignal support.
 */

import { LifeModel, OnboardingData } from '@/types';
import { TokenUsage } from './ai-utils';
import { generateLifeModel } from './generate-life-model';
import { generatePersonas } from './generate-personas';
import { generateTimelines } from './generate-timeline';
import { generateLetters } from './generate-letter';
import { generateDualRegretGratitude } from './generate-regret-gratitude';

export type PipelineStage =
  | 'life-model'
  | 'personas'
  | 'timelines'
  | 'letters'
  | 'reflections'
  | 'complete';

export interface PipelineProgress {
  stage: PipelineStage;
  label: string;
  description: string;
  progressPercent: number;
  stageIndex: number;
  totalStages: number;
}

export interface PipelineOptions {
  /** Optional callback fired when entering each generation phase */
  onProgress?: (progress: PipelineProgress) => void;
  /** Optional AbortSignal to cancel generation */
  signal?: AbortSignal;
}

export interface PipelineResult {
  /** Fully assembled dual-trajectory LifeModel */
  model: LifeModel;
  /** Cumulative token consumption across all 5 AI stages */
  tokenUsage: TokenUsage;
}

/**
 * Stage configuration metadata for progress tracking.
 */
const STAGE_CONFIGS: Record<
  Exclude<PipelineStage, 'complete'>,
  { label: string; description: string; progressPercent: number; stageIndex: number }
> = {
  'life-model': {
    label: 'Baseline Synthesis',
    description: 'Analyzing habits, goals, and synthesizing baseline trajectory...',
    progressPercent: 20,
    stageIndex: 1,
  },
  personas: {
    label: 'Persona Development',
    description: 'Deepening career, health, relationships, and daily narratives for both paths...',
    progressPercent: 40,
    stageIndex: 2,
  },
  timelines: {
    label: 'Timeline Projection',
    description: 'Projecting 1, 3, and 5-year chronological milestones and turning points...',
    progressPercent: 60,
    stageIndex: 3,
  },
  letters: {
    label: 'Letters From Future Self',
    description: 'Composing introspective letters addressed to you in the present day...',
    progressPercent: 80,
    stageIndex: 4,
  },
  reflections: {
    label: 'Reflective Insights',
    description: 'Gathering poignant reflections of future regrets and gratitude...',
    progressPercent: 95,
    stageIndex: 5,
  },
};

/**
 * Combines token usage counts safely across multiple AI calls.
 */
function accumulateTokens(target: TokenUsage, addition?: TokenUsage): TokenUsage {
  return {
    promptTokens: (target.promptTokens ?? 0) + (addition?.promptTokens ?? 0),
    completionTokens: (target.completionTokens ?? 0) + (addition?.completionTokens ?? 0),
    totalTokens: (target.totalTokens ?? 0) + (addition?.totalTokens ?? 0),
  };
}

/**
 * Throws an AbortError if the provided signal has been aborted.
 */
function checkAborted(signal?: AbortSignal): void {
  if (signal?.aborted) {
    throw new DOMException('Pipeline generation was aborted', 'AbortError');
  }
}

/**
 * Executes the complete 5-stage AI life model generation pipeline.
 *
 * @param inputs - Validated user onboarding questionnaire responses
 * @param options - Optional progress callback and AbortSignal
 * @returns Fully populated LifeModel and total token metrics
 */
export async function generatePipeline(
  inputs: OnboardingData,
  options: PipelineOptions = {}
): Promise<PipelineResult> {
  const { onProgress, signal } = options;

  if (!inputs) {
    throw new Error('Missing required onboarding inputs for pipeline generation.');
  }

  checkAborted(signal);

  let cumulativeTokens: TokenUsage = {
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
  };

  const emitProgress = (stage: Exclude<PipelineStage, 'complete'>) => {
    const config = STAGE_CONFIGS[stage];
    onProgress?.({
      stage,
      label: config.label,
      description: config.description,
      progressPercent: config.progressPercent,
      stageIndex: config.stageIndex,
      totalStages: 5,
    });
  };

  // Stage 1: Baseline Life Model Synthesis
  emitProgress('life-model');
  checkAborted(signal);
  let stage1Tokens: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  const baseModel = await generateLifeModel(inputs, {
    signal,
    onTokenUsage: (usage) => {
      stage1Tokens = usage;
    },
  });
  cumulativeTokens = accumulateTokens(cumulativeTokens, stage1Tokens);

  // Stage 2: Deep Persona Trajectory Generation
  emitProgress('personas');
  checkAborted(signal);
  let stage2Tokens: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  const personasResult = await generatePersonas(inputs, {
    baseModel,
    signal,
    onTokenUsage: (usage) => {
      stage2Tokens = usage;
    },
  });
  cumulativeTokens = accumulateTokens(cumulativeTokens, stage2Tokens);

  // Stage 3: Chronological Timeline Projections
  emitProgress('timelines');
  checkAborted(signal);
  let stage3Tokens: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  const timelinesResult = await generateTimelines(inputs, {
    currentSummary: personasResult.currentPath.summary,
    improvedSummary: personasResult.improvedPath.summary,
    signal,
    onTokenUsage: (usage) => {
      stage3Tokens = usage;
    },
  });
  cumulativeTokens = accumulateTokens(cumulativeTokens, stage3Tokens);

  // Stage 4: Introspective Future Self Letters
  emitProgress('letters');
  checkAborted(signal);
  let stage4Tokens: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  const lettersResult = await generateLetters(inputs, {
    currentContext: personasResult.currentPath.summary,
    improvedContext: personasResult.improvedPath.summary,
    signal,
    onTokenUsage: (usage) => {
      stage4Tokens = usage;
    },
  });
  cumulativeTokens = accumulateTokens(cumulativeTokens, stage4Tokens);

  // Stage 5: Regret and Gratitude Reflections
  emitProgress('reflections');
  checkAborted(signal);
  let stage5Tokens: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  const reflectionsResult = await generateDualRegretGratitude(inputs, {
    currentContext: personasResult.currentPath.summary,
    improvedContext: personasResult.improvedPath.summary,
    signal,
    onTokenUsage: (usage) => {
      stage5Tokens = usage;
    },
  });
  cumulativeTokens = accumulateTokens(cumulativeTokens, stage5Tokens);

  checkAborted(signal);

  // Assemble the unified LifeModel with full persona sub-structures
  const fullyPopulatedModel: LifeModel = {
    ...baseModel,
    currentPath: {
      ...personasResult.currentPath,
      timeline: timelinesResult.currentTimeline,
      letter: lettersResult.currentLetter,
      regrets: reflectionsResult.current.regrets,
      gratitudes: reflectionsResult.current.gratitudes,
    },
    improvedPath: {
      ...personasResult.improvedPath,
      timeline: timelinesResult.improvedTimeline,
      letter: lettersResult.improvedLetter,
      regrets: reflectionsResult.improved.regrets,
      gratitudes: reflectionsResult.improved.gratitudes,
    },
  };

  onProgress?.({
    stage: 'complete',
    label: 'Generation Complete',
    description: 'Your future trajectories are fully synthesized.',
    progressPercent: 100,
    stageIndex: 5,
    totalStages: 5,
  });

  return {
    model: fullyPopulatedModel,
    tokenUsage: cumulativeTokens,
  };
}
