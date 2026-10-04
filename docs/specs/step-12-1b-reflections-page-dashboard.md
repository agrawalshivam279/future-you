# 📄 Technical Specification: Dashboard Reflections Section & Dedicated Route

> **Step ID**: `Step 12.1b`  
> **Target Module**: `src/app/reflections/page.tsx`, `src/app/dashboard/page.tsx`, `src/app/reflections/__tests__/page.test.tsx`  
> **Git Feature Branch**: `feat/step-12-1b-reflections-page-dashboard`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

Step 12.1b integrates the Regrets & Gratitudes reflection components into the primary user experience, concluding Phase 12. It establishes a dedicated full-page reflections view at `src/app/reflections/page.tsx` with multi-persona switcher tabs (Current Path amber vs Improved Path emerald), URL query parameter synchronization (`/reflections?persona=...`), back-to-dashboard navigation, and quick links to persona letter and chat. It also enhances `DashboardPage` with a tabbed view or dedicated reflections section displaying `ReflectionsGrid` alongside the timeline and habit levers, while strictly respecting the $\le 300$ LOC invariant.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - `src/components/reflections/reflections-grid.tsx` (Step 12.1a)
  - `src/stores/life-model-store.ts`
  - `src/components/ui/button.tsx` & `src/components/ui/card.tsx`
- **Blocked by**: None (Step 12.1a shipped)
- **New Packages / Libraries**: None

---

## 3. 🔒 Privacy, Storage & Disclaimer Impact

- [x] **Zero Cloud Storage**: All reflections are loaded directly from local Zustand state.
- [x] **Honesty Disclaimer**: Present in page footer and embedded `ReflectionsGrid`.
- [x] **Accessibility**: All switcher tabs and navigation controls have explicit `aria-label`s and `role="tab"` attributes.

---

## 4. Route & Page Contracts

### 4.1 Route Component (`src/app/reflections/page.tsx`)

- Uses `'use client'`
- Wrapped with `React.Suspense` for Next.js App Router query param safety.
- Reads `?persona=current` vs `?persona=improved`.
- Guard: if `!model`, displays empty state card with CTA to `/onboarding`.

### 4.2 Dashboard Page Updates (`src/app/dashboard/page.tsx`)

- Embeds `ReflectionsGrid` in a tabbed or stacked section alongside `DualTimeline`.
- Maintains file length $\le 300$ lines.

---

## 5. Step-by-Step Implementation Sequence

1. **Phase A: Dedicated Reflections Route (`src/app/reflections/page.tsx`)**
   - Create `src/app/reflections/page.tsx` with `ReflectionsPageInner` and Suspense wrapper.
   - Header with Back to Dashboard, Persona Switcher Tabs, Letter shortcut, and Chat shortcut.
   - Render `ReflectionsGrid` with active persona's regrets and gratitudes.
2. **Phase B: Dashboard Page Integration (`src/app/dashboard/page.tsx`)**
   - Integrate `ReflectionsGrid` into `DashboardPage`.
3. **Phase C: Hermetic Testing & Verification**
   - Author route tests in `src/app/reflections/__tests__/page.test.tsx`.
   - Update `src/app/dashboard/__tests__/page.test.tsx` to verify reflections rendering.

---

## 6. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/app/reflections/__tests__/page.test.tsx src/app/dashboard/__tests__/page.test.tsx
```

### Acceptance Checklist
- [ ] Dedicated route `/reflections` renders with Improved Path by default.
- [ ] Query parameter `?persona=current` opens Current Path reflections.
- [ ] Dashboard displays reflections section.
- [ ] Max file length $\le 300$ lines across all files.
- [ ] Zero TypeScript or lint errors.
