# Technical Specification: Step 15.3d — Trade-offs & Latent Blindspots (`trade-offs-card.tsx`)

## 1. Overview
Step 15.3d implements the **TradeOffsCard** component within the Decision Simulator suite. It visualizes the critical sacrifices, hidden frictions, and second-order blindspots associated with a user's life fork, ensuring the user confronts the non-obvious costs alongside the optimistic upsides.

---

## 2. File Layout & LOC Budget
- **Component**: `src/components/simulator/trade-offs-card.tsx` ($\le 180$ LOC)
- **Barrel Export**: Export from `src/components/simulator/index.ts`
- **Component Tests**: `src/components/simulator/__tests__/trade-offs-card.test.tsx` ($\le 160$ LOC)

---

## 3. Component Specification & Props Interface

```typescript
export interface TradeOffsCardProps {
  /** Explicit sacrifices and trade-offs required by the decision */
  tradeOffs: string[];
  /** Latent frictions, second-order effects, or unforeseen risks */
  unforeseenRisks: string[];
  /** Optional custom CSS classes for container */
  className?: string;
}
```

### Visual Sub-sections:
1. **Section Heading**: "Trade-offs & Latent Blindspots" with subtitle emphasizing that every path involves deliberate sacrifices.
2. **Direct Sacrifices & Trade-offs Card (Amber Theme)**:
   - Icon: `Scale` / `AlertTriangle`.
   - Title: "Direct Sacrifices & Frictions".
   - Subtitle: "The explicit costs required to pursue this path".
   - Badge: "Trade-offs" (warning/amber variant).
   - Render: Formatted item cards with index badges and readable text.
   - Fallback: "No explicit trade-offs detected for this decision."
3. **Unforeseen & Second-Order Risks Card (Rose/Danger Theme)**:
   - Icon: `EyeOff` / `AlertOctagon`.
   - Title: "Unforeseen & Latent Risks".
   - Subtitle: "Second-order hazards and hidden vulnerabilities".
   - Badge: "Blindspots" (danger/rose variant).
   - Render: Formatted item cards with index badges and readable text.
   - Fallback: "No latent blindspots detected for this decision."

---

## 4. Accessibility & Styling Invariants
1. **Responsive Grid**: Side-by-side columns on desktop (`grid-cols-1 md:grid-cols-2`), stacked cleanly on mobile screens $< 768$px.
2. **WCAG AA Compliance**: Meets contrast requirements ($\ge 4.5:1$).
3. **Semantic ARIA**: Accessible lists (`role="list"` and `role="listitem"`) and card-level `aria-label` tags.
4. **Code Quality**: `function` declaration syntax, typed props, strictly $\le 300$ LOC.

---

## 5. Testing Strategy
- Renders section headings and subtitles.
- Correctly renders all trade-off items and unforeseen risk items.
- Displays appropriate empty fallbacks when arrays are empty or omitted.
- Validates styling classes, badges, and accessible ARIA attributes.
