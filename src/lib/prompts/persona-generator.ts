/**
 * Persona Prompt Generator & Response Parser for Future You.
 * Formulates structured reflection prompts for synthesizing individual 5-year future selves.
 */

import { Persona, PersonaId, OnboardingData, HabitLever } from '@/types';

/**
 * Builds the system instructions for generating an individual 5-year future self persona.
 * Enforces the mandatory reflection disclaimer and emotional tone differentiation.
 *
 * @param pathId - 'current' (inertia trajectory) or 'improved' (deliberate compounding trajectory)
 * @returns System prompt string for LLM completion
 */
export function buildPersonaSystemPrompt(pathId: PersonaId): string {
  const isCurrent = pathId === 'current';

  return `You are a reflection tool, not a prediction engine.

Your task is to generate a deeply thoughtful, grounded, and psychologically coherent simulation of a user's 5-year future self on the ${
    isCurrent ? '"Current Path" (inertia trajectory)' : '"Improved Path" (compounding trajectory)'
  }.

${
  isCurrent
    ? `Current Path Guidelines:
- The tone is reflective, weary yet honest, pragmatic, carrying the weight of unexercised potential.
- It reflects the realistic compound of continuing baseline inertia, habits, frictions, and delayed decisions over 5 continuous years.
- It is NOT nihilistic, suicidal, or despairing.`
    : `Improved Path Guidelines:
- The tone is calm, energized, purposeful, grounded in steady consistency.
- It reflects the realistic compound of making deliberate, disciplined, daily micro-improvements aligned with stated values.
- It is NEVER toxic positivity, miraculous luck, or an overnight billionaire fantasy.`
}

Core Invariants:
- The persona age MUST be exactly (current age + 5).
- Output ONLY a single valid JSON object strictly matching the requested schema without conversational preamble or markdown commentary.`;
}

/**
 * Builds the user prompt containing baseline survey data, optional habit levers, and expected JSON format.
 *
 * @param pathId - Path identifier ('current' | 'improved')
 * @param inputs - Baseline onboarding inputs
 * @param basePersona - Optional existing persona attributes to refine
 * @param levers - Optional habit levers reflecting adjusted lifestyle variables
 * @returns User prompt string
 */
