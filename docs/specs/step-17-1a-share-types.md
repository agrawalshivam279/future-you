# Technical Specification: Step 17.1a — Shareable Card Type Definitions

## 1. Overview
Step 17.1a establishes the domain type definitions, export formats, privacy configurations, and theme styling schemas for **Phase 17: Shareable Result Card & V3 System Polish**.
The shareable result card is an exportable, high-resolution artifact summarizing the user's dual 5-year simulation, core habit vectors, and Future Self reflection note with client-side canvas/SVG rendering and strict privacy redaction controls.

---

## 2. File Layout & LOC Budget
- **Type Definitions**: `src/types/share.types.ts` ($\le 120$ LOC)
- **Barrel Export**: `src/types/index.ts`
- **Unit & Schema Tests**: `src/types/__tests__/share-types.test.ts` ($\le 100$ LOC)

---

## 3. Data Models Specification (`src/types/share.types.ts`)

```typescript
/**
 * Visual styling theme for the exportable share card.
 */
export type ShareCardTheme = 'midnight' | 'emerald' | 'amber' | 'monochrome';

/**
 * Image export serialization format.
 */
export type CardExportFormat = 'png' | 'svg';

/**
 * Aspect ratio presets for different sharing channels.
 */
export type CardAspectRatio = 'square' | 'portrait' | 'landscape';

/**
 * Which persona view to feature on the card.
 */
export type CardPersonaMode = 'split' | 'improved' | 'current';

/**
 * Privacy controls for masking sensitive or private personal reflections.
 */
export interface ShareCardPrivacyConfig {
  /** Mask exact financial savings/income numbers with asterisks or qualitative tags */
  maskFinances: boolean;
  /** Mask private anxieties and fear descriptions */
  maskAnxieties: boolean;
  /** Include quote excerpt from the 5-year Future Self letter */
  includeLetterQuote: boolean;
  /** Include composite check-in alignment score badge if available */
  includeAlignmentScore: boolean;
  /** Include key habit lever comparisons */
  includeHabits: boolean;
}

/**
 * Complete user configuration for card rendering and export.
 */
export interface ShareCardConfig {
  /** Visual color theme */
  theme: ShareCardTheme;
  /** Export image format */
  format: CardExportFormat;
  /** Aspect ratio preset */
  aspectRatio: CardAspectRatio;
  /** Displayed persona view mode */
  personaMode: CardPersonaMode;
  /** Active privacy masking settings */
  privacy: ShareCardPrivacyConfig;
}

/**
 * Snapshot of data extracted from stores to render the card.
 */
export interface ShareCardData {
  primaryGoal: string;
  improvedHeadline: string;
  improvedQuote?: string;
  currentHeadline?: string;
  alignmentScore?: number;
  habits: Array<{
    label: string;
    baseline: string | number;
    target: string | number;
    isFinancial?: boolean;
  }>;
  anxieties?: string[];
  generatedAt: string;
}
```

---

## 4. Privacy & Ethical Invariants
- **Zero Cloud Storage**: All share card configurations and exports happen client-side in the browser.
- **Client-Side Redaction**: Privacy masks alter data before rendering to HTML5 Canvas or SVG serialization.
- **Honesty Disclaimer**: Every exported card must feature the brand signature: *"Future You · A reflection tool, not a prediction engine"*.
- **LOC Limit**: Maximum 300 LOC per file.
