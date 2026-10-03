import { useUIStore } from '../ui-store';
import { STORAGE_PREFIX } from '@/lib/constants';

describe('useUIStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useUIStore.getState().resetUI();
  });

  it('initializes with default UI coordinates', () => {
    const state = useUIStore.getState();
    expect(state.isDisclaimerOpen).toBe(false);
    expect(state.isSettingsOpen).toBe(false);
    expect(state.activeDashboardTab).toBe('split');
    expect(state.activePersona).toBe('improved');
  });

  it('updates modal visibility states', () => {
    const store = useUIStore.getState();
    store.setDisclaimerOpen(true);
    store.setSettingsOpen(true);

    const updated = useUIStore.getState();
    expect(updated.isDisclaimerOpen).toBe(true);
    expect(updated.isSettingsOpen).toBe(true);
  });

  it('switches active dashboard tab', () => {
    const store = useUIStore.getState();
    store.setActiveDashboardTab('timeline');

    expect(useUIStore.getState().activeDashboardTab).toBe('timeline');

    store.setActiveDashboardTab('chat');
    expect(useUIStore.getState().activeDashboardTab).toBe('chat');
  });

  it('switches active persona focus', () => {
    const store = useUIStore.getState();
    store.setActivePersona('current');

    expect(useUIStore.getState().activePersona).toBe('current');
  });

  it('resets UI coordinates to default values', () => {
    const store = useUIStore.getState();
    store.setActiveDashboardTab('regrets');
    store.setActivePersona('current');
    store.setSettingsOpen(true);

    store.resetUI();

    const reset = useUIStore.getState();
    expect(reset.activeDashboardTab).toBe('split');
    expect(reset.activePersona).toBe('improved');
    expect(reset.isSettingsOpen).toBe(false);
  });

  it('persists state with future-you: prefix', () => {
    const store = useUIStore.getState();
    store.setActiveDashboardTab('chat');

    const raw = localStorage.getItem(`${STORAGE_PREFIX}ui`);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.activeDashboardTab).toBe('chat');
  });
});
