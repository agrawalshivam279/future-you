# 📄 Technical Specification: UI Primitives — Input, Textarea & Slider Components

> **Step ID**: `1.1b`  
> **Target Module**: `src/components/ui/`  
> **Git Feature Branch**: `feat/step-1-1b-input-textarea-slider`  
> **Status**: 📋 In Execution (/auto_cycle)  
> **Created**: 2026-10-03  

---

## 1. Executive Summary

This specification defines the implementation of accessible form primitives: `Input`, `Textarea`, and `Slider` components. These elements serve as the data collection inputs across the 6-step Onboarding Wizard (habits, goals, spending, fears) and the live Habit Levers dashboard panel.

---

## 2. Dependencies & Prerequisites

- **Depends on**: Step 0.1 (Scaffold & Styling).
- **Blocked by**: None.
- **Packages**: `clsx`, `tailwind-merge`, `lucide-react`.

---

## 3. 🔒 Rules & Accessibility Invariants

- [x] **Function Declarations**: All components MUST use `function Input(...)`, `function Textarea(...)`, and `function Slider(...)`.
- [x] **Interface Prop Typing**: Typed using strict `interface` extending native HTML elements.
- [x] **File Length Limit**: Strictly $\le 300$ lines per file.
- [x] **JSDoc Documentation**: Comprehensive JSDoc for each exported component.
- [x] **Accessibility**:
  - `Input` & `Textarea`: Explicit `aria-invalid`, `aria-describedby` when errors are provided, visible focus rings.
  - `Slider`: `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and descriptive `aria-label`.
  - Contrast ratios $\ge 4.5:1$ against `--bg-primary` canvas.

---

## 4. Component Contracts & Interfaces

### 4.1 Input (`src/components/ui/input.tsx`)

```typescript
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

### 4.2 Textarea (`src/components/ui/textarea.tsx`)

```typescript
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
```

### 4.3 Slider (`src/components/ui/slider.tsx`)

```typescript
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  variant?: 'neutral' | 'current' | 'improved';
  onChange: (value: number) => void;
}
```

---

## 5. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/ui/__tests__/input.test.tsx
npm test -- src/components/ui/__tests__/textarea.test.tsx
npm test -- src/components/ui/__tests__/slider.test.tsx
```

### Acceptance Checklist
- [ ] Input and Textarea accept values and render error states.
- [ ] Slider displays current numeric value, responds to changes, and sets ARIA value attributes.
- [ ] All components use `function` declarations and stay strictly under 300 LOC.
- [ ] `tsc --noEmit` and `npm run lint` pass with 0 errors.
