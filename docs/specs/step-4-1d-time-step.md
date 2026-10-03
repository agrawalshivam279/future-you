# Technical Specification: Step 4.1d — Step 3: Weekly Time Allocation Form

## 1. Overview
Step 4.1d implements the third form of the Future You onboarding wizard: the Weekly Time Allocation Step (`TimeStep`). Users map out how their 168 weekly hours are distributed across career, learning, relationships, creative expression, and downtime. This provides the AI simulation engine with temporal constraints to project achievable future progress.

## 2. Invariants & Rules Compliance
- **Tech Stack**: Next.js 14 App Router, Tailwind CSS, Zustand with `localStorage` (`future-you:onboarding`).
- **File Length Limit**: Max 300 LOC per file.
- **Component Style**: `function` declarations, destructured props typed with `interface`, JSDoc comments.
- **Accessibility**: Sliders with `aria-label`, explicit labels, numeric readouts, and WCAG AA contrast.
- **Tone**: Pragmatic, non-judgmental, analytical.

## 3. Architecture & File Structure
```
src/
├── components/
│   └── onboarding/
│       ├── steps/
│       │   ├── time-step.tsx             # Step 3 interactive time allocation form
│       │   └── __tests__/
│       │       └── time-step.test.tsx    # Unit & interaction tests
│       ├── onboarding-wizard.tsx         # Wired to render TimeStep on step 3
│       └── index.ts                      # Barrel export updated
```

## 4. Component Details: `TimeStep`
- **168-Hour Weekly Budget Visualizer**:
  - Computes total tracked waking hours + estimated weekly sleep (`habits.sleepHours * 7`).
  - Shows remaining unstructured hours or warns if overbooked (> 168 hrs).
  - Multi-segment progress bar visually displaying proportional time distribution.
- **Time Sliders**:
  - Career & Work: `workHoursPerWeek` (0–80 hrs/wk, step 1, unit " hrs/wk").
  - Learning & Study: `studyHoursPerWeek` (0–40 hrs/wk, step 1, unit " hrs/wk").
  - Social & Relationships: `socialHoursPerWeek` (0–50 hrs/wk, step 1, unit " hrs/wk").
  - Creative & Hobbies: `creativeHoursPerWeek` (0–40 hrs/wk, step 1, unit " hrs/wk").
  - Downtime / Unproductive: `wastedHoursPerWeek` (0–50 hrs/wk, step 1, unit " hrs/wk").
- **State Synchronization**:
  - Binds directly to `useOnboardingStore.updateTime`.

## 5. Verification Plan
- `npx tsc --noEmit` & `npm run lint`: 0 errors.
- Unit tests:
  - All 5 sliders render with accessible labels.
  - Changing each slider updates `useOnboardingStore.time`.
  - 168-hour budget correctly calculates allocated and remaining hours.
- Integration test in `OnboardingWizard` (navigating to step 3 renders `TimeStep`).
- Full regression suite (`npm test`).
