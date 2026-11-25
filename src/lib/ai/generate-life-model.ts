/**
 * Life Model AI Generation Orchestrator for Future You.
 * Synthesizes onboarding inputs into dual 5-year simulation paths using LLM completion.
 */

import { createAIClient } from '@/lib/ai/client';
import {
  buildLifeModelSystemPrompt,
  buildLifeModelUserPrompt,
  parseLifeModelResponse,
} from '@/lib/prompts/life-model-generator';
import { LifeModel, OnboardingData, AISettings } from '@/types';
import {
  TokenUsage,
  resolveAISettings,
  formatAIError,
  isRetryableAIError,
  sleepWithSignal,
} from '@/lib/ai/ai-utils';

/**
 * Options for configuring Life Model generation behavior.
 */
export interface GenerateLifeModelOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient or parse failures (default: 1) */
  maxRetries?: number;
  /** Custom AI settings overriding the global settings store */
  customSettings?: AISettings;
  /** Progress notification callback */
  onProgress?: (status: string) => void;
  /** Token metrics callback */
  onTokenUsage?: (usage: TokenUsage) => void;
}

/**
 * Generates a complete 5-year LifeModel simulation by invoking the configured AI provider.
 * Orchestrates prompt formulation, API communication, resilient JSON parsing, and retries.
 *
 * @param inputs - Baseline onboarding responses provided by the user
 * @param options - Optional generation configuration and callbacks
 * @returns Promise resolving to the validated, typed LifeModel
 */
export async function generateLifeModel(
  inputs: OnboardingData,
  options: GenerateLifeModelOptions = {}
): Promise<LifeModel> {
  const {
    signal,
    maxRetries = 1,
    customSettings,
    onProgress,
    onTokenUsage,
  } = options;

  if (signal?.aborted) {
    throw new Error('Generation cancelled by user.');
  }

  const settings = resolveAISettings(customSettings);
  const client = createAIClient(settings);

  const systemPrompt = buildLifeModelSystemPrompt();
  const userPrompt = buildLifeModelUserPrompt(inputs);

  let lastError: unknown = null;
  const attempts = Math.max(1, maxRetries + 1);

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (signal?.aborted) {
      throw new Error('Generation cancelled by user.');
    }

    if (attempt > 0) {
      onProgress?.(`Retrying generation (attempt ${attempt + 1}/${attempts})...`);
      await sleepWithSignal(1000 * attempt, signal);
    } else {
      onProgress?.('Generating 5-year future trajectories...');
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

      onProgress?.('Parsing and validating future models...');
      const lifeModel = parseLifeModelResponse(rawContent, inputs);
      return lifeModel;
    } catch (err: unknown) {
      lastError = err;

      if (!isRetryableAIError(err) || attempt >= attempts - 1) {
        throw formatAIError(err, settings.modelName);
      }
    }
  }

  throw formatAIError(lastError, settings.modelName);
}
