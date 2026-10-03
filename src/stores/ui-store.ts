import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PersonaId } from '@/types';
import { STORAGE_PREFIX } from '@/lib/constants';

export type DashboardTab = 'split' | 'timeline' | 'regrets' | 'chat';

export interface UIState {
  /** Global visibility flag for the first-time disclaimer modal */
  isDisclaimerOpen: boolean;
  /** Global visibility flag for the settings slide-over / modal */
  isSettingsOpen: boolean;
  /** Current active section within the dashboard view */
  activeDashboardTab: DashboardTab;
  /** Active persona selected for focused inspection or chat */
  activePersona: PersonaId;

  /** Toggle or set disclaimer modal open state */
  setDisclaimerOpen: (open: boolean) => void;
  /** Toggle or set settings dialog open state */
  setSettingsOpen: (open: boolean) => void;
  /** Switch the active dashboard view tab */
  setActiveDashboardTab: (tab: DashboardTab) => void;
  /** Switch the active persona focus */
  setActivePersona: (persona: PersonaId) => void;
  /** Reset UI state to defaults */
  resetUI: () => void;
}

const DEFAULT_UI_STATE = {
  isDisclaimerOpen: false,
  isSettingsOpen: false,
  activeDashboardTab: 'split' as DashboardTab,
  activePersona: 'improved' as PersonaId,
};

/**
 * Zustand store managing application UI coordinates and navigation state.
 * Persists locally to browser localStorage under future-you:ui.
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      ...DEFAULT_UI_STATE,

      setDisclaimerOpen: (isDisclaimerOpen: boolean) => set({ isDisclaimerOpen }),

      setSettingsOpen: (isSettingsOpen: boolean) => set({ isSettingsOpen }),

      setActiveDashboardTab: (activeDashboardTab: DashboardTab) => set({ activeDashboardTab }),

      setActivePersona: (activePersona: PersonaId) => set({ activePersona }),

      resetUI: () => set(DEFAULT_UI_STATE),
    }),
    {
      name: `${STORAGE_PREFIX}ui`,
    }
  )
);
