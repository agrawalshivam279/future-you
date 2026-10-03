/**
 * Future Self Letter AI Generation Orchestrator for Future You.
 * Orchestrates LLM prompt formulations and completions for introspective 5-year future self letters.
 */

import { createAIClient } from '@/lib/ai/client';
import {
  buildLetterSystemPrompt,
  buildLetterUserPrompt,
} from '@/lib/prompts/letter-generator';
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
 * Options for configuring single future self letter generation.
 */
export interface GenerateLetterOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient failures (default: 1) */
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
 * Options for configuring dual future self letter generation.
 */
export interface GenerateLettersOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient failures (default: 1) */
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
 * Cleans markdown code fences or wrapping artifacts from raw letter text.
 */
function cleanLetterText(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:markdown|text)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return cleaned.trim();
}

/**
 * Generates an introspective letter from the user's 5-year future self.
 *
 * @param path - 'current' or 'improved'
 * @param inputs - Baseline onboarding responses
 * @param options - Generation options and callbacks
 * @returns Promise resolving to the letter string
 */
export async function generateLetter(
  path: PersonaId,
  inputs: OnboardingData,
  options: GenerateLetterOptions = {}
): Promise<string> {
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

  const systemPrompt = buildLetterSystemPrompt(path);
  const userPrompt = buildLetterUserPrompt(path, inputs, personaContext);

  let lastError: unknown = null;
  const attempts = Math.max(1, maxRetries + 1);

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (signal?.aborted) {
      throw new Error('Generation cancelled by user.');
    }

    if (attempt > 0) {
      onProgress?.(`Retrying ${path} letter generation (attempt ${attempt + 1}/${attempts})...`);
      await sleepWithSignal(1000 * attempt, signal);
    } else {
      onProgress?.(`Generating letter from ${path} future self...`);
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

      onProgress?.(`Finalizing ${path} future self letter...`);
      return cleanLetterText(rawContent);
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
 * Generates future self letters for both Current and Improved paths concurrently.
 *
 * @param inputs - Baseline onboarding responses
 * @param options - Generation options and callbacks
 * @returns Promise resolving to both future self letters
 */
export async function generateLetters(
  inputs: OnboardingData,
  options: GenerateLettersOptions = {}
): Promise<{ currentLetter: string; improvedLetter: string }> {
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

  const [currentLetter, improvedLetter] = await Promise.all([
    generateLetter('current', inputs, {
      signal,
      maxRetries,
      customSettings,
      personaContext: currentContext,
      onProgress: (status) => onProgress?.('current', status),
      onTokenUsage: handleTokenUsage,
    }),
    generateLetter('improved', inputs, {
      signal,
      maxRetries,
      customSettings,
      personaContext: improvedContext,
      onProgress: (status) => onProgress?.('improved', status),
      onTokenUsage: handleTokenUsage,
    }),
  ]);

  return { currentLetter, improvedLetter };
}
