/**
 * Timeline Milestone AI Generation Orchestrator for Future You.
 * Orchestrates LLM prompt formulations, API completions, and resilient parsing for chronological milestones (Years 1, 3, 5).
 */

import { createAIClient } from '@/lib/ai/client';
import {
  buildTimelineSystemPrompt,
  buildTimelineUserPrompt,
  buildSinglePathTimelineUserPrompt,
  parseTimelineResponse,
  parseSinglePathTimelineResponse,
  TimelineGenerationResult,
} from '@/lib/prompts/timeline-generator';
import {
  TimelineMilestone,
  OnboardingData,
  PersonaId,
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
 * Options for configuring dual timeline milestone generation.
 */
export interface GenerateTimelinesOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient or parse failures (default: 1) */
  maxRetries?: number;
  /** Custom AI settings overriding the global settings store */
  customSettings?: AISettings;
  /** Optional persona summary for the Current Path */
  currentSummary?: string;
  /** Optional persona summary for the Improved Path */
  improvedSummary?: string;
  /** Progress notification callback */
  onProgress?: (status: string) => void;
  /** Token metrics callback */
  onTokenUsage?: (usage: TokenUsage) => void;
}

/**
 * Options for configuring single path timeline milestone generation.
 */
export interface GenerateSingleTimelineOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Maximum number of retry attempts on transient or parse failures (default: 1) */
  maxRetries?: number;
  /** Custom AI settings overriding the global settings store */
  customSettings?: AISettings;
  /** Optional persona summary for this specific trajectory */
  personaSummary?: string;
  /** Progress notification callback */
  onProgress?: (status: string) => void;
  /** Token metrics callback */
  onTokenUsage?: (usage: TokenUsage) => void;
}

/**
 * Generates chronological milestones (Years 1, 3, 5) for both Current and Improved paths.
 *
 * @param inputs - Baseline onboarding responses
 * @param options - Generation options and callbacks
 * @returns Promise resolving to dual timeline milestone collections
 */
export async function generateTimelines(
  inputs: OnboardingData,
  options: GenerateTimelinesOptions = {}
): Promise<TimelineGenerationResult> {
  const {
    signal,
    maxRetries = 1,
    customSettings,
    currentSummary,
    improvedSummary,
    onProgress,
    onTokenUsage,
  } = options;

  if (signal?.aborted) {
    throw new Error('Generation cancelled by user.');
  }

  const settings = resolveAISettings(customSettings);
  const client = createAIClient(settings);

  const systemPrompt = buildTimelineSystemPrompt();
  const userPrompt = buildTimelineUserPrompt(inputs, currentSummary, improvedSummary);

  let lastError: unknown = null;
  const attempts = Math.max(1, maxRetries + 1);

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (signal?.aborted) {
      throw new Error('Generation cancelled by user.');
    }

    if (attempt > 0) {
      onProgress?.(`Retrying timeline generation (attempt ${attempt + 1}/${attempts})...`);
      await sleepWithSignal(1000 * attempt, signal);
    } else {
      onProgress?.('Generating 5-year timeline milestones...');
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

      onProgress?.('Parsing and validating chronological milestones...');
      const isLastAttempt = attempt >= attempts - 1;
      const timelines = parseTimelineResponse(rawContent, inputs, !isLastAttempt);
      return timelines;
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
 * Generates chronological milestones (Years 1, 3, 5) for a single trajectory path.
 *
 * @param pathId - 'current' or 'improved'
 * @param inputs - Baseline onboarding responses
 * @param options - Generation options and callbacks
 * @returns Promise resolving to an array of TimelineMilestones
 */
export async function generateSingleTimeline(
  pathId: PersonaId,
  inputs: OnboardingData,
  options: GenerateSingleTimelineOptions = {}
): Promise<TimelineMilestone[]> {
  const {
    signal,
    maxRetries = 1,
    customSettings,
    personaSummary,
    onProgress,
    onTokenUsage,
  } = options;

  if (signal?.aborted) {
    throw new Error('Generation cancelled by user.');
  }

  const settings = resolveAISettings(customSettings);
  const client = createAIClient(settings);

  const systemPrompt = buildTimelineSystemPrompt();
  const userPrompt = buildSinglePathTimelineUserPrompt(pathId, inputs, personaSummary);

  let lastError: unknown = null;
  const attempts = Math.max(1, maxRetries + 1);

  for (let attempt = 0; attempt < attempts; attempt++) {
    if (signal?.aborted) {
      throw new Error('Generation cancelled by user.');
    }

    if (attempt > 0) {
      onProgress?.(`Retrying ${pathId} timeline generation (attempt ${attempt + 1}/${attempts})...`);
      await sleepWithSignal(1000 * attempt, signal);
    } else {
      onProgress?.(`Generating ${pathId} timeline milestones...`);
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

      onProgress?.(`Parsing and validating ${pathId} timeline milestones...`);
      const isLastAttempt = attempt >= attempts - 1;
      const timeline = parseSinglePathTimelineResponse(rawContent, pathId, inputs, !isLastAttempt);
      return timeline;
    } catch (err: unknown) {
      lastError = err;

      if (!isRetryableAIError(err) || attempt >= attempts - 1) {
        throw formatAIError(err, settings.modelName);
      }
    }
  }

  throw formatAIError(lastError, settings.modelName);
}
