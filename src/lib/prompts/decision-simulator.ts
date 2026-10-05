/**
 * AI Decision Simulator Prompt Generator & Parser for Future You.
 * Formulates structured projections and multi-horizon impact assessments for user-defined life forks.
 */

import {
  DecisionScenario,
  DecisionEvaluation,
  HorizonProjection,
  DomainDelta,
  OnboardingData,
  Persona,
  DecisionDomain,
} from '@/types';

/**
 * Builds the system prompt for the Decision Simulator.
 * Mandates the reflection disclaimer and strict structured JSON schema.
 */
export function buildDecisionSimulatorSystemPrompt(): string {
  return `You are the Decision Simulator intelligence for Future You.
Your role is to simulate the projected compounding consequences of a major life decision against the user's personal baseline.

CRITICAL INVARIANT: You are a reflection tool, not a prediction engine. Frame these projections as exploratory what-if heuristics, never as predetermined certainties or absolute predictions.

Analytical Guidelines:
1. Ground every projection in the user's specific background, baseline habits, and aspirations.
2. Provide multi-horizon timeline projections:
   - Year 1: Initial disruption, transition friction, and immediate shocks.
   - Year 3: Stabilization, skill adaptation, and emerging momentum.
   - Year 5: Compounded outcome, structural reality, and long-term divergence.
3. Score domain impact deltas on a -10 to +10 scale:
   - Career, Finances, Health, Relationships, and Lifestyle.
   - -10 indicates severe friction/depletion; 0 indicates neutral/unchanged; +10 indicates transformative compounding.
4. Voice first-person verdicts from both future selves:
   - Current Path (cautious, risk-averse, anchored in status quo comfort).
   - Improved Path (disciplined, compounding, evaluating calculated strategic agency).
5. Uncover 2-3 genuine hidden trade-offs and 2 unforeseen friction risks.

Output must be ONLY valid JSON matching this schema:
{
  "projections": [
    {
      "year": 1,
      "phaseTitle": "Short descriptive phase title",
      "summary": "2-3 sentences explaining Year 1 impact",
      "keyChallenge": "The biggest immediate challenge",
      "keyAdvantage": "The primary early advantage"
    },
    {
      "year": 3,
      "phaseTitle": "Year 3 title",
      "summary": "2-3 sentences explaining Year 3 impact",
      "keyChallenge": "Primary mid-term challenge",
      "keyAdvantage": "Primary mid-term advantage"
    },
    {
      "year": 5,
      "phaseTitle": "Year 5 title",
      "summary": "2-3 sentences explaining Year 5 compounding",
      "keyChallenge": "Long-term trade-off",
      "keyAdvantage": "Long-term compounding advantage"
    }
  ],
  "domainDeltas": [
    {
      "domain": "career",
      "label": "Career Growth",
      "delta": 6,
      "reasoning": "Brief rationale for score"
    },
    {
      "domain": "finances",
      "label": "Financial Resilience",
      "delta": -3,
      "reasoning": "Brief rationale for score"
    },
    {
      "domain": "health",
      "label": "Energy & Vitality",
      "delta": 2,
      "reasoning": "Brief rationale for score"
    },
    {
      "domain": "relationships",
      "label": "Relationships & Community",
      "delta": -1,
      "reasoning": "Brief rationale for score"
    },
    {
      "domain": "lifestyle",
      "label": "Autonomy & Lifestyle",
      "delta": 5,
      "reasoning": "Brief rationale for score"
    }
  ],
  "personaReactions": {
    "currentPathVerdict": "1-2 sentences in first person from Current Path perspective",
    "improvedPathVerdict": "1-2 sentences in first person from Improved Path perspective"
  },
  "tradeOffs": ["Trade-off 1", "Trade-off 2", "Trade-off 3"],
  "unforeseenRisks": ["Risk 1", "Risk 2"]
}`;
}

/**
 * Builds the contextual user prompt for evaluating a scenario against the user's life model.
 */
