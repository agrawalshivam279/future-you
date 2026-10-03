# Technical Specification: Step 4.2 — Onboarding Form Validation & Completion Handshake

## 1. Context & Objectives
- **Module**: `src/lib/validation/onboarding-validator.ts` and `src/components/onboarding/onboarding-wizard.tsx`
- **Parent**: `src/app/onboarding/page.tsx`
- **Store**: `useOnboardingStore` (`setCompleted`, `getOnboardingData`, `isCompleted`)
- **Objective**: Implement client-side validation logic per step, preventing users from advancing with empty or invalid datasets, and establishing the final completion handshake for Phase 5/6 generation.

## 2. Requirements & UX Architecture
1. **Validation Engine (`src/lib/validation/onboarding-validator.ts`)**:
   - `validateStep(step: number, data: OnboardingData): ValidationResult`
   - `validateAll(data: OnboardingData): FullValidationResult`
   - Validation criteria:
     - Step 1: `name` >= 2 chars; `age` between 16 and 100; at least 1 goal (`shortTerm` or `longTerm`).
     - Step 2: `sleepHours` between 4 and 14; `screenTime` between 0 and 24.
     - Step 3: Total weekly hours (active + sleep) <= 168.
     - Step 4: `incomeRange` selected; `financialGoal` >= 3 chars.
     - Step 5: `currentSkills` >= 1; `careerField` >= 2 chars.
     - Step 6: `coreValues` >= 1; `biggestFears` >= 1.
2. **Accessible Feedback in `OnboardingWizard`**:
   - Displays inline validation alerts (`role="alert"` with error icon and bulleted requirements) above `WizardNav` when validation fails.
   - Automatically clears errors when step changes.
3. **Completion Handshake**:
   - When Step 6 validates successfully upon clicking "Generate My Future Simulations", sets `setCompleted(true)` in `useOnboardingStore`.
   - Invokes `onComplete?.()` callback.
4. **Invariants**:
   - Max 300 LOC per file.
   - Zero cloud storage: strictly local validation and state persistence.
   - WCAG AA accessibility, screen-reader alert regions.

## 3. Testing Plan
- Hermetic unit tests in `onboarding-validator.test.ts` covering valid and invalid conditions for all 6 steps.
- Wizard tests verifying validation halts progress when Step 1 is empty, and permits advancement once valid.
- Wizard tests verifying `setCompleted(true)` is executed upon Step 6 submission.
