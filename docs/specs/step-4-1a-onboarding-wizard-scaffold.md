# Technical Specification: Step 4.1a — Onboarding Wizard Scaffold & Step Navigation

## 1. Overview
Step 4.1a establishes the structural foundation of the 6-step Onboarding Wizard for Future You. It implements the step progress indicator, animated directional transitions with Framer Motion, bidirectional navigation controls (Back / Next), and integrates directly with `useOnboardingStore` for persistent local progress.

## 2. Invariants & Rules Compliance
- **Tech Stack**: Next.js 14 App Router, Tailwind CSS, Framer Motion, Zustand with `localStorage` (`future-you:onboarding`).
- **File Length Limit**: Max 300 LOC per file.
- **Component Style**: `function` declarations, destructured props typed with `interface`, JSDoc comments.
- **Accessibility**: Stepper uses `<ol>` with `aria-current="step"`, buttons have descriptive `aria-label`, progress bar exposes `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`.
- **Motion Reduction**: Respects `prefers-reduced-motion` settings.

## 3. Architecture & File Structure
```
src/
├── components/
│   └── onboarding/
│       ├── constants.ts              # Step metadata definitions (1-6)
│       ├── wizard-progress.tsx       # Progress indicator (desktop steps + mobile bar)
│       ├── step-wrapper.tsx          # Framer Motion animated step container
│       ├── wizard-nav.tsx            # Navigation bar (Back, Step X of 6, Next)
│       ├── onboarding-wizard.tsx     # Wizard coordinator component
│       ├── index.ts                  # Barrel export
│       └── __tests__/
│           ├── wizard-progress.test.tsx
│           ├── step-wrapper.test.tsx
│           ├── wizard-nav.test.tsx
│           └── onboarding-wizard.test.tsx
└── app/
    └── onboarding/
        ├── page.tsx                  # /onboarding route view
        └── __tests__/
            └── page.test.tsx
```

## 4. Detailed Component Specifications

### 4.1 `src/components/onboarding/constants.ts`
- Defines `ONBOARDING_STEPS` array:
  1. Goals & Aspirations
  2. Daily Habits & Lifestyle
  3. Weekly Time Allocation
  4. Finances & Resources
  5. Skills & Learning
  6. Fears & Values

### 4.2 `src/components/onboarding/wizard-progress.tsx`
- Props: `currentStep: number`, `onStepClick?: (step: number) => void`.
- Visual progress bar calculated as `((currentStep - 1) / 5) * 100`% (or step ratio).
- Stepper list: displays 1 to 6 with completed checkmarks and active highlight.
- Accessible: `role="progressbar"`, `aria-current="step"`.

### 4.3 `src/components/onboarding/step-wrapper.tsx`
- Props: `stepNumber: number`, `title: string`, `description: string`, `direction: number`, `children: React.ReactNode`.
- Uses `motion.div` with directional x offset based on navigation direction (`direction > 0` slides from right, `< 0` slides from left).

### 4.4 `src/components/onboarding/wizard-nav.tsx`
- Props: `currentStep: number`, `onBack: () => void`, `onNext: () => void`, `isNextDisabled?: boolean`, `nextLabel?: string`.
- Renders:
  - Back button (`disabled={currentStep === 1}`).
  - Step counter text: "Step X of 6".
  - Next / Continue button.

### 4.5 `src/components/onboarding/onboarding-wizard.tsx`
- Connects to `useOnboardingStore`.
- Tracks `direction` state for smooth slide animations.
- Renders progress bar, step wrapper, step content slot/placeholder, and navigation buttons.

### 4.6 `src/app/onboarding/page.tsx`
- Page route rendering the `OnboardingWizard`.

## 5. Verification Plan
- `npx tsc --noEmit` & `npm run lint`: 0 errors.
- Unit & integration tests for progress, wrapper, navigation, wizard, and page.
- Full regression suite execution (`npm test`).
