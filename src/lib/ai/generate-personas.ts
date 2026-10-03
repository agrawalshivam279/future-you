/**
 * Persona Generation Orchestrator for Future You.
 * Orchestrates LLM prompt formulations, API completions, and resilient parsing for individual and dual personas.
 */

import { createAIClient } from '@/lib/ai/client';
import {
  buildPersonaSystemPrompt,
  buildPersonaUserPrompt,
  parsePersonaResponse,
} from '@/lib/prompts/persona-generator';
import {
  Persona,
  PersonaId,
  OnboardingData,
  HabitLever,
  AISettings,
  LifeModel,
} from '@/types';
import {
  TokenUsage,
  resolveAISettings,
  formatAIError,
  isRetryableAIError,
  sleepWithSignal,
} from '@/lib/ai/ai-utils';

/**
 * Options for configuring single persona generation.
 */
export interface GeneratePersonaOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient or parse failures (default: 1) */
  maxRetries?: number;
  /** Custom AI settings overriding the global settings store */
  customSettings?: AISettings;
  /** Optional base persona to preserve or enrich */
  basePersona?: Partial<Persona>;
  /** Optional active habit levers */
  habitLevers?: HabitLever[];
  /** Progress notification callback */
  onProgress?: (status: string) => void;
  /** Token metrics callback */
  onTokenUsage?: (usage: TokenUsage) => void;
}

/**
 * Options for configuring dual persona generation (Current + Improved).
 */
export interface GeneratePersonasOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient or parse failures (default: 1) */
  maxRetries?: number;
  /** Custom AI settings overriding the global settings store */
  customSettings?: AISettings;
  /** Optional base LifeModel containing existing personas and levers */
  baseModel?: LifeModel;
  /** Progress notification callback per persona */
  onProgress?: (pathId: PersonaId, status: string) => void;
  /** Aggregate token metrics callback */
  onTokenUsage?: (usage: TokenUsage) => void;
}

/**
 * Generates or enriches an individual 5-year future self persona (Current or Improved).
 *
 * @param pathId - 'current' or 'improved'
 * @param inputs - Baseline onboarding responses
 * @param options - Generation options and callbacks
 * @returns Promise resolving to the validated Persona
 */
export async function generatePersona(
  pathId: PersonaId,
  inputs: OnboardingData,
  options: GeneratePersonaOptions = {}
): Promise<Persona> {
  const {
    signal,
    maxRetries = 1,
    customSettings,
    basePersona,
    habitLevers,
    onProgress,
    onTokenUsage,
  } = options;

  if (signal?.aborted) {
    throw new Error('Generation cancelled by user.');
  }

  const settings = resolveAISettings(customSettings);
  const client = createAIClient(settings);

  const systemPrompt = buildPersonaSystemPrompt(pathId);
  const userPrompt = buildPersonaUserPrompt(pathId, inputs, basePersona, habitLevers);

  let lastError: unknown = null;
  const attempts = Math.max(1, maxRetries + 1);

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (signal?.aborted) {
      throw new Error('Generation cancelled by user.');
    }

    if (attempt > 0) {
      onProgress?.(`Retrying ${pathId} persona generation (attempt ${attempt + 1}/${attempts})...`);
      await sleepWithSignal(1000 * attempt, signal);
    } else {
      onProgress?.(`Generating ${pathId} persona...`);
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

      onProgress?.(`Parsing and validating ${pathId} persona...`);
      const persona = parsePersonaResponse(rawContent, pathId, inputs, basePersona);
      return persona;
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
 * Generates both Current Path and Improved Path personas concurrently.
 *
 * @param inputs - Baseline onboarding responses
 * @param options - Generation options and callbacks
 * @returns Promise resolving to both synthesized Personas
 */
export async function generatePersonas(
  inputs: OnboardingData,
  options: GeneratePersonasOptions = {}
): Promise<{ currentPath: Persona; improvedPath: Persona }> {
  const {
    signal,
    maxRetries = 1,
    customSettings,
    baseModel,
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

  const [currentPath, improvedPath] = await Promise.all([
    generatePersona('current', inputs, {
      signal,
      maxRetries,
      customSettings,
      basePersona: baseModel?.currentPath,
      habitLevers: baseModel?.habitLevers,
      onProgress: (status) => onProgress?.('current', status),
      onTokenUsage: handleTokenUsage,
    }),
    generatePersona('improved', inputs, {
      signal,
      maxRetries,
      customSettings,
      basePersona: baseModel?.improvedPath,
      habitLevers: baseModel?.habitLevers,
      onProgress: (status) => onProgress?.('improved', status),
      onTokenUsage: handleTokenUsage,
    }),
  ]);

  return { currentPath, improvedPath };
}
