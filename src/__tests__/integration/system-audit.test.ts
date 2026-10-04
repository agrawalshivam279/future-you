import { STORAGE_PREFIX, HONESTY_DISCLAIMER } from '@/lib/constants';
import {
  useSettingsStore,
  useUIStore,
  useOnboardingStore,
  useLifeModelStore,
  useChatStore,
} from '@/stores';
import { deleteAllLocalData, exportLocalData } from '@/lib/storage/data-manager';
import {
  buildCurrentPathSystemPrompt,
  buildImprovedPathSystemPrompt,
  buildLifeModelSystemPrompt,
  buildPersonaSystemPrompt,
  buildTimelineSystemPrompt,
  buildLetterSystemPrompt,
  buildRegretGratitudeSystemPrompt,
} from '@/lib/prompts';
import { mockLifeModel } from '@/app/dashboard/__tests__/fixtures';

jest.mock('@/lib/storage/indexed-db', () => ({
  ...jest.requireActual('@/lib/storage/indexed-db'),
  clearIndexedDBDatabase: jest.fn().mockResolvedValue(undefined),
}));

describe('Phase 14: System-Wide Architectural & Privacy Invariants Audit', () => {
  beforeEach(async () => {
    localStorage.clear();
    await deleteAllLocalData();
  });

  describe('Invariant 1: Local-First Storage & Prefix Invariant', () => {
    it('enforces exact future-you: prefix constant', () => {
      expect(STORAGE_PREFIX).toBe('future-you:');
    });

    it('stores all Zustand persisted keys under future-you: namespace', () => {
      // Populate stores
      useSettingsStore.getState().setApiKey('sk-audit-key');
      useOnboardingStore.getState().updateBasics('Alex', 30);
      useLifeModelStore.getState().setLifeModel(mockLifeModel);
      useUIStore.getState().setActiveDashboardTab('timeline');

      // Check keys in localStorage
      const keys = Object.keys(localStorage);
      expect(keys.length).toBeGreaterThan(0);
      keys.forEach((key) => {
        expect(key.startsWith('future-you:')).toBe(true);
      });
    });

    it('exportLocalData captures only future-you: prefixed entries', () => {
      localStorage.setItem('future-you:test-key', JSON.stringify({ audit: true }));
      localStorage.setItem('foreign-unrelated-key', 'should-not-be-exported');

      const backup = exportLocalData();
      expect(backup.localStorage['future-you:test-key']).toEqual({ audit: true });
      expect(backup.localStorage['foreign-unrelated-key']).toBeUndefined();
    });
  });

  describe('Invariant 2: Complete One-Click Data Purge', () => {
    it('completely purges all stores, local storage, and resets in-memory states', async () => {
      // 1. Fill state
      useSettingsStore.getState().setApiKey('sk-purge-test');
      useOnboardingStore.getState().updateBasics('Sam', 35);
      useLifeModelStore.getState().setLifeModel(mockLifeModel);
      useChatStore.getState().addMessage('current', {
        id: 'msg-1',
        role: 'user',
        content: 'Hello future me',
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('future-you:extra', JSON.stringify({ active: true }));

      expect(useLifeModelStore.getState().model).not.toBeNull();
      expect(useSettingsStore.getState().apiKey).toBe('sk-purge-test');

      // 2. Perform total purge
      await deleteAllLocalData();

      // 3. Verify clean slate
      expect(useLifeModelStore.getState().model).toBeNull();
      expect(useSettingsStore.getState().apiKey).toBe('');
      expect(useOnboardingStore.getState().name).toBe('');
      expect(useChatStore.getState().conversations.current).toEqual([]);

      const remainingKeys = Object.keys(localStorage).filter((k) =>
        k.startsWith(STORAGE_PREFIX)
      );
      expect(remainingKeys.length).toBe(0);
    });
  });

  describe('Invariant 3: Honesty Reflection Disclaimer Audit', () => {
    const requiredPhrase = /reflection tool, not a prediction engine/i;

    it('contains reflection disclaimer in honesty constant', () => {
      expect(HONESTY_DISCLAIMER).toMatch(requiredPhrase);
    });

    it('contains reflection disclaimer across all LLM system prompt builders', () => {
      const dummyOnboarding = useOnboardingStore.getState().getOnboardingData();

      const currentPrompt = buildCurrentPathSystemPrompt(
        mockLifeModel.currentPath,
        dummyOnboarding
      );
      const improvedPrompt = buildImprovedPathSystemPrompt(
        mockLifeModel.improvedPath,
        dummyOnboarding
      );
      const lifeModelPrompt = buildLifeModelSystemPrompt();
      const personaPrompt = buildPersonaSystemPrompt('current');
      const timelinePrompt = buildTimelineSystemPrompt();
      const letterPrompt = buildLetterSystemPrompt('improved');
      const regretPrompt = buildRegretGratitudeSystemPrompt('current');

      expect(currentPrompt).toMatch(requiredPhrase);
      expect(improvedPrompt).toMatch(requiredPhrase);
      expect(lifeModelPrompt).toMatch(requiredPhrase);
      expect(personaPrompt).toMatch(requiredPhrase);
      expect(timelinePrompt).toMatch(requiredPhrase);
      expect(letterPrompt).toMatch(requiredPhrase);
      expect(regretPrompt).toMatch(requiredPhrase);
    });
  });

  describe('Invariant 4: Safe Missing API Key Handling', () => {
    it('flags unconfigured status when key is empty without throwing', () => {
      useSettingsStore.setState({ provider: 'openai', apiKey: '' });
      expect(useSettingsStore.getState().isConfigured()).toBe(false);

      useSettingsStore.setState({ provider: 'gemini', apiKey: '   ' });
      expect(useSettingsStore.getState().isConfigured()).toBe(false);

      useSettingsStore.setState({ provider: 'freellmapi', apiKey: '' });
      expect(useSettingsStore.getState().isConfigured()).toBe(true);
    });
  });
});
