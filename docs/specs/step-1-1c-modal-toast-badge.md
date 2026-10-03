# 📄 Technical Specification: UI Primitives — Modal, Toast & Badge Components

> **Step ID**: `1.1c`  
> **Target Module**: `src/components/ui/`  
> **Git Feature Branch**: `feat/step-1-1c-modal-toast-badge`  
> **Status**: 📋 In Execution (/auto_cycle)  
> **Created**: 2026-10-03  

---

## 1. Executive Summary

This specification defines the feedback, overlay, and status primitives for **Future You**:
1. `Badge`: Compact status and tag pill component with persona accents.
2. `Modal`: Accessible dialog overlay with backdrop blur, keyboard Escape dismissal, and focus trapping.
3. `Toast`: Non-blocking notification toast provider and hook (`useToast`) supporting success, error, and info alerts.

---

## 2. Dependencies & Prerequisites

- **Depends on**: Step 0.1 (Scaffold).
- **Blocked by**: None.
- **Packages**: `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`.

---

## 3. 🔒 Rules & Accessibility Invariants

- [x] **Function Declarations**: All components MUST use `function Badge(...)`, `function Modal(...)`, `function ToastProvider(...)`.
- [x] **Interface Prop Typing**: Strict TypeScript interfaces for all props.
- [x] **File Length Limit**: Strictly $\le 300$ lines per file.
- [x] **JSDoc Documentation**: Comprehensive JSDoc on all exports.
- [x] **Accessibility**:
  - `Modal`: `role="dialog"`, `aria-modal="true"`, Escape key dismissal, focus trap, and background scroll lock.
  - `Toast`: `aria-live="polite"` (or `assertive` for errors), `role="status"` / `role="alert"`.
  - `Badge`: Semantic text contrast $\ge 4.5:1$.

---

## 4. Component Contracts & Interfaces

### 4.1 Badge (`src/components/ui/badge.tsx`)

```typescript
export type BadgeVariant = 'neutral' | 'current' | 'improved' | 'info' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}
```

### 4.2 Modal (`src/components/ui/modal.tsx`)

```typescript
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
}
```

### 4.3 Toast (`src/components/ui/toast.tsx`)

```typescript
export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
  duration?: number;
}

export interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}
```

---

## 5. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/ui/__tests__/badge.test.tsx
npm test -- src/components/ui/__tests__/modal.test.tsx
npm test -- src/components/ui/__tests__/toast.test.tsx
```

### Acceptance Checklist
- [ ] Badge renders all color variants.
- [ ] Modal displays when `isOpen={true}`, closes on Escape key or backdrop click.
- [ ] Toast renders dynamically, auto-dismisses after duration, and supports manual dismissal.
- [ ] All components $\le 300$ lines and strictly adhere to `.rules`.
