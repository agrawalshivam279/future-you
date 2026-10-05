# Technical Specification: Step 16.5 — Check-in Mode End-to-End Suite & Phase 16 Exit Criteria

> **Feature**: Version 3 — Check-in Mode (Integration & Invariants E2E Suite)  
> **Target Branch**: `feat/step-16-5-check-in-e2e-suite`  
> **Status**: In Progress  

---

## 1. Context & Objective

Step 16.5 concludes **Phase 16: Check-in Mode (Trajectory Drift & Habits)** by providing a hermetic, rigorous end-to-end integration and invariants suite verifying all Phase 16 deliverables and exit criteria:
1. **Mathematical Edge Cases** (16.5a):
   - Zero-denominator safeguards when baseline equals target.
   - Extreme out-of-bounds performance clamped to $[0, 100]$ in composite alignment.
   - Inverted metric polarity (screen time where less is better).
   - Frequency category mappings (`daily`, `weekly`, `rarely`, `never`).
2. **Store & Component Integration** (16.5b):
   - LocalStorage persistence under `future-you:check-ins`.
   - Single-click data purge via `deleteAllLocalData()` wiping all check-in logs and cached evaluations.
   - End-to-end integration between `useOnboardingStore`, `useLifeModelStore`, `useCheckInStore`, and `evaluateAndGenerateCheckInFeedback`.
   - System prompt honesty disclaimer invariant (*"You are a reflection tool, not a prediction engine"*).
   - Empirical validation of all Phase 16 exit criteria.

---

## 2. Invariants & Guardrails

- **Zero Cloud Storage**: All checkpoint state lives in browser `localStorage` under `future-you:check-ins`.
- **Complete Purge**: `deleteAllLocalData()` clears check-in store.
- **Reflection Honesty**: System prompt disclaimer verified.
- **File Length Limit**: Strictly $\le 300$ LOC per test file.

---

## 3. Verification Plan

1. **Run End-to-End Test Suite**:
   `npm test -- src/__tests__/integration/check-in-mode-e2e.test.ts --forceExit`
2. **Run Full Project Test Suite**:
   `npm test -- --forceExit` to confirm 100% test pass rate.
