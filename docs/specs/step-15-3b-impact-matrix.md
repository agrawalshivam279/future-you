# Technical Specification: Step 15.3b — Impact Matrix Component (`impact-matrix.tsx`)

## 1. Overview
Step 15.3b delivers the **Impact Matrix** visualizer for the Decision Simulator. The component displays the AI-evaluated outcomes of a simulated decision scenario, breaking down results into two complementary visualizations:
1. **Domain Delta Scorecards**: Visual metric bars displaying score deltas (-10 to +10) across Career, Finances, Health, Relationships, and Lifestyle with domain reasoning.
2. **Multi-Horizon Projection Track**: A 3-column chronological projection grid for Years 1, 3, and 5, detailing phase titles, narrative summaries, immediate challenges, and compounding advantages.

---

## 2. File Layout & LOC Budget
- **Component**: `src/components/simulator/impact-matrix.tsx` ($\le 250$ LOC)
- **Barrel Export**: Export from `src/components/simulator/index.ts`
- **Component Tests**: `src/components/simulator/__tests__/impact-matrix.test.tsx` ($\le 180$ LOC)

---

## 3. Component Specification & Props Interface

```typescript
export interface ImpactMatrixProps {
  /** Multi-horizon milestone projections across Years 1, 3, and 5 */
  projections: HorizonProjection[];
  /** Score deltas (-10 to +10) across key life dimensions */
  domainDeltas: DomainDelta[];
  /** Optional custom CSS classes */
  className?: string;
}
```

### Visual Sub-sections:
1. **Domain Impact Overview**:
   - 5 domain cards/bars showing delta score badges (`+N` in emerald, `-N` in amber/red, `0` neutral).
   - Domain labels (Career, Finances, Health, Relationships, Lifestyle).
   - Concise reasoning explaining the mathematical and psychological basis of each delta.
2. **Multi-Horizon Timeline Cards (Years 1, 3, 5)**:
   - Chronological grid (1-column on mobile, 3-columns on desktop).
   - Phase badge and title.
   - Contextual summary narrative.
   - Distinct sections for **Key Challenge** (warning icon) and **Key Advantage** (sparkle/check icon).

---

## 4. Accessibility & Styling Invariants
1. **WCAG AA Compliance**: High contrast ratios on all score indicators ($\ge 4.5:1$).
2. **ARIA Semantic Annotations**: Descriptive aria-labels on delta meters (e.g., `aria-label="Career Growth delta: +7"`).
3. **Responsive**: Side-by-side cards collapse into an accessible vertical stack on small viewports ($< 768$px).
4. **Code Quality**: `function` declaration syntax, typed props, strictly $\le 300$ LOC.

---

## 5. Testing Strategy
- Renders domain delta scorecards with correct values, colors, and reasoning.
- Renders all 3 multi-horizon projection cards (Years 1, 3, 5).
- Verifies positive deltas render with `+` sign and emerald styling; negative with minus sign and amber styling.
- Handles empty or partial projection arrays gracefully with fallback cards.
