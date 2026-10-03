/**
 * Timeline and milestone types for Future You.
 */

export type MilestoneYear = 1 | 3 | 5;

export type MilestoneMood = 'positive' | 'neutral' | 'negative';

/**
 * Represents a simulated milestone along a 5-year timeline.
 */
export interface TimelineMilestone {
  /** The year horizon for this milestone (1, 3, or 5 years out) */
  year: MilestoneYear;
  /** Short punchy headline for the milestone */
  title: string;
  /** Detailed 2-3 sentence narrative describing the milestone event */
  description: string;
  /** Affective tone or mood of the milestone */
  mood: MilestoneMood;
  /** Optional domain-specific metrics or indicators */
  metrics?: Record<string, string | number>;
}
