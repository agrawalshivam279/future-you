# 📄 Technical Specification: Step 7.1b — Split View Container & Dashboard Page

> **Step ID**: `7.1b`  
> **Target Module**: `src/components/dashboard/` & `src/app/dashboard/`  
> **Git Feature Branch**: `feat/step-7-1b-dashboard-page`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

This specification completes **Phase 7 (Dashboard & Split View)** of Future You. It introduces the **`SplitViewContainer`** component and the primary **`DashboardPage`** (`src/app/dashboard/page.tsx`).

The `SplitViewContainer` manages the side-by-side presentation (2 columns on desktop $\ge 1024$px, stacked on mobile $< 768$px) of the Current Path and Improved Path `PersonaCard`s, paired with the `ComparisonStatsGrid`. The `DashboardPage` acts as the primary hub where users view their simulated futures, providing empty-state guards (directing new users to `/onboarding`), header actions for settings and regeneration (with a confirmation modal), and seamless route transitions to persona chat, letter, and reflections.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - Step 7.1a presentation components (`PersonaCard`, `ComparisonStatsGrid` in `src/components/dashboard/`)
  - `src/stores/life-model-store.ts` (`useLifeModelStore`)
  - `src/stores/onboarding-store.ts` (`useOnboardingStore`)
  - `src/components/ui/modal.tsx` (`Modal`)
  - `src/components/ui/button.tsx` (`Button`)
  - `src/components/ui/card.tsx` (`Card`)
  - `lucide-react` icons (`RotateCcw`, `Settings`, `ArrowLeft`, `Sparkles`, `TrendingUp`)
- **Blocked by**: None.
- **New Packages / Libraries**: None (Tech stack is locked).

---

## 3. 🔒 Privacy, Storage & Accessibility Impact

- [x] **Zero Cloud Storage**: All simulation data is retrieved directly from client-side Zustand store (`useLifeModelStore`).
- [x] **Honesty Disclaimer Alignment**: Permanent reflective disclaimer visible in dashboard header/footer: *"Future You is a reflection tool, not a prediction engine."*
- [x] **Responsive Split View**:
  - Desktop ($\ge 1024$px): Side-by-side 2-column layout.
  - Mobile ($< 768$px): Stacked single-column layout for comfortable readability.
- [x] **WCAG AA Accessibility**:
  - Interactive buttons feature explicit `aria-label` tags.
  - Modal follows accessible dialog semantics (`role="dialog"`).
  - High-contrast text on dark backgrounds ($\ge 4.5:1$).
- [x] **Code & Architecture Constraints**:
  - `function` component declarations exclusively.
  - TypeScript `interface` typing for all props.
  - Strictly $\le 300$ LOC per file.

---

## 4. 🧠 Sequential Thinking MCP Evaluation

- **Heuristic Evaluation**:
  - Complex Habit Lever Math: Evaluated in Phase 5.2f & Phase 10.
  - Persona Voice Grounding: Evaluated in Phase 5 prompt templates.
  - Client-side Routing & Layout Composition: Standard Next.js App Router and Zustand integration.
- **Verdict**: Sequential Thinking MCP is **Skipped** for Step 7.1b.

---

## 5. Component Contracts & Interfaces

### 5.1 SplitViewContainer (`src/components/dashboard/split-view-container.tsx`)

```typescript
import { LifeModel, PersonaId } from '@/types';

export interface SplitViewContainerProps {
  /** Dual-path life simulation model */
  lifeModel: LifeModel;
  /** Callback triggered when clicking chat for a persona */
  onChatClick?: (personaId: PersonaId) => void;
  /** Callback triggered when clicking letter for a persona */
  onLetterClick?: (personaId: PersonaId) => void;
  /** Callback triggered when clicking reflections for a persona */
  onReflectionsClick?: (personaId: PersonaId) => void;
  /** Optional custom CSS classes */
  className?: string;
}
```

### 5.2 DashboardPage (`src/app/dashboard/page.tsx`)

- Next.js client component (`'use client'`).
- Subscribes to `useLifeModelStore((state) => state.model)`.
- If `model === null`, renders empty-state reflection prompt with a link to `/onboarding`.
- If `model !== null`:
  - Renders dashboard header with title ("Your Two Futures"), subtitle, Settings button, and Regenerate button.
  - Renders `SplitViewContainer`.
  - Regenerate button opens confirmation `Modal` before routing back to `/generate`.

---

## 6. Step-by-Step Implementation Sequence

1. **Phase A: SplitViewContainer Component (`src/components/dashboard/split-view-container.tsx`)**
   - Renders 2-column grid (`grid grid-cols-1 lg:grid-cols-2 gap-6`) for Current Path and Improved Path `PersonaCard`s.
   - Renders `ComparisonStatsGrid` below the cards.
   - Forwards persona callbacks (`onChatClick`, `onLetterClick`, `onReflectionsClick`).
   - Exports from `src/components/dashboard/index.ts`.

2. **Phase B: Dashboard Page (`src/app/dashboard/page.tsx`)**
   - Connects to `useLifeModelStore` and Next.js `useRouter`.
   - Implements Empty State when `model === null`.
   - Implements Header with title, settings icon, and regenerate modal.
   - Embeds the honesty disclaimer.

3. **Phase C: Spec-Driven Tests**
   - Author `src/components/dashboard/__tests__/split-view-container.test.tsx`.
   - Author `src/app/dashboard/__tests__/page.test.tsx`.

---

## 7. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/dashboard src/app/dashboard
npx tsc --noEmit
npm run lint
```

### Acceptance Checklist
- [x] All components declared using `function` syntax with typed props.
- [x] Files strictly $\le 300$ LOC.
- [x] Responsive 2-column desktop / stacked mobile grid.
- [x] Empty state cleanly guides users without models to `/onboarding`.
- [x] Regenerate modal prompts for confirmation.
- [x] 100% test pass rate with zero TypeScript compiler or ESLint warnings.