export function buildDecisionSimulatorUserPrompt(
  scenario: DecisionScenario,
  inputs?: Partial<OnboardingData>,
  currentPersona?: Partial<Persona>,
  improvedPersona?: Partial<Persona>
): string {
  const name = inputs?.name?.trim() || 'User';
  const age = inputs?.age || 28;
  const career = inputs?.skills?.careerField || 'Current Profession';
  const incomeRange = inputs?.money?.incomeRange || 'Not specified';
  const savingsRate = inputs?.money?.savingsRate ?? 10;
  const riskTolerance = inputs?.fearsAndValues?.riskTolerance ?? 5;
  const fears = inputs?.fearsAndValues?.biggestFears?.join(', ') || 'Stagnation';
  const values = inputs?.fearsAndValues?.coreValues?.join(', ') || 'Autonomy, Mastery';

  const currentSummary = currentPersona?.summary || 'Status quo trajectory focused on stability.';
  const improvedSummary = improvedPersona?.summary || 'High discipline and intentional compounding.';

  return `Please evaluate the following proposed life decision for ${name} (Age: ${age}):

=== PROPOSED DECISION SCENARIO ===
Title: ${scenario.title}
Primary Domain: ${scenario.primaryDomain}
Time Horizon for Implementation: ${scenario.timeHorizon}
Detailed Description: ${scenario.description}

=== USER BASELINE PROFILE ===
- Career Field: ${career}
- Financial Context: Income bracket ${incomeRange}, Savings rate ${savingsRate}%
- Stated Risk Tolerance (1-10): ${riskTolerance}/10
- Core Values: ${values}
- Core Anxieties: ${fears}

=== SIMULATION CONTEXT ===
- Baseline Current Path Context: ${currentSummary}
- Target Improved Path Context: ${improvedSummary}

Simulate this fork and return the JSON evaluation matrix.`;
}

/**
 * Safely parses and normalizes the AI completion into a robust DecisionEvaluation.
 */
export function parseDecisionSimulatorResponse(
  rawContent: string,
  scenarioId: string
): DecisionEvaluation {
  const cleaned = rawContent
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/\s*```$/, '');

  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        // Fall back to empty object
      }
    }
  }

  const rawProjections = Array.isArray(parsed.projections) ? parsed.projections : [];
  const years: (1 | 3 | 5)[] = [1, 3, 5];
  const projections: HorizonProjection[] = years.map((yr) => {
    const found = rawProjections.find((p) => Number(p?.year) === yr);
    return {
      year: yr,
      phaseTitle: found?.phaseTitle?.trim() || `Year ${yr} Horizon`,
      summary: found?.summary?.trim() || `Projected compounding trajectory for year ${yr}.`,
      keyChallenge: found?.keyChallenge?.trim() || 'Navigating trade-offs and transition friction.',
      keyAdvantage: found?.keyAdvantage?.trim() || 'Gaining strategic agency and domain clarity.',
    };
  });

  const validDomains: DecisionDomain[] = [
    'career',
    'finances',
    'health',
    'relationships',
    'lifestyle',
  ];
  const rawDeltas = Array.isArray(parsed.domainDeltas) ? parsed.domainDeltas : [];
  const domainDeltas: DomainDelta[] = validDomains.map((domain) => {
    const found = rawDeltas.find((d) => d?.domain === domain);
    const rawScore = Number(found?.delta);
    const delta = isNaN(rawScore) ? 0 : Math.max(-10, Math.min(10, Math.round(rawScore)));
    const defaultLabel =
      domain === 'career'
        ? 'Career Growth'
        : domain === 'finances'
        ? 'Financial Resilience'
        : domain === 'health'
        ? 'Energy & Vitality'
        : domain === 'relationships'
        ? 'Relationships & Community'
        : 'Autonomy & Lifestyle';

    return {
      domain,
      label: found?.label?.trim() || defaultLabel,
      delta,
      reasoning: found?.reasoning?.trim() || `Projected delta for ${domain}.`,
    };
  });

  const personaReactions = {
    currentPathVerdict:
      typeof parsed.personaReactions === 'object' && parsed.personaReactions !== null
        ? String(
            (parsed.personaReactions as Record<string, unknown>).currentPathVerdict || ''
          ).trim() || 'The familiar comfort of stability is lost, introducing avoidable volatility.'
        : 'The familiar comfort of stability is lost, introducing avoidable volatility.',
    improvedPathVerdict:
      typeof parsed.personaReactions === 'object' && parsed.personaReactions !== null
        ? String(
            (parsed.personaReactions as Record<string, unknown>).improvedPathVerdict || ''
          ).trim() ||
          'Calculated agency creates high long-term leverage if daily discipline is maintained.'
        : 'Calculated agency creates high long-term leverage if daily discipline is maintained.',
  };

  const tradeOffs = Array.isArray(parsed.tradeOffs) && parsed.tradeOffs.length > 0
    ? parsed.tradeOffs.map(String).filter(Boolean)
    : [
        'Short-term financial or emotional runway buffer is consumed.',
        'Existing comfortable habits and routines require intentional restructuring.',
      ];

  const unforeseenRisks = Array.isArray(parsed.unforeseenRisks) && parsed.unforeseenRisks.length > 0
    ? parsed.unforeseenRisks.map(String).filter(Boolean)
    : [
        'Underestimating the emotional stamina required during the initial disruption phase.',
        'Delayed payoff horizon may test patience before compounding kicks in.',
      ];

  return {
    scenarioId,
    evaluatedAt: new Date().toISOString(),
    projections,
    domainDeltas,
    personaReactions,
    tradeOffs,
    unforeseenRisks,
  };
}
