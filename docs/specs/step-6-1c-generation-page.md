# Technical Specification: Step 6.1c — Generation Page & Wizard Transition

## 1. Overview
Step 6.1c concludes Phase 6 (Generation Flow) by delivering the main generation route (`src/app/generate/page.tsx`) and connecting the onboarding completion action in `src/components/onboarding/onboarding-wizard.tsx` to automatically navigate to `/generate`.

The Generation Page acts as the orchestration view where users observe real-time progress across the 5 simulation stages, read contemplative philosophical quotes, receive actionable error guidance if their provider fails, and transition seamlessly to the dashboard (`/dashboard`) once synthesis finishes.

---

## 2. Architecture & Design

### Modules to Create / Modify
1. **`src/app/generate/page.tsx`**:
   - `'use client'` Next.js App Router page.
   - Onboarding Guard: inspects `useOnboardingStore`. If name or required data is missing, redirects to `/onboarding` with `router.replace('/onboarding')`.
   - Pipeline Hook: initializes `useGenerationPipeline({ autoStart: true, onComplete: () => router.push('/dashboard') })`.
   - Visual Composition:
     - Header / branding badge.
     - `GenerationStepper` displaying current percentage and active stage.
     - `GenerationErrorCard` rendered conditionally on pipeline error with "Try Again" and "Edit Onboarding" actions.
     - `ReflectiveQuoteTicker` cycling contemplative prompts during generation.
     - Visible Honesty Disclaimer: *"You are a reflection tool, not a prediction engine."*

2. **`src/components/onboarding/onboarding-wizard.tsx`**:
   - Updates `handleNext` on step 6:
     ```typescript
     setCompleted(true);
     onComplete?.();
     router.push('/generate');
     ```

---

## 3. Invariants & Rules
- **File Length**: Max 300 LOC per file.
- **Component Declarations**: Use `function GenerationPage()` declarations (no arrow functions).
- **Accessibility**: Full WCAG AA contrast, proper aria-live announcements and labels.
- **Zero Cloud Storage**: All state is local in `localStorage` and `useLifeModelStore`.
- **Honesty Disclaimer**: Visible on page.

---

## 4. Test Strategy
- Page Tests (`src/app/generate/__tests__/page.test.tsx`):
  1. Redirects to `/onboarding` when onboarding data is missing.
  2. Renders stepper and quote ticker while generating.
  3. Displays error card with retry button when pipeline encounters an error.
  4. Redirects to `/dashboard` upon pipeline completion.
  5. Displays the honesty disclaimer text.
- Wizard Tests (`src/components/onboarding/__tests__/onboarding-wizard.test.tsx`):
  1. Verifies navigating to `/generate` upon completing step 6.
