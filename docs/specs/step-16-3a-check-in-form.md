# Technical Specification: Step 16.3a — Habit Check-in Form Component

> **Feature**: Version 3 — Check-in Mode (`CheckInForm` Component)  
> **Target Branch**: `feat/step-16-3a-check-in-form`  
> **Status**: In Progress  

---

## 1. Context & Objective

In Steps 16.1, 16.2a, and 16.2b, we established the state model, mathematical drift scoring engine, and AI reflection generation pipeline. Step 16.3 kicks off the user interface suite for Check-in Mode.

Step 16.3a delivers `CheckInForm` (`src/components/check-in/check-in-form.tsx`), an interactive, accessible form allowing the user to record their weekly habit checkpoint:
1. **Sleep Hours** (0-12 hrs, step 0.5)
2. **Physical Exercise Cadence** (daily, weekly, rarely, never)
3. **Deep Work Hours Per Week** (0-60 hrs, step 1)
4. **Digital Screen Time** (0-16 hrs/day, step 0.5)
5. **Monthly Savings Rate** (0-100%, step 1)
6. **Qualitative Friction & Reflection Notes** (optional multiline notes)

---

## 2. Invariants & Guardrails

- **Client-Side Only**: Directly interfaces with `useCheckInStore` and `useOnboardingStore`.
- **Pre-Population**: Defaults to the user's latest logged values if available, or falls back to onboarding baseline inputs, saving the user time.
- **Accessible UI**: ARIA labels on all slider and frequency radio inputs, semantic labels, keyboard navigable, and WCAG AA contrast compliance.
- **File Length Limit**: Max 300 LOC per file.
- **Function Declarations**: Named React `function` component declaration, strict TypeScript interfaces.

---

## 3. Component Contract

```tsx
export interface CheckInFormData {
  sleepHours: number;
  exerciseFrequency: ExerciseFrequency;
  deepWorkHoursPerWeek: number;
  screenTimeHoursPerDay: number;
  savingsRatePercentage: number;
  notes?: string;
}

export interface CheckInFormProps {
  initialValues?: Partial<CheckInFormData>;
  onSubmit: (data: CheckInFormData) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
}
```

---

## 4. Verification Plan

1. **Unit & Interaction Tests** (`src/components/check-in/__tests__/check-in-form.test.tsx`):
   - Renders all 5 habit controls and notes textarea.
   - Respects pre-populated initial values.
   - Allows adjusting sliders and selecting exercise cadences.
   - Calls `onSubmit` with updated values on submission.
   - Disables submission and inputs while `isLoading` is true.
