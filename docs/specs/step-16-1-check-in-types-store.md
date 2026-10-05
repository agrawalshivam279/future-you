# Technical Specification: Step 16.1 — Check-in Mode Types & Persistent Store

## 1. Overview
Step 16.1 establishes the data models and persistent state store for **Phase 16: Check-in Mode (Trajectory Drift & Habits)**. Check-in Mode transforms Future You into a longitudinal companion, allowing users to log recurring habit checkpoints, calculate trajectory alignment (0-100%), and receive grounded voice reflections without cloud storage dependencies.

---

## 2. File Layout & LOC Budget
- **Types Definition**: `src/types/check-in.types.ts` ($\le 120$ LOC)
- **Barrel Export**: `src/types/index.ts`
- **Zustand Store**: `src/stores/check-in-store.ts` ($\le 200$ LOC)
- **Store Barrel Export**: `src/stores/index.ts`
- **Data Manager Integration**: `src/lib/storage/data-manager.ts` (reset hook)
- **Store Unit Tests**: `src/stores/__tests__/check-in-store.test.ts` ($\le 180$ LOC)

---

## 3. Data Models Specification (`src/types/check-in.types.ts`)

```typescript
export type ExerciseFrequency = 'never' | 'rarely' | 'weekly' | 'daily';

export type DriftStatus = 'aligned' | 'drifting_current' | 'surpassing';

export interface CheckInLog {
  id: string;
  loggedAt: string;
  sleepHours: number;
  exerciseFrequency: ExerciseFrequency;
  deepWorkHoursPerWeek: number;
  screenTimeHoursPerDay: number;
  savingsRatePercentage: number;
  notes?: string;
}

export interface HabitDriftVector {
  habitId: string;
  label: string;
  baselineValue: number;
  targetValue: number;
  actualValue: number;
  driftPercentage: number; // Positive = towards Improved Path, Negative = towards Current Path
  status: DriftStatus;
}

export interface CheckInEvaluation {
  logId: string;
  evaluatedAt: string;
  overallAlignmentScore: number; // 0 - 100%
  driftVectors: HabitDriftVector[];
  futureSelfReflection: string; // 2-3 sentence grounded voice reflection
}
```

---

## 4. State Store Specification (`src/stores/check-in-store.ts`)

### Persistence Key:
- `future-you:check-ins` via Zustand `persist` middleware.

### Store Interface:
```typescript
export interface CheckInState {
  logs: CheckInLog[];
  evaluations: Record<string, CheckInEvaluation>;
  activeLogId: string | null;
  isLoading: boolean;
  error: string | null;

  addLog: (logData: Omit<CheckInLog, 'id' | 'loggedAt'>) => CheckInLog;
  deleteLog: (id: string) => void;
  setEvaluation: (logId: string, evaluation: CheckInEvaluation) => void;
  setActiveLog: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  resetCheckInStore: () => void;
  getLatestLog: () => CheckInLog | null;
  getEvaluationForLog: (logId: string) => CheckInEvaluation | undefined;
}
```

---

## 5. Architectural & Privacy Invariants
1. **Namespace Prefix**: Local storage key strictly equals `future-you:check-ins`.
2. **Single-Click Data Wipe**: `deleteAllLocalData()` in `src/lib/storage/data-manager.ts` calls `resetCheckInStore()` to guarantee zero leftover state.
3. **No Cloud Leakage**: Pure browser-local data lifecycle.
4. **Code Quality**: Strict TypeScript, full JSDoc, $\le 300$ LOC per file.

---

## 6. Testing Strategy
- Verify logging, updating, and deleting checkpoints.
- Verify evaluation indexing by `logId`.
- Verify `future-you:check-ins` persistence key in localStorage.
- Verify `deleteAllLocalData()` wipes all logs and evaluations.
- Verify helper methods (`getLatestLog()`, `getEvaluationForLog()`).
