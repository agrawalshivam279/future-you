# Technical Specification: Step 16.4a — Check-in Page Route & History Timeline

> **Feature**: Version 3 — Check-in Mode (`/check-in` Page Route & History Component)  
> **Target Branch**: `feat/step-16-4a-check-in-page`  
> **Status**: In Progress  

---

## 1. Context & Objective

In Steps 16.1 through 16.3d, we delivered all underlying state, calculation math, AI reflection prompts, and UI components (`CheckInForm`, `AlignmentGauge`, `DriftVectorList`, `ReflectionBadge`).

Step 16.4a introduces the dedicated page route `/check-in` (`src/app/check-in/page.tsx`) and the historical log coordinator `CheckInHistoryCard` (`src/components/check-in/check-in-history-card.tsx`):
1. **Onboarding Guard**: Redirects users to `/onboarding` if they haven't generated a Life Model yet.
2. **Weekly Check-in Orchestration**: Submits habit logs, calculates mathematical drift, calls AI feedback engine, and caches results.
3. **Active Checkpoint Inspection**: Renders `AlignmentGauge`, `ReflectionBadge`, and `DriftVectorList` for the active checkpoint.
4. **Historical Timeline & Streaks**: Visualizes past logs with timestamps, alignment score badges, notes, and log management.
5. **Zero Cloud Invariant**: All data resides in `future-you:check-ins` localStorage.

---

## 2. Invariants & Guardrails

- **Zero Cloud Storage**: All state reads and mutations strictly use client-side stores (`useCheckInStore`).
- **File Length Limit**: Strictly $\le 300$ lines of code per file.
- **Component Style**: Named React `function` component, destructured props, full JSDoc.
- **Accessibility**: Meeting WCAG AA contrast standards, keyboard accessible tabs/buttons with ARIA labels.

---

## 3. Module Breakdown

### 3.1 History Card (`src/components/check-in/check-in-history-card.tsx`)
```tsx
export interface CheckInHistoryCardProps {
  logs: CheckInLog[];
  evaluations: Record<string, CheckInEvaluation>;
  activeLogId: string | null;
  onSelectLog: (id: string) => void;
  onDeleteLog: (id: string) => void;
  className?: string;
}
```

### 3.2 Page Route (`src/app/check-in/page.tsx`)
- Coordinates `useLifeModelStore`, `useCheckInStore`, `evaluateAndGenerateCheckInFeedback`.
- Renders empty state, record form, active evaluation overview, and historical timeline.

---

## 4. Verification Plan

1. **Unit & Page Integration Tests** (`src/app/check-in/__tests__/page.test.tsx`):
   - Renders onboarding guard when `model` is null.
   - Renders empty checkpoint welcome card when no logs exist.
   - Toggles record form and submits new habit checkpoint.
   - Renders active evaluation with gauge, reflection badge, and drift vectors.
   - Allows switching between historical logs.
