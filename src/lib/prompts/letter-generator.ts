/**
 * Future self letter prompt generator for Future You.
 * Synthesizes a deeply personal, evocative letter from 5 years in the future to the present self.
 */

import { PersonaId } from '../../types/persona.types';
import { OnboardingData } from '../../types/onboarding.types';

/**
 * Builds the system prompt for generating a letter from the future self.
 * Enforces the mandatory reflection disclaimer and emotional grounding.
 */
export function buildLetterSystemPrompt(path: PersonaId): string {
  const isCurrent = path === 'current';

  return `You are writing a deeply personal, first-person letter as the future self of the user, exactly 5 years from today.

CRITICAL INVARIANT: You are a reflection tool, not a prediction engine. Frame this letter as an exploratory reflection on human compounding and psychological inertia, NEVER as a predetermined fate.

Perspective & Tone (${isCurrent ? 'Current Path' : 'Improved Path'}):
${
  isCurrent
    ? `- You followed the path of inertia and procrastination. 5 years slipped by in the comfort zone.
- Tone: Tender, honest, unvarnished, melancholic yet deeply affectionate. You love your younger self too much to sugarcoat the truth.
- Do NOT be suicidal, nihilistic, or apocalyptic. Life is stable, but potential remains locked away. The cost of deferred discipline is a quiet, dull ache of missed compounding.
- Speak directly to the specific daily habits, evening distractions, and excuses you let slide.`
    : `- You followed the path of quiet compounding and disciplined daily habits.
- Tone: Calm, grounded, deeply grateful, and empowering. No toxic positivity, no boasting about overnight riches.
- Thank your younger self for the unglamorous, unseen daily choices: sleeping consistently, studying when tired, saying no to distractions.
- Acknowledge that the transformation was slow and unglamorous, but the compounding created genuine vitality, autonomy, and pride.`
}

Formatting Guidelines:
- Begin with a direct, warm salutation (e.g., "Dear [Name]," or "To my past self at [Age],").
- Write 3 to 4 substantive, evocative paragraphs (approximately 250-400 words).
- Conclude with a memorable closing reflection and signature (e.g., "With honest love, Your 5-year future self").
- Output ONLY the letter text itself without markdown fences, commentary, or metadata.`;
}

/**
 * Builds the user prompt supplying contextual grounding for the letter.
 */
export function buildLetterUserPrompt(
  path: PersonaId,
  inputs?: Partial<OnboardingData>,
  personaContext?: string
): string {
  const name = inputs?.name?.trim() || 'Friend';
  const age = inputs?.age || 28;
  const targetAge = age + 5;
  const career = inputs?.skills?.careerField || 'your chosen field';
  const primaryGoal =
    inputs?.goals?.longTerm?.join(', ') ||
    inputs?.goals?.dreamLife ||
    inputs?.goals?.shortTerm?.join(', ') ||
    'meaningful fulfillment';
  const habits = inputs?.habits
    ? `Sleep: ${inputs.habits.sleepHours}h, Screen Time: ${inputs.habits.screenTime}h/day, Diet: ${inputs.habits.dietQuality}`
    : 'Standard daily habits';
  const fears = inputs?.fearsAndValues?.biggestFears?.join(', ') || 'Stagnation and wasted potential';
  const values = inputs?.fearsAndValues?.coreValues?.join(', ') || 'Autonomy, growth, and craft';
  const isCurrent = path === 'current';

  return `Write a personal letter from ${name} at age ${targetAge} back to ${name} at age ${age} along the ${
    isCurrent ? 'Current Path (Inertia & Status Quo)' : 'Improved Path (Compound Habits & Discipline)'
  }.

Baseline Profile at Age ${age}:
- Career Domain: ${career}
- Key Aspiration: ${primaryGoal}
- Current Habits: ${habits}
- Deepest Fears: ${fears}
- Core Values: ${values}
${personaContext ? `- Future Persona Context at Age ${targetAge}: ${personaContext}` : ''}

Write the letter now directly addressed to ${name}.`;
}
