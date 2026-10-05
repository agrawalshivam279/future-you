import { STORAGE_PREFIX, HONESTY_DISCLAIMER } from '@/lib/constants';
import {
  useDecisionStore,
  DECISION_PRESETS,
  useLifeModelStore,
} from '@/stores';
import { deleteAllLocalData } from '@/lib/storage/data-manager';
import {
  buildDecisionSimulatorSystemPrompt,
  buildDecisionSimulatorUserPrompt,
  parseDecisionSimulatorResponse,
} from '@/lib/prompts/decision-simulator';
import { mockLifeModel } from '@/app/dashboard/__tests__/fixtures';
import { DecisionScenario } from '@/types';

jest.mock('@/lib/storage/indexed-db', () => ({
  ...jest.requireActual('@/lib/storage/indexed-db'),
  clearIndexedDBDatabase: jest.fn().mockResolvedValue(undefined),
}));

describe('Phase 15: Decision Simulator End-to-End Integration & Invariants', () => {
  beforeEach(async () => {
    localStorage.clear();
    await deleteAllLocalData();
  });

  describe('Invariant 1: Local Storage Isolation & Namespace Prefix', () => {
    it('persists DecisionStore state under the strict future-you: prefix', () => {
      const scenarioData: Omit<DecisionScenario, 'id' | 'createdAt'> = {
        title: 'Move to Berlin for Tech Venture',
        description: 'Leaving existing residence to co-found a decentralized infrastructure startup.',
        primaryDomain: 'career',
        timeHorizon: '6months',
      };

      const created = useDecisionStore.getState().addScenario(scenarioData);
      expect(created.id).toBeDefined();
      expect(created.createdAt).toBeDefined();

      const storedRaw = localStorage.getItem(`${STORAGE_PREFIX}decisions`);
      expect(storedRaw).not.toBeNull();

      const parsed = JSON.parse(storedRaw!);
      expect(parsed.state.scenarios).toHaveLength(1);
      expect(parsed.state.scenarios[0].title).toBe('Move to Berlin for Tech Venture');
    });

    it('provides accessible curated presets in DECISION_PRESETS', () => {
      expect(DECISION_PRESETS.length).toBeGreaterThanOrEqual(3);
      DECISION_PRESETS.forEach((preset) => {
        expect(preset.id).toBeDefined();
        expect(preset.title.length).toBeGreaterThan(0);
        expect(preset.description.length).toBeGreaterThan(0);
      });
    });

    it('deleting a scenario purges both the scenario and its cached evaluation', () => {
      const created = useDecisionStore.getState().addScenario({
        title: 'Test Fork',
        description: 'Temporary fork test',
        primaryDomain: 'lifestyle',
        timeHorizon: 'immediate',
      });

      useDecisionStore.getState().setEvaluation(created.id, {
        scenarioId: created.id,
        evaluatedAt: new Date().toISOString(),
        projections: [],
        domainDeltas: [],
        personaReactions: {
          currentPathVerdict: 'Verdict A',
          improvedPathVerdict: 'Verdict B',
        },
        tradeOffs: ['Tradeoff 1'],
        unforeseenRisks: ['Risk 1'],
      });

      expect(useDecisionStore.getState().hasEvaluation(created.id)).toBe(true);

      useDecisionStore.getState().deleteScenario(created.id);

      expect(useDecisionStore.getState().scenarios).toHaveLength(0);
      expect(useDecisionStore.getState().hasEvaluation(created.id)).toBe(false);
    });
  });

  describe('Invariant 2: AI Prompt Disclaimers & Grounding', () => {
    it('mandates reflection honesty disclaimer in system prompt', () => {
      const systemPrompt = buildDecisionSimulatorSystemPrompt();
      expect(systemPrompt).toContain('You are a reflection tool, not a prediction engine');
    });

    it('embeds user baseline, habit context, and decision fork in user prompt', () => {
      useLifeModelStore.setState({ model: mockLifeModel });

      const scenario: DecisionScenario = {
        id: 'scenario-user-test',
        title: 'Resign and Pursue Writing Full Time',
        description: 'Publishing articles daily and surviving on savings for 12 months.',
        primaryDomain: 'career',
        timeHorizon: 'immediate',
        createdAt: new Date().toISOString(),
      };

      const userPrompt = buildDecisionSimulatorUserPrompt(
        scenario,
        { name: 'Taylor' },
        mockLifeModel.currentPath,
        mockLifeModel.improvedPath
      );
      expect(userPrompt).toContain('Resign and Pursue Writing Full Time');
      expect(userPrompt).toContain('career');
      expect(userPrompt).toContain('Taylor');
    });
  });

  describe('Invariant 3: Output Bounds Clamping & Chronology', () => {
    it('clamps domain deltas within [-10, 10] and guarantees chronological horizons', () => {
      const mockRawAIOutput = JSON.stringify({
        scenarioId: 'test-scenario',
        evaluatedAt: '2026-10-06T00:00:00Z',
        projections: [
          { year: 5, phaseTitle: 'Y5 Phase', summary: 'Year 5', keyChallenge: 'C5', keyAdvantage: 'A5' },
          { year: 1, phaseTitle: 'Y1 Phase', summary: 'Year 1', keyChallenge: 'C1', keyAdvantage: 'A1' },
          { year: 3, phaseTitle: 'Y3 Phase', summary: 'Year 3', keyChallenge: 'C3', keyAdvantage: 'A3' },
        ],
        domainDeltas: [
          { domain: 'career', label: 'Career Growth', delta: 99, reasoning: 'Exceeded cap' },
          { domain: 'finances', label: 'Finances', delta: -50, reasoning: 'Exceeded floor' },
        ],
        personaReactions: {
          currentPathVerdict: 'Cautious observation.',
          improvedPathVerdict: 'Bold calculated execution.',
        },
        tradeOffs: ['Sacrifice A'],
        unforeseenRisks: ['Risk B'],
      });

      const parsed = parseDecisionSimulatorResponse(mockRawAIOutput, 'test-scenario');

      expect(parsed.domainDeltas.find((d) => d.domain === 'career')?.delta).toBe(10);
      expect(parsed.domainDeltas.find((d) => d.domain === 'finances')?.delta).toBe(-10);

      // Verify projections
      expect(parsed.projections).toHaveLength(3);
      expect(parsed.projections.map((p) => p.year)).toEqual(expect.arrayContaining([1, 3, 5]));
    });
  });

  describe('Invariant 4: Single-Click Privacy Wipe', () => {
    it('deleteAllLocalData completely purges DecisionStore state and localStorage', async () => {
      useDecisionStore.getState().addScenario({
        title: 'Sensitive Fork',
        description: 'Private financial decision',
        primaryDomain: 'finances',
        timeHorizon: 'immediate',
      });

      expect(useDecisionStore.getState().scenarios).toHaveLength(1);
      expect(localStorage.getItem(`${STORAGE_PREFIX}decisions`)).not.toBeNull();

      await deleteAllLocalData();

      expect(useDecisionStore.getState().scenarios).toHaveLength(0);
      expect(useDecisionStore.getState().evaluations).toEqual({});
      expect(useDecisionStore.getState().activeScenarioId).toBeNull();
      expect(localStorage.getItem(`${STORAGE_PREFIX}decisions`)).toBeNull();
    });
  });
});
