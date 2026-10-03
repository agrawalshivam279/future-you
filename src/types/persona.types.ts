/**
 * Persona trajectory models for Future You.
 */

import { TimelineMilestone } from './timeline.types';

export type PersonaId = 'current' | 'improved';

/**
 * Career and professional trajectory for a persona.
 */
export interface PersonaCareer {
  /** Simulated job title or professional role */
  title: string;
  /** Work environment or company context */
  companyOrContext: string;
  /** Career satisfaction score (1-10) */
  satisfaction: number;
  /** Key professional milestones and achievements */
  highlights: string[];
  /** Ongoing workplace or creative frictions */
  challenges: string[];
}

/**
 * Health and vitality trajectory for a persona.
 */
export interface PersonaHealth {
  /** Qualitative description of physical health */
  physicalStatus: string;
  /** Average sleep duration in hours */
  sleepAverageHours: number;
  /** Subjective daily energy level description */
  energyLevel: string;
  /** Summary of diet and fitness habits */
  habitsSummary: string;
}

/**
 * Financial stability and capital trajectory for a persona.
 */
export interface PersonaFinances {
  /** Monthly savings rate percentage */
  savingsRate: number;
  /** Qualitative financial status (debt, investments, comfort) */
  financialStatus: string;
  /** Subjective sense of financial autonomy */
  freedomLevel: string;
}

/**
 * Relational and social trajectory for a persona.
 */
export interface PersonaRelationships {
  /** Status of primary personal relationships */
  status: string;
  /** Depth and health of friendship network */
  socialCircle: string;
  /** Relational satisfaction score (1-10) */
  satisfaction: number;
}

/**
 * Complete simulated future self persona representation (5 years out).
 */
export interface Persona {
  /** Path identifier: current status-quo vs improved intentional habits */
  id: PersonaId;
  /** Persona display name (e.g. 'You in 2031 — Current Path') */
  name: string;
  /** Age of persona (current age + 5) */
  age: number;
  /** High-level executive summary of this future existence */
  summary: string;
  /** Psychological grounding and voice tone description for chat */
  personality: string;
  /** Dominant emotional state and worldview */
  emotionalState: string;
  /** Professional domain breakdown */
  career: PersonaCareer;
  /** Physical and mental wellness breakdown */
  health: PersonaHealth;
  /** Capital and wealth breakdown */
  finances: PersonaFinances;
  /** Interpersonal connections breakdown */
  relationships: PersonaRelationships;
  /** Proficiencies mastered or stagnant */
  skills: string[];
  /** Notable accomplishments over the 5 years */
  achievements: string[];
  /** Ongoing regrets, stumbling blocks, or battles */
  struggles: string[];
  /** A day in the life narrative */
  dailyRoutine: string;
  /** Chronological milestones (Years 1, 3, 5) */
  timeline: TimelineMilestone[];
  /** Full introspective letter addressed to the present-day user */
  letter: string;
  /** What this persona looks back on with regret */
  regrets: string[];
  /** What this persona thanks the present-day user for */
  gratitudes: string[];
}
