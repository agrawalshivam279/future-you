import { useSettingsStore, PROVIDER_PRESETS } from '../settings-store';
import { STORAGE_PREFIX } from '@/lib/constants';

describe('useSettingsStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useSettingsStore.getState().resetSettings();
  });

  it('initializes with default OpenAI configuration', () => {
    const state = useSettingsStore.getState();
    expect(state.provider).toBe('openai');
    expect(state.baseURL).toBe(PROVIDER_PRESETS.openai.defaultBaseURL);
    expect(state.modelName).toBe(PROVIDER_PRESETS.openai.defaultModel);
    expect(state.apiKey).toBe('');
    expect(state.isConfigured()).toBe(false);
  });

  it('switches provider and synchronizes default baseURL and model', () => {
    const store = useSettingsStore.getState();
    store.setProvider('gemini');

    const updated = useSettingsStore.getState();
    expect(updated.provider).toBe('gemini');
    expect(updated.baseURL).toBe(PROVIDER_PRESETS.gemini.defaultBaseURL);
    expect(updated.modelName).toBe(PROVIDER_PRESETS.gemini.defaultModel);
  });

  it('updates apiKey and trims whitespace', () => {
    const store = useSettingsStore.getState();
    store.setApiKey('  sk-test-key  ');

    const updated = useSettingsStore.getState();
    expect(updated.apiKey).toBe('sk-test-key');
    expect(updated.isConfigured()).toBe(true);
  });

  it('updates custom baseURL and modelName', () => {
    const store = useSettingsStore.getState();
    store.setBaseURL('  https://my-proxy.com/v1  ');
    store.setModelName('  custom-model-x  ');

    const updated = useSettingsStore.getState();
    expect(updated.baseURL).toBe('https://my-proxy.com/v1');
    expect(updated.modelName).toBe('custom-model-x');
  });

  it('updates temperature and maxTokens', () => {
    const store = useSettingsStore.getState();
    store.setTemperature(0.2);
    store.setMaxTokens(2048);

    const updated = useSettingsStore.getState();
    expect(updated.temperature).toBe(0.2);
    expect(updated.maxTokens).toBe(2048);
  });

  it('considers freellmapi configured without an API key', () => {
    const store = useSettingsStore.getState();
    store.setProvider('freellmapi');

    const updated = useSettingsStore.getState();
    expect(updated.isConfigured()).toBe(true);
  });

  it('resets settings to default values', () => {
    const store = useSettingsStore.getState();
    store.setProvider('openrouter');
    store.setApiKey('sk-or-test');
    store.resetSettings();

    const reset = useSettingsStore.getState();
    expect(reset.provider).toBe('openai');
    expect(reset.apiKey).toBe('');
    expect(reset.baseURL).toBe(PROVIDER_PRESETS.openai.defaultBaseURL);
  });

  it('uses the mandatory future-you: prefix for localStorage persistence', () => {
    const store = useSettingsStore.getState();
    store.setApiKey('sk-persisted-test');

    const raw = localStorage.getItem(`${STORAGE_PREFIX}settings`);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.apiKey).toBe('sk-persisted-test');
  });
});
