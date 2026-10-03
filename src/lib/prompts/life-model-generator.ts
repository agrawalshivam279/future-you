/**
 * Life Model AI Prompt Generator & Response Parser for Future You.
 * Formulates structured reflection prompts for synthesizing dual 5-year trajectories.
 */

import { OnboardingData, LifeModel, HabitLever, Persona } from '@/types';

/**
 * Builds the system instructions for the LLM simulating two 5-year future selves.
 * Enforces the mandatory reflection disclaimer and emotional tone differentiation.
 */
export function buildLifeModelSystemPrompt(): string {
  return `You are a reflection tool, not a prediction engine.

Your task is to take a user's self-reported baseline life survey and generate a deeply thoughtful, grounded, and psychologically coherent simulation of two distinct 5-year future trajectories:
1. "Current Path" (id: "current"): The realistic compound of continuing baseline inertia, habits, frictions, and delayed decisions over 5 continuous years. The tone is reflective, weary yet honest, pragmatic, carrying the weight of unexercised potential—NOT nihilistic, suicidal, or despairing.
2. "Improved Path" (id: "improved"): The realistic compound of making deliberate, disciplined, daily micro-improvements aligned with their stated values and goals. The tone is calm, energized, purposeful, grounded in steady consistency—NEVER toxic positivity, miraculous luck, or overnight billionaire fantasy.

Core Invariants:
- The future persona age MUST be exactly (current age + 5).
- Both personas are the SAME person 5 years later, reflecting different compounding vectors of the same core values and fears.
- Do NOT output conversational preamble or markdown commentary. Return ONLY a single valid JSON object strictly matching the schema requested.`;
}

/**
 * Builds the user prompt containing structured onboarding survey inputs and expected JSON format.
 */
