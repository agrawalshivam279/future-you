/**
 * Regret and Gratitude AI Generation Orchestrator for Future You.
 * Orchestrates LLM prompt formulations and completions for introspective reflections across Current and Improved paths.
 */

import { createAIClient } from '@/lib/ai/client';
import {
  buildRegretGratitudeSystemPrompt,
  buildRegretGratitudeUserPrompt,
  parseRegretGratitudeResponse,
  RegretGratitudeResult,
} from '@/lib/prompts/regret-gratitude-generator';
import {
  PersonaId,
  OnboardingData,
  AISettings,
} from '@/types';
import {
  TokenUsage,
  resolveAISettings,
  formatAIError,
  isRetryableAIError,
  sleepWithSignal,
} from '@/lib/ai/ai-utils';

/**
 * Options for configuring single path regret & gratitude generation.
 */
export interface GenerateRegretGratitudeOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient or parse failures (default: 1) */
  maxRetries?: number;
  /** Custom AI settings overriding the global settings store */
  customSettings?: AISettings;
  /** Optional persona context describing this future trajectory */
  personaContext?: string;
  /** Progress notification callback */
  onProgress?: (status: string) => void;
  /** Token metrics callback */
  onTokenUsage?: (usage: TokenUsage) => void;
}

/**
 * Options for configuring dual trajectory regret & gratitude generation.
 */
export interface GenerateDualRegretGratitudeOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient or parse failures (default: 1) */
  maxRetries?: number;
  /** Custom AI settings overriding the global settings store */
  customSettings?: AISettings;
  /** Optional persona context for Current Path */
  currentContext?: string;
  /** Optional persona context for Improved Path */
  improvedContext?: string;
  /** Progress notification callback */
  onProgress?: (path: PersonaId, status: string) => void;
  /** Aggregate token metrics callback */
  onTokenUsage?: (usage: TokenUsage) => void;
}

/**
 * Generates structured regrets and gratitudes from a specific 5-year future self trajectory.
 *
 * @param path - 'current' or 'improved'
 * @param inputs - Baseline onboarding responses
 * @param options - Generation options and callbacks
 * @returns Promise resolving to categorized regrets and gratitudes
 */
export async function generateRegretGratitude(
  path: PersonaId,
  inputs: OnboardingData,
  options: GenerateRegretGratitudeOptions = {}
): Promise<RegretGratitudeResult> {
  const {
    signal,
    maxRetries = 1,
    customSettings,
    personaContext,
    onProgress,
    onTokenUsage,
  } = options;

  if (signal?.aborted) {
    throw new Error('Generation cancelled by user.');
  }

  const settings = resolveAISettings(customSettings);
  const client = createAIClient(settings);

  const systemPrompt = buildRegretGratitudeSystemPrompt(path);
  const userPrompt = buildRegretGratitudeUserPrompt(path, inputs, personaContext);

  let lastError: unknown = null;
  const attempts = Math.max(1, maxRetries + 1);

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (signal?.aborted) {
      throw new Error('Generation cancelled by user.');
    }

    if (attempt > 0) {
      onProgress?.(`Retrying ${path} reflections generation (attempt ${attempt + 1}/${attempts})...`);
      await sleepWithSignal(1000 * attempt, signal);
    } else {
      onProgress?.(`Generating regrets & gratitudes from ${path} future self...`);
    }

    try {
      const response = await client.chat.completions.create(
        {
          model: settings.modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: settings.temperature ?? 0.7,
          max_tokens: settings.maxTokens ?? 4096,
        },
        { signal }
      );

      const choice = response.choices?.[0];
      const rawContent = choice?.message?.content;

      if (!rawContent || !rawContent.trim()) {
        throw new Error('AI provider returned an empty response.');
      }

      if (response.usage && onTokenUsage) {
        onTokenUsage({
          promptTokens: response.usage.prompt_tokens ?? 0,
          completionTokens: response.usage.completion_tokens ?? 0,
          totalTokens: response.usage.total_tokens ?? 0,
        });
      }

      onProgress?.(`Parsing ${path} regrets and gratitudes...`);
      const isLastAttempt = attempt >= attempts - 1;
      const reflections = parseRegretGratitudeResponse(rawContent, path, inputs, !isLastAttempt);
      return reflections;
    } catch (err: unknown) {
      lastError = err;

      if (!isRetryableAIError(err) || attempt >= attempts - 1) {
        throw formatAIError(err, settings.modelName);
      }
    }
  }

  throw formatAIError(lastError, settings.modelName);
}

/**
 * Generates regrets and gratitudes for both Current and Improved paths concurrently.
 *
 * @param inputs - Baseline onboarding responses
 * @param options - Generation options and callbacks
 * @returns Promise resolving to reflections for both paths
 */
export async function generateDualRegretGratitude(
  inputs: OnboardingData,
  options: GenerateDualRegretGratitudeOptions = {}
): Promise<{ current: RegretGratitudeResult; improved: RegretGratitudeResult }> {
  const {
    signal,
    maxRetries = 1,
    customSettings,
    currentContext,
    improvedContext,
    onProgress,
    onTokenUsage,
  } = options;

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

  const [current, improved] = await Promise.all([
    generateRegretGratitude('current', inputs, {
      signal,
      maxRetries,
      customSettings,
      personaContext: currentContext,
      onProgress: (status) => onProgress?.('current', status),
      onTokenUsage: handleTokenUsage,
    }),
    generateRegretGratitude('improved', inputs, {
      signal,
      maxRetries,
      customSettings,
      personaContext: improvedContext,
      onProgress: (status) => onProgress?.('improved', status),
      onTokenUsage: handleTokenUsage,
    }),
  ]);

  return { current, improved };
}
