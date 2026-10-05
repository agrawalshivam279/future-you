# Technical Specification: Step 17.1b — Shareable Card Visual Preview Component

## 1. Overview
Step 17.1b implements the core visual card component `ShareableCard` in `src/components/share/shareable-card.tsx`.
This component renders an elegant, high-contrast, themeable preview of the user's simulation. It serves as both the live on-screen preview inside the upcoming `ShareModal` and the DOM target for pure client-side image/SVG export.

---

## 2. File Layout & LOC Budget
- **Component**: `src/components/share/shareable-card.tsx` ($\le 280$ LOC)
- **Barrel Export**: `src/components/share/index.ts` ($\le 20$ LOC)
- **Unit Tests**: `src/components/share/__tests__/shareable-card.test.tsx` ($\le 200$ LOC)

---

## 3. Component Specification & Props Interface

```typescript
export interface ShareableCardProps {
  /** Snapshot of simulation, alignment, and habit data */
  data: ShareCardData;
  /** Rendering configuration including theme, aspect, and privacy masks */
  config: ShareCardConfig;
  /** Optional container CSS class */
  className?: string;
  /** Ref forwarded for client-side canvas/SVG serialization */
  cardRef?: React.Ref<HTMLDivElement>;
}
```

---

## 4. Theme & Layout Tokens
- **Midnight**: Dark zinc/obsidian background (`bg-zinc-950 border-zinc-800 text-zinc-100`) with emerald & amber contrast accents.
- **Emerald**: Deep forest/emerald glow (`bg-emerald-950/90 border-emerald-700/60 text-emerald-50`) celebrating compounding growth.
- **Amber**: Warm dark amber/stone (`bg-amber-950/80 border-amber-700/60 text-amber-50`) grounding status-quo realities.
- **Monochrome**: High-contrast black & white minimalist aesthetic (`bg-black border-zinc-700 text-white`).

---

## 5. Architectural & Privacy Invariants
- **Named Function Declaration**: Export `function ShareableCard(...)`.
- **Client-Side Redaction**:
  - Masking financial values as `••••••` when `config.privacy.maskFinances` is active.
  - Omitting anxieties, letter quotes, or alignment badges according to privacy flags.
- **Mandatory Reflection Disclaimer**: Card footer must prominently feature:
  `"Future You · A reflection tool, not a prediction engine"`
- **Accessibility**: Container has `role="region"` and `aria-label="Shareable Result Card Preview"`.
- **LOC Limit**: Strictly $\le 300$ lines.
