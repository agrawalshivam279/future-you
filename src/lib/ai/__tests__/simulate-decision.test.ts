import { simulateDecisionScenario } from '../simulate-decision';
import { useSettingsStore } from '@/stores/settings-store';
import { useDecisionStore } from '@/stores/decision-store';
import { DecisionScenario } from '@/types';
import OpenAI from 'openai';

jest.mock('openai');

describe('simulateDecisionScenario', () => {
  const mockCreate = jest.fn();

  const mockScenario: DecisionScenario = {
    id: 'scen-ai-test',
    createdAt: '2026-10-06T00:00:00.000Z',
    title: 'Switch from Engineering to Product Management',
    description: 'Transition from IC engineer to Product Manager at a growth-stage company.',
    primaryDomain: 'career',
    timeHorizon: 'immediate',
  };

  const sampleJsonResponse = JSON.stringify({
    projections: [
      {
        year: 1,
        phaseTitle: 'The Pivot',
        summary: 'Navigating ambiguity and learning cross-functional leadership.',
        keyChallenge: 'Imposter syndrome without code output',
        keyAdvantage: 'Broad exposure to strategy',
      },
      {
        year: 3,
        phaseTitle: 'Product Leadership',
        summary: 'Owning major product line with measurable business outcomes.',
        keyChallenge: 'Stakeholder misalignment',
        keyAdvantage: 'High leverage and influence',
      },
      {
        year: 5,
        phaseTitle: 'Strategic Director',
        summary: 'Directing product vision with deep organizational trust.',
        keyChallenge: 'Executive politics',
        keyAdvantage: 'Executive autonomy',
      },
    ],
    domainDeltas: [
      { domain: 'career', label: 'Career Growth', delta: 7, reasoning: 'Direct route to executive roles' },
      { domain: 'finances', label: 'Financial Resilience', delta: 5, reasoning: 'Higher bonus potential' },
      { domain: 'health', label: 'Energy & Vitality', delta: -1, reasoning: 'More meetings' },
      { domain: 'relationships', label: 'Relationships', delta: 4, reasoning: 'Expanded network' },
      { domain: 'lifestyle', label: 'Lifestyle', delta: 2, reasoning: 'Flexible but high responsibility' },
    ],
    personaReactions: {
      currentPathVerdict: 'Writing code is simpler and more peaceful than managing meetings.',
      improvedPathVerdict: 'Strategic leverage is vastly higher when shaping what gets built.',
    },
    tradeOffs: ['Losing hands-on technical sharpness', 'Constant context switching'],
    unforeseenRisks: ['Burnout from organizational friction'],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useSettingsStore.getState().resetSettings();
    useDecisionStore.getState().resetDecisionStore();

    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));
  });

  it('throws an error if no API key is configured', async () => {
    useSettingsStore.getState().setApiKey('');

    await expect(simulateDecisionScenario(mockScenario)).rejects.toThrow(
      'AI provider is not configured. Please add an API key in Settings.'
    );
  });

  it('successfully simulates a decision scenario and persists evaluation to store', async () => {
    useSettingsStore.getState().setApiKey('test-key-mock');

    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: sampleJsonResponse } }],
      usage: { prompt_tokens: 350, completion_tokens: 420, total_tokens: 770 },
    });

    const onProgress = jest.fn();
    const onTokenUsage = jest.fn();

    const evaluation = await simulateDecisionScenario(mockScenario, {
      onProgress,
      onTokenUsage,
    });

    expect(evaluation.scenarioId).toBe(mockScenario.id);
    expect(evaluation.projections).toHaveLength(3);
    expect(evaluation.domainDeltas).toHaveLength(5);
    expect(evaluation.domainDeltas.find((d) => d.domain === 'career')?.delta).toBe(7);
    expect(evaluation.personaReactions.improvedPathVerdict).toContain('Strategic leverage');

    // Verifies store persistence
    expect(useDecisionStore.getState().hasEvaluation(mockScenario.id)).toBe(true);

    // Verifies callbacks
    expect(onProgress).toHaveBeenCalledWith(expect.stringContaining('Projecting'));
    expect(onTokenUsage).toHaveBeenCalledWith({
      promptTokens: 350,
      completionTokens: 420,
      totalTokens: 770,
    });
  });

  it('retries on retryable transient error and succeeds', async () => {
    useSettingsStore.getState().setApiKey('test-key-mock');

    const rateLimitError = new Error('Rate limit exceeded 429');
    mockCreate
      .mockRejectedValueOnce(rateLimitError)
      .mockResolvedValueOnce({
        choices: [{ message: { content: sampleJsonResponse } }],
        usage: { prompt_tokens: 100, completion_tokens: 100, total_tokens: 200 },
      });

    const onProgress = jest.fn();
    const evaluation = await simulateDecisionScenario(mockScenario, {
      maxRetries: 1,
      onProgress,
    });

    expect(evaluation.scenarioId).toBe(mockScenario.id);
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(onProgress).toHaveBeenCalledWith(expect.stringContaining('Retrying'));
  });

  it('throws when receiving empty content from provider', async () => {
    useSettingsStore.getState().setApiKey('test-key-mock');

    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '   ' } }],
    });

    await expect(
      simulateDecisionScenario(mockScenario, { maxRetries: 0 })
    ).rejects.toThrow('Received an empty response from the AI provider.');
  });

  it('aborts cleanly when signal is already cancelled', async () => {
    useSettingsStore.getState().setApiKey('test-key-mock');

    const controller = new AbortController();
    controller.abort();

    await expect(
      simulateDecisionScenario(mockScenario, { signal: controller.signal })
    ).rejects.toThrow('Decision simulation was cancelled by user.');
  });
});
