# 📄 Technical Specification: Step 8.1b — Dual Timeline Component & Dashboard Integration

> **Step ID**: `8.1b`  
> **Target Module**: `src/components/timeline/` & `src/app/dashboard/`  
> **Git Feature Branch**: `feat/step-8-1b-dual-timeline`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

This specification completes **Phase 8 (Timeline)** of Future You. It delivers the **`DualTimeline`** container component (`src/components/timeline/dual-timeline.tsx`) and integrates it into the primary **`DashboardPage`** (`src/app/dashboard/page.tsx`).

The `DualTimeline` displays parallel chronological tracks for the Current and Improved trajectories. Each track connects Year 1, Year 3, and Year 5 milestones using animated connecting lines, year-scaled `TimelineNode` anchors, and interactive floating `MilestoneTooltip` popovers. The layout adapts responsively (horizontal dual tracks on desktop $\ge 768$px, vertical stacked tracks on mobile $< 768$px) and includes initial draw animations with Framer Motion.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - Step 8.1a components (`TimelineNode`, `MilestoneTooltip` in `src/components/timeline/`)
  - `src/types/timeline.types.ts` (`TimelineMilestone`, `MilestoneYear`)
  - `src/components/ui/card.tsx` (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`)
  - `src/components/ui/badge.tsx` (`Badge`)
  - `lucide-react` icons (`Clock`, `Milestone`, `Calendar`)
  - `framer-motion` for track draw animation
- **Blocked by**: None.
- **New Packages / Libraries**: None (Tech stack is strictly locked).

---

## 3. 🔒 Privacy, Storage & Accessibility Impact

- [x] **Zero Cloud Storage**: Milestones are read locally from the client-side `LifeModel` stored in Zustand.
- [x] **WCAG AA Accessibility**:
  - Semantic sectioning (`<section aria-label="5-Year Milestone Timeline">`).
  - Interactive nodes are keyboard focusable buttons with `aria-label` tags.
  - Reduced Motion support: respects `prefers-reduced-motion` for line animations.
- [x] **Code & Architecture Constraints**:
  - `function` component declarations exclusively.
  - TypeScript `interface` typing for all props.
  - Strictly $\le 300$ LOC per file.
  - Max animation duration $\le 800$ms with spring/ease-out.

---

## 4. 🧠 Sequential Thinking MCP Evaluation

- **Heuristic Evaluation**:
  - Deterministic React/Tailwind/Framer Motion timeline rendering without prompt modification or complex math recalculation.
- **Verdict**: Sequential Thinking MCP is **Skipped** for Step 8.1b.

---

## 5. Component Contracts & Interfaces

### 5.1 DualTimeline (`src/components/timeline/dual-timeline.tsx`)

```typescript
import { TimelineMilestone } from '@/types/timeline.types';

export interface DualTimelineProps {
  /** Milestones for Current Path (Years 1, 3, 5) */
  currentMilestones: TimelineMilestone[];
  /** Milestones for Improved Path (Years 1, 3, 5) */
  improvedMilestones: TimelineMilestone[];
  /** Optional custom CSS classes */
  className?: string;
}
```

### 5.2 DashboardPage Integration (`src/app/dashboard/page.tsx`)

- Renders `<DualTimeline>` directly beneath `<SplitViewContainer>` in the dashboard view, passing `model.currentPath.timeline` and `model.improvedPath.timeline`.

---

## 6. Step-by-Step Implementation Sequence

1. **Phase A: DualTimeline Component (`src/components/timeline/dual-timeline.tsx`)**
   - Author `DualTimeline` wrapping timeline tracks inside a styled `Card`.
   - Implement sorting by `year` (1, 3, 5).
   - Render horizontal track lines on desktop with Framer Motion draw animation.
   - Render vertical/stacked layout on mobile for comfortable readability.
   - Place `TimelineNode` for each milestone year.
   - Export from `src/components/timeline/index.ts`.

2. **Phase B: Dashboard Page Integration (`src/app/dashboard/page.tsx`)**
   - Import `DualTimeline` from `@/components/timeline`.
   - Render `DualTimeline` below `SplitViewContainer`.

3. **Phase C: Spec-Driven Tests**
   - Author `src/components/timeline/__tests__/dual-timeline.test.tsx`.
   - Update `src/app/dashboard/__tests__/page.test.tsx` to assert timeline presence.

---

## 7. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/timeline src/app/dashboard
npx tsc --noEmit
npm run lint
```

### Acceptance Checklist
- [x] All components declared using `function` syntax with typed props.
- [x] Files strictly $\le 300$ LOC.
- [x] Responsive layout: horizontal on desktop, vertical on mobile.
- [x] Animated track draw line respects reduced motion.
- [x] 100% test pass rate with zero TypeScript compiler or ESLint warnings.
