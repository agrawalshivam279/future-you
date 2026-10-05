/**
 * AI Check-in Feedback Orchestrator for Future You.
 * Orchestrates LLM prompt execution, timeout handling, retry resilience,
 * and persistent storage of trajectory drift evaluations.
 */

import { createAIClient } from '@/lib/ai/client';
import {
  buildCheckInReflectionSystemPrompt,
  buildCheckInReflectionUserPrompt,
  parseCheckInReflectionResponse,
} from '@/lib/prompts/check-in-reflection';
import {
  CheckInLog,
  CheckInEvaluation,
  AISettings,
} from '@/types';
import {
  useOnboardingStore,
  useLifeModelStore,
  useCheckInStore,
} from '@/stores';
import {
  TokenUsage,
  resolveAISettings,
  formatAIError,
  isRetryableAIError,
  sleepWithSignal,
} from '@/lib/ai/ai-utils';
import { evaluateCheckInDrift } from '@/lib/scoring';
import { AI_TIMEOUT_MS } from '@/lib/constants';

/**
 * Options for configuring check-in feedback evaluation and generation.
 */
export interface CheckInFeedbackOptions {
  /** Optional external abort signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient network failures (default: 1) */
  maxRetries?: number;
  /** Custom AI settings overriding the global settings store */
  customSettings?: AISettings;
  /** Status notification callback */
  onProgress?: (status: string) => void;
  /** Token metrics callback */
  onTokenUsage?: (usage: TokenUsage) => void;
  /** If true, generates deterministic reflection note without calling LLM */
  fallbackOnly?: boolean;
}

/**
 * Generates an empathetic, deterministic reflection note for offline or fallback scenarios.
 */
export function generateDeterministicReflection(alignmentScore: number): string {
  if (alignmentScore >= 80) {
    return (
      'You are holding your trajectory with remarkable steadiness. Every protected rhythm is ' +
      'quietly compounding into the life we envisioned 5 years ahead.\n\n' +
      'Micro-adjustment: Keep protecting your current morning momentum without adding unnecessary pressure.\n\n' +
      'Stay grounded in what is already working.'
    );
  }

  if (alignmentScore >= 50) {
    return (
      'Progress is rarely a straight diagonal. You held several key anchors this week, and the areas of ' +
      'drift are gentle signals for recalibration, not personal failures.\n\n' +
      'Micro-adjustment: Pick one slipping habit to gently reset tomorrow morning.\n\n' +
      'Consistency is built through small returns, not drastic overhauls.'
    );
  }

  return (
    'This was clearly a week with heavy friction and cognitive drag, and that is completely human. ' +
    'Do not punish yourself or attempt an overwhelming turnaround.\n\n' +
    'Micro-adjustment: Protect just 7 hours of restorative sleep tonight before worrying about any other goal.\n\n' +
    'Be kind to yourself today. Momentum will return.'
  );
}

/**
 * Evaluates check-in drift metrics and generates an AI reflection note from the Future Self.
 *
 * @param log - Recorded check-in log
 * @param options - Execution and retry options
 * @returns Complete evaluated CheckInEvaluation
 */
