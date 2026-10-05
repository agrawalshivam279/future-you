# Technical Specification: Step 16.3b — Trajectory Alignment Gauge Component

> **Feature**: Version 3 — Check-in Mode (`AlignmentGauge` Component)  
> **Target Branch**: `feat/step-16-3b-alignment-gauge`  
> **Status**: In Progress  

---

## 1. Context & Objective

In Check-in Mode, users record their weekly habits and receive a composite trajectory alignment score (0–100%) calculated deterministically by `drift-calculator.ts`.

Step 16.3b delivers `AlignmentGauge` (`src/components/check-in/alignment-gauge.tsx`), an accessible radial SVG meter displaying the alignment score with:
1. Dynamic color coding:
   - $\ge 80\%$: Emerald / Improved Path (`#10b981`, `accent-improved`) — "Strong Alignment"
   - $50–79\%$: Amber / Current Path (`#f59e0b`, `accent-current`) — "Moderate Recalibration"
   - $< 50\%$: Rose / Warning (`#ef4444`, `text-red-400`) — "Drifting Status Quo"
2. Smooth Framer Motion SVG stroke-dashoffset animation.
3. Semantic accessibility markup (`role="meter"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`).
4. Supporting descriptive status badge and contextual interpretation.

---

## 2. Invariants & Guardrails

- **Accessibility**: Meets WCAG AA contrast standards ($\ge 4.5:1$), includes ARIA meter semantics, respects `prefers-reduced-motion`.
- **File Length Limit**: Strictly $\le 300$ lines of code per file.
- **Component Style**: `function` declaration for React component, destructuring props, JSDoc annotations.

---

## 3. Component Contract

```tsx
export interface AlignmentGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}
```

---

## 4. Verification Plan

1. **Unit & Render Tests** (`src/components/check-in/__tests__/alignment-gauge.test.tsx`):
   - Renders SVG circle meter with correct ARIA attributes (`role="meter"`, `aria-valuenow`).
   - Renders numeric score (e.g. "85%").
   - Applies appropriate semantic color and status label across high, medium, and low scores.
   - Handles edge cases (0%, 100%, clamped outliers).
