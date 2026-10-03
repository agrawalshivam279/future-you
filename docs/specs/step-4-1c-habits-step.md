# Technical Specification: Step 4.1c — Step 2: Daily Habits & Lifestyle Form

## 1. Overview
Step 4.1c implements the second step of the Future You onboarding wizard: the Daily Habits & Lifestyle Step (`HabitsStep`). Physical and mental wellness habits form the primary biological levers for the 5-year simulation engine, projecting vitality, cognitive capacity, burnout resistance, and longevity.

## 2. Invariants & Rules Compliance
- **Tech Stack**: Next.js 14 App Router, Tailwind CSS, Zustand with `localStorage` (`future-you:onboarding`).
- **File Length Limit**: Max 300 LOC per file.
- **Component Style**: `function` declarations, destructured props typed with `interface`, JSDoc comments.
- **Accessibility**: Slider with `aria-label` and `aria-valuenow`, segmented button groups with `role="radiogroup"` and `aria-checked`, full keyboard navigation.
- **Tone**: Reflective, honest, non-judgmental.

## 3. Architecture & File Structure
```
src/
├── components/
│   └── onboarding/
│       ├── steps/
│       │   ├── habits-step.tsx           # Step 2 interactive habits form
│       │   └── __tests__/
│       │       └── habits-step.test.tsx  # Unit & interaction tests
│       ├── onboarding-wizard.tsx         # Wired to render HabitsStep on step 2
│       └── index.ts                      # Barrel export updated
```

## 4. Component Details: `HabitsStep`
- **Sleep Duration**:
  - `Slider`: min 4, max 12, step 0.5, unit " hrs/night".
  - Descriptive label: "Nightly Sleep Duration".
- **Physical Exercise**:
  - Segmented radio button group (`never`, `rarely`, `weekly`, `daily`).
  - Clear descriptors: Never, Rarely (1-2x/mo), Weekly (1-3x/wk), Daily (4+x/wk).
- **Diet & Nutrition Quality**:
  - Segmented radio button group (`poor`, `average`, `good`, `excellent`).
  - Clear descriptors: Poor (mostly processed), Average (balanced mix), Good (mostly whole foods), Excellent (nutrient-dense).
- **Screen Time**:
  - `Slider`: min 0, max 16, step 1, unit " hrs/day".
  - Descriptive label: "Recreational Screen Time".
- **Daily Reflection / Meditation**:
  - Binary choice (`false` / `true`): "No" / "Yes, daily practice".
- **State Synchronization**:
  - Directly binds to `useOnboardingStore.updateHabits`.

## 5. Verification Plan
- `npx tsc --noEmit` & `npm run lint`: 0 errors.
- Unit tests:
  - Sleep slider change updates store.
  - Exercise frequency selection updates store.
  - Diet quality selection updates store.
  - Screen time slider change updates store.
  - Meditation toggle updates store.
- Integration test in `OnboardingWizard` (navigating to step 2 renders `HabitsStep`).
- Full regression test run (`npm test`).
