import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { DecisionSimulatorCard } from '../decision-simulator-card';
import { useDecisionStore } from '@/stores/decision-store';
import { DecisionScenario } from '@/types';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockScenario: DecisionScenario = {
  id: 'test-fork-1',
  title: 'Founder Pivot',
  description: 'Starting a software business',
  primaryDomain: 'career',
  timeHorizon: 'immediate',
  createdAt: '2026-10-06T00:00:00.000Z',
};

describe('DecisionSimulatorCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useDecisionStore.setState({
      scenarios: [],
      evaluations: {},
      activeScenarioId: null,
      isLoading: false,
      error: null,
    });
  });

  it('renders title, description, and badge when no scenarios exist', () => {
    render(<DecisionSimulatorCard />);

    expect(screen.getByText('Test Major Life Decisions')).toBeInTheDocument();
    expect(screen.getByText('Decision Simulator')).toBeInTheDocument();
    expect(screen.getByText('Explore forks')).toBeInTheDocument();
    expect(
      screen.getByText(/Simulate forks like career transitions, relocations, or new investments/i)
    ).toBeInTheDocument();
  });

  it('displays accurate count when scenarios exist in store', () => {
    useDecisionStore.setState({
      scenarios: [mockScenario],
    });

    const { rerender } = render(<DecisionSimulatorCard />);

    expect(screen.getByText('1 fork evaluated')).toBeInTheDocument();

    act(() => {
      useDecisionStore.setState({
        scenarios: [
          mockScenario,
          { ...mockScenario, id: 'test-fork-2', title: 'Relocation' },
        ],
      });
    });

    rerender(<DecisionSimulatorCard />);

    expect(screen.getByText('2 forks evaluated')).toBeInTheDocument();
  });

  it('navigates to /simulator when clicking Launch Simulator button', () => {
    render(<DecisionSimulatorCard />);

    const button = screen.getByRole('button', { name: /launch decision simulator/i });
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/simulator');
  });

  it('triggers onNavigate callback when provided', () => {
    const mockNavigate = jest.fn();
    render(<DecisionSimulatorCard onNavigate={mockNavigate} />);

    const button = screen.getByRole('button', { name: /launch decision simulator/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('applies custom className to card wrapper', () => {
    const { container } = render(<DecisionSimulatorCard className="custom-dash-class" />);
    expect(container.firstChild).toHaveClass('custom-dash-class');
  });
});
