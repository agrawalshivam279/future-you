/**
 * Life Model AI Generation Orchestrator for Future You.
 * Synthesizes onboarding inputs into dual 5-year simulation paths using LLM completion.
 */

import { createAIClient } from '@/lib/ai/client';
import { useSettingsStore } from '@/stores/settings-store';
import {
  buildLifeModelSystemPrompt,
  buildLifeModelUserPrompt,
  parseLifeModelResponse,
} from '@/lib/prompts/life-model-generator';
import { LifeModel, OnboardingData, AISettings } from '@/types';
import { TokenUsage } from '@/lib/ai/ai-utils';

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
 * Resolves active AI settings, ensuring credentials are configured.
 */
function resolveSettings(customSettings?: AISettings): AISettings {
  if (customSettings) {
    if (customSettings.provider !== 'freellmapi' && !customSettings.apiKey?.trim()) {
      throw new Error('API key is required for the selected AI provider.');
    }
    return customSettings;
  }

  const store = useSettingsStore.getState();
  if (!store.isConfigured()) {
    throw new Error('AI provider is not configured. Please add an API key in Settings.');
  }

  return {
    provider: store.provider,
    apiKey: store.apiKey,
    baseURL: store.baseURL,
    modelName: store.modelName,
    temperature: store.temperature,
    maxTokens: store.maxTokens,
  };
}

/**
 * Translates provider and HTTP errors into human-readable error messages.
 */
function formatAIError(error: unknown, modelName: string): Error {
  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.message.toLowerCase().includes('abort')) {
      return new Error('Generation cancelled by user.');
    }

    const msg = error.message.toLowerCase();
    if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('invalid api key')) {
      return new Error('Invalid API key. Please check your credentials in Settings.');
    }
    if (msg.includes('404') || msg.includes('not found')) {
      return new Error(`Model '${modelName}' not found or endpoint URL is incorrect.`);
    }
    if (msg.includes('429') || msg.includes('quota')) {
      return new Error('Rate limit or billing quota exceeded for this API key.');
    }
    if (msg.includes('timeout') || msg.includes('timed out')) {
      return new Error('AI generation timed out. Please try again.');
    }
    return error;
  }

  return new Error(String(error || 'Unknown AI error occurred during generation.'));
}

/**
 * Determines whether a given error qualifies for an automated retry attempt.
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    if (error.name === 'AbortError' || error.message.toLowerCase().includes('abort')) {
      return false;
    }
    const msg = error.message.toLowerCase();
    if (msg.includes('invalid api key') || msg.includes('401') || msg.includes('unauthorized')) {
      return false;
    }
    if (msg.includes('not found') || msg.includes('404')) {
      return false;
    }
    if (msg.includes('not configured')) {
      return false;
    }
    // Parse errors, timeouts, rate limits, and server errors are retryable
    return true;
  }
  return true;
}

/**
 * Pause execution for specified milliseconds, respecting AbortSignal.
 */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Generation cancelled by user.'));
      return;
    }

    const timeout = setTimeout(() => {
      resolve();
    }, ms);

    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timeout);
        reject(new Error('Generation cancelled by user.'));
      },
      { once: true }
    );
  });
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

  const settings = resolveSettings(customSettings);
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
      // Exponential backoff: 1000ms, 2000ms...
      await sleep(1000 * attempt, signal);
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

      // Record token usage if present
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

      if (!isRetryableError(err) || attempt >= attempts - 1) {
        throw formatAIError(err, settings.modelName);
      }
    }
  }

  throw formatAIError(lastError, settings.modelName);
}
