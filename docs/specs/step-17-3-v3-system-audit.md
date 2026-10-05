# Technical Specification: Step 17.3 — V3 System Integration Audit & Polish

## 1. Overview
Step 17.3 executes the final release verification for **Version 3: Autonomy, Longitudinal Companionship & Artifact Sharing**.
It conducts an end-to-end audit verifying:
1. Local-first storage namespace invariants (`future-you:*`) across all stores.
2. Complete single-click data deletion purge across V1, V2, and V3 stores (`future-you:decisions`, `future-you:check-ins`).
3. Accessibility conformance (WCAG AA contrast, keyboard accessibility, ARIA roles, labels) across all V3 routes (`/simulator`, `/check-in`, `/dashboard`).
4. Production build integrity and bundle size check ($< 500$ kB initial JS).
5. 100% test suite pass rate across all unit, integration, and E2E suites.

---

## 2. File Layout & LOC Budget
- **Audit Suite**: `src/__tests__/integration/v3-system-audit-e2e.test.ts` ($\le 240$ LOC)
- **Specification**: `docs/specs/step-17-3-v3-system-audit.md` ($\le 60$ LOC)

---

## 3. Audit Verification Scenarios
1. **Local-First Storage Invariant**:
   - Inspect all localStorage writes from `useSettingsStore`, `useOnboardingStore`, `useLifeModelStore`, `useUIStore`, `useDecisionStore`, and `useCheckInStore`.
   - Assert all keys strictly begin with `future-you:`.
2. **Single-Click Data Purge Invariant**:
   - Seed data into all stores.
   - Execute `deleteAllLocalData()`.
   - Assert all localStorage items and IndexedDB tables are cleared and stores reset.
3. **Accessibility & Disclaimer Conformance**:
   - Verify every prompt in `lib/prompts/` contains the reflection disclaimer:
     `"You are a reflection tool, not a prediction engine"`
   - Verify Shareable Card and export artifacts contain the disclaimer.
4. **Build & Bundle Quality Gate**:
   - `npx tsc --noEmit` returns 0 errors.
   - `npm run lint` returns 0 warnings or errors.
   - `npm run build` succeeds cleanly with production bundle targets.
   - All Jest test suites pass.
