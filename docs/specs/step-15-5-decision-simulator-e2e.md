# Technical Specification: Step 15.5 — Decision Simulator End-to-End Integration & Invariants Suite

## 1. Overview
Step 15.5 delivers the comprehensive end-to-end integration and architectural invariants test suite for Phase 15 (Decision Simulator). It validates the entire lifecycle from scenario definition and preset loading to prompt synthesis, structured evaluation parsing, local persistence under `future-you:decisions`, and clean privacy purging via `deleteAllLocalData()`.

---

## 2. File Layout & LOC Budget
- **Integration Test Suite**: `src/__tests__/integration/decision-simulator-e2e.test.ts` ($\le 250$ LOC)
- **Documentation**: Updates `implementation_plan.md` (Phase 15 Exit Criteria checked) and `.agents/memory/flashback.md`

---

## 3. Test Scenarios & Invariants Verified

1. **Scenario Creation & Local-First Namespace**:
   - Verify `useDecisionStore` persists state strictly under `future-you:decisions`.
   - Verify preset scenario loading and custom fork additions.
2. **AI Prompt Architecture & Honesty Disclaimer**:
   - Ensure `buildDecisionSimulatorSystemPrompt()` mandates: *"You are a reflection tool, not a prediction engine"*.
   - Verify user prompt contains life model baseline, habits, and decision parameters.
3. **Evaluation Response Validation & Bounds Clamping**:
   - Verify multi-horizon projections are strictly chronological (Years 1, 3, 5).
   - Verify domain delta clamping within [-10, +10].
   - Verify presence of dual persona verdicts (Current vs Improved).
4. **Data Isolation & Single-Click Purge**:
   - Verify `deleteAllLocalData()` resets `useDecisionStore` to initial state, wiping all scenarios and cached evaluations.

---

## 4. Phase 15 Exit Criteria
- [x] Users can create, save, and evaluate custom life forks.
- [x] Both personas deliver distinct, grounded verdicts without character drift.
- [x] Full local persistence under `future-you:decisions` with zero cloud leakage.
