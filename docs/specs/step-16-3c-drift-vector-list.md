# Technical Specification: Step 16.3c — Habit Drift Vector List Component

> **Feature**: Version 3 — Check-in Mode (`DriftVectorList` Component)  
> **Target Branch**: `feat/step-16-3c-drift-vector-list`  
> **Status**: In Progress  

---

## 1. Context & Objective

In Check-in Mode, users evaluate their weekly habits against baseline and target values, producing an array of `HabitDriftVector` items across sleep, exercise, screen time, deep work, and savings rate.

Step 16.3c delivers `DriftVectorList` (`src/components/check-in/drift-vector-list.tsx`), an accessible, responsive list component visualizing each evaluated habit dimension:
1. Status breakdown pills (Total habits, Surpassing, Aligned, Drifting counts).
2. Per-habit progress row:
   - Habit label & metric unit (e.g., "Nightly Sleep (hrs)").
   - Actual value vs. Baseline and Target goal.
   - Status badge (`surpassing`, `aligned`, `drifting_current`).
   - Visual progress bar showing percentage completion towards target.
3. Accessible ARIA attributes (`role="list"`, `role="listitem"`, progress bars with `aria-valuenow`).

---

## 2. Invariants & Guardrails

- **Accessibility**: Meets WCAG AA contrast standards, keyboard navigable, full ARIA roles.
- **File Length Limit**: Strictly $\le 300$ LOC per file.
- **Component Style**: Named React `function` component, destructured typed props, JSDoc annotations.

---

## 3. Component Contract

```tsx
export interface DriftVectorListProps {
  vectors: HabitDriftVector[];
  className?: string;
}
```

---

## 4. Verification Plan

1. **Unit & Render Tests** (`src/components/check-in/__tests__/drift-vector-list.test.tsx`):
   - Renders all habit vector rows with labels and actual/baseline/target values.
   - Accurately renders status badges (`Surpassing`, `Aligned`, `Drifting`).
   - Renders summary status counts (e.g., "2 Aligned, 1 Surpassing, 2 Drifting").
   - Gracefully handles empty vectors list.
