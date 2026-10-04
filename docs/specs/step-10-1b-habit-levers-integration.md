# 📄 Technical Specification: Step 10.1b — Dashboard Habit Levers Integration & Regeneration Flow

> **Step ID**: `10.1b`  
> **Target Module**: `src/app/dashboard/`  
> **Git Feature Branch**: `feat/step-10-1b-habit-levers-integration`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

This specification completes **Phase 10 (Habit Levers)** of Future You by integrating the **`HabitLeversPanel`** into the dashboard page route (`src/app/dashboard/page.tsx`), orchestrating dynamic futures regeneration via `regenerateFutures`, and providing interactive loading feedback while the AI recalculates the user's Improved Path trajectory.

When habit levers are modified and applied, the dashboard triggers `regenerateFutures`, updating the user's Improved Path persona and timeline while preserving the Current Path as the fixed baseline of inertia.

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - Step 10.1a components (`HabitLeversPanel`, `HabitLeverSlider` in `src/components/dashboard/`)
  - `src/lib/ai/regenerate-futures.ts` (`regenerateFutures`)
  - `src/stores/life-model-store.ts` (`useLifeModelStore`)
  - `src/stores/ui-store.ts` (`useUIStore`) for toast alerts
  - `src/components/ui/skeleton.tsx` (`Skeleton`)
- **Blocked by**: None.
- **New Packages / Libraries**: None (Tech stack is strictly locked).

---

## 3. 🔒 Privacy, Storage & Accessibility Impact

- [x] **Zero Cloud Storage**: All recalculations update the client-side Zustand store and `future-you:life-model` localStorage directly.
- [x] **WCAG AA Accessibility**:
  - Live loading announcements and accessible skeleton states during futures recalculation.
  - Buttons and inputs have explicit ARIA labels.
- [x] **Code & Architecture Constraints**:
  - `function DashboardPage(...)` App Router client component.
  - Strictly $\le 300$ LOC in `src/app/dashboard/page.tsx`.

---

## 4. 🧠 Sequential Thinking MCP Evaluation

- **Heuristic Evaluation**:
  - Step 10.1b integrates previously authored and tested modules (`regenerateFutures`, `HabitLeversPanel`, `useLifeModelStore`).
  - Delta math and bounds validation are fully encapsulated in `regenerateFutures` and `HabitLeverSlider`.
- **Verdict**: Sequential Thinking MCP is **Skipped** for Step 10.1b.

---

## 5. Implementation Details & Plan

### 5.1 Dashboard Layout Integration (`src/app/dashboard/page.tsx`)
- Render `HabitLeversPanel` between `SplitViewContainer` and `DualTimeline`.
- Pass `model.habitLevers`.
- Manage `isRegenerating` state flag.
- During regeneration:
  - Display non-intrusive status indicator or skeleton overlay on the Improved Path column.
  - Disable lever controls.

### 5.2 Regeneration Handler
```typescript
const handleApplyHabitLevers = async (updatedLevers: HabitLever[]) => {
  if (!model) return;
  setIsRegenerating(true);
  try {
    const updatedModel = await regenerateFutures(model, updatedLevers);
    setLifeModel(updatedModel);
    addToast({
      title: 'Futures Recalculated',
      description: 'Your Improved Path has been updated based on your new habit levers.',
      variant: 'success',
    });
  } catch (err) {
    addToast({
      title: 'Recalculation Failed',
      description: err instanceof Error ? err.message : 'Failed to recalculate futures.',
      variant: 'error',
    });
  } finally {
    setIsRegenerating(false);
  }
};
```

---

## 6. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/app/dashboard
npx tsc --noEmit
npm run lint
```

### Acceptance Checklist
- [x] `HabitLeversPanel` renders on dashboard when habit levers exist.
- [x] Applying changes invokes `regenerateFutures` and updates the life model store.
- [x] Loading state shows feedback while recalculating.
- [x] Errors during regeneration trigger user-friendly toast alerts.
- [x] 100% test pass rate with zero TypeScript compiler or ESLint warnings.
- [x] File stays strictly $\le 300$ LOC.
