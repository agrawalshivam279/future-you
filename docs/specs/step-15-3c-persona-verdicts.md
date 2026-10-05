# Technical Specification: Step 15.3c — Persona Verdicts Component (`persona-verdicts.tsx`)

## 1. Overview
Step 15.3c delivers the **Persona Verdicts** component for the Decision Simulator. It renders contrasting, first-person commentary from both simulated future personas (Current Path vs. Improved Path) in response to a user-submitted life choice. This provides users with direct, qualitative feedback highlighting the psychological trade-offs between comfortable inertia and disciplined compounding.

---

## 2. File Layout & LOC Budget
- **Component**: `src/components/simulator/persona-verdicts.tsx` ($\le 180$ LOC)
- **Barrel Export**: Export from `src/components/simulator/index.ts`
- **Component Tests**: `src/components/simulator/__tests__/persona-verdicts.test.tsx` ($\le 160$ LOC)

---

## 3. Component Specification & Props Interface

```typescript
export interface PersonaVerdictsProps {
  /** Dual persona reactions from the AI decision evaluation */
  reactions: DecisionPersonaReactions;
  /** Optional custom CSS classes for the container */
  className?: string;
}
```

### Visual Sub-sections:
1. **Section Heading**: "Future Selves' Perspectives", clarifying that both personas offer distinct lenses on the same choice.
2. **Current Path Reaction Card (Amber Theme)**:
   - Accent styling: `border-accent-current/30`, `bg-accent-current/5`.
   - Title: "Current Path Perspective".
   - Subtitle: "Status Quo & Risk Preservation".
   - Quote block rendering `reactions.currentPathVerdict` with an amber quotation icon.
3. **Improved Path Reaction Card (Emerald Theme)**:
   - Accent styling: `border-accent-improved/30`, `bg-accent-improved/5`.
   - Title: "Improved Path Perspective".
   - Subtitle: "Compounding Agency & Calculated Risk".
   - Quote block rendering `reactions.improvedPathVerdict` with an emerald quotation icon.

---

## 4. Accessibility & Styling Invariants
1. **Side-by-Side to Stack Transformation**: Renders 2 equal columns on desktop (`grid-cols-1 md:grid-cols-2`), stacking cleanly on screens $< 768$px.
2. **WCAG AA Compliance**: Meets contrast requirements ($\ge 4.5:1$).
3. **Semantic ARIA**: Meaningful `aria-label` attributes on both persona cards.
4. **Code Quality**: `function` declaration syntax, typed props, strictly $\le 300$ LOC.

---

## 5. Testing Strategy
- Renders both Current and Improved Path verdict cards.
- Displays the exact first-person text supplied in `reactions`.
- Validates amber/emerald persona color accents and semantic badges.
- Handles empty or fallback text gracefully without crashing.
