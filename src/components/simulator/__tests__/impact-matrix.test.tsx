import React from 'react';
import { render, screen } from '@testing-library/react';
import { ImpactMatrix } from '../impact-matrix';
import { HorizonProjection, DomainDelta } from '@/types';

const mockProjections: HorizonProjection[] = [
  {
    year: 3,
    phaseTitle: 'Stabilized Traction',
    summary: 'Mid-term operations become sustainable and repeatable.',
    keyChallenge: 'Scaling dependencies',
    keyAdvantage: 'High autonomy and compounding revenue',
  },
  {
    year: 1,
    phaseTitle: 'Initial Disruption',
    summary: 'Navigating immediate transition shock and cash runway friction.',
    keyChallenge: 'Income volatility',
    keyAdvantage: 'Sharp learning velocity',
  },
  {
    year: 5,
    phaseTitle: 'Enduring Independence',
    summary: 'Structural shift in life autonomy and creative control.',
    keyChallenge: 'Long-term stamina maintenance',
    keyAdvantage: 'Total freedom over time',
  },
];

const mockDomainDeltas: DomainDelta[] = [
  {
    domain: 'career',
    label: 'Career Growth',
    delta: 8,
    reasoning: 'Accelerated skill acquisition and executive autonomy.',
  },
  {
    domain: 'finances',
    label: 'Financial Resilience',
    delta: -4,
    reasoning: 'Depletion of initial cash runway before revenue stabilizes.',
  },
  {
    domain: 'health',
    label: 'Energy & Vitality',
    delta: 0,
    reasoning: 'Balanced by heightened autonomy despite higher building hours.',
  },
  {
    domain: 'relationships',
    label: 'Relationships & Community',
    delta: -2,
    reasoning: 'Temporary reduction in casual social hours.',
  },
  {
    domain: 'lifestyle',
    label: 'Autonomy & Lifestyle',
    delta: 7,
    reasoning: 'Complete control over daily calendar and creative priorities.',
  },
];

describe('ImpactMatrix Component', () => {
  it('renders section headings and descriptions', () => {
    render(<ImpactMatrix projections={mockProjections} domainDeltas={mockDomainDeltas} />);

    expect(screen.getByRole('heading', { name: /Domain Impact Deltas/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Multi-Horizon Projections \(Years 1, 3, and 5\)/i })
    ).toBeInTheDocument();
  });

  it('renders all domain delta scorecards with formatted signs and reasoning', () => {
    render(<ImpactMatrix projections={mockProjections} domainDeltas={mockDomainDeltas} />);

    // Positive delta
    expect(screen.getByText('Career Growth')).toBeInTheDocument();
    expect(screen.getByText('+8')).toBeInTheDocument();
    expect(
      screen.getByText('Accelerated skill acquisition and executive autonomy.')
    ).toBeInTheDocument();

    // Negative delta
    expect(screen.getByText('Financial Resilience')).toBeInTheDocument();
    expect(screen.getByText('-4')).toBeInTheDocument();

    // Neutral delta
    expect(screen.getByText('Energy & Vitality')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();

    // Aria labels
    expect(screen.getByLabelText('Career Growth delta: +8')).toBeInTheDocument();
    expect(screen.getByLabelText('Financial Resilience delta: -4')).toBeInTheDocument();
    expect(screen.getByLabelText('Energy & Vitality delta: 0')).toBeInTheDocument();
  });

  it('renders all 3 multi-horizon projection cards sorted chronologically', () => {
    render(<ImpactMatrix projections={mockProjections} domainDeltas={mockDomainDeltas} />);

    // Check Year 1
    expect(screen.getByText('Initial Disruption')).toBeInTheDocument();
    expect(screen.getByText(/Navigating immediate transition shock/i)).toBeInTheDocument();
    expect(screen.getByText('Income volatility')).toBeInTheDocument();
    expect(screen.getByText('Sharp learning velocity')).toBeInTheDocument();

    // Check Year 3
    expect(screen.getByText('Stabilized Traction')).toBeInTheDocument();
    expect(screen.getByText(/Mid-term operations become sustainable/i)).toBeInTheDocument();

    // Check Year 5
    expect(screen.getByText('Enduring Independence')).toBeInTheDocument();
    expect(screen.getByText(/Structural shift in life autonomy/i)).toBeInTheDocument();

    // Verify chronological order in the rendered cards
    const cards = screen.getAllByLabelText(/Projection for Year \d/i);
    expect(cards).toHaveLength(3);
    expect(cards[0]).toHaveAttribute('aria-label', expect.stringContaining('Year 1'));
    expect(cards[1]).toHaveAttribute('aria-label', expect.stringContaining('Year 3'));
    expect(cards[2]).toHaveAttribute('aria-label', expect.stringContaining('Year 5'));
  });
});
