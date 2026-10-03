# 📄 Technical Specification: Step 8.1a — Timeline Node & Milestone Tooltip Components

> **Step ID**: `8.1a`  
> **Target Module**: `src/components/timeline/`  
> **Git Feature Branch**: `feat/step-8-1a-timeline-nodes`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

This specification initiates **Phase 8 (Timeline)** of Future You by introducing the core building blocks for chronological milestone visualization: the **`TimelineNode`** and the **`MilestoneTooltip`** (popover) components.

The `TimelineNode` represents a concrete future horizon (Year 1, 3, or 5) along the user's path, rendered as an interactive node whose size scales proportionally with the simulated time horizon (Year 1: 14px, Year 3: 18px, Year 5: 24px) and whose color reflects persona path alignment (amber for Current Path, emerald for Improved Path). The `MilestoneTooltip` provides rich contextual detail—rendering the milestone title, affective mood indicator, detailed narrative description, and key domain metric indicators upon hover, focus, or tap.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - `src/types/timeline.types.ts` (`TimelineMilestone`, `MilestoneYear`, `MilestoneMood`)
  - `src/types/persona.types.ts` (`PersonaId`)
  - `src/components/ui/badge.tsx` (`Badge`)
  - `src/lib/utils.ts` (`cn`)
  - `framer-motion` for tooltip scale/fade animations
- **Blocked by**: None.
- **New Packages / Libraries**: None (Tech stack is strictly locked).

---

## 3. 🔒 Privacy, Storage & Accessibility Impact

- [x] **Zero Cloud Storage**: Milestones are consumed entirely from local persona models.
- [x] **WCAG AA Accessibility**:
  - `TimelineNode` is rendered as an accessible interactive `<button>` with clear `aria-label` (e.g. `aria-label="Year 1 milestone: Promoted to Tech Lead"`).
  - Proper `aria-expanded` and `aria-haspopup="dialog"` attributes.
  - Keyboard accessible: focusable via `Tab`, togglable via `Enter` / `Space`.
  - Contrast ratios $\ge 4.5:1$ on dark canvas.
- [x] **Code & Architecture Constraints**:
  - `function` component declarations exclusively.
  - TypeScript `interface` typing for all props.
  - Strictly $\le 300$ LOC per file.
  - Smooth Framer Motion transitions ($\le 300$ms).

---

## 4. 🧠 Sequential Thinking MCP Evaluation

- **Heuristic Evaluation**:
  - Timeline milestones are generated in Phase 5 AI module (`generateTimeline`).
  - This step consists of deterministic React/Tailwind/Framer Motion visual presentation components.
- **Verdict**: Sequential Thinking MCP is **Skipped** for Step 8.1a.

---

## 5. Component Contracts & Interfaces

### 5.1 MilestoneTooltip (`src/components/timeline/milestone-tooltip.tsx`)

```typescript
import { TimelineMilestone } from '@/types/timeline.types';
import { PersonaId } from '@/types/persona.types';

export interface MilestoneTooltipProps {
  /** Milestone data object */
  milestone: TimelineMilestone;
  /** Persona path identifier */
  personaId: PersonaId;
  /** Whether the tooltip is currently visible */
  isVisible?: boolean;
  /** Positioning mode */
  position?: 'top' | 'bottom';
  /** Optional custom CSS classes */
  className?: string;
}
```

### 5.2 TimelineNode (`src/components/timeline/timeline-node.tsx`)

```typescript
import { TimelineMilestone } from '@/types/timeline.types';
import { PersonaId } from '@/types/persona.types';

export interface TimelineNodeProps {
  /** Milestone represented by this node */
  milestone: TimelineMilestone;
  /** Path trajectory identity: current or improved */
  personaId: PersonaId;
  /** Whether this node is currently selected/active */
  isSelected?: boolean;
  /** Callback invoked on node selection / toggle */
  onSelect?: (milestone: TimelineMilestone) => void;
  /** Optional CSS classes */
  className?: string;
}
```

---

## 6. Visual & Styling Specifications

| Year Horizon | Node Diameter | Accent (Current) | Accent (Improved) |
| :--- | :--- | :--- | :--- |
| **Year 1** | 14px (`w-3.5 h-3.5`) | `bg-accent-current ring-accent-current/30` | `bg-accent-improved ring-accent-improved/30` |
| **Year 3** | 18px (`w-4.5 h-4.5` or `w-[18px] h-[18px]`) | `bg-accent-current ring-accent-current/40` | `bg-accent-improved ring-accent-improved/40` |
| **Year 5** | 24px (`w-6 h-6`) | `bg-accent-current ring-accent-current/50` | `bg-accent-improved ring-accent-improved/50` |

---

## 7. Step-by-Step Implementation Sequence

1. **Phase A: Directory & MilestoneTooltip (`src/components/timeline/milestone-tooltip.tsx`)**
   - Create `src/components/timeline/` directory.
   - Build `MilestoneTooltip` with header badge, year headline, title, narrative, and optional metrics badges.
   - Embed Framer Motion animated appearance.

2. **Phase B: TimelineNode Component (`src/components/timeline/timeline-node.tsx`)**
   - Build `TimelineNode` button component scaling circle sizes by `milestone.year`.
   - Implement hover and focus management with tooltip integration.
   - Support keyboard navigation (`Tab`, `Enter`).

3. **Phase C: Barrel Export (`src/components/timeline/index.ts`)**
   - Export components and prop interfaces.

4. **Phase D: Spec-Driven Tests**
   - Author `src/components/timeline/__tests__/milestone-tooltip.test.tsx`.
   - Author `src/components/timeline/__tests__/timeline-node.test.tsx`.

---

## 8. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/timeline
npx tsc --noEmit
npm run lint
```

### Acceptance Checklist
- [x] All components declared using `function` syntax with typed props.
- [x] Files strictly $\le 300$ LOC.
- [x] Accessible button semantics with `aria-label` and `aria-expanded`.
- [x] 100% test pass rate with zero TypeScript compiler or ESLint warnings.
