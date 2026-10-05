# Technical Specification: Step 15.1 — Decision Simulator Type Definitions & Zustand Store

## 1. Overview
Step 15.1 establishes the data models, contracts, and client-side persistent state management for the **Decision Simulator ("What If?" Fork Engine)**. It provides strongly-typed interfaces for user-defined life decisions, multi-horizon impacts (Years 1, 3, 5), domain score deltas (-10 to +10), dual-persona verdicts, trade-offs, and pre-built scenario presets. All state is maintained locally in Zustand with `localStorage` persistence under the mandatory `future-you:decisions` key prefix.

---

## 2. Architecture & File Layout
- **Type Definitions**: `src/types/decision.types.ts` ($\le 120$ LOC)
- **Zustand Store**: `src/lib/stores/decision-store.ts` ($\le 180$ LOC)
- **Test Suite**: `src/lib/stores/__tests__/decision-store.test.ts` ($\le 200$ LOC)

---

## 3. Data Contracts & Schemas

### 3.1 `src/types/decision.types.ts`
```typescript
export type DecisionDomain =
  | 'career'
  | 'finances'
  | 'health'
  | 'relationships'
  | 'lifestyle';

export type TimeHorizon = 'immediate' | '6months' | '1year';

export interface DecisionScenario {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  primaryDomain: DecisionDomain;
  timeHorizon: TimeHorizon;
}

export interface DomainDelta {
  domain: DecisionDomain;
  label: string;
  delta: number; // -10 to +10
  reasoning: string;
}

export interface HorizonProjection {
  year: 1 | 3 | 5;
  phaseTitle: string;
  summary: string;
  keyChallenge: string;
  keyAdvantage: string;
}

export interface DecisionPersonaReactions {
  currentPathVerdict: string;
  improvedPathVerdict: string;
}

export interface DecisionEvaluation {
  scenarioId: string;
  evaluatedAt: string;
  projections: HorizonProjection[];
  domainDeltas: DomainDelta[];
  personaReactions: DecisionPersonaReactions;
  tradeOffs: string[];
  unforeseenRisks: string[];
}

export interface DecisionPreset {
  id: string;
  title: string;
  description: string;
  primaryDomain: DecisionDomain;
  timeHorizon: TimeHorizon;
}
```

### 3.2 `src/lib/stores/decision-store.ts`
```typescript
export interface DecisionState {
  scenarios: DecisionScenario[];
  evaluations: Record<string, DecisionEvaluation>;
  activeScenarioId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  addScenario: (scenario: Omit<DecisionScenario, 'id' | 'createdAt'>) => DecisionScenario;
  updateScenario: (id: string, updates: Partial<Omit<DecisionScenario, 'id' | 'createdAt'>>) => void;
  deleteScenario: (id: string) => void;
  setActiveScenario: (id: string | null) => void;
  setEvaluation: (scenarioId: string, evaluation: DecisionEvaluation) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
```

---

## 4. Privacy & System Invariants
1. **Zero Cloud Storage**: All scenarios and evaluations reside in `localStorage`.
2. **Storage Prefix**: Must use `name: 'future-you:decisions'`.
3. **Data Erasure**: Calling `reset()` clears all scenarios and evaluations, aligning with the one-click wipe feature.
4. **File Length Limit**: Strictly $\le 300$ lines per file.
5. **No Any**: Strict TypeScript types throughout.

---

## 5. Verification & Testing Strategy
- Store adds scenarios and generates unique IDs with ISO timestamps.
- Store updates existing scenarios and prevents updating non-existent IDs.
- Store deletes scenarios and cleans up associated evaluations.
- Store records evaluations keyed by `scenarioId`.
- Store resets state to default.
- LocalStorage persistence under key `future-you:decisions` verified.
