# Technical Specification: Step 16.4b — Header Navigation Link & Dashboard Check-in CTA

> **Feature**: Version 3 — Check-in Mode (Header Link & Dashboard CTA)  
> **Target Branch**: `feat/step-16-4b-header-nav-dashboard-cta`  
> **Status**: In Progress  

---

## 1. Context & Objective

Now that the `/check-in` page route and component hierarchy are fully implemented, users need seamless, intuitive discovery points across the application.

Step 16.4b connects Check-in Mode to the core application shell:
1. **Header Navigation Link** (`src/components/layout/header.tsx`):
   - Adds an accessible navigation link to `/check-in` ("Check-in") with an `Activity` icon next to Disclaimer and Settings.
2. **Dashboard Quick-Action CTA Card** (`src/components/dashboard/check-in-summary-card.tsx`):
   - A companion card embedded on `/dashboard` next to `DecisionSimulatorCard`.
   - Displays active checkpoint metrics (e.g. latest alignment score or "Record first checkpoint"), concise feature description, and an accessible CTA button leading to `/check-in`.
3. **Dashboard Route Integration** (`src/app/dashboard/page.tsx`):
   - Embeds `CheckInSummaryCard` alongside `DecisionSimulatorCard` in a responsive two-column grid.
   - Enforces the strict $\le 300$ LOC limit on `page.tsx`.

---

## 2. Invariants & Guardrails

- **Zero Cloud Storage**: Reads live checkpoint count and score purely from client-side `useCheckInStore`.
- **Responsive Layout**: Side-by-side on desktop ($\ge 768$px), stacked on mobile ($< 768$px).
- **File Length Limit**: Strictly $\le 300$ LOC per file.
- **Accessibility**: Meeting WCAG AA contrast standards, keyboard navigable, full ARIA roles.

---

## 3. Module Breakdown

### 3.1 Header (`src/components/layout/header.tsx`)
- Adds `/check-in` navigation link.

### 3.2 Dashboard Card (`src/components/dashboard/check-in-summary-card.tsx`)
```tsx
export interface CheckInSummaryCardProps {
  className?: string;
  onNavigate?: () => void;
}
```

### 3.3 Dashboard Page (`src/app/dashboard/page.tsx`)
- Embeds both V3 modules in a responsive companion grid.

---

## 4. Verification Plan

1. **Header Tests** (`src/components/layout/__tests__/header.test.tsx`):
   - Confirms presence of Check-in navigation link pointing to `/check-in`.
2. **Dashboard CTA Tests** (`src/components/dashboard/__tests__/check-in-summary-card.test.tsx`):
   - Renders card with dynamic checkpoint count or alignment score.
   - Invokes router navigation to `/check-in` on button click.
3. **Dashboard Page Tests** (`src/app/dashboard/__tests__/page.test.tsx`):
   - Confirms `CheckInSummaryCard` is rendered and operable on `/dashboard`.
