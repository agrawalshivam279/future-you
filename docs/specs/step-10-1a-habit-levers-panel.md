# 📄 Technical Specification: Step 10.1a — Habit Lever Slider & Levers Panel Components

> **Step ID**: `10.1a`  
> **Target Module**: `src/components/dashboard/`  
> **Git Feature Branch**: `feat/step-10-1a-habit-levers-panel`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

This specification initiates **Phase 10 (Habit Levers)** of Future You by authoring the interactive habit modification UI components: **`HabitLeverSlider`** and **`HabitLeversPanel`** in `src/components/dashboard/`.

The `HabitLeverSlider` provides an accessible, fine-tuned range slider representing a single habit lever generated from the user's `LifeModel`. It displays live numeric values, units, and real-time delta indicators (+/- difference against baseline).

The `HabitLeversPanel` aggregates the collection of habit levers into an interactive dashboard card. It manages local staged lever adjustments, shows a summary badge of modified levers, offers a "Reset to Baseline" action, and provides an "Apply Changes" trigger to run dynamic futures recalculation.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - `src/types/life-model.types.ts` (`HabitLever`, `LifeModel`)
  - `src/components/ui/slider.tsx` (`Slider`)
  - `src/components/ui/button.tsx` (`Button`)
  - `src/components/ui/card.tsx` (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`)
  - `src/components/ui/badge.tsx` (`Badge`)
  - `lucide-react` icons (`Sliders`, `RotateCcw`, `Sparkles`, `TrendingUp`, `TrendingDown`, `Minus`)
- **Blocked by**: None.
- **New Packages / Libraries**: None (Tech stack is strictly locked).

---

## 3. 🔒 Privacy, Storage & Accessibility Impact

- [x] **Zero Cloud Storage**: All slider states operate entirely in browser memory; changes are committed locally to `useLifeModelStore`.
- [x] **WCAG AA Accessibility**:
  - Each slider includes `aria-label`, `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
  - Color contrast for diff badges and values meets $\ge 4.5:1$.
  - Keyboard accessible (arrow keys for step adjustment).
- [x] **Code & Architecture Constraints**:
  - `function` component declarations exclusively.
  - TypeScript `interface` typing for all props.
  - Strictly $\le 300$ LOC per file.

---

## 4. 🧠 Sequential Thinking MCP Evaluation

- **Heuristic Evaluation**:
  - Step 10.1a focuses on UI presentation, staged state diffing, and accessible slider manipulation.
  - Deep prompt logic and AI recalculation are handled in Step 10.1b and existing `lib/ai/regenerate-futures.ts`.
- **Verdict**: Sequential Thinking MCP is **Skipped** for Step 10.1a.

---

## 5. Component Contracts & Interfaces

### 5.1 HabitLeverSlider (`src/components/dashboard/habit-lever-slider.tsx`)

```typescript
import { HabitLever } from '@/types/life-model.types';

export interface HabitLeverSliderProps {
  /** The habit lever configuration and current value */
  lever: HabitLever;
  /** Baseline value before user adjustments (defaults to lever.currentValue) */
  baselineValue?: number;
  /** Callback fired when the lever value changes */
  onChange: (value: number) => void;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Optional custom CSS classes */
  className?: string;
}
```

### 5.2 HabitLeversPanel (`src/components/dashboard/habit-levers-panel.tsx`)

```typescript
import { HabitLever } from '@/types/life-model.types';

export interface HabitLeversPanelProps {
  /** Active habit levers from the LifeModel */
  levers: HabitLever[];
  /** Callback fired when user applies modified levers */
  onApplyChanges: (updatedLevers: HabitLever[]) => void;
  /** Optional callback when user resets levers to baseline */
  onResetToBaseline?: () => void;
  /** Whether futures recalculation is actively in progress */
  isRegenerating?: boolean;
  /** Optional custom CSS classes */
  className?: string;
}
```

---

## 6. Step-by-Step Implementation Sequence

1. **Phase A: HabitLeverSlider Component (`src/components/dashboard/habit-lever-slider.tsx`)**
   - Render `Slider` with `variant="improved"`.
   - Calculate diff: `delta = currentValue - baselineValue`.
   - Display delta badge: `+X unit` (emerald/improved), `-X unit` (amber/current), or `0` (neutral).
   - Ensure proper ARIA semantics and labels.

2. **Phase B: HabitLeversPanel Component (`src/components/dashboard/habit-levers-panel.tsx`)**
   - Manage local staged values: `Record<string, number>`.
   - Compute count of modified levers.
   - Render header with icon, title, description, and status badge.
   - Render grid of `HabitLeverSlider` items.
   - Render footer controls: "Reset to Baseline" and "Apply Changes" (with loading state).
   - Include explanatory note: "Habit adjustments update your Improved Path while Current Path remains your fixed baseline."

3. **Phase C: Barrel Export (`src/components/dashboard/index.ts`)**
   - Export `HabitLeverSlider`, `HabitLeversPanel`, and their respective prop interfaces.

4. **Phase D: Spec-Driven Tests**
   - `src/components/dashboard/__tests__/habit-lever-slider.test.tsx`:
     - Test slider value rendering, label, and unit.
     - Test delta calculations for positive, negative, and zero differences.
     - Test `onChange` trigger when slider moves.
     - Test disabled state.
   - `src/components/dashboard/__tests__/habit-levers-panel.test.tsx`:
     - Test rendering multiple habit levers.
     - Test staged edits and "Apply Changes" callback with updated values.
     - Test "Reset to Baseline" resets modified values.
     - Test button disabled states when no modifications exist or when `isRegenerating` is true.

---

## 7. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/dashboard
npx tsc --noEmit
npm run lint
```

### Acceptance Checklist
- [x] All components declared using `function` syntax with typed props.
- [x] Files strictly $\le 300$ LOC.
- [x] Real-time delta indicators accurately show positive/negative change against baseline.
- [x] Reset and Apply buttons handle staged state properly without premature store mutations.
- [x] 100% test pass rate with zero TypeScript compiler or ESLint warnings.
