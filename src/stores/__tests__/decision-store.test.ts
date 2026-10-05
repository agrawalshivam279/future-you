import { useDecisionStore, DECISION_PRESETS } from '../decision-store';
import { DecisionEvaluation, DecisionScenario } from '@/types';

describe('useDecisionStore', () => {
  beforeEach(() => {
    useDecisionStore.getState().resetDecisionStore();
    localStorage.clear();
  });

  afterEach(() => {
    useDecisionStore.getState().resetDecisionStore();
    localStorage.clear();
  });

  it('initializes with default empty state', () => {
    const state = useDecisionStore.getState();
    expect(state.scenarios).toEqual([]);
    expect(state.evaluations).toEqual({});
    expect(state.activeScenarioId).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('adds a scenario and automatically sets it as active', () => {
    const newScenario = useDecisionStore.getState().addScenario({
      title: 'Move to Berlin',
      description: 'Relocating to Europe for tech opportunities',
      primaryDomain: 'lifestyle',
      timeHorizon: '6months',
    });

    expect(newScenario.id).toBeDefined();
    expect(newScenario.createdAt).toBeDefined();
    expect(newScenario.title).toBe('Move to Berlin');

    const state = useDecisionStore.getState();
    expect(state.scenarios).toHaveLength(1);
    expect(state.scenarios[0]).toEqual(newScenario);
    expect(state.activeScenarioId).toBe(newScenario.id);
  });

  it('updates an existing scenario', () => {
    const scenario = useDecisionStore.getState().addScenario({
      title: 'Initial Title',
      description: 'Initial Description',
      primaryDomain: 'career',
      timeHorizon: 'immediate',
    });

    useDecisionStore.getState().updateScenario(scenario.id, {
      title: 'Updated Title',
    });

    const updated = useDecisionStore.getState().scenarios.find((s) => s.id === scenario.id);
    expect(updated?.title).toBe('Updated Title');
    expect(updated?.description).toBe('Initial Description');
  });

  it('deletes a scenario and purges its evaluation', () => {
    const scenario = useDecisionStore.getState().addScenario({
      title: 'Startup Launch',
      description: 'Leave corporate job',
      primaryDomain: 'career',
      timeHorizon: 'immediate',
    });

    const mockEvaluation: DecisionEvaluation = {
      scenarioId: scenario.id,
      evaluatedAt: new Date().toISOString(),
      projections: [
        {
          year: 1,
          phaseTitle: 'The Leap',
          summary: 'High volatility year',
          keyChallenge: 'Cash flow uncertainty',
          keyAdvantage: 'High agency and fast growth',
        },
      ],
      domainDeltas: [
        {
          domain: 'career',
          label: 'Career Growth',
          delta: 8,
          reasoning: 'Steep learning curve',
        },
      ],
      personaReactions: {
        currentPathVerdict: 'Too risky without safety net',
        improvedPathVerdict: 'Bold step that compounds long-term value',
      },
      tradeOffs: ['Financial buffer depleted', 'Long work hours'],
      unforeseenRisks: ['Market shifts in niche domain'],
    };

    useDecisionStore.getState().setEvaluation(scenario.id, mockEvaluation);
    expect(useDecisionStore.getState().hasEvaluation(scenario.id)).toBe(true);

    useDecisionStore.getState().deleteScenario(scenario.id);

    const state = useDecisionStore.getState();
    expect(state.scenarios).toHaveLength(0);
    expect(state.evaluations[scenario.id]).toBeUndefined();
    expect(state.activeScenarioId).toBeNull();
    expect(useDecisionStore.getState().hasEvaluation(scenario.id)).toBe(false);
  });

  it('stores and retrieves evaluations correctly', () => {
    const scenario = useDecisionStore.getState().addScenario({
      title: 'Sabbatical',
      description: '6 month study break',
      primaryDomain: 'career',
      timeHorizon: '1year',
    });

    const evaluation: DecisionEvaluation = {
      scenarioId: scenario.id,
      evaluatedAt: new Date().toISOString(),
      projections: [],
      domainDeltas: [],
      personaReactions: {
        currentPathVerdict: 'Unnecessary pause',
        improvedPathVerdict: 'Crucial recalibration',
      },
      tradeOffs: [],
      unforeseenRisks: [],
    };

    useDecisionStore.getState().setEvaluation(scenario.id, evaluation);

    expect(useDecisionStore.getState().evaluations[scenario.id]).toEqual(evaluation);
    expect(useDecisionStore.getState().hasEvaluation(scenario.id)).toBe(true);
    expect(useDecisionStore.getState().hasEvaluation('non-existent')).toBe(false);
  });

  it('manages loading and error state transitions', () => {
    useDecisionStore.getState().setLoading(true);
    expect(useDecisionStore.getState().isLoading).toBe(true);

    useDecisionStore.getState().setError('Failed to project decision outcome');
    expect(useDecisionStore.getState().error).toBe('Failed to project decision outcome');
    expect(useDecisionStore.getState().isLoading).toBe(false);

    useDecisionStore.getState().setLoading(true);
    expect(useDecisionStore.getState().error).toBeNull();
  });

  it('resets entire decision store to default', () => {
    useDecisionStore.getState().addScenario({
      title: 'Test Scenario',
      description: 'Testing reset',
      primaryDomain: 'career',
      timeHorizon: 'immediate',
    });

    useDecisionStore.getState().setError('Some error');
    useDecisionStore.getState().resetDecisionStore();

    const state = useDecisionStore.getState();
    expect(state.scenarios).toHaveLength(0);
    expect(state.evaluations).toEqual({});
    expect(state.error).toBeNull();
  });

  it('provides curated decision presets', () => {
    expect(DECISION_PRESETS.length).toBeGreaterThanOrEqual(3);
    DECISION_PRESETS.forEach((preset) => {
      expect(preset.id).toBeDefined();
      expect(preset.title).toBeDefined();
      expect(preset.description).toBeDefined();
      expect(preset.primaryDomain).toBeDefined();
      expect(preset.timeHorizon).toBeDefined();
    });
  });
});
