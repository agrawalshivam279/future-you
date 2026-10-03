/**
 * Timeline milestone prompt generator and resilient response parser for Future You.
 * Generates chronological milestones across Year 1, Year 3, and Year 5 for both trajectories.
 */

import { TimelineMilestone, MilestoneYear, MilestoneMood } from '../../types/timeline.types';
import { OnboardingData } from '../../types/onboarding.types';
import { PersonaId } from '../../types/persona.types';

/**
 * Result structure when generating both timelines concurrently.
 */
export interface TimelineGenerationResult {
  currentTimeline: TimelineMilestone[];
  improvedTimeline: TimelineMilestone[];
}

/**
 * Generates the system prompt for the Timeline AI milestone generation.
 * Enforces strict JSON formatting, chronological consistency, and reflection disclaimer.
 */
export function buildTimelineSystemPrompt(): string {
  return `You are an introspective narrative architect for "Future You", an application that simulates two 5-year future trajectories.

CRITICAL INVARIANT: You are a reflection tool, not a prediction engine. Frame all milestones as plausible exploratory projections based on compounding habits and human inertia, NEVER absolute certainties.

Your task is to generate chronological milestone markers for both the Current Path (status-quo inertia) and Improved Path (compounding positive habits) at Year 1, Year 3, and Year 5.

For each milestone:
1. "year": Must be strictly 1, 3, or 5.
2. "title": Short, punchy, narrative headline (3-7 words).
3. "description": 2-3 vivid sentences detailing the concrete situation, daily life reality, and emotional weight.
4. "mood": Exactly one of "positive", "neutral", or "negative".
5. "metrics": Key domain metrics reflecting the moment (e.g. {"savingsRate": "15%", "careerSatisfaction": 5, "energyLevel": "Moderate"}).

Tone Guidance:
- Current Path: Realistic compounding of present friction, procrastination, and fatigue. Gradual drift rather than catastrophic ruin. Honest, unvarnished, but never despairing.
- Improved Path: Grounded compounding of small, disciplined daily actions. Real victories accompanied by natural ongoing challenges. Never toxic positivity or overnight fairy-tale wealth.

Output MUST be strictly valid JSON conforming to the requested schema without markdown commentary or preamble.`;
}

/**
 * Generates the user prompt requesting dual timeline milestones for both paths.
 */
export function buildTimelineUserPrompt(
  inputs?: Partial<OnboardingData>,
  currentSummary?: string,
  improvedSummary?: string
): string {
  const name = inputs?.name?.trim() || 'User';
  const age = inputs?.age || 28;
  const career = inputs?.skills?.careerField || 'General Career';
  const goals =
    inputs?.goals?.longTerm?.join(', ') ||
    inputs?.goals?.dreamLife ||
    inputs?.goals?.shortTerm?.join(', ') ||
    'Personal Growth';

  return `Generate dual 5-year timeline milestones (Year 1, Year 3, and Year 5) for ${name} (currently age ${age}).

Context:
- Current Domain: ${career}
- Key Aspiration / Goal: ${goals}
${currentSummary ? `- Current Path Persona Context: ${currentSummary}` : ''}
${improvedSummary ? `- Improved Path Persona Context: ${improvedSummary}` : ''}

Respond with a single JSON object matching this schema:
{
  "currentTimeline": [
    { "year": 1, "title": "Headline", "description": "2-3 sentences.", "mood": "neutral", "metrics": { "careerSatisfaction": 5 } },
    { "year": 3, "title": "Headline", "description": "2-3 sentences.", "mood": "negative", "metrics": { "careerSatisfaction": 4 } },
    { "year": 5, "title": "Headline", "description": "2-3 sentences.", "mood": "negative", "metrics": { "careerSatisfaction": 4 } }
  ],
  "improvedTimeline": [
    { "year": 1, "title": "Headline", "description": "2-3 sentences.", "mood": "positive", "metrics": { "careerSatisfaction": 7 } },
    { "year": 3, "title": "Headline", "description": "2-3 sentences.", "mood": "positive", "metrics": { "careerSatisfaction": 8 } },
    { "year": 5, "title": "Headline", "description": "2-3 sentences.", "mood": "positive", "metrics": { "careerSatisfaction": 9 } }
  ]
}`;
}

/**
 * Generates a prompt for a single timeline path (useful for habit lever updates).
 */
export function buildSinglePathTimelineUserPrompt(
  path: PersonaId,
  inputs?: Partial<OnboardingData>,
  personaSummary?: string
): string {
  const name = inputs?.name?.trim() || 'User';
  const age = inputs?.age || 28;
  const isCurrent = path === 'current';

  return `Generate 3 timeline milestones (Year 1, Year 3, and Year 5) for ${name}'s ${isCurrent ? 'Current Path' : 'Improved Path'} (Age ${age} to ${age + 5}).
${personaSummary ? `Persona Context: ${personaSummary}` : ''}

Respond with a JSON object containing a "timeline" array with 3 milestone objects (years 1, 3, 5):
{
  "timeline": [
    { "year": 1, "title": "...", "description": "...", "mood": "${isCurrent ? 'neutral' : 'positive'}", "metrics": {} },
    { "year": 3, "title": "...", "description": "...", "mood": "${isCurrent ? 'negative' : 'positive'}", "metrics": {} },
    { "year": 5, "title": "...", "description": "...", "mood": "${isCurrent ? 'negative' : 'positive'}", "metrics": {} }
  ]
}`;
}

/**
 * Sanitizes and extracts JSON substring from text.
 */
