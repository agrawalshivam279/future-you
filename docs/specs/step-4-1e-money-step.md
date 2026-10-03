# Technical Specification: Step 4.1e — Step 4: Finances & Resources Form (`MoneyStep`)

## 1. Context & Objectives
- **Module**: `src/components/onboarding/steps/money-step.tsx`
- **Parent**: `src/components/onboarding/onboarding-wizard.tsx` (Step 4 of 6)
- **Store**: `useOnboardingStore` (`money` state, `updateMoney` action)
- **Type**: `MoneyData` from `src/types/onboarding.types.ts`
- **Objective**: Provide an intuitive, non-judgmental, reflective financial trajectory form allowing users to declare their current income bracket, monthly savings rate, debt burden level, spending habits, and top financial milestone.

## 2. Requirements & UX Architecture
1. **Income Range**:
   - Preset chips: `< $30k`, `$30k - $60k`, `$60k - $100k`, `$100k - $150k`, `$150k - $250k`, `$250k+`.
   - Accessible radiogroup with keyboard navigation and clear visual active state.
2. **Savings Rate Slider**:
   - Range: 0% to 100% (default 15%).
   - Step: 1%.
   - Dynamic trajectory badge:
     - 0-9%: *Living paycheck to paycheck / lean margin*
     - 10-24%: *Standard steady builder*
     - 25-49%: *Strong accelerator*
     - 50%+: *Aggressive financial independence trajectory*
3. **Debt Burden Level**:
   - 4-option radio group for `DebtLevel` (`'none' | 'low' | 'moderate' | 'high'`).
   - Descriptive sub-labels for clarity:
     - None: *No debt or paid off monthly*
     - Low: *Low-interest, easily manageable*
     - Moderate: *Notable student/auto obligations*
     - High: *High-interest / restrictive stress*
4. **Spending Habits**:
   - Quick selectable presets: *Disciplined / Minimalist*, *Balanced / Conscious*, *Comfort-First / Social*, *Impulsive / Lifestyle Creep*.
5. **Core Financial Goal**:
   - Accessible input field with quick-tap suggestion pills (e.g. *6-month emergency reserve*, *Debt-free freedom*, *First home down payment*, *Invest for early retirement*, *Seed funding for my venture*).
6. **Invariants Enforced**:
   - Under 300 LOC limit.
   - Function declaration for React component.
   - Zero cloud storage: strictly local Zustand store.
   - WCAG AA contrast and full ARIA accessibility (`role="radiogroup"`, `role="radio"`, `aria-checked`).

## 3. Testing Plan
- Render all form sections, labels, and helper descriptions.
- Test income range selection updating store.
- Test savings rate slider interaction and descriptive indicator.
- Test debt level radio selection updating store.
- Test spending habits preset selection.
- Test financial goal typing and suggestion chip clicks.
- Test wizard integration (step 4 render).
