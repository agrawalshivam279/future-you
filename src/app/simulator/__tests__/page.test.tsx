import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SimulatorPage from '../page';
import { useLifeModelStore } from '@/stores/life-model-store';
import { useDecisionStore } from '@/stores/decision-store';
import { simulateDecisionScenario } from '@/lib/ai/simulate-decision';
import { mockLifeModel } from '@/app/dashboard/__tests__/fixtures';
import { DecisionScenario, DecisionEvaluation } from '@/types';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

jest.mock('@/lib/ai/simulate-decision', () => ({
  simulateDecisionScenario: jest.fn(),
}));

const mockScenario: DecisionScenario = {
  id: 'scenario-test-1',
  title: 'Pivoting to Independent Software Founder',
  description: 'Leaving corporate work to bootstrap an autonomous developer tooling business.',
  primaryDomain: 'career',
  timeHorizon: 'immediate',
  createdAt: '2026-10-06T00:00:00.000Z',
};

const mockEvaluation: DecisionEvaluation = {
  scenarioId: 'scenario-test-1',
  evaluatedAt: '2026-10-06T00:00:00.000Z',
  projections: [
    {
      year: 1,
      phaseTitle: 'Initial Turbulence',
      summary: 'Runway contraction and steep learning curve.',
      keyChallenge: 'Cashflow volatility',
      keyAdvantage: 'High agency velocity',
    },
    {
      year: 3,
      phaseTitle: 'Compounding Revenue',
      summary: 'Product-market fit stabilizes recurring cash flow.',
      keyChallenge: 'Operational scaling',
      keyAdvantage: 'Independent equity value',
    },
    {
      year: 5,
      phaseTitle: 'Enduring Freedom',
      summary: 'Complete autonomy over schedule and capital.',
      keyChallenge: 'Long-term endurance',
      keyAdvantage: 'Uncapped creative freedom',
    },
  ],
  domainDeltas: [
    {
      domain: 'career',
      label: 'Career Growth',
      delta: 8,
      reasoning: 'Accelerated autonomy and ownership.',
    },
    {
      domain: 'finances',
      label: 'Financial Resilience',
      delta: -3,
      reasoning: 'Initial sacrifice of fixed salary.',
    },
  ],
  personaReactions: {
    currentPathVerdict: 'Steady career ladder guarantees safe predictability.',
    improvedPathVerdict: 'The asymmetric upside of independence justifies the calculated risk.',
  },
  tradeOffs: [
    'Forfeiting guaranteed corporate benefits for 12 months.',
    'Working through weekends during launch phase.',
  ],
  unforeseenRisks: [
    'Unexpected isolation from remote solo founding.',
  ],
};

describe('SimulatorPage Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLifeModelStore.setState({ model: null });
    useDecisionStore.setState({
      scenarios: [],
      evaluations: {},
      activeScenarioId: null,
      isLoading: false,
      error: null,
    });
  });

  it('renders empty state guard when user has not completed onboarding', () => {
    render(<SimulatorPage />);

    expect(screen.getByTestId('empty-simulator-guard')).toBeInTheDocument();
    expect(screen.getByText('No Future Models Found')).toBeInTheDocument();

    const startButton = screen.getByRole('button', { name: /start onboarding/i });
    fireEvent.click(startButton);
    expect(mockPush).toHaveBeenCalledWith('/onboarding');
  });

  it('renders DecisionForm when user has life model but no active scenarios', () => {
    useLifeModelStore.setState({ model: mockLifeModel });

    render(<SimulatorPage />);

    expect(screen.getByRole('heading', { level: 1, name: /decision simulator/i })).toBeInTheDocument();
    expect(screen.getByText(/reflection tool • not prediction/i)).toBeInTheDocument();
    expect(screen.getByText('Explore a New Life Fork')).toBeInTheDocument();

    const backButton = screen.getByRole('button', { name: /back to dashboard/i });
    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('renders evaluation results when scenario and evaluation exist', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    useDecisionStore.setState({
      scenarios: [mockScenario],
      evaluations: { [mockScenario.id]: mockEvaluation },
      activeScenarioId: mockScenario.id,
      isLoading: false,
      error: null,
    });

    render(<SimulatorPage />);

    expect(screen.getByTestId('decision-evaluation-results')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Pivoting to Independent Software Founder' })
    ).toBeInTheDocument();
    expect(screen.getByText('Domain Impact Deltas')).toBeInTheDocument();
    expect(screen.getByText('Future Selves\' Perspectives')).toBeInTheDocument();
    expect(screen.getByText('Trade-offs & Latent Blindspots')).toBeInTheDocument();
  });

  it('allows switching to new decision form and back', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    useDecisionStore.setState({
      scenarios: [mockScenario],
      evaluations: { [mockScenario.id]: mockEvaluation },
      activeScenarioId: mockScenario.id,
      isLoading: false,
      error: null,
    });

    render(<SimulatorPage />);

    const newButton = screen.getByRole('button', { name: /create new decision scenario/i });
    fireEvent.click(newButton);

    expect(screen.getByText('Explore a New Life Fork')).toBeInTheDocument();

    // Clicking the saved scenario tab restores results view
    const tab = screen.getByRole('tab', { name: mockScenario.title });
    fireEvent.click(tab);

    expect(screen.getByTestId('decision-evaluation-results')).toBeInTheDocument();
  });

  it('allows deleting the active scenario', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    useDecisionStore.setState({
      scenarios: [mockScenario],
      evaluations: { [mockScenario.id]: mockEvaluation },
      activeScenarioId: mockScenario.id,
      isLoading: false,
      error: null,
    });

    render(<SimulatorPage />);

    const deleteButton = screen.getByRole('button', { name: /delete scenario/i });
    fireEvent.click(deleteButton);

    expect(useDecisionStore.getState().scenarios).toHaveLength(0);
    expect(screen.getByText('Explore a New Life Fork')).toBeInTheDocument();
  });

  it('displays and dismisses error banner', () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    useDecisionStore.setState({
      scenarios: [],
      evaluations: {},
      activeScenarioId: null,
      isLoading: false,
      error: 'Simulated API rate limit exceeded.',
    });

    render(<SimulatorPage />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Simulated API rate limit exceeded.')).toBeInTheDocument();

    const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
    fireEvent.click(dismissButton);

    expect(useDecisionStore.getState().error).toBeNull();
  });

  it('submits a new scenario and triggers simulateDecisionScenario', async () => {
    useLifeModelStore.setState({ model: mockLifeModel });
    (simulateDecisionScenario as jest.Mock).mockResolvedValueOnce(mockEvaluation);

    render(<SimulatorPage />);

    const titleInput = screen.getByLabelText(/decision title/i);
    fireEvent.change(titleInput, { target: { value: 'Launch open source project' } });

    const descInput = screen.getByLabelText(/context, risks & motivation/i);
    fireEvent.change(descInput, {
      target: { value: 'Dedicate evenings to building and documenting my library.' },
    });

    const submitBtn = screen.getByRole('button', { name: /simulate decision$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(simulateDecisionScenario).toHaveBeenCalled();
    });
  });
});