function extractJsonString(rawText: string): string {
  let cleaned = rawText.trim();
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = jsonBlockRegex.exec(cleaned);
  if (match && match[1]) {
    cleaned = match[1].trim();
  }

  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');

  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    const lastBracket = cleaned.lastIndexOf(']');
    if (lastBracket > firstBracket) return cleaned.slice(firstBracket, lastBracket + 1);
  }

  if (firstBrace !== -1) {
    const lastBrace = cleaned.lastIndexOf('}');
    if (lastBrace > firstBrace) return cleaned.slice(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

/**
 * Normalizes mood string to valid MilestoneMood.
 */
function normalizeMood(val: unknown, fallback: MilestoneMood): MilestoneMood {
  if (typeof val !== 'string') return fallback;
  const lower = val.toLowerCase().trim();
  if (['positive', 'good', 'optimistic', 'great', 'high'].includes(lower)) return 'positive';
  if (['negative', 'bad', 'pessimistic', 'low', 'difficult', 'struggling'].includes(lower)) return 'negative';
  return 'neutral';
}

/**
 * Normalizes year value to valid MilestoneYear.
 */
function normalizeYear(val: unknown, fallback: MilestoneYear): MilestoneYear {
  const num = typeof val === 'number' ? val : parseInt(String(val), 10);
  return num === 1 || num === 3 || num === 5 ? num : fallback;
}

/**
 * Creates default fallback milestones for a persona path.
 */
function createDefaultMilestones(path: PersonaId, inputs?: Partial<OnboardingData>): TimelineMilestone[] {
  const isCurrent = path === 'current';
  const field = inputs?.skills?.careerField || 'your chosen field';

  return [
    {
      year: 1,
      title: isCurrent ? 'The Familiar Friction' : 'The First Compounding Sparks',
      description: isCurrent
        ? `One year in, routine holds sway in ${field}. Good intentions are frequently deferred to the following week.`
        : `Small, consistent daily changes in ${field} begin yielding visible traction and renewed morning energy.`,
      mood: isCurrent ? 'neutral' : 'positive',
      metrics: { satisfaction: isCurrent ? 5 : 7 },
    },
    {
      year: 3,
      title: isCurrent ? 'Comfort Zone Drift' : 'Autonomous Momentum',
      description: isCurrent
        ? 'Three years pass quickly. Stagnation sets in comfortably, though a quiet internal restlessness lingers.'
        : 'Discipline has turned into effortless identity. Major milestones are reached with quiet confidence.',
      mood: isCurrent ? 'negative' : 'positive',
      metrics: { satisfaction: isCurrent ? 4 : 8 },
    },
    {
      year: 5,
      title: isCurrent ? 'The Cost of Inaction' : 'The Compounded Life',
      description: isCurrent
        ? 'Half a decade of deferred decisions culminates in stable but unfulfilled potential.'
        : 'Five years of disciplined compounding result in high vitality, deep mastery, and genuine autonomy.',
      mood: isCurrent ? 'negative' : 'positive',
      metrics: { satisfaction: isCurrent ? 4 : 9 },
    },
  ];
}

/**
 * Normalizes a list of milestones ensuring years 1, 3, and 5 exist.
 */
function normalizeMilestoneList(
  rawList: unknown,
  path: PersonaId,
  inputs?: Partial<OnboardingData>
): TimelineMilestone[] {
  if (!Array.isArray(rawList) || rawList.length === 0) {
    return createDefaultMilestones(path, inputs);
  }

  const expectedYears: MilestoneYear[] = [1, 3, 5];
  const defaults = createDefaultMilestones(path, inputs);

  return expectedYears.map((targetYear, idx) => {
    const found = rawList.find(
      (item) => typeof item === 'object' && item !== null && normalizeYear(item.year, targetYear) === targetYear
    );

    if (found && typeof found === 'object') {
      return {
        year: targetYear,
        title: typeof found.title === 'string' && found.title.trim() ? found.title.trim() : defaults[idx].title,
        description:
          typeof found.description === 'string' && found.description.trim()
            ? found.description.trim()
            : defaults[idx].description,
        mood: normalizeMood(found.mood, defaults[idx].mood),
        metrics: typeof found.metrics === 'object' && found.metrics !== null ? found.metrics : defaults[idx].metrics,
      };
    }

    return defaults[idx];
  });
}

/**
 * Robustly parses and validates raw completion text into dual timeline milestone lists.
 */
export function parseTimelineResponse(
  rawText: string,
  inputs?: Partial<OnboardingData>
): TimelineGenerationResult {
  try {
    const jsonStr = extractJsonString(rawText);
    const parsed = JSON.parse(jsonStr);

    return {
      currentTimeline: normalizeMilestoneList(parsed.currentTimeline || parsed.current, 'current', inputs),
      improvedTimeline: normalizeMilestoneList(parsed.improvedTimeline || parsed.improved, 'improved', inputs),
    };
  } catch {
    return {
      currentTimeline: createDefaultMilestones('current', inputs),
      improvedTimeline: createDefaultMilestones('improved', inputs),
    };
  }
}

/**
 * Parses a single path timeline response.
 */
export function parseSinglePathTimelineResponse(
  rawText: string,
  path: PersonaId,
  inputs?: Partial<OnboardingData>
): TimelineMilestone[] {
  try {
    const jsonStr = extractJsonString(rawText);
    const parsed = JSON.parse(jsonStr);
    const list = parsed.timeline || parsed.milestones || parsed;
    return normalizeMilestoneList(list, path, inputs);
  } catch {
    return createDefaultMilestones(path, inputs);
  }
}
