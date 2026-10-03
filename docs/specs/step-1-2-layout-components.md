# Step 1.2 Technical Specification: Layout Components

## 1. Overview
Step 1.2 implements the structural layout components for Future You:
- **`Header`**: Top navigation header featuring branding, navigation links, and settings shortcut.
- **`Footer`**: Persistent honesty disclaimer footer satisfying all project privacy and reflection mandates.
- **`DisclaimerModal`**: First-time visitor onboarding modal explaining the reflection vs. prediction principle and local-first privacy architecture, with persistent acknowledgment in `localStorage`.

---

## 2. Invariants & Rules Checklist
- [x] Zero cloud storage: Acknowledgment stored strictly in `localStorage` under `future-you:disclaimer-acknowledged`.
- [x] Next.js 14 App Router: Clean separation of server layout and interactive client components.
- [x] Honesty disclaimer: Visible in the footer on every page and detailed in the first-time visitor modal.
- [x] Component style: `function` declarations, destructured props with TypeScript `interface`.
- [x] Max 300 LOC per file: Header (~60 LOC), Footer (~60 LOC), DisclaimerModal (~90 LOC).
- [x] Accessibility: `role="banner"`, `role="contentinfo"`, `role="dialog"`, full keyboard navigation, WCAG AA contrast.
- [x] Dark mode default: Seamless integration with Tailwind dark theme tokens (`bg-bg-primary`, `bg-bg-secondary`, `border-border-primary`).

---

## 3. Component Architecture & Props

### 3.1 Header (`src/components/layout/header.tsx`)
```typescript
export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  showNav?: boolean;
  onOpenDisclaimer?: () => void;
}
```
- Brand identity with link to home (`/`).
- Navigation links: "About / Disclaimer" trigger and "Settings" icon link (`/settings`).
- Landmark: `<header role="banner">`.

### 3.2 Footer (`src/components/layout/footer.tsx`)
```typescript
export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  onOpenDisclaimer?: () => void;
}
```
- Landmark: `<footer role="contentinfo">`.
- Always displays `HONESTY_DISCLAIMER`.
- Highlights local privacy: "100% Client-Side • Zero Remote Storage".
- Includes interactive button to trigger `DisclaimerModal`.

### 3.3 DisclaimerModal (`src/components/layout/disclaimer-modal.tsx`)
```typescript
export interface DisclaimerModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  autoPrompt?: boolean;
}
```
- Checks `future-you:disclaimer-acknowledged` in `localStorage` on client mount when `autoPrompt` is true.
- Modal content outlines the 3 Core Tenets:
  1. Reflection, Not Prediction.
  2. Complete Privacy & Zero Cloud Storage.
  3. Total User Agency & Instant Data Deletion.
- "I Understand & Begin" primary button records acknowledgment to `localStorage` and dismisses modal.

---

## 4. Verification Plan
- **Static Analysis**: `npx tsc --noEmit && npm run lint`
- **Unit Tests**:
  - `src/components/layout/__tests__/header.test.tsx`
  - `src/components/layout/__tests__/footer.test.tsx`
  - `src/components/layout/__tests__/disclaimer-modal.test.tsx`
- **Invariants**: 100% statement and line coverage on layout primitives.
