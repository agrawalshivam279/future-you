import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { TradeOffsCard } from '../trade-offs-card';

const mockTradeOffs = [
  'Reduced liquid savings buffer for the first 12-18 months.',
  'Compromised leisure hours and weekend disconnect time during initial launch phase.',
  'Postponement of non-essential discretionary capital expenditures.',
];

const mockUnforeseenRisks = [
  'Creeping cognitive fatigue causing suboptimal decision-making across personal relationships.',
  'Unanticipated regulatory or compliance compliance friction in the new sector.',
  'Over-dependence on a single partner channel during early customer acquisition.',
];

describe('TradeOffsCard Component', () => {
  it('renders section title and explanatory description', () => {
    render(<TradeOffsCard tradeOffs={mockTradeOffs} unforeseenRisks={mockUnforeseenRisks} />);

    expect(
      screen.getByRole('heading', { name: /Trade-offs & Latent Blindspots/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Confronting the unavoidable sacrifices and non-obvious hazards of this path/i)
    ).toBeInTheDocument();
  });

  it('renders direct sacrifices card with badges, numbers, and items', () => {
    render(<TradeOffsCard tradeOffs={mockTradeOffs} unforeseenRisks={mockUnforeseenRisks} />);

    expect(screen.getByText('Direct Sacrifices & Frictions')).toBeInTheDocument();
    expect(screen.getByText('Explicit costs required by this choice')).toBeInTheDocument();
    expect(screen.getByText('Trade-offs')).toBeInTheDocument();

    const card = screen.getByLabelText('Direct sacrifices and frictions');
    expect(card).toBeInTheDocument();

    mockTradeOffs.forEach((item) => {
      expect(within(card).getByText(item)).toBeInTheDocument();
    });

    expect(within(card).getByText('01')).toBeInTheDocument();
    expect(within(card).getByText('02')).toBeInTheDocument();
    expect(within(card).getByText('03')).toBeInTheDocument();
  });

  it('renders unforeseen risks card with badges, numbers, and items', () => {
    render(<TradeOffsCard tradeOffs={mockTradeOffs} unforeseenRisks={mockUnforeseenRisks} />);

    expect(screen.getByText('Unforeseen & Latent Risks')).toBeInTheDocument();
    expect(screen.getByText('Second-order hazards and hidden vulnerabilities')).toBeInTheDocument();
    expect(screen.getByText('Blindspots')).toBeInTheDocument();

    const card = screen.getByLabelText('Unforeseen and latent risks');
    expect(card).toBeInTheDocument();

    mockUnforeseenRisks.forEach((risk) => {
      expect(within(card).getByText(risk)).toBeInTheDocument();
    });

    expect(within(card).getByText('01')).toBeInTheDocument();
    expect(within(card).getByText('02')).toBeInTheDocument();
    expect(within(card).getByText('03')).toBeInTheDocument();
  });

  it('renders fallback messages when tradeOffs and unforeseenRisks are empty', () => {
    render(<TradeOffsCard tradeOffs={[]} unforeseenRisks={[]} />);

    expect(
      screen.getByText(/No explicit trade-offs detected for this decision\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No latent blindspots detected for this decision\./i)
    ).toBeInTheDocument();
  });

  it('filters out whitespace-only entries and renders fallback when all items are blank', () => {
    render(<TradeOffsCard tradeOffs={['  ', '']} unforeseenRisks={['\t']} />);

    expect(
      screen.getByText(/No explicit trade-offs detected for this decision\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No latent blindspots detected for this decision\./i)
    ).toBeInTheDocument();
  });

  it('merges custom container className', () => {
    const { container } = render(
      <TradeOffsCard
        tradeOffs={mockTradeOffs}
        unforeseenRisks={mockUnforeseenRisks}
        className="test-custom-wrapper"
      />
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('test-custom-wrapper');
  });
});
