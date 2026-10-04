# 📄 Technical Specification: State-Aware Landing Page with Ambient Visuals & Dynamic CTAs

> **Step ID**: `Step 13.1`  
> **Target Module**: `src/app/page.tsx`, `src/components/landing/`, `src/app/__tests__/page.test.tsx`  
> **Git Feature Branch**: `feat/step-13-1-landing-page`  
> **Status**: 📋 In Progress  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

Step 13.1 implements Phase 13 of Future You by transforming the initial placeholder landing page into a state-aware, atmospheric gateway. The page detects the user's current progress:
1. **Returning User with Completed Simulation** (`model !== null`): Presents a prominent "View Your Futures" CTA leading directly to `/dashboard`.
2. **Returning User with In-Progress Onboarding** (`!model` and `currentStep > 1` or started onboarding): Presents a "Continue Onboarding (Step N of 6)" CTA leading directly to `/onboarding`.
3. **First-Time User**: Presents a "Begin Journey" CTA to `/onboarding`.
4. **Missing API Key State**: If `!isConfigured()`, displays a gentle alert pill with a link to `/settings`, warning that an API key is needed to run simulations.
5. **Atmospheric Aesthetics**: Adds subtle, ambient glow animations (`ambient-background.tsx`) that respect `prefers-reduced-motion`.
6. **Value Proposition Highlights**: Sleek cards previewing Dual Trajectories, Compounding Habit Levers, Letters & Voice, and 100% Client-Side Privacy.
7. **Honesty Reflection Disclaimer**: Emphasizes the reflection invariant: *"Future You is a reflection tool, not a prediction engine."*

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - `src/stores/settings-store.ts` (`isConfigured`, `provider`)
  - `src/stores/onboarding-store.ts` (`currentStep`, `name`)
  - `src/stores/life-model-store.ts` (`model`)
  - `src/components/ui/button.tsx` & `src/components/ui/card.tsx`
  - `src/lib/constants.ts` (`HONESTY_DISCLAIMER`)
- **Blocked by**: None (Phase 12 complete and shipped)
- **New Packages / Libraries**: None

---

## 3. 🔒 Privacy, Storage & Disclaimer Impact

- [x] **Zero Cloud Storage**: All state checks (`useSettingsStore`, `useOnboardingStore`, `useLifeModelStore`) occur client-side via local storage.
- [x] **Honesty Disclaimer**: Displayed prominently in the footer/hero.
- [x] **Accessibility**: Meets WCAG AA contrast, all interactive buttons/links have descriptive `aria-label`s, animations respect `prefers-reduced-motion`.
- [x] **Code Style**: Max $\le 300$ lines per file, `function` declarations for components.

---

## 4. Component Structure & Modular Breakdown

To maintain modularity and strictly satisfy the $\le 300$ LOC limit:

1. `src/components/landing/ambient-background.tsx`:
   - Subtle background glowing shapes with Framer Motion, safely disabled or static when `prefers-reduced-motion` is active.
2. `src/components/landing/feature-highlights.tsx`:
   - Grid of 4 responsive cards showcasing key features (Dual Futures, Habit Levers, Narration & Letters, 100% Private).
3. `src/components/landing/index.ts`:
   - Barrel export for landing components.
4. `src/app/page.tsx`:
   - Orchestrates the state inspection, API key warning banner, hero copy, dynamic CTA buttons, and feature section.

---

## 5. Verification & Acceptance Criteria

### Automated Tests
- Test cases covering:
  - First-time user defaults (headline, "Begin Journey" CTA to `/onboarding`).
  - In-progress onboarding state (displays "Continue Onboarding (Step N)").
  - Completed simulation state (displays "View Your Futures" to `/dashboard`).
  - API key unconfigured warning banner (link to `/settings`).
  - API key configured state (displays AI Ready indicator).
  - Honesty disclaimer presence.
  - Feature cards rendered with appropriate titles and descriptions.

```bash
npm test -- src/app/__tests__/page.test.tsx
```
