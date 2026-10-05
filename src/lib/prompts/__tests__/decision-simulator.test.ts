import {
  buildDecisionSimulatorSystemPrompt,
  buildDecisionSimulatorUserPrompt,
  parseDecisionSimulatorResponse,
} from '../decision-simulator';
import { DecisionScenario } from '@/types';

const mockScenario: DecisionScenario = {
  id: 'test-scenario-1',
  createdAt: '2026-10-06T00:00:00.000Z',
  title: 'Founding an AI Studio',
  description: 'Quit senior engineering job to build a bootstrapped AI tools company.',
  primaryDomain: 'career',
  timeHorizon: 'immediate',
};

describe('Decision Simulator Prompts', () => {
  describe('buildDecisionSimulatorSystemPrompt', () => {
    it('contains the mandatory honesty reflection disclaimer', () => {
      const prompt = buildDecisionSimulatorSystemPrompt();
      expect(prompt).toContain('reflection tool, not a prediction engine');
    });

    it('specifies the 1, 3, and 5-year multi-horizon analysis', () => {
      const prompt = buildDecisionSimulatorSystemPrompt();
      expect(prompt).toContain('Year 1');
      expect(prompt).toContain('Year 3');
      expect(prompt).toContain('Year 5');
    });

    it('specifies the -10 to +10 score delta scale and JSON format', () => {
      const prompt = buildDecisionSimulatorSystemPrompt();
      expect(prompt).toContain('-10 to +10');
      expect(prompt).toContain('"domainDeltas"');
      expect(prompt).toContain('"personaReactions"');
    });
  });

  describe('buildDecisionSimulatorUserPrompt', () => {
    it('injects scenario parameters into the user prompt', () => {
      const prompt = buildDecisionSimulatorUserPrompt(mockScenario);
      expect(prompt).toContain('Founding an AI Studio');
      expect(prompt).toContain('career');
      expect(prompt).toContain('immediate');
      expect(prompt).toContain('bootstrapped AI tools company');
    });

    it('injects baseline user profile data when provided', () => {
      const prompt = buildDecisionSimulatorUserPrompt(
        mockScenario,
        {
          name: 'Alex Rivera',
          age: 32,
          skills: {
            careerField: 'Distributed Systems',
            currentSkills: ['Rust'],
            learningGoals: ['AI Agents'],
            careerSatisfaction: 7,
            growthMindset: 8,
          },
          fearsAndValues: {
            biggestFears: ['Stagnation'],
            coreValues: ['Autonomy', 'Craft'],
            regrets: '',
            motivation: 'internal',
            riskTolerance: 8,
          },
        },
        { summary: 'Solid senior engineer playing it safe.' },
        { summary: 'High agency builder shipping independent software.' }
      );

      expect(prompt).toContain('Alex Rivera');
      expect(prompt).toContain('32');
      expect(prompt).toContain('Distributed Systems');
      expect(prompt).toContain('8/10');
      expect(prompt).toContain('Solid senior engineer');
      expect(prompt).toContain('High agency builder');
    });
  });

  describe('parseDecisionSimulatorResponse', () => {
    it('parses structured JSON with markdown code blocks', () => {
      const raw = `\`\`\`json
{
  "projections": [
    {
      "year": 1,
      "phaseTitle": "Launch Friction",
      "summary": "Burn rate stress and intense building.",
      "keyChallenge": "Zero initial revenue",
      "keyAdvantage": "Rapid skill compounding"
    },
    {
      "year": 3,
      "phaseTitle": "Product-Market Fit",
      "summary": "Steady customer growth and autonomy.",
      "keyChallenge": "Scaling operations",
      "keyAdvantage": "Total ownership of time"
    },
    {
      "year": 5,
      "phaseTitle": "Compounded Flywheel",
      "summary": "Thriving studio with enduring independence.",
      "keyChallenge": "Preventing burnout",
      "keyAdvantage": "Unbounded career upside"
    }
  ],
  "domainDeltas": [
    { "domain": "career", "label": "Career Growth", "delta": 8, "reasoning": "High autonomy" },
    { "domain": "finances", "label": "Financial Resilience", "delta": -4, "reasoning": "Income volatility" },
    { "domain": "health", "label": "Energy & Vitality", "delta": 1, "reasoning": "Energized by work" },
    { "domain": "relationships", "label": "Relationships", "delta": -2, "reasoning": "Longer hours" },
    { "domain": "lifestyle", "label": "Lifestyle", "delta": 7, "reasoning": "Schedule freedom" }
  ],
  "personaReactions": {
    "currentPathVerdict": "Way too unpredictable compared to corporate stability.",
    "improvedPathVerdict": "The best decision we could have made for long-term freedom."
  },
  "tradeOffs": ["Sacrificing immediate 401k match and steady paycheck"],
  "unforeseenRisks": ["Longer sales cycles than anticipated"]
}
\`\`\``;

      const result = parseDecisionSimulatorResponse(raw, 'scenario-123');
      expect(result.scenarioId).toBe('scenario-123');
      expect(result.projections).toHaveLength(3);
      expect(result.projections[0].year).toBe(1);
      expect(result.projections[0].phaseTitle).toBe('Launch Friction');
      expect(result.domainDeltas).toHaveLength(5);
      expect(result.domainDeltas[0].delta).toBe(8);
      expect(result.domainDeltas[1].delta).toBe(-4);
      expect(result.personaReactions.currentPathVerdict).toContain('Way too unpredictable');
      expect(result.tradeOffs).toHaveLength(1);
      expect(result.unforeseenRisks).toHaveLength(1);
    });

    it('clamps delta scores exceeding -10 to +10 bounds', () => {
      const raw = JSON.stringify({
        projections: [],
        domainDeltas: [
          { domain: 'career', delta: 25 },
          { domain: 'finances', delta: -50 },
        ],
        personaReactions: {},
      });

      const result = parseDecisionSimulatorResponse(raw, 'scenario-clamp');
      const career = result.domainDeltas.find((d) => d.domain === 'career');
      const finances = result.domainDeltas.find((d) => d.domain === 'finances');

      expect(career?.delta).toBe(10);
      expect(finances?.delta).toBe(-10);
    });

    it('falls back to safe defaults when JSON is corrupted or incomplete', () => {
      const result = parseDecisionSimulatorResponse('Corrupt invalid text {', 'scenario-fallback');
      expect(result.scenarioId).toBe('scenario-fallback');
      expect(result.projections).toHaveLength(3);
      expect(result.domainDeltas).toHaveLength(5);
      expect(result.personaReactions.currentPathVerdict).toBeDefined();
      expect(result.personaReactions.improvedPathVerdict).toBeDefined();
      expect(result.tradeOffs.length).toBeGreaterThan(0);
      expect(result.unforeseenRisks.length).toBeGreaterThan(0);
    });
  });
});
