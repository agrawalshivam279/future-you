# 📄 Technical Specification: UI Primitives — Button & Card Components

> **Step ID**: `1.1a`  
> **Target Module**: `src/components/ui/`  
> **Git Feature Branch**: `feat/step-1-1a-button-card`  
> **Status**: 📋 Draft / Ready for Implementation  
> **Created**: 2026-10-03  

---

## 1. Executive Summary

This specification defines the implementation of the core UI primitives: `Button` and `Card` components, adhering strictly to the **Future You** design system ([`design.md`](file:///d:/Future%20You/design.md)) and coding guidelines ([`.rules`](file:///d:/Future%20You/.rules)). It introduces accessible, composable building blocks with persona-aware theming (amber accents for Current Path, emerald accents for Improved Path) that form the foundational building blocks for all subsequent pages, onboarding wizards, and dashboards.

---

## 2. Dependencies & Prerequisites

- **Depends on**: Step 0.1 (Scaffold & Tailwind setup).
- **Blocked by**: None.
- **Packages Used**: `clsx`, `tailwind-merge`, `lucide-react`.

---

## 3. 🔒 Rules & Accessibility Invariants

- [x] **Function Declarations**: All components MUST be declared using `function Button(...)` and `function Card(...)`. Never arrow functions.
- [x] **Interface Prop Typing**: Props MUST be declared with `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}`.
- [x] **File Length Limit**: Strictly $\le 300$ lines per file.
- [x] **JSDoc Documentation**: Every exported component has a comprehensive JSDoc header.
- [x] **Accessibility**:
  - `aria-label` supported and forwarded.
  - Buttons with `isLoading={true}` must render with `aria-busy="true"` and `disabled`.
  - Contrast ratios adhere to WCAG AA ($\ge 4.5:1$).
  - Full keyboard focusability with visible outline focus rings (`focus-visible:ring-2 focus-visible:ring-border-focus`).

---

## 4. Component Contracts & Interfaces

### 4.1 Button Primitive (`src/components/ui/button.tsx`)

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'current' | 'improved';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

### 4.2 Card Primitive (`src/components/ui/card.tsx`)

```typescript
export type CardVariant = 'default' | 'current' | 'improved';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  isInteractive?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

---

## 5. Visual & Styling Specifications

| Component | Variant | Styling Classes |
| :--- | :--- | :--- |
| **`Button`** | `primary` | `bg-text-primary text-bg-primary font-medium hover:bg-white/90 active:scale-95` |
| | `secondary` | `bg-bg-tertiary text-text-primary border border-border-primary hover:bg-bg-hover` |
| | `ghost` | `bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover` |
| | `danger` | `bg-accent-danger/10 text-accent-danger border border-accent-danger/20 hover:bg-accent-danger/20` |
| | `current` | `bg-accent-current/10 text-accent-current border border-accent-current/30 hover:bg-accent-current/20` |
| | `improved` | `bg-accent-improved/10 text-accent-improved border border-accent-improved/30 hover:bg-accent-improved/20` |
| **`Card`** | `default` | `bg-bg-secondary border border-border-primary rounded-xl p-6` |
| | `current` | `bg-current-bg/40 border border-current-border border-l-4 border-l-accent-current rounded-xl p-6` |
| | `improved` | `bg-improved-bg/40 border border-improved-border border-l-4 border-l-accent-improved rounded-xl p-6` |

---

## 6. Step-by-Step Implementation Sequence

1. **Step 1: Button Component**
   - Create `src/components/ui/button.tsx`.
   - Implement loading spinner fallback using `lucide-react` Loader2 icon.
   - Forward ref using `React.forwardRef`.
2. **Step 2: Card Component**
   - Create `src/components/ui/card.tsx`.
   - Implement composable subcomponents: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
3. **Step 3: Spec-Driven Tests**
   - Author `src/components/ui/__tests__/button.test.tsx`.
   - Author `src/components/ui/__tests__/card.test.tsx`.

---

## 7. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/ui/__tests__/button.test.tsx
npm test -- src/components/ui/__tests__/card.test.tsx
```

### Acceptance Checklist
- [ ] Button handles click events, disabled state, and loading spinner.
- [ ] Card persona variants render left accent borders (`border-l-accent-current`, `border-l-accent-improved`).
- [ ] Zero TypeScript errors (`npx tsc --noEmit`).
- [ ] Zero ESLint errors (`npm run lint`).
- [ ] All files strictly under 300 LOC.
