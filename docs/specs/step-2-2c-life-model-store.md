# Step 2.2c Technical Specification: Life Model Zustand Store

## 1. Overview
Step 2.2c implements `src/stores/life-model-store.ts`, managing the AI-generated life simulation model (Current Path & Improved Path personas, interactive habit levers, generation lifecycle states, and errors) with client-side persistence under `future-you:life-model`.

---

## 2. Invariants & Rules Checklist
- [x] Zero cloud storage: Persists exclusively to client `localStorage` with prefix `future-you:`.
- [x] State management stack: Zustand with `persist` middleware.
- [x] Strict TypeScript: Typed using `LifeModel`, `Persona`, `PersonaId`, and `HabitLever` from `@/types`.
- [x] Max 300 LOC per file: Modular and lean.
- [x] JSDoc on store hook and actions.

---

## 3. Store Architecture & Interfaces

### 3.1 State Shape
```typescript
export interface LifeModelState {
  // Model data
  model: LifeModel | null;

  // Generation status
  isGenerating: boolean;
  error: string | null;
  lastGeneratedAt: string | null;

  // Actions
  setLifeModel: (model: LifeModel) => void;
  setGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  updateHabitLever: (leverId: string, value: number) => void;
  updatePersona: (path: PersonaId, updates: Partial<Persona>) => void;
  resetLifeModel: () => void;
  hasModel: () => boolean;
}
```

### 3.2 Storage Contract
- **Key**: `future-you:life-model`
- **Default State**:
  - `model`: null
  - `isGenerating`: false
  - `error`: null
  - `lastGeneratedAt`: null

---

## 4. Verification Plan
- **TypeScript & Lint**: `npx tsc --noEmit && npm run lint`
- **Unit Tests**: `src/stores/__tests__/life-model-store.test.ts`
  - Model assignment and `hasModel()` predicate
  - Async generation lifecycle states (`isGenerating`, `error`, `lastGeneratedAt`)
  - Habit lever value mutation
  - Persona partial update (e.g. regenerative deltas or persona tweaks)
  - Full reset functionality
  - LocalStorage persistence under `future-you:life-model`
