# Technical Specification: Step 4.1b — Step 1: Goals & Aspirations Form

## 1. Overview
Step 4.1b implements the first interactive form in the Future You onboarding wizard: the Goals & Aspirations Step (`GoalsStep`). This step captures the foundational baseline for the AI reflection simulation:
1. User name / callsign
2. Current age (anchoring the 5-year horizon calculation)
3. 1-Year short-term goals (`shortTerm: string[]`)
4. 5-Year long-term goals (`longTerm: string[]`)
5. Ideal future life vision narrative (`dreamLife: string`)

## 2. Invariants & Rules Compliance
- **Tech Stack**: Next.js 14 App Router, Tailwind CSS, Zustand with `localStorage` persistence (`future-you:onboarding`).
- **File Length Limit**: Max 300 LOC per file.
- **Component Style**: `function` declarations, destructured props typed with `interface`, JSDoc comments.
- **Accessibility**: Explicit `<label htmlFor="...">` attributes for inputs, `aria-label` for add/remove buttons, keyboard navigation.
- **Tone**: Minimal, serious, reflective.

## 3. Architecture & File Structure
```
src/
├── components/
│   └── onboarding/
│       ├── steps/
│       │   ├── goals-step.tsx            # Step 1 interactive form
│       │   └── __tests__/
│       │       └── goals-step.test.tsx   # Comprehensive unit & interaction tests
│       ├── onboarding-wizard.tsx         # Wired to render GoalsStep on step 1
│       └── index.ts                      # Barrel export updated
```

## 4. Component Details: `GoalsStep`
- **Identity Fields**:
  - `name`: Text Input with placeholder "Enter your name or nickname".
  - `age`: Number Input (min 16, max 100).
- **Goal Lists**:
  - `shortTerm` & `longTerm`: Interactive item builder (Input with "Add" button and Enter key support, rendering removable badges).
  - Quick suggested aspiration chips for instant inspiration (e.g. "Career switch", "Debt freedom", "Physical vitality").
- **Dream Life Vision**:
  - Multi-line `Textarea` with reflective guidance: "Describe your ideal day 5 years from now in vivid sensory detail: work, environment, peace of mind."
- **Zustand Synchronization**:
  - Calls `updateBasics(name, age)` and `updateGoals({ shortTerm, longTerm, dreamLife })` on change.

## 5. Verification Plan
- `npx tsc --noEmit` & `npm run lint`: 0 errors.
- Unit tests:
  - Updates name and age in store.
  - Adds and removes short-term goals.
  - Adds and removes long-term goals.
  - Updates dream life textarea.
- Integration test in `OnboardingWizard`.
- Full regression suite (`npm test`).
