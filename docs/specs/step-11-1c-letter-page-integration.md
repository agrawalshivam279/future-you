# 📄 Technical Specification: Letter Page Route & Multi-Persona Flow Integration

> **Step ID**: `Step 11.1c`  
> **Target Module**: `src/app/letter/page.tsx`, `src/app/letter/__tests__/page.test.tsx`  
> **Git Feature Branch**: `feat/step-11-1c-letter-page-integration`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

Step 11.1c builds the dedicated full-page letter view at `src/app/letter/page.tsx`, concluding Phase 11 (Letter from Future Self + TTS). It connects the generated `LifeModel` letters from both personas (`current` and `improved`) to the `LetterView` stationery component. The page includes URL search parameter synchronization (`/letter?persona=...`), a high-contrast persona switcher tab strip (Current Path amber vs Improved Path emerald), empty simulation state redirection guards, and direct navigation links back to the dashboard or to live persona chat.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - `src/components/letter/letter-view.tsx` (Step 11.1b)
  - `src/stores/life-model-store.ts` (LifeModel state)
  - `src/stores/onboarding-store.ts` (Onboarding inputs & callsign)
  - `src/components/ui/button.tsx` & `src/components/ui/card.tsx`
- **Blocked by**: None (Steps 11.1a & 11.1b shipped)
- **New Packages / Libraries**: None

---

## 3. 🔒 Privacy, Storage & Disclaimer Impact

- [x] **Zero Cloud Storage**: Reads directly from client-side Zustand store persisted in `future-you:life-model` localStorage.
- [x] **Honesty Disclaimer**: Present both in the page header subtitle and within the embedded `LetterView` footer.
- [x] **Accessibility**: All switcher tabs and navigation buttons have explicit `aria-label`s, role attributes, and keyboard focus states meeting WCAG AA contrast.

---

## 4. Route Architecture & Component Contracts

### 4.1 Route Component (`src/app/letter/page.tsx`)

- Uses `'use client'`
- Wrapped with `React.Suspense` for Next.js App Router `useSearchParams` boundary compatibility.
- Synchronizes with `?persona=current` vs `?persona=improved`.
- Guard: if `lifeModel` is null, displays empty state card with CTA to `/onboarding`.

---

## 5. Step-by-Step Implementation Sequence

1. **Phase A: Letter Page Route Implementation**
   - Create `src/app/letter/page.tsx` with `LetterViewPage` and `LetterPageInner`.
   - Implement navigation bar with Back to Dashboard, Persona Switcher Tabs, and Chat shortcut.
   - Embed `LetterView` wired to the active persona letter.
2. **Phase B: Verification & Testing**
   - Author comprehensive unit tests in `src/app/letter/__tests__/page.test.tsx`.
   - Verify empty state redirect, search param parsing, tab switching, and navigation.

---

## 6. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/app/letter/__tests__/page.test.tsx
```

### Acceptance Checklist
- [ ] Page renders smoothly on `/letter` with Improved Path by default.
- [ ] Query parameter `?persona=current` opens Current Path letter.
- [ ] Persona tabs allow instant switching between Current and Improved letters.
- [ ] Empty state redirects or provides clear button to begin onboarding.
- [ ] Max file length $\le 300$ lines.
- [ ] Zero TypeScript or lint errors.