export function buildLifeModelUserPrompt(data: OnboardingData): string {
  const targetAge = (data.age || 28) + 5;
  const callsign = data.name || 'Friend';

  return `Here is the user's current baseline profile:

1. Demographics: Callsign: ${callsign}, Current Age: ${data.age || 28} (Target Age: ${targetAge})
2. Goals: 1-Year: ${data.goals?.shortTerm?.join(', ') || 'None'}, 5-Year: ${data.goals?.longTerm?.join(', ') || 'None'}, Dream Life: ${data.goals?.dreamLife || 'None'}
3. Habits: Sleep: ${data.habits?.sleepHours || 7}h/day, Exercise: ${data.habits?.exerciseFrequency || 'rarely'}, Nutrition: ${data.habits?.dietQuality || 'average'}, Screen Time: ${data.habits?.screenTime || 4}h/day, Reflection: ${data.habits?.meditationOrReflection ? 'Yes' : 'No'}
4. Weekly Time (168h): Work: ${data.time?.workHoursPerWeek || 40}h, Study: ${data.time?.studyHoursPerWeek || 5}h, Social: ${data.time?.socialHoursPerWeek || 10}h, Creative: ${data.time?.creativeHoursPerWeek || 3}h, Downtime: ${data.time?.wastedHoursPerWeek || 5}h
5. Money: Income: ${data.money?.incomeRange || 'Not disclosed'}, Savings: ${data.money?.savingsRate || 15}%, Debt: ${data.money?.debtLevel || 'none'}, Spending: ${data.money?.spendingHabits || 'Balanced'}, Goal: ${data.money?.financialGoal || 'Freedom'}
6. Skills: Strengths: ${data.skills?.currentSkills?.join(', ') || 'None'}, Learning Goals: ${data.skills?.learningGoals?.join(', ') || 'None'}, Field: ${data.skills?.careerField || 'Technology'}, Satisfaction: ${data.skills?.careerSatisfaction || 5}/10, Growth Mindset: ${data.skills?.growthMindset || 7}/10
7. Fears & Values: Anxieties: ${data.fearsAndValues?.biggestFears?.join(', ') || 'Stagnation'}, Values: ${data.fearsAndValues?.coreValues?.join(', ') || 'Autonomy'}, Regrets: ${data.fearsAndValues?.regrets || 'None'}, Motivation: ${data.fearsAndValues?.motivation || 'mixed'}, Risk Tolerance: ${data.fearsAndValues?.riskTolerance || 5}/10

---
Output a single valid JSON object strictly matching this schema:
{
  "currentPath": {
    "name": "${callsign} in 5 Years (Current Path)",
    "age": ${targetAge},
    "summary": "1-2 sentence high-level overview of life 5 years out on current habits.",
    "personality": "Detailed description of tone and perspective for chat.",
    "emotionalState": "Dominant emotional posture.",
    "career": { "title": "Job title", "companyOrContext": "Context", "satisfaction": 5, "highlights": ["Milestone"], "challenges": ["Friction"] },
    "health": { "physicalStatus": "Status", "sleepAverageHours": ${data.habits?.sleepHours || 7}, "energyLevel": "Energy", "habitsSummary": "Habits" },
    "finances": { "savingsRate": ${data.money?.savingsRate || 15}, "financialStatus": "Status", "freedomLevel": "Level" },
    "relationships": { "status": "Status", "socialCircle": "Circle", "satisfaction": 6 },
    "skills": ["Skill 1"], "achievements": ["Achievement"], "struggles": ["Struggle"],
    "dailyRoutine": "Typical Tuesday routine paragraph."
  },
  "improvedPath": {
    "name": "${callsign} in 5 Years (Improved Path)",
    "age": ${targetAge},
    "summary": "1-2 sentence high-level overview of life 5 years out on improved compound habits.",
    "personality": "Detailed description of tone and perspective for chat.",
    "emotionalState": "Dominant emotional posture.",
    "career": { "title": "Job title", "companyOrContext": "Context", "satisfaction": 8, "highlights": ["Milestone"], "challenges": ["Challenge"] },
    "health": { "physicalStatus": "Strong", "sleepAverageHours": 8, "energyLevel": "High", "habitsSummary": "Habits" },
    "finances": { "savingsRate": ${Math.min(100, (data.money?.savingsRate || 15) + 15)}, "financialStatus": "Compounding", "freedomLevel": "High" },
    "relationships": { "status": "Connected", "socialCircle": "Circle", "satisfaction": 8 },
    "skills": ["Compounded skill"], "achievements": ["Achievement"], "struggles": ["High-level challenge"],
    "dailyRoutine": "Typical Tuesday routine paragraph."
  },
  "habitLevers": [
    { "id": "sleep-hours", "label": "Nightly Sleep", "min": 4, "max": 12, "step": 0.5, "currentValue": ${data.habits?.sleepHours || 7}, "unit": "hrs" },
    { "id": "study-hours", "label": "Weekly Skill Study", "min": 0, "max": 40, "step": 1, "currentValue": ${data.time?.studyHoursPerWeek || 5}, "unit": "hrs/wk" },
    { "id": "screen-time", "label": "Recreational Screen Time", "min": 0, "max": 16, "step": 0.5, "currentValue": ${data.habits?.screenTime || 4}, "unit": "hrs/day" },
    { "id": "savings-rate", "label": "Monthly Savings Rate", "min": 0, "max": 100, "step": 1, "currentValue": ${data.money?.savingsRate || 15}, "unit": "%" },
    { "id": "creative-hours", "label": "Weekly Passion Projects", "min": 0, "max": 40, "step": 1, "currentValue": ${data.time?.creativeHoursPerWeek || 3}, "unit": "hrs/wk" }
  ]
}`;
}

/**
 * Creates default fallback habit levers from user inputs.
 */
function createDefaultLevers(inputs: OnboardingData): HabitLever[] {
  return [
    { id: 'sleep-hours', label: 'Nightly Sleep', min: 4, max: 12, step: 0.5, currentValue: inputs.habits?.sleepHours || 7, unit: 'hrs' },
    { id: 'study-hours', label: 'Weekly Skill Study', min: 0, max: 40, step: 1, currentValue: inputs.time?.studyHoursPerWeek || 5, unit: 'hrs/wk' },
    { id: 'screen-time', label: 'Recreational Screen Time', min: 0, max: 16, step: 0.5, currentValue: inputs.habits?.screenTime || 4, unit: 'hrs/day' },
    { id: 'savings-rate', label: 'Monthly Savings Rate', min: 0, max: 100, step: 1, currentValue: inputs.money?.savingsRate || 15, unit: '%' },
    { id: 'creative-hours', label: 'Weekly Passion Projects', min: 0, max: 40, step: 1, currentValue: inputs.time?.creativeHoursPerWeek || 3, unit: 'hrs/wk' },
  ];
}

