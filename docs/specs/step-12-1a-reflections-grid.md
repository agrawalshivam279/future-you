# 📄 Technical Specification: Regrets & Gratitudes Reflection Grid Component

> **Step ID**: `Step 12.1a`  
> **Target Module**: `src/components/reflections/reflection-item-card.tsx`, `src/components/reflections/reflections-grid.tsx`, `src/components/reflections/index.ts`  
> **Git Feature Branch**: `feat/step-12-1a-reflections-grid`  
> **Status**: 📋 Ready for Implementation  
> **Created**: 2026-10-04  

---

## 1. Executive Summary

Step 12.1a implements the visual, psychological reflection components for Future You (Phase 12). It provides a structured two-column layout contrasting what each future self looks back on with **Regret** (delayed action, missed opportunities, friction) against what they look back on with **Gratitude** (discipline, habits, compounded consistency). Features include staggered reveal animations via Framer Motion, accessible expandable reflection cards (`ReflectionItemCard`), and persona trajectory theming (`improved` emerald vs `current` amber).

---

## 2. Dependencies & Prerequisites

- **Depends on**:
  - `src/components/ui/card.tsx` (Card container primitive)
  - `src/types/persona.types.ts` (`Persona`, `PersonaId`)
  - `src/lib/constants.ts` (`HONESTY_DISCLAIMER`)
- **Blocked by**: None (Phase 11 completed)
- **New Packages / Libraries**: None

---

## 3. 🔒 Privacy, Storage & Disclaimer Impact

- [x] **Zero Cloud Storage**: Reads directly from memory/props. No external storage or analytics.
- [x] **Honesty Disclaimer**: Reflections container footer embeds the mandatory reflection disclaimer: *"You are a reflection tool, not a prediction engine."*
- [x] **Accessibility**: All interactive cards are keyboard expandable with `aria-expanded` attributes, meeting WCAG AA contrast ($\ge 4.5:1$).

---

## 4. Component Contracts

### 4.1 ReflectionItemCard (`src/components/reflections/reflection-item-card.tsx`)

```typescript
export interface ReflectionItemCardProps {
  /** Reflection text */
  text: string;
  /** Reflection type: 'regret' (amber/rose) or 'gratitude' (emerald) */
  type: 'regret' | 'gratitude';
  /** Zero-based index for animation delay */
  index?: number;
  /** Optional custom styling classes */
  className?: string;
}
```

### 4.2 ReflectionsGrid (`src/components/reflections/reflections-grid.tsx`)

```typescript
export interface ReflectionsGridProps {
  /** Regrets array for the persona */
  regrets: string[];
  /** Gratitudes array for the persona */
  gratitudes: string[];
  /** Trajectory identifier for styling accents */
  personaId?: 'current' | 'improved';
  /** Persona display name */
  personaName?: string;
  /** Optional custom styling classes */
  className?: string;
}
```

---

## 5. Step-by-Step Implementation Sequence

1. **Phase A: Reflection Item Card Component**
   - Create `src/components/reflections/reflection-item-card.tsx`.
   - Implement expandable card with icon indicator (`AlertCircle` for regrets, `Heart` / `Sparkles` for gratitudes).
   - Add Framer Motion staggered entrance animation and accessible `aria-expanded`.
2. **Phase B: Reflections Grid Container Component**
   - Create `src/components/reflections/reflections-grid.tsx`.
   - Build responsive 2-column layout on desktop (Regrets on left, Gratitudes on right), stacking on mobile.
   - Include section header, count badges, and empty-state fallbacks.
   - Create barrel export in `src/components/reflections/index.ts`.
3. **Phase C: Tests & Verification**
   - Author component tests for `ReflectionItemCard` in `src/components/reflections/__tests__/reflection-item-card.test.tsx`.
   - Author component tests for `ReflectionsGrid` in `src/components/reflections/__tests__/reflections-grid.test.tsx`.

---

## 6. Verification & Acceptance Criteria

### Automated Tests
```bash
npm test -- src/components/reflections/__tests__/reflection-item-card.test.tsx src/components/reflections/__tests__/reflections-grid.test.tsx
```

### Acceptance Checklist
- [ ] Two-column layout renders cleanly (regrets left, gratitudes right).
- [ ] Cards expand on click/Enter to show full reflection context.
- [ ] Staggered animations execute smoothly ($\le 300$ms).
- [ ] Mandatory reflection disclaimer visible.
- [ ] All interactive elements reachable via Tab key with `aria-label`.
- [ ] Max file length $\le 300$ lines.
