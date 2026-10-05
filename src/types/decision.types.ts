/**
 * Core type definitions for the Decision Simulator ("What If?" Fork Engine).
 * Allows users to simulate and project pivotal life choices against their Life Model.
 */

export type DecisionDomain =
  | 'career'
  | 'finances'
  | 'health'
  | 'relationships'
  | 'lifestyle';

export type TimeHorizon = 'immediate' | '6months' | '1year';

/**
 * User-defined or preset decision scenario.
 */
export interface DecisionScenario {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  primaryDomain: DecisionDomain;
  timeHorizon: TimeHorizon;
}

/**
 * Score delta (-10 to +10) across key life dimensions resulting from the decision.
 */
export interface DomainDelta {
  domain: DecisionDomain;
  label: string;
  delta: number;
  reasoning: string;
}

/**
 * Multi-horizon milestone projection (Years 1, 3, and 5) following the decision.
 */
export interface HorizonProjection {
  year: 1 | 3 | 5;
  phaseTitle: string;
  summary: string;
  keyChallenge: string;
  keyAdvantage: string;
}

/**
 * Distinct first-person verdicts from Current and Improved path future selves.
 */
export interface DecisionPersonaReactions {
  currentPathVerdict: string;
  improvedPathVerdict: string;
}

/**
 * Comprehensive AI evaluation of a decision scenario.
 */
export interface DecisionEvaluation {
  scenarioId: string;
  evaluatedAt: string;
  projections: HorizonProjection[];
  domainDeltas: DomainDelta[];
  personaReactions: DecisionPersonaReactions;
  tradeOffs: string[];
  unforeseenRisks: string[];
}

/**
 * Curated scenario template for instant exploration.
 */
export interface DecisionPreset {
  id: string;
  title: string;
  description: string;
  primaryDomain: DecisionDomain;
  timeHorizon: TimeHorizon;
}
