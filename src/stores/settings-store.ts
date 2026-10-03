import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIProvider, AISettings, ProviderPreset } from '@/types';
import { STORAGE_PREFIX } from '@/lib/constants';

/**
 * Universal provider presets configuring base URLs and default models.
 */
export const PROVIDER_PRESETS: Record<AIProvider, ProviderPreset> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    defaultBaseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
    requiresKey: true,
    apiKeyPlaceholder: 'sk-...',
    helpUrl: 'https://platform.openai.com/api-keys',
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    defaultBaseURL: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-1.5-pro',
    requiresKey: true,
    apiKeyPlaceholder: 'AIzaSy...',
    helpUrl: 'https://aistudio.google.com/app/apikey',
  },
  freellmapi: {
    id: 'freellmapi',
    name: 'FreeLLMAPI / Local',
    defaultBaseURL: 'http://localhost:8000/v1',
    defaultModel: 'llama-3.1-70b',
    requiresKey: false,
    apiKeyPlaceholder: 'Optional for local',
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    defaultBaseURL: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-3.5-sonnet',
    requiresKey: true,
    apiKeyPlaceholder: 'sk-or-v1-...',
    helpUrl: 'https://openrouter.ai/keys',
  },
  custom: {
    id: 'custom',
    name: 'Custom Endpoint',
    defaultBaseURL: 'https://api.openai.com/v1',
    defaultModel: 'custom-model',
    requiresKey: true,
    apiKeyPlaceholder: 'Enter custom API key...',
  },
};

const DEFAULT_PROVIDER: AIProvider = 'openai';

const DEFAULT_STATE: AISettings = {
  provider: DEFAULT_PROVIDER,
  apiKey: '',
  baseURL: PROVIDER_PRESETS[DEFAULT_PROVIDER].defaultBaseURL,
  modelName: PROVIDER_PRESETS[DEFAULT_PROVIDER].defaultModel,
  temperature: 0.7,
  maxTokens: 4096,
};

export interface SettingsState extends AISettings {
  /** Update AI provider and synchronize default baseURL and model */
  setProvider: (provider: AIProvider) => void;
  /** Update secret API key */
  setApiKey: (apiKey: string) => void;
  /** Update endpoint base URL */
  setBaseURL: (baseURL: string) => void;
  /** Update target LLM model name */
  setModelName: (modelName: string) => void;
  /** Update sampling temperature */
  setTemperature: (temperature: number) => void;
  /** Update maximum completion tokens */
  setMaxTokens: (maxTokens: number) => void;
  /** Reset all settings back to default initial state */
  resetSettings: () => void;
  /** Helper returning true if client is ready to make requests */
  isConfigured: () => boolean;
}

/**
 * Zustand store managing AI provider credentials and configurations.
 * Persists locally to browser localStorage under future-you:settings.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setProvider: (provider: AIProvider) => {
        const preset = PROVIDER_PRESETS[provider];
        set({
          provider,
          baseURL: preset.defaultBaseURL,
          modelName: preset.defaultModel,
        });
      },

      setApiKey: (apiKey: string) => set({ apiKey: apiKey.trim() }),

      setBaseURL: (baseURL: string) => set({ baseURL: baseURL.trim() }),

      setModelName: (modelName: string) => set({ modelName: modelName.trim() }),

      setTemperature: (temperature: number) => set({ temperature }),

      setMaxTokens: (maxTokens: number) => set({ maxTokens }),

      resetSettings: () => set(DEFAULT_STATE),

      isConfigured: () => {
        const { provider, apiKey } = get();
        if (provider === 'freellmapi') {
          return true; // Local/FreeLLMAPI can function without explicit key
        }
        return apiKey.trim().length > 0;
      },
    }),
    {
      name: `${STORAGE_PREFIX}settings`,
    }
  )
);
