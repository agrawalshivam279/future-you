# Technical Specification: Step 6.1b — Generation UI Components & Hook

## 1. Overview
Step 6.1b creates the client-side state hook and accessible UI presentation components required for the AI Generation Flow screen.
It interfaces between the user's persisted onboarding responses (`useOnboardingStore`), the 5-stage AI pipeline orchestrator (`generatePipeline`), and the persisted life model store (`useLifeModelStore`).

---

## 2. Architecture & Design

### Modules to Create
1. **`src/hooks/use-generation-pipeline.ts`**:
   - Manages generation lifecycle: `status: 'idle' | 'generating' | 'completed' | 'error'`.
   - Tracks current `PipelineProgress` object.
   - Manages `AbortController` to cancel long-running calls on unmount or user request.
   - Persists final `LifeModel` into `useLifeModelStore.setLifeModel(...)`.
   - Provides `startGeneration()`, `cancelGeneration()`, and `retry()`.

2. **`src/components/generation/generation-stepper.tsx`**:
   - Visual progress stepper presenting all 5 generation stages:
     1. Baseline Synthesis
     2. Persona Development
     3. Timeline Projection
     4. Letters From Future Self
     5. Reflective Insights
   - Framer Motion animated progress bar with accessible `role="progressbar"`.
   - Visual step status indicators: completed (green/accent check), in-progress (pulsing ring/spinner), pending (muted ring).

3. **`src/components/generation/generation-error-card.tsx`**:
   - User-friendly error display card.
   - Actionable recovery buttons: "Try Again" and "Review Onboarding Answers".
   - Clear diagnostic context (e.g. API key misconfiguration guidance).

4. **`src/components/generation/reflective-quote-ticker.tsx`**:
   - Contemplative quote rotator reinforcing that Future You is a reflection tool, not an absolute prediction engine.
   - Smooth transition ticker with `aria-live="polite"`.

5. **`src/components/generation/index.ts`**:
   - Clean barrel export.

---

## 3. Invariants & Rules
- **File Length Limit**: Strictly $\le 300$ LOC per file.
- **Component Declarations**: Use standard `function ComponentName(...)` declarations (no arrow functions).
- **Accessibility**: Full WCAG AA contrast, `role="progressbar"`, `aria-valuenow`, `aria-label` on all interactive buttons.
- **Zero Cloud Storage**: All state is local in browser stores (`future-you:` localStorage).
- **Honesty Disclaimer**: Visible reminder throughout UI.

---

## 4. Test Strategy
- Unit tests for hook (`use-generation-pipeline.test.ts`): state transitions, progress updates, store persistence, cancellation, error recovery.
- Component tests (`generation-stepper.test.tsx`): progress bar accessibility, active stage rendering, completed markers.
- Component tests (`generation-error-card.test.tsx`): error message rendering, retry and back button triggers.
- Component tests (`reflective-quote-ticker.test.tsx`): quote rendering and polite announcements.
