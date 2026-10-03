import {
  exportLocalData,
  downloadDataAsJSON,
  deleteAllLocalData,
} from '../data-manager';
import {
  useSettingsStore,
  useUIStore,
  useOnboardingStore,
  useLifeModelStore,
  useChatStore,
} from '@/stores';

describe('Data Manager Storage Utilities', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  describe('exportLocalData', () => {
    it('gathers all future-you:* keys from localStorage while omitting external keys', () => {
      window.localStorage.setItem('future-you:settings', JSON.stringify({ provider: 'openai' }));
      window.localStorage.setItem('future-you:disclaimer-acknowledged', 'true');
      window.localStorage.setItem('other-app:data', JSON.stringify({ secret: 'ignore-me' }));

      const exportResult = exportLocalData();

      expect(exportResult.version).toBe(1);
      expect(exportResult.exportedAt).toBeDefined();
      expect(exportResult.localStorage['future-you:settings']).toEqual({ provider: 'openai' });
      expect(exportResult.localStorage['future-you:disclaimer-acknowledged']).toBe(true);
      expect(exportResult.localStorage['other-app:data']).toBeUndefined();
    });
  });

  describe('downloadDataAsJSON', () => {
    it('creates an anchor element and triggers download with correct file naming', () => {
      const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = jest.fn();
      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;

      const clickSpy = jest.fn();
      const mockAnchor = {
        href: '',
        download: '',
        setAttribute: jest.fn(),
        click: clickSpy,
      } as unknown as HTMLAnchorElement;

      const createElementSpy = jest
        .spyOn(document, 'createElement')
        .mockReturnValue(mockAnchor);
      const appendChildSpy = jest
        .spyOn(document.body, 'appendChild')
        .mockImplementation(() => mockAnchor);
      const removeChildSpy = jest
        .spyOn(document.body, 'removeChild')
        .mockImplementation(() => mockAnchor);

      downloadDataAsJSON();

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockAnchor.href).toBe('blob:mock-url');
      expect(mockAnchor.download).toMatch(/^future-you-backup-\d{4}-\d{2}-\d{2}\.json$/);
      expect(clickSpy).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

      createElementSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('deleteAllLocalData', () => {
    it('purges all future-you:* keys from localStorage and resets stores', async () => {
      window.localStorage.setItem('future-you:settings', JSON.stringify({ apiKey: 'test-key' }));
      window.localStorage.setItem('future-you:onboarding', JSON.stringify({ name: 'Alex' }));
      window.localStorage.setItem('external-token', 'preserve-me');

      const resetSettingsSpy = jest.spyOn(useSettingsStore.getState(), 'resetSettings');
      const resetUISpy = jest.spyOn(useUIStore.getState(), 'resetUI');
      const resetOnboardingSpy = jest.spyOn(useOnboardingStore.getState(), 'resetOnboarding');
      const resetLifeModelSpy = jest.spyOn(useLifeModelStore.getState(), 'resetLifeModel');
      const resetChatSpy = jest.spyOn(useChatStore.getState(), 'resetChat');

      await deleteAllLocalData();

      expect(window.localStorage.getItem('future-you:settings')).toBeNull();
      expect(window.localStorage.getItem('future-you:onboarding')).toBeNull();
      expect(window.localStorage.getItem('external-token')).toBe('preserve-me');

      expect(resetSettingsSpy).toHaveBeenCalled();
      expect(resetUISpy).toHaveBeenCalled();
      expect(resetOnboardingSpy).toHaveBeenCalled();
      expect(resetLifeModelSpy).toHaveBeenCalled();
      expect(resetChatSpy).toHaveBeenCalled();
    });
  });
});
