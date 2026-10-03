# Technical Specification: Step 4.1g — Step 6: Fears, Values & Drivers Form (`FearsValuesStep`)

## 1. Context & Objectives
- **Module**: `src/components/onboarding/steps/fears-values-step.tsx`
- **Parent**: `src/components/onboarding/onboarding-wizard.tsx` (Step 6 of 6)
- **Store**: `useOnboardingStore` (`fearsAndValues` state, `updateFearsAndValues` action)
- **Type**: `FearsAndValuesData` from `src/types/onboarding.types.ts`
- **Objective**: Capture user anxieties, non-negotiable core life values, past regrets to address, underlying motivation orientation, and risk tolerance rating to ground the AI projection engine.

## 2. Requirements & UX Architecture
1. **Primary Anxieties & Biggest Fears (`biggestFears: string[]`)**:
   - Reusable `GoalListBuilder` with `badgeVariant="current"`.
   - Suggestions: *Unrealized Potential & Stagnation*, *Financial Insecurity*, *Health & Vitality Decline*, *Superficial Relationships*, *Living an Inauthentic Life*, *Imposter Syndrome & Doubt*.
2. **Core Life Values (`coreValues: string[]`)**:
   - Reusable `GoalListBuilder` with `badgeVariant="improved"`.
   - Suggestions: *Autonomy & Freedom*, *Deep Family & Connection*, *Intellectual Rigor & Truth*, *Creative Self-Expression*, *Physical & Mental Vitality*, *Integrity & Honesty*, *Continuous Mastery*.
3. **Past Regrets & Lessons (`regrets: string`)**:
   - Accessible `Textarea` for reflective prose.
   - Helper text contextualizing it as an honest reflection tool.
4. **Motivation Orientation (`motivation: MotivationType`)**:
   - Segmented radio buttons for `internal`, `external`, and `mixed`.
   - Clear explanatory subtexts for each.
5. **Risk Tolerance Rating (`riskTolerance: number`)**:
   - Range: 1 to 10 (default 5).
   - Dynamic notes translating rating to actionable mindset (*High Caution*, *Calculated Pragmatist*, *Bold Explorer*, *Aggressive Venture Risk*).
6. **Invariants Enforced**:
   - Under 300 LOC limit.
   - Exported as `function FearsValuesStep`.
   - Props typed with `interface FearsValuesStepProps`.
   - Synchronized with `useOnboardingStore.updateFearsAndValues`.
   - Full ARIA accessibility and WCAG AA contrast.

## 3. Testing Plan
- Test rendering of all 5 form sections.
- Test adding and removing fears.
- Test adding and removing core values.
- Test typing into regrets textarea.
- Test selecting motivation options.
- Test slider updates for risk tolerance.
- Test wizard step 6 integration.
