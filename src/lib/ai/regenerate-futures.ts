/**
 * Dynamic Futures Regeneration Orchestrator for Future You.
 * Recalculates simulated Improved Path trajectories when interactive habit lever sliders are modified.
 */

import { generatePersona } from '@/lib/ai/generate-personas';
import { generateSingleTimeline } from '@/lib/ai/generate-timeline';
import {
  LifeModel,
  HabitLever,
  AISettings,
} from '@/types';
import { TokenUsage } from '@/lib/ai/ai-utils';

/**
 * Options for configuring habit lever future regeneration.
 */
export interface RegenerateFuturesOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient failures (default: 1) */
  maxRetries?: number;
  /** Custom AI settings overriding the global settings store */
  customSettings?: AISettings;
  /** Whether to recalculate the improved timeline alongside the persona (default: true) */
  regenerateTimeline?: boolean;
  /** Progress notification callback */
  onProgress?: (status: string) => void;
  /** Aggregate token metrics callback */
  onTokenUsage?: (usage: TokenUsage) => void;
}

/**
 * Merges updated lever values into an existing array of habit levers, clamping to min/max boundaries.
 *
 * @param existingLevers - Baseline habit levers from the active LifeModel
 * @param updates - Array of updated levers or a key-value dictionary of { [leverId]: newValue }
 * @returns New array of updated HabitLevers with clamped values
 */
export function applyLeverUpdates(
  existingLevers: HabitLever[],
  updates: HabitLever[] | Record<string, number>
): HabitLever[] {
  if (Array.isArray(updates)) {
    const updateMap = new Map(updates.map((u) => [u.id, u.currentValue]));
    return existingLevers.map((lever) => {
      if (updateMap.has(lever.id)) {
        const val = updateMap.get(lever.id)!;
        const clamped = Math.min(lever.max, Math.max(lever.min, val));
        return { ...lever, currentValue: clamped };
      }
      return { ...lever };
    });
  }

  return existingLevers.map((lever) => {
    if (Object.prototype.hasOwnProperty.call(updates, lever.id)) {
      const val = updates[lever.id];
      const clamped = Math.min(lever.max, Math.max(lever.min, val));
      return { ...lever, currentValue: clamped };
    }
    return { ...lever };
  });
}

/**
 * Recalculates the Improved Path persona and timeline when habit lever sliders are modified.
 * Preserves the Current Path intact as the fixed baseline of inertia.
 *
 * @param existingModel - Active LifeModel containing baseline inputs and previous trajectories
 * @param leverUpdates - Modified habit levers or delta values
 * @param options - Generation options and callbacks
 * @returns Promise resolving to an updated LifeModel instance
 */
export async function regenerateFutures(
  existingModel: LifeModel,
  leverUpdates: HabitLever[] | Record<string, number>,
  options: RegenerateFuturesOptions = {}
): Promise<LifeModel> {
  if (!existingModel || !existingModel.inputs) {
    throw new Error('A valid existing LifeModel is required for futures regeneration.');
  }

  const {
    signal,
    maxRetries = 1,
    customSettings,
    regenerateTimeline = true,
    onProgress,
    onTokenUsage,
  } = options;

  if (signal?.aborted) {
    throw new Error('Generation cancelled by user.');
  }

  const updatedLevers = applyLeverUpdates(existingModel.habitLevers, leverUpdates);

  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;
  let totalTokens = 0;

  const handleTokenUsage = (usage: TokenUsage) => {
    totalPromptTokens += usage.promptTokens;
    totalCompletionTokens += usage.completionTokens;
    totalTokens += usage.totalTokens;

    onTokenUsage?.({
      promptTokens: totalPromptTokens,
      completionTokens: totalCompletionTokens,
      totalTokens,
    });
  };

  onProgress?.('Recalculating improved persona based on updated habit levers...');

  const updatedPersona = await generatePersona('improved', existingModel.inputs, {
    signal,
    maxRetries,
    customSettings,
    basePersona: existingModel.improvedPath,
    habitLevers: updatedLevers,
    onProgress: (status) => onProgress?.(status),
    onTokenUsage: handleTokenUsage,
  });

  if (regenerateTimeline) {
    onProgress?.('Recalculating 5-year timeline milestones...');

    const updatedTimeline = await generateSingleTimeline('improved', existingModel.inputs, {
      signal,
      maxRetries,
      customSettings,
      personaSummary: updatedPersona.summary,
      onProgress: (status) => onProgress?.(status),
      onTokenUsage: handleTokenUsage,
    });

    updatedPersona.timeline = updatedTimeline;
  } else {
    updatedPersona.timeline = existingModel.improvedPath.timeline || [];
  }

  return {
    ...existingModel,
    improvedPath: updatedPersona,
    habitLevers: updatedLevers,
  };
}
