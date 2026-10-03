/**
 * Universal AI Orchestration Utilities for Future You.
 * Shared credential resolution, error categorization, and cancellation helpers.
 */

import { useSettingsStore } from '@/stores/settings-store';
import { AISettings } from '@/types';

/**
 * Token usage report returned by the AI provider.
 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/**
 * Resolves active AI settings, ensuring credentials are configured.
 *
 * @param customSettings - Optional overrides provided by caller
 * @returns Configured AISettings object
 */
export function resolveAISettings(customSettings?: AISettings): AISettings {
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
 *
 * @param error - Caught error or exception
 * @param modelName - Active AI model identifier
 * @returns Standardized Error instance
 */
export function formatAIError(error: unknown, modelName: string): Error {
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
 *
 * @param error - Caught error
 * @returns Boolean indicating retryability
 */
export function isRetryableAIError(error: unknown): boolean {
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
    return true;
  }
  return true;
}

/**
 * Pause execution for specified milliseconds, respecting AbortSignal.
 *
 * @param ms - Sleep duration in milliseconds
 * @param signal - Optional AbortSignal
 * @returns Promise resolving upon timeout or rejecting upon cancellation
 */
export function sleepWithSignal(ms: number, signal?: AbortSignal): Promise<void> {
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
