/**
 * Type definitions for Version 3: Shareable Result Card.
 * Defines configuration, export formats, privacy masking, and card render data.
 */

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
 * - square: 1:1 (1080x1080) for Instagram posts / general feeds
 * - portrait: 4:5 or 9:16 (1080x1350) for mobile stories
 * - landscape: 16:9 (1200x675) for Twitter / LinkedIn
 */
export type CardAspectRatio = 'square' | 'portrait' | 'landscape';

/**
 * Which persona view to feature on the exportable card.
 * - split: Side-by-side contrast of Current vs Improved Path
 * - improved: Hero focus on the 5-year Improved Path
 * - current: Honest baseline focus on the 5-year Current Path
 */
export type CardPersonaMode = 'split' | 'improved' | 'current';

/**
 * Privacy controls for masking sensitive or private personal reflections before card export.
 */
export interface ShareCardPrivacyConfig {
  /** Mask exact financial savings/income numbers with asterisks */
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
 * Structured habit data row prepared for card display.
 */
export interface ShareCardHabitItem {
  /** Human-readable habit label (e.g., "Nightly Sleep") */
  label: string;
  /** Baseline value from onboarding */
  baseline: string | number;
  /** Compounding target value from Improved Path */
  target: string | number;
  /** Flag indicating if the value represents financial data subject to masking */
  isFinancial?: boolean;
}

/**
 * Snapshot of data extracted from stores to render the card.
 */
export interface ShareCardData {
  /** User's primary stated goal or north star */
  primaryGoal: string;
  /** Improved Path persona headline */
  improvedHeadline: string;
  /** Improved Path inspiring quote excerpt */
  improvedQuote?: string;
  /** Current Path persona headline */
  currentHeadline?: string;
  /** Check-in alignment score percentage (0-100) if recorded */
  alignmentScore?: number;
  /** Key habit comparisons */
  habits: ShareCardHabitItem[];
  /** Private anxieties or friction points */
  anxieties?: string[];
  /** ISO timestamp when the card was generated */
  generatedAt: string;
}

/**
 * Default privacy settings prioritizing user data protection.
 */
export const DEFAULT_SHARE_PRIVACY: ShareCardPrivacyConfig = {
  maskFinances: true,
  maskAnxieties: true,
  includeLetterQuote: true,
  includeAlignmentScore: true,
  includeHabits: true,
};

/**
 * Default card generation configuration.
 */
export const DEFAULT_SHARE_CONFIG: ShareCardConfig = {
  theme: 'midnight',
  format: 'png',
  aspectRatio: 'square',
  personaMode: 'split',
  privacy: DEFAULT_SHARE_PRIVACY,
};

/**
 * Pixel dimensions associated with each aspect ratio preset.
 */
export const CARD_DIMENSIONS: Record<CardAspectRatio, { width: number; height: number }> = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1200, height: 675 },
};
