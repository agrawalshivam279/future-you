# Step 1.1d Technical Specification: Skeleton & Spinner Primitives

## 1. Overview
Step 1.1d implements the visual loading indicators required by the Future You design system:
- **`Skeleton`**: Content placeholder for loading states (cards, text lines, timeline nodes, chat bubbles) preventing Cumulative Layout Shift (CLS).
- **`Spinner`**: Rotary loader for buttons, async forms, and LLM streaming connection states.

---

## 2. Invariants & Rules Checklist
- [x] Zero cloud storage: Pure client-side presentation components.
- [x] Next.js 14 App Router: React client-safe components with `'use client'` where appropriate.
- [x] React component style: `function` declaration exports, destructured props.
- [x] Type definitions: `interface` props exported.
- [x] Max 300 LOC per file: Modular and lean.
- [x] Accessibility: `role="status"`, `aria-label`, `sr-only` descriptive text, WCAG AA compliance.
- [x] Reduced motion: Respects `prefers-reduced-motion` with `motion-safe:animate-pulse` and `motion-safe:animate-spin`.
- [x] Styling: Dark mode first using Tailwind CSS design tokens (`bg-bg-tertiary`, `text-text-primary`, etc.).

---

## 3. Component Specifications

### 3.1 Skeleton (`src/components/ui/skeleton.tsx`)
```typescript
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text' | 'card';
  width?: string | number;
  height?: string | number;
}
```
- **Variants**:
  - `default`: standard rounded rectangle (`rounded-md`).
  - `circular`: avatar / badge placeholder (`rounded-full`).
  - `text`: single text line (`h-4 rounded`).
  - `card`: full card container (`h-32 w-full rounded-lg`).
- **Animation**: `motion-safe:animate-pulse` with dark neutral background (`bg-bg-tertiary/70`).

### 3.2 Spinner (`src/components/ui/spinner.tsx`)
```typescript
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'current' | 'improved';
  label?: string;
}
```
- **Sizes**:
  - `sm`: 16px (`w-4 h-4`)
  - `md`: 24px (`w-6 h-6`)
  - `lg`: 32px (`w-8 h-8`)
  - `xl`: 48px (`w-12 h-12`)
- **Variants**:
  - `default`: `text-text-tertiary`
  - `primary`: `text-text-primary`
  - `current`: `text-amber-500`
  - `improved`: `text-emerald-500`
- **Accessibility**: Includes `role="status"`, `aria-label`, and `<span className="sr-only">{label}</span>`.

---

## 4. Verification Plan
- **TypeScript & Lint**: `npx tsc --noEmit && npm run lint`
- **Unit Testing**:
  - `src/components/ui/__tests__/skeleton.test.tsx`
  - `src/components/ui/__tests__/spinner.test.tsx`
  - Ensure $\ge 90\%$ branch and line coverage.
