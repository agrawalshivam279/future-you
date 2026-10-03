import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LifeModel, Persona, PersonaId } from '@/types';
import { STORAGE_PREFIX } from '@/lib/constants';

export interface LifeModelState {
  /** Generated dual-trajectory life simulation model */
  model: LifeModel | null;
  /** Transient flag indicating AI generation or regeneration is running */
  isGenerating: boolean;
  /** Last caught error message from generation failure */
  error: string | null;
  /** ISO-8601 timestamp of last successful model synthesis */
  lastGeneratedAt: string | null;

  /** Set a newly generated LifeModel and update timestamps */
  setLifeModel: (model: LifeModel) => void;
  /** Update AI generation progress flag */
  setGenerating: (isGenerating: boolean) => void;
  /** Set or clear error state */
  setError: (error: string | null) => void;
  /** Adjust value of a specific habit lever slider */
  updateHabitLever: (leverId: string, value: number) => void;
  /** Immutably update persona sub-dimensions for either Current or Improved path */
  updatePersona: (path: PersonaId, updates: Partial<Persona>) => void;
  /** Reset life model state and delete cached model */
  resetLifeModel: () => void;
  /** Check if a valid model is already loaded */
  hasModel: () => boolean;
}

const INITIAL_STATE = {
  model: null,
  isGenerating: false,
  error: null,
  lastGeneratedAt: null,
};

/**
 * Zustand store managing the AI-generated LifeModel and dynamic habit levers.
 * Persists locally to browser localStorage under future-you:life-model.
 */
export const useLifeModelStore = create<LifeModelState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setLifeModel: (model: LifeModel) =>
        set({
          model,
          isGenerating: false,
          error: null,
          lastGeneratedAt: new Date().toISOString(),
        }),

      setGenerating: (isGenerating: boolean) =>
        set((state) => ({
          isGenerating,
          error: isGenerating ? null : state.error,
        })),

      setError: (error: string | null) =>
        set({
          error,
          isGenerating: false,
        }),

      updateHabitLever: (leverId: string, value: number) =>
        set((state) => {
          if (!state.model) return state;
          const updatedLevers = state.model.habitLevers.map((lever) =>
            lever.id === leverId ? { ...lever, currentValue: value } : lever
          );
          return {
            model: {
              ...state.model,
              habitLevers: updatedLevers,
            },
          };
        }),

      updatePersona: (path: PersonaId, updates: Partial<Persona>) =>
        set((state) => {
          if (!state.model) return state;
          const targetKey = path === 'current' ? 'currentPath' : 'improvedPath';
          return {
            model: {
              ...state.model,
              [targetKey]: {
                ...state.model[targetKey],
                ...updates,
              },
            },
          };
        }),

      resetLifeModel: () => set(INITIAL_STATE),

      hasModel: () => get().model !== null,
    }),
    {
      name: `${STORAGE_PREFIX}life-model`,
    }
  )
);
