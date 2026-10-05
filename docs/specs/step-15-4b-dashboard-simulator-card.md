# Technical Specification: Step 15.4b — Dashboard Decision Simulator Trigger Card (`decision-simulator-card.tsx`)

## 1. Overview
Step 15.4b embeds an intuitive entrypoint card for the Decision Simulator directly on the main `/dashboard` screen. This connects the core dual-persona dashboard with the "What If?" Fork Engine, letting users see active scenario counts and jump straight to `/simulator` to test major life choices.

---

## 2. File Layout & LOC Budget
- **Component**: `src/components/dashboard/decision-simulator-card.tsx` ($\le 120$ LOC)
- **Barrel Export**: Export from `src/components/dashboard/index.ts`
- **Dashboard Integration**: Embedded in `src/app/dashboard/page.tsx` (maintaining $\le 300$ LOC)
- **Component Tests**: `src/components/dashboard/__tests__/decision-simulator-card.test.tsx` ($\le 140$ LOC)
- **Page Tests**: Assert presence in `src/app/dashboard/__tests__/page.test.tsx`

---

## 3. Component Specification & Props Interface

```typescript
export interface DecisionSimulatorCardProps {
  /** Optional custom CSS classes for container */
  className?: string;
  /** Optional callback override for navigation */
  onNavigate?: () => void;
}
```

### Visual Sub-sections:
1. **Header with Icon & Badges**:
   - Icon: `GitFork` or `Compass` with subtle highlight container.
   - Badge: "What If? Fork Engine" (`variant="info"`).
   - Dynamic Count Badge: Displays number of simulated forks saved in `useDecisionStore` (e.g. `2 Forks Simulated` or `Explore Scenarios`).
2. **Body & Explanation**:
   - Title: "Decision Simulator".
   - Description: Explaining multi-horizon evaluation across both future trajectories.
3. **Action Button**:
   - Primary or secondary CTA: "Launch Simulator" with `ArrowRight` icon.
   - Accessible `aria-label="Launch Decision Simulator"`.

---

## 4. Accessibility & Styling Invariants
1. **WCAG AA Compliance**: High-contrast text ($\ge 4.5:1$).
2. **Keyboard Navigation**: Reachable and activatable via Tab and Enter keys.
3. **Strict Limits**: Strict $\le 300$ LOC limit maintained across all files.

---

## 5. Testing Strategy
- Renders title, description, and badge on dashboard.
- Displays correct count of simulated scenarios from `useDecisionStore`.
- Clicking CTA invokes router navigation to `/simulator`.
- Integrates seamlessly into `src/app/dashboard/page.tsx` without regressions.
