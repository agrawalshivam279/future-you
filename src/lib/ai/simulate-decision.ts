/**
 * Decision Simulation AI Orchestrator for Future You.
 * Orchestrates LLM prompt execution, retry resilience, and structured evaluation parsing for life forks.
 */

import { createAIClient } from '@/lib/ai/client';
import {
  buildDecisionSimulatorSystemPrompt,
  buildDecisionSimulatorUserPrompt,
  parseDecisionSimulatorResponse,
} from '@/lib/prompts/decision-simulator';
import {
  DecisionScenario,
  DecisionEvaluation,
  AISettings,
} from '@/types';
import {
  useOnboardingStore,
  useLifeModelStore,
  useDecisionStore,
} from '@/stores';
import {
  TokenUsage,
  resolveAISettings,
  formatAIError,
  isRetryableAIError,
  sleepWithSignal,
} from '@/lib/ai/ai-utils';
import { AI_TIMEOUT_MS } from '@/lib/constants';

/**
 * Options for configuring decision simulation execution.
 */
export interface SimulateDecisionOptions {
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
}

/**
 * Evaluates a user decision scenario against their life model using the configured LLM.
 *
 * @param scenario - The decision scenario to project
 * @param options - Execution and retry options
 * @returns Parsed DecisionEvaluation matrix
 */
export async function simulateDecisionScenario(
  scenario: DecisionScenario,
  options?: SimulateDecisionOptions
): Promise<DecisionEvaluation> {
  const settings = resolveAISettings(options?.customSettings);
  const maxRetries = options?.maxRetries ?? 1;

  if (!settings.apiKey) {
    throw new Error('No API key configured. Please configure your API key in Settings.');
  }

  // Retrieve user background and existing simulation context
  const onboardingData = useOnboardingStore.getState().getOnboardingData();
  const lifeModel = useLifeModelStore.getState().model;

  const systemPrompt = buildDecisionSimulatorSystemPrompt();
  const userPrompt = buildDecisionSimulatorUserPrompt(
    scenario,
    onboardingData,
    lifeModel?.currentPath,
    lifeModel?.improvedPath
  );

  const client = createAIClient(settings);
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt <= maxRetries) {
    if (options?.signal?.aborted) {
      throw new Error('Decision simulation was cancelled by user.');
    }

    // Provision 60s timeout controller linked to optional parent signal
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
          ? 'Projecting multi-horizon decision impacts...'
          : `Retrying decision projection (attempt ${attempt + 1}/${maxRetries + 1})...`
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

      // Record token usage if metrics returned
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

      options?.onProgress?.('Synthesizing persona verdicts and trade-offs...');
      const evaluation = parseDecisionSimulatorResponse(rawContent, scenario.id);

      // Persist evaluation directly to Zustand store
      try {
        useDecisionStore.getState().setEvaluation(scenario.id, evaluation);
      } catch {
        // Safe for non-DOM test environments
      }

      options?.onProgress?.('Decision simulation complete.');
      return evaluation;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (options?.signal) {
        options.signal.removeEventListener('abort', onParentAbort);
      }

      lastError = err;

      if (options?.signal?.aborted) {
        throw new Error('Decision simulation was cancelled by user.');
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
  throw new Error(`Failed to simulate decision: ${formattedErr.message}`);
}
