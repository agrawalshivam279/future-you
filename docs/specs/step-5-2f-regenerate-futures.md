# Technical Specification: Step 5.2f — Habit Levers Future Regeneration Orchestrator

## 1. Context & Objectives
- **Module**: `src/lib/ai/regenerate-futures.ts`
- **Related Modules**: `src/lib/ai/generate-personas.ts`, `src/lib/ai/generate-timeline.ts`, `src/stores/life-model-store.ts`
- **Domain Types**: `LifeModel`, `HabitLever`, `Persona`, `OnboardingData`, `AISettings`
- **Objective**: Author the dynamic futures regeneration orchestrator `regenerateFutures()` that recalculates the Improved Path persona and timeline whenever interactive habit lever sliders are modified, computing lever updates, passing delta math into prompt formulation, and returning an updated, synchronized `LifeModel`.

## 2. Requirements & Invariants
1. **Delta Math & Lever Integration**:
   - `applyLeverUpdates`: Merges modified habit lever values (`HabitLever[]` or `Record<string, number>`) into the active lever set, clamping to min/max boundaries.
   - Grounded regeneration: Passes updated levers directly to `generatePersona('improved', ...)`.
2. **Synchronized Trajectory Recalculation**:
   - Re-synthesizes the `improvedPath` persona incorporating the modified habits.
   - By default (`regenerateTimeline: true`), recalculates the corresponding Year 1, 3, 5 chronological milestones using `generateSingleTimeline`.
   - Preserves existing `currentPath` intact (reflecting unadjusted status-quo inertia).
3. **Local-First & Client-Side Configuration**:
   - Dynamic credential lookup via `resolveAISettings()`.
   - Zero cloud persistence.
4. **Resilient Error & Token Handling**:
   - Accumulates token metrics across persona and timeline generation calls.
   - Respects `AbortSignal` for cancellation.
5. **Code Style & 300 LOC Invariant**:
   - Function declarations for exported functions.
   - Comprehensive JSDoc documentation.
   - Strictly $\le 300$ LOC per file.

## 3. Testing Plan
- Test `applyLeverUpdates` correctly updates specific levers by ID and clamps to min/max.
- Test `regenerateFutures` recalculates Improved Path persona and timeline while preserving Current Path.
- Test `regenerateFutures` with `regenerateTimeline: false` skips timeline call.
- Test error thrown if `existingModel` is null or invalid.
- Test `AbortSignal` cancellation stops execution immediately.
- Test token metrics accumulation across multiple generation steps.
