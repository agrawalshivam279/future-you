import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DecisionScenario, DecisionEvaluation, DecisionPreset } from '@/types';
import { STORAGE_PREFIX } from '@/lib/constants';

/**
 * Pre-configured decision scenario templates to accelerate user exploration.
 */
export const DECISION_PRESETS: DecisionPreset[] = [
  {
    id: 'preset-career-founder',
    title: 'Transition from Corporate to Solo Founder',
    description:
      'Leaving a stable full-time salaried job to build an independent business and product full-time.',
    primaryDomain: 'career',
    timeHorizon: 'immediate',
  },
  {
    id: 'preset-relocation',
    title: 'Relocate to an International Tech Hub',
    description:
      'Moving away from hometown to immerse in a high-density international innovation ecosystem.',
    primaryDomain: 'lifestyle',
    timeHorizon: '6months',
  },
  {
    id: 'preset-sabbatical',
    title: 'Take a 6-Month Intensive Learning Sabbatical',
    description:
      'Pausing commercial work to dedicate 40 hours/week to deep technical and creative mastery.',
    primaryDomain: 'career',
    timeHorizon: '1year',
  },
];

export interface DecisionState {
  /** Array of saved user scenarios */
  scenarios: DecisionScenario[];
  /** Evaluations keyed by scenario ID */
  evaluations: Record<string, DecisionEvaluation>;
  /** Currently selected scenario ID for comparison/view */
  activeScenarioId: string | null;
  /** Transient flag indicating AI evaluation is running */
  isLoading: boolean;
  /** Last caught error message from evaluation failure */
  error: string | null;

  /** Create and store a new scenario, returning the created item */
  addScenario: (
    scenario: Omit<DecisionScenario, 'id' | 'createdAt'>
  ) => DecisionScenario;
  /** Update fields on an existing scenario */
  updateScenario: (
    id: string,
    updates: Partial<Omit<DecisionScenario, 'id' | 'createdAt'>>
  ) => void;
  /** Remove a scenario and purge its cached evaluation */
  deleteScenario: (id: string) => void;
  /** Set or clear the actively viewed scenario */
  setActiveScenario: (id: string | null) => void;
  /** Store AI evaluation for a scenario */
  setEvaluation: (
    scenarioId: string,
    evaluation: DecisionEvaluation
  ) => void;
  /** Update AI loading state */
  setLoading: (isLoading: boolean) => void;
  /** Set or clear error state */
  setError: (error: string | null) => void;
  /** Reset store state to empty defaults */
  resetDecisionStore: () => void;
  /** Check if a scenario already has a calculated evaluation */
  hasEvaluation: (scenarioId: string) => boolean;
}

const INITIAL_STATE = {
  scenarios: [],
  evaluations: {},
  activeScenarioId: null,
  isLoading: false,
  error: null,
};

/**
 * Zustand store managing Decision Simulator scenarios and AI evaluations.
 * Persists locally to browser localStorage under future-you:decisions.
 */
export const useDecisionStore = create<DecisionState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addScenario: (scenarioData) => {
        const id = `scenario-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newScenario: DecisionScenario = {
          ...scenarioData,
          id,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          scenarios: [newScenario, ...state.scenarios],
          activeScenarioId: id,
          error: null,
        }));

        return newScenario;
      },

      updateScenario: (id, updates) => {
        set((state) => ({
          scenarios: state.scenarios.map((scenario) =>
            scenario.id === id ? { ...scenario, ...updates } : scenario
          ),
        }));
      },

      deleteScenario: (id) => {
        set((state) => {
          const nextEvaluations = { ...state.evaluations };
          delete nextEvaluations[id];

          const nextScenarios = state.scenarios.filter((s) => s.id !== id);
          const nextActiveId =
            state.activeScenarioId === id
              ? nextScenarios[0]?.id ?? null
              : state.activeScenarioId;

          return {
            scenarios: nextScenarios,
            evaluations: nextEvaluations,
            activeScenarioId: nextActiveId,
          };
        });
      },

      setActiveScenario: (activeScenarioId) => {
        set({ activeScenarioId });
      },

      setEvaluation: (scenarioId, evaluation) => {
        set((state) => ({
          evaluations: {
            ...state.evaluations,
            [scenarioId]: evaluation,
          },
          isLoading: false,
          error: null,
        }));
      },

      setLoading: (isLoading) => {
        set((state) => ({
          isLoading,
          error: isLoading ? null : state.error,
        }));
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      resetDecisionStore: () => {
        set({ ...INITIAL_STATE });
      },

      hasEvaluation: (scenarioId) => {
        return Boolean(get().evaluations[scenarioId]);
      },
    }),
    {
      name: `${STORAGE_PREFIX}decisions`,
    }
  )
);
