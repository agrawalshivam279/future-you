/**
 * Regret and gratitude prompt generator and resilient response parser for Future You.
 * Extracts structured reflections for both Current and Improved future personas.
 */

import { PersonaId } from '../../types/persona.types';
import { OnboardingData } from '../../types/onboarding.types';

/**
 * Result structure containing categorized lists of regrets and gratitudes.
 */
export interface RegretGratitudeResult {
  regrets: string[];
  gratitudes: string[];
}

/**
 * Builds the system prompt for generating regrets and gratitudes from the future self.
 * Enforces reflection disclaimer, emotional authenticity, and strict JSON formatting.
 */
export function buildRegretGratitudeSystemPrompt(path: PersonaId): string {
  const isCurrent = path === 'current';

  return `You are an introspective psychologist for "Future You", an application that simulates two 5-year future trajectories.

CRITICAL INVARIANT: You are a reflection tool, not a prediction engine. Frame all reflections as exploratory insights into compounding habits and psychological friction, NEVER absolute certainties.

Task: Generate a concise, emotionally authentic list of specific regrets and gratitudes looking back from 5 years in the future.

Tone & Focus (${isCurrent ? 'Current Path' : 'Improved Path'}):
${
  isCurrent
    ? `- Focus primarily on 3 to 4 specific, poignant REGRETS born of procrastination, excessive screen time, and delayed action.
- Include 1 to 2 small, honest GRATITUDES for things the user managed to preserve (e.g., maintaining health baselines, loyal friends).
- Regrets should feel concrete and personal (e.g., "Waiting for the 'perfect weekend' to start writing"), not generic clichés.`
    : `- Focus primarily on 3 to 4 deep, heartfelt GRATITUDES toward the younger self for showing up, building discipline, and choosing sleep over doomscrolling.
- Include 1 to 2 honest REGRETS or bittersweet reflections (e.g., "Being overly perfectionist during Year 2", "Not taking more spontaneous rest").
- Gratitudes must highlight unglamorous daily choices that compounded into freedom.`
}

Output MUST be a single valid JSON object strictly matching this schema:
{
  "regrets": [
    "Specific 1-2 sentence regret looking back.",
    "Another concrete regret."
  ],
  "gratitudes": [
    "Specific 1-2 sentence expression of gratitude to younger self.",
    "Another concrete gratitude."
  ]
}`;
}

/**
 * Builds the user prompt supplying onboarding context and persona details.
 */
export function buildRegretGratitudeUserPrompt(
  path: PersonaId,
  inputs?: Partial<OnboardingData>,
  personaContext?: string
): string {
  const name = inputs?.name?.trim() || 'User';
  const age = inputs?.age || 28;
  const isCurrent = path === 'current';
  const field = inputs?.skills?.careerField || 'Technology & Creative';
  const goals =
    inputs?.goals?.longTerm?.join(', ') ||
    inputs?.goals?.dreamLife ||
    inputs?.goals?.shortTerm?.join(', ') ||
    'Personal Mastery';
  const fears = inputs?.fearsAndValues?.biggestFears?.join(', ') || 'Wasted potential';

  return `Generate specific regrets and gratitudes from ${name} at age ${age + 5} looking back at age ${age} along the ${
    isCurrent ? 'Current Path' : 'Improved Path'
  }.

Context:
- Professional Domain: ${field}
- Long-term Vision: ${goals}
- Primary Anxieties: ${fears}
${personaContext ? `- Persona Context: ${personaContext}` : ''}

Respond with ONLY the JSON object containing "regrets" and "gratitudes" string arrays.`;
}

/**
 * Extracts and cleans JSON substring from completion text.
 */
function extractJsonString(rawText: string): string {
  let cleaned = rawText.trim();
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = jsonBlockRegex.exec(cleaned);
  if (match && match[1]) {
    cleaned = match[1].trim();
  }

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

/**
 * Creates default fallback reflections based on path.
 */
function createDefaultReflections(path: PersonaId, inputs?: Partial<OnboardingData>): RegretGratitudeResult {
  const isCurrent = path === 'current';
  const field = inputs?.skills?.careerField || 'your craft';

  if (isCurrent) {
    return {
      regrets: [
        `I regret waiting three years for the 'right time' to push my ambitions in ${field}.`,
        'I regret trading hundreds of precious evening hours for mindless digital stimulation.',
        'I regret letting quiet self-doubt masquerade as rational patience.',
      ],
      gratitudes: [
        'Thank you for at least keeping basic financial stability intact through the drift.',
        'Thank you for preserving the loyal relationships that continue to anchor me.',
      ],
    };
  }

  return {
    regrets: [
      'I regret being occasionally too hard on myself when habits slipped in Year 1.',
      'I regret not making more time for spontaneous, unplanned rest along the journey.',
    ],
    gratitudes: [
      `Thank you for protecting our morning hours and investing deeply in ${field}.`,
      'Thank you for putting your phone away at night so our mind could genuinely recover.',
      'Thank you for refusing to quit when progress felt imperceptible in the early months.',
    ],
  };
}

/**
 * Robustly parses and validates completion text into typed regrets and gratitudes.
 */
export function parseRegretGratitudeResponse(
  rawText: string,
  path: PersonaId,
  inputs?: Partial<OnboardingData>,
  throwOnError: boolean = false
): RegretGratitudeResult {
  const defaults = createDefaultReflections(path, inputs);

  try {
    const jsonStr = extractJsonString(rawText);
    const parsed = JSON.parse(jsonStr);

    const regrets = Array.isArray(parsed.regrets) && parsed.regrets.length > 0
      ? parsed.regrets
          .filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0)
          .map((item: string) => item.trim())
      : defaults.regrets;

    const gratitudes = Array.isArray(parsed.gratitudes) && parsed.gratitudes.length > 0
      ? parsed.gratitudes
          .filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0)
          .map((item: string) => item.trim())
      : defaults.gratitudes;

    return {
      regrets: regrets.length > 0 ? regrets : defaults.regrets,
      gratitudes: gratitudes.length > 0 ? gratitudes : defaults.gratitudes,
    };
  } catch (err) {
    if (throwOnError) {
      throw new Error(
        `Failed to parse LLM RegretGratitude response as JSON: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
    return defaults;
  }
}