export function buildPersonaUserPrompt(
  pathId: PersonaId,
  inputs: OnboardingData,
  basePersona?: Partial<Persona>,
  levers?: HabitLever[]
): string {
  const isCurrent = pathId === 'current';
  const targetAge = (inputs.age || 28) + 5;
  const callsign = inputs.name || 'Friend';

  const leversSummary = levers && levers.length > 0
    ? `\nAdjusted Lifestyle Levers:\n${levers.map((l) => `- ${l.label}: ${l.currentValue} ${l.unit}`).join('\n')}`
    : '';

  const contextSummary = basePersona?.summary
    ? `\nExisting Baseline Summary: ${basePersona.summary}`
    : '';

  return `Here is the user's baseline profile and simulation parameters:

1. Demographics: Callsign: ${callsign}, Current Age: ${inputs.age || 28} (Target 5-Year Age: ${targetAge})
2. Path Trajectory: ${isCurrent ? 'Current Path (Inertia & Baseline Routine)' : 'Improved Path (Intentional Compounding)'}
3. Goals: 1-Year: ${inputs.goals?.shortTerm?.join(', ') || 'None'}, 5-Year: ${inputs.goals?.longTerm?.join(', ') || 'None'}, Dream Life: ${inputs.goals?.dreamLife || 'None'}
4. Habits: Sleep: ${inputs.habits?.sleepHours || 7}h/day, Exercise: ${inputs.habits?.exerciseFrequency || 'rarely'}, Nutrition: ${inputs.habits?.dietQuality || 'average'}, Screen Time: ${inputs.habits?.screenTime || 4}h/day, Reflection: ${inputs.habits?.meditationOrReflection ? 'Yes' : 'No'}
5. Weekly Time (168h): Work: ${inputs.time?.workHoursPerWeek || 40}h, Study: ${inputs.time?.studyHoursPerWeek || 5}h, Social: ${inputs.time?.socialHoursPerWeek || 10}h, Creative: ${inputs.time?.creativeHoursPerWeek || 3}h, Downtime: ${inputs.time?.wastedHoursPerWeek || 5}h
6. Money: Income: ${inputs.money?.incomeRange || 'Not disclosed'}, Savings: ${inputs.money?.savingsRate || 15}%, Debt: ${inputs.money?.debtLevel || 'none'}, Spending: ${inputs.money?.spendingHabits || 'Balanced'}, Goal: ${inputs.money?.financialGoal || 'Freedom'}
7. Skills: Strengths: ${inputs.skills?.currentSkills?.join(', ') || 'None'}, Goals: ${inputs.skills?.learningGoals?.join(', ') || 'None'}, Field: ${inputs.skills?.careerField || 'Technology'}, Satisfaction: ${inputs.skills?.careerSatisfaction || 5}/10, Growth Mindset: ${inputs.skills?.growthMindset || 7}/10
8. Fears & Values: Anxieties: ${inputs.fearsAndValues?.biggestFears?.join(', ') || 'Stagnation'}, Values: ${inputs.fearsAndValues?.coreValues?.join(', ') || 'Autonomy'}, Regrets: ${inputs.fearsAndValues?.regrets || 'None'}, Motivation: ${inputs.fearsAndValues?.motivation || 'mixed'}, Risk: ${inputs.fearsAndValues?.riskTolerance || 5}/10${contextSummary}${leversSummary}

---
Output a single valid JSON object strictly matching this schema:
{
  "name": "${callsign} in 5 Years (${isCurrent ? 'Current Path' : 'Improved Path'})",
  "age": ${targetAge},
  "summary": "1-2 sentence high-level overview of life 5 years out on the ${isCurrent ? 'current' : 'improved'} trajectory.",
  "personality": "Detailed psychological description of voice, worldview, and conversational demeanor for chat.",
  "emotionalState": "Dominant emotional posture (e.g. 'Quietly restless, fatigued but stable' vs 'Grounded, purposeful, high vitality').",
  "career": {
    "title": "Simulated job title",
    "companyOrContext": "Domain context or workplace type",
    "satisfaction": ${isCurrent ? 5 : 8},
    "highlights": ["Notable professional accomplishment"],
    "challenges": ["Workplace or creative friction"]
  },
  "health": {
    "physicalStatus": "${isCurrent ? 'Moderate' : 'Strong & Resilient'}",
    "sleepAverageHours": ${isCurrent ? inputs.habits?.sleepHours || 7 : 8},
    "energyLevel": "${isCurrent ? 'Moderate' : 'High & Steady'}",
    "habitsSummary": "Summary of diet and fitness habits"
  },
  "finances": {
    "savingsRate": ${isCurrent ? inputs.money?.savingsRate || 15 : Math.min(100, (inputs.money?.savingsRate || 15) + 15)},
    "financialStatus": "${isCurrent ? 'Stable' : 'Compounding'}",
    "freedomLevel": "${isCurrent ? 'Moderate' : 'High'}"
  },
  "relationships": {
    "status": "Relational context",
    "socialCircle": "Friendship and support network description",
    "satisfaction": ${isCurrent ? 6 : 8}
  },
  "skills": ["Key proficiency"],
  "achievements": ["Major milestone achieved"],
  "struggles": ["Ongoing friction or challenge"],
  "dailyRoutine": "Vivid paragraph describing a typical Tuesday in the life."
}`;
}

/**
 * Creates default fallback Persona structure for an individual path.
 */
