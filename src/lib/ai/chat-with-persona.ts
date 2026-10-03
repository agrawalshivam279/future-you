/**
 * Streaming Persona Chat Orchestrator for Future You.
 * Connects persona conversational prompts, conversation history, and real-time streaming tokens.
 */

import { createAIClient } from '@/lib/ai/client';
import { buildCurrentPathSystemPrompt } from '@/lib/prompts/system-current-path';
import { buildImprovedPathSystemPrompt } from '@/lib/prompts/system-improved-path';
import {
  ChatMessage,
  Persona,
  PersonaId,
  OnboardingData,
  AISettings,
} from '@/types';
import {
  resolveAISettings,
  formatAIError,
} from '@/lib/ai/ai-utils';

/**
 * Normalized message format passed to the LLM completion API.
 */
export interface ModelMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Configuration options for persona chat interactions.
 */
export interface ChatWithPersonaOptions {
  /** Optional cancellation signal */
  signal?: AbortSignal;
  /** Custom AI settings overriding the global settings store */
  customSettings?: AISettings;
  /** Streaming token callback invoked as each text chunk arrives */
  onToken?: (token: string) => void;
  /** Previous conversation history with this persona */
  chatHistory?: ChatMessage[];
  /** Maximum number of previous messages to include in the context window (default: 16) */
  maxContextMessages?: number;
}

/**
 * Assembles the full array of messages including the grounded persona system prompt,
 * recent conversation history, and the new user message.
 *
 * @param personaId - Target persona identifier ('current' | 'improved')
 * @param userMessage - Latest message from the user
 * @param persona - Full persona data model
 * @param inputs - Baseline onboarding inputs
 * @param chatHistory - Existing messages list
 * @param maxContextMessages - Maximum history messages to retain (default: 16)
 * @returns Array of ModelMessages ready for API submission
 */
export function buildChatMessages(
  personaId: PersonaId,
  userMessage: string,
  persona: Persona,
  inputs: OnboardingData,
  chatHistory: ChatMessage[] = [],
  maxContextMessages: number = 16
): ModelMessage[] {
  const trimmedInput = userMessage.trim();
  if (!trimmedInput) {
    throw new Error('Message content cannot be empty.');
  }

  const systemContent =
    personaId === 'current'
      ? buildCurrentPathSystemPrompt(persona, inputs)
      : buildImprovedPathSystemPrompt(persona, inputs);

  const messages: ModelMessage[] = [
    { role: 'system', content: systemContent },
  ];

  // Filter completed historical messages and cap to context window
  const validHistory = chatHistory
    .filter((msg) => !msg.isStreaming && msg.content?.trim().length > 0)
    .slice(-maxContextMessages)
    .map((msg) => ({
      role: msg.role,
      content: msg.content.trim(),
    }));

  messages.push(...validHistory);
  messages.push({ role: 'user', content: trimmedInput });

  return messages;
}

/**
 * Initiates an interactive conversational exchange with a simulated future self persona.
 * Streams response tokens in real-time and returns the complete text upon completion.
 *
 * @param personaId - 'current' or 'improved'
 * @param userMessage - Current message from the user
 * @param persona - Target Persona representation
 * @param inputs - Baseline onboarding survey responses
 * @param options - Configuration and streaming callbacks
 * @returns Promise resolving to the complete assistant response string
 */
export async function chatWithPersona(
  personaId: PersonaId,
  userMessage: string,
  persona: Persona,
  inputs: OnboardingData,
  options: ChatWithPersonaOptions = {}
): Promise<string> {
  const {
    signal,
    customSettings,
    onToken,
    chatHistory = [],
    maxContextMessages = 16,
  } = options;

  if (signal?.aborted) {
    throw new Error('Generation cancelled by user.');
  }

  const settings = resolveAISettings(customSettings);
  const client = createAIClient(settings);

  const messages = buildChatMessages(
    personaId,
    userMessage,
    persona,
    inputs,
    chatHistory,
    maxContextMessages
  );

  let accumulatedContent = '';

  try {
    const stream = await client.chat.completions.create(
      {
        model: settings.modelName,
        messages,
        temperature: settings.temperature ?? 0.7,
        max_tokens: settings.maxTokens ?? 2048,
        stream: true,
      },
      { signal }
    );

    for await (const chunk of stream) {
      if (signal?.aborted) {
        throw new Error('Generation cancelled by user.');
      }

      const delta = chunk.choices?.[0]?.delta?.content || '';
      if (delta) {
        accumulatedContent += delta;
        onToken?.(delta);
      }
    }

    return accumulatedContent;
  } catch (error: unknown) {
    throw formatAIError(error, settings.modelName);
  }
}
