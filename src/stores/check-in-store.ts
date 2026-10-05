import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CheckInLog, CheckInEvaluation } from '@/types';
import { STORAGE_PREFIX } from '@/lib/constants';

export interface CheckInState {
  /** Array of historical check-in logs, sorted newest first */
  logs: CheckInLog[];
  /** Evaluations indexed by corresponding CheckInLog id */
  evaluations: Record<string, CheckInEvaluation>;
  /** ID of currently selected or inspected check-in log */
  activeLogId: string | null;
  /** Transient flag indicating AI reflection note generation is active */
  isLoading: boolean;
  /** Transient error message from failed evaluations or actions */
  error: string | null;

  /** Create and store a new habit check-in, prepending to logs */
  addLog: (logData: Omit<CheckInLog, 'id' | 'loggedAt'>) => CheckInLog;
  /** Delete a specific check-in log and remove its evaluation */
  deleteLog: (id: string) => void;
  /** Cache an alignment and drift evaluation for a log */
  setEvaluation: (logId: string, evaluation: CheckInEvaluation) => void;
  /** Set or clear the actively viewed check-in log */
  setActiveLog: (id: string | null) => void;
  /** Update loading status */
  setLoading: (isLoading: boolean) => void;
  /** Set or clear active error */
  setError: (error: string | null) => void;
  /** Reset check-in store to clean defaults */
  resetCheckInStore: () => void;
  /** Retrieve the most recent recorded check-in log */
  getLatestLog: () => CheckInLog | null;
  /** Retrieve the evaluation associated with a log ID */
  getEvaluationForLog: (logId: string) => CheckInEvaluation | undefined;
}

const INITIAL_STATE = {
  logs: [],
  evaluations: {},
  activeLogId: null,
  isLoading: false,
  error: null,
};

/**
 * Zustand store managing Version 3 habit check-ins and trajectory drift evaluations.
 * Persists locally to browser localStorage under future-you:check-ins.
 */
export const useCheckInStore = create<CheckInState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addLog: (logData) => {
        const id = `checkin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newLog: CheckInLog = {
          ...logData,
          id,
          loggedAt: new Date().toISOString(),
        };

        set((state) => ({
          logs: [newLog, ...state.logs],
          activeLogId: id,
          error: null,
        }));

        return newLog;
      },

      deleteLog: (id: string) => {
        set((state) => {
          const updatedLogs = state.logs.filter((log) => log.id !== id);
          const updatedEvaluations = { ...state.evaluations };
          delete updatedEvaluations[id];

          return {
            logs: updatedLogs,
            evaluations: updatedEvaluations,
            activeLogId:
              state.activeLogId === id
                ? updatedLogs.length > 0
                  ? updatedLogs[0].id
                  : null
                : state.activeLogId,
          };
        });
      },

      setEvaluation: (logId: string, evaluation: CheckInEvaluation) => {
        set((state) => ({
          evaluations: {
            ...state.evaluations,
            [logId]: evaluation,
          },
          error: null,
        }));
      },

      setActiveLog: (id: string | null) => {
        set({ activeLogId: id });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      resetCheckInStore: () => {
        set(INITIAL_STATE);
      },

      getLatestLog: () => {
        const { logs } = get();
        return logs.length > 0 ? logs[0] : null;
      },

      getEvaluationForLog: (logId: string) => {
        return get().evaluations[logId];
      },
    }),
    {
      name: `${STORAGE_PREFIX}check-ins`,
    }
  )
);