/**
 * Creates a baseline fallback Persona.
 */
function createFallbackPersona(id: 'current' | 'improved', inputs: OnboardingData): Persona {
  const isCurrent = id === 'current';
  return {
    id,
    name: `${inputs.name || 'You'} (${isCurrent ? 'Current Path' : 'Improved Path'})`,
    age: (inputs.age || 28) + 5,
    summary: `${inputs.name || 'Your'} 5-year ${isCurrent ? 'current' : 'improved'} simulation.`,
    personality: isCurrent ? 'Reflective, pragmatic, carrying unexercised potential.' : 'Calm, energized, purposeful and disciplined.',
    emotionalState: isCurrent ? 'Quietly restless, fatigued but stable' : 'Grounded, purposeful, high vitality',
    career: {
      title: inputs.skills?.careerField || 'Professional',
      companyOrContext: 'Domain context',
      satisfaction: isCurrent ? 5 : 8,
      highlights: [],
      challenges: [],
    },
    health: {
      physicalStatus: isCurrent ? 'Moderate' : 'Strong & Vital',
      sleepAverageHours: inputs.habits?.sleepHours || 7,
      energyLevel: isCurrent ? 'Moderate' : 'High',
      habitsSummary: 'Standard routine',
    },
    finances: {
      savingsRate: inputs.money?.savingsRate || 15,
      financialStatus: isCurrent ? 'Stable' : 'Compounding',
      freedomLevel: isCurrent ? 'Moderate' : 'High',
    },
    relationships: {
      status: 'Ongoing relationships',
      socialCircle: 'Family & Friends',
      satisfaction: isCurrent ? 6 : 8,
    },
    skills: inputs.skills?.currentSkills || [],
    achievements: [],
    struggles: [],
    dailyRoutine: 'Typical day in the life.',
    timeline: [],
    letter: '',
    regrets: [],
    gratitudes: [],
  };
}

/**
 * Robustly parses and validates the LLM response into a typed LifeModel structure.
 * Strips markdown code fencing, fills missing fields with fallbacks, and links inputs.
 *
 * @param rawText - Raw string output from the LLM completion
 * @param inputs - Original onboarding data inputs
 * @returns Fully constructed, type-safe LifeModel instance
 */
export function parseLifeModelResponse(
  rawText: string,
  inputs: OnboardingData
): LifeModel {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('LLM returned an empty or invalid response string.');
  }

  // Strip markdown code fences if present
  let cleanText = rawText.trim();
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }

  // Find the outermost JSON object bounds
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanText = cleanText.slice(firstBrace, lastBrace + 1);
  }

  let parsed: Partial<LifeModel>;
  try {
    parsed = JSON.parse(cleanText);
  } catch (err) {
    throw new Error(
      `Failed to parse LLM LifeModel response as JSON: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }

  const currentPath: Persona = {
    ...createFallbackPersona('current', inputs),
    ...(parsed.currentPath || {}),
    id: 'current',
    age: (inputs.age || 28) + 5,
    timeline: parsed.currentPath?.timeline || [],
    letter: parsed.currentPath?.letter || '',
    regrets: parsed.currentPath?.regrets || [],
    gratitudes: parsed.currentPath?.gratitudes || [],
  };

  const improvedPath: Persona = {
    ...createFallbackPersona('improved', inputs),
    ...(parsed.improvedPath || {}),
    id: 'improved',
    age: (inputs.age || 28) + 5,
    timeline: parsed.improvedPath?.timeline || [],
    letter: parsed.improvedPath?.letter || '',
    regrets: parsed.improvedPath?.regrets || [],
    gratitudes: parsed.improvedPath?.gratitudes || [],
  };

  return {
    id: `life-model-${Date.now()}`,
    createdAt: new Date().toISOString(),
    inputs,
    currentPath,
    improvedPath,
    habitLevers: Array.isArray(parsed.habitLevers) && parsed.habitLevers.length > 0
      ? parsed.habitLevers
      : createDefaultLevers(inputs),
  };
}
