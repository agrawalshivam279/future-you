/**
 * Settings and AI provider configuration types for Future You.
 */

export type AIProvider = 'openai' | 'gemini' | 'freellmapi' | 'openrouter' | 'custom';

/**
 * Universal OpenAI-compatible AI client settings.
 */
export interface AISettings {
  /** Chosen AI provider preset */
  provider: AIProvider;
  /** Secret API key supplied by user */
  apiKey: string;
  /** OpenAI-compatible base URL */
  baseURL: string;
  /** Target LLM model identifier (e.g. 'gpt-4o', 'gemini-1.5-pro', 'llama3') */
  modelName: string;
  /** Sampling temperature (0.0 to 1.0) */
  temperature?: number;
  /** Max completion tokens */
  maxTokens?: number;
}

/**
 * Metadata defining provider preset behaviors and default values.
 */
export interface ProviderPreset {
  /** Provider identifier */
  id: AIProvider;
  /** Human-readable display title */
  name: string;
  /** Default endpoint base URL */
  defaultBaseURL: string;
  /** Recommended default model name */
  defaultModel: string;
  /** Whether this provider strictly mandates an API key */
  requiresKey: boolean;
  /** Input placeholder hint for the API key input */
  apiKeyPlaceholder?: string;
  /** Official documentation or key retrieval URL */
  helpUrl?: string;
}