export async function evaluateAndGenerateCheckInFeedback(
  log: CheckInLog,
  options?: CheckInFeedbackOptions
): Promise<CheckInEvaluation> {
  const onboardingData = useOnboardingStore.getState().getOnboardingData();
  const lifeModel = useLifeModelStore.getState().model;

  // 1. Calculate deterministic drift vectors and alignment score
  options?.onProgress?.('Evaluating habit drift and trajectory alignment...');
  const baselineInputs = {
    habits: onboardingData?.habits,
    time: onboardingData?.time,
    money: onboardingData?.money,
  };
  const { alignmentScore, driftVectors } = evaluateCheckInDrift(
    log,
    baselineInputs,
    lifeModel?.habitLevers
  );

  // 2. Fallback mode requested
  if (options?.fallbackOnly) {
    const fallbackText = generateDeterministicReflection(alignmentScore);
    const evaluation: CheckInEvaluation = {
      logId: log.id,
      evaluatedAt: new Date().toISOString(),
      overallAlignmentScore: alignmentScore,
      driftVectors,
      futureSelfReflection: fallbackText,
    };

    try {
      useCheckInStore.getState().setEvaluation(log.id, evaluation);
    } catch {
      // Safe for headless non-browser environments
    }

    options?.onProgress?.('Check-in evaluation complete.');
    return evaluation;
  }

  // 3. Resolve LLM configuration
  const settings = resolveAISettings(options?.customSettings);
  const maxRetries = options?.maxRetries ?? 1;

  if (!settings.apiKey) {
    throw new Error('No API key configured. Please configure your API key in Settings.');
  }

  const systemPrompt = buildCheckInReflectionSystemPrompt();
  const userPrompt = buildCheckInReflectionUserPrompt(
    log,
    driftVectors,
    alignmentScore,
    onboardingData,
    lifeModel?.improvedPath
  );

  const client = createAIClient(settings);
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt <= maxRetries) {
    if (options?.signal?.aborted) {
      throw new Error('Check-in reflection generation was cancelled by user.');
    }

    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      timeoutController.abort(new Error(`AI call timed out after ${AI_TIMEOUT_MS / 1000}s`));
    }, AI_TIMEOUT_MS);

    const onParentAbort = () => {
      timeoutController.abort(options?.signal?.reason);
    };

    if (options?.signal) {
      options.signal.addEventListener('abort', onParentAbort);
    }

    try {
      options?.onProgress?.(
        attempt === 0
          ? 'Synthesizing Future Self reflection...'
          : `Retrying reflection generation (attempt ${attempt + 1}/${maxRetries + 1})...`
      );

      const completion = await client.chat.completions.create(
        {
          model: settings.modelName || 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
        },
        {
          signal: timeoutController.signal,
        }
      );

      clearTimeout(timeoutId);
      if (options?.signal) {
        options.signal.removeEventListener('abort', onParentAbort);
      }

      if (completion.usage && options?.onTokenUsage) {
        options.onTokenUsage({
          promptTokens: completion.usage.prompt_tokens ?? 0,
          completionTokens: completion.usage.completion_tokens ?? 0,
          totalTokens: completion.usage.total_tokens ?? 0,
        });
      }

      const rawContent = completion.choices[0]?.message?.content;
      if (!rawContent || !rawContent.trim()) {
        throw new Error('Received an empty response from the AI provider.');
      }

      const parsed = parseCheckInReflectionResponse(rawContent);
      const formattedReflection = `${parsed.futureSelfReflection}\n\nMicro-adjustment: ${parsed.recommendedAdjustment}\n\n${parsed.encouragement}`;

      const evaluation: CheckInEvaluation = {
        logId: log.id,
        evaluatedAt: new Date().toISOString(),
        overallAlignmentScore: alignmentScore,
        driftVectors,
        futureSelfReflection: formattedReflection,
      };

      try {
        useCheckInStore.getState().setEvaluation(log.id, evaluation);
      } catch {
        // Safe for non-DOM test environments
      }

      options?.onProgress?.('Check-in evaluation complete.');
      return evaluation;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (options?.signal) {
        options.signal.removeEventListener('abort', onParentAbort);
      }

      lastError = err;

      if (options?.signal?.aborted) {
        throw new Error('Check-in reflection generation was cancelled by user.');
      }

      if (attempt < maxRetries && isRetryableAIError(err)) {
        attempt++;
        const backoffDelay = 1000 * Math.pow(2, attempt - 1);
        await sleepWithSignal(backoffDelay, options?.signal);
        continue;
      }

      break;
    }
  }

  const formattedErr = formatAIError(lastError, settings.modelName || 'gpt-4o');
  throw new Error(`Failed to generate check-in reflection: ${formattedErr.message}`);
}