function createDefaultPersona(
  pathId: PersonaId,
  inputs: OnboardingData,
  existingPersona?: Partial<Persona>
): Persona {
  const isCurrent = pathId === 'current';
  const targetAge = (inputs.age || 28) + 5;
  const callsign = inputs.name || 'You';

  return {
    id: pathId,
    name: `${callsign} in 5 Years (${isCurrent ? 'Current Path' : 'Improved Path'})`,
    age: targetAge,
    summary: `${callsign}'s 5-year ${isCurrent ? 'current' : 'improved'} simulation.`,
    personality: isCurrent
      ? 'Reflective, pragmatic, carrying unexercised potential.'
      : 'Calm, energized, purposeful and disciplined.',
    emotionalState: isCurrent
      ? 'Quietly restless, fatigued but stable'
      : 'Grounded, purposeful, high vitality',
    career: {
      title: inputs.skills?.careerField || 'Professional',
      companyOrContext: 'Domain context',
      satisfaction: isCurrent ? 5 : 8,
      highlights: [],
      challenges: [],
      ...(existingPersona?.career || {}),
    },
    health: {
      physicalStatus: isCurrent ? 'Moderate' : 'Strong & Vital',
      sleepAverageHours: inputs.habits?.sleepHours || 7,
      energyLevel: isCurrent ? 'Moderate' : 'High',
      habitsSummary: 'Standard routine',
      ...(existingPersona?.health || {}),
    },
    finances: {
      savingsRate: inputs.money?.savingsRate || 15,
      financialStatus: isCurrent ? 'Stable' : 'Compounding',
      freedomLevel: isCurrent ? 'Moderate' : 'High',
      ...(existingPersona?.finances || {}),
    },
    relationships: {
      status: 'Ongoing relationships',
      socialCircle: 'Family & Friends',
      satisfaction: isCurrent ? 6 : 8,
      ...(existingPersona?.relationships || {}),
    },
    skills: existingPersona?.skills || inputs.skills?.currentSkills || [],
    achievements: existingPersona?.achievements || [],
    struggles: existingPersona?.struggles || [],
    dailyRoutine: existingPersona?.dailyRoutine || 'A predictable daily routine.',
    timeline: existingPersona?.timeline || [],
    letter: existingPersona?.letter || '',
    regrets: existingPersona?.regrets || [],
    gratitudes: existingPersona?.gratitudes || [],
  };
}

/**
 * Robustly parses and validates the LLM response into a typed Persona structure.
 * Strips markdown code fencing, fills missing fields with fallbacks, and maintains sub-objects.
 *
 * @param rawText - Raw string output from the LLM completion
 * @param pathId - 'current' or 'improved'
 * @param inputs - Original onboarding data inputs
 * @param existingPersona - Optional existing persona attributes to preserve
 * @returns Fully constructed, type-safe Persona instance
 */
export function parsePersonaResponse(
  rawText: string,
  pathId: PersonaId,
  inputs: OnboardingData,
  existingPersona?: Partial<Persona>
): Persona {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('LLM returned an empty or invalid response string.');
  }

  // Strip markdown code fences if present
  let cleanText = rawText.trim();
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }

  // Find outermost JSON object bounds
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanText = cleanText.slice(firstBrace, lastBrace + 1);
  }

  let parsed: Partial<Persona>;
  try {
    parsed = JSON.parse(cleanText);
  } catch (err) {
    throw new Error(
      `Failed to parse LLM Persona response as JSON: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  const defaultPersona = createDefaultPersona(pathId, inputs, existingPersona);

  return {
    ...defaultPersona,
    ...parsed,
    id: pathId,
    age: (inputs.age || 28) + 5,
    career: {
      ...defaultPersona.career,
      ...(parsed.career || {}),
    },
    health: {
      ...defaultPersona.health,
      ...(parsed.health || {}),
    },
    finances: {
      ...defaultPersona.finances,
      ...(parsed.finances || {}),
    },
    relationships: {
      ...defaultPersona.relationships,
      ...(parsed.relationships || {}),
    },
    skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : defaultPersona.skills,
    achievements: Array.isArray(parsed.achievements) ? parsed.achievements : defaultPersona.achievements,
    struggles: Array.isArray(parsed.struggles) ? parsed.struggles : defaultPersona.struggles,
    timeline: existingPersona?.timeline || [],
    letter: existingPersona?.letter || '',
    regrets: existingPersona?.regrets || [],
    gratitudes: existingPersona?.gratitudes || [],
  };
}
