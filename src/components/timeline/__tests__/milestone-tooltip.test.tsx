import React from 'react';
import { render, screen } from '@testing-library/react';
import { MilestoneTooltip } from '../milestone-tooltip';
import { TimelineMilestone } from '@/types/timeline.types';

describe('MilestoneTooltip Component', () => {
  const mockMilestone: TimelineMilestone = {
    year: 1,
    title: 'Solidified Core Habits',
    description: 'Stabilized sleep schedule and committed 5 hours weekly to deep work.',
    mood: 'positive',
    metrics: {
      sleep: '7.5h',
      savingsRate: '20%',
    },
  };

  it('renders milestone headline, description, mood badge, and metrics', () => {
    render(
      <MilestoneTooltip
        milestone={mockMilestone}
        personaId="improved"
        isVisible={true}
      />
    );

    expect(screen.getByText('Year 1 Horizon')).toBeInTheDocument();
    expect(screen.getByText('Solidified Core Habits')).toBeInTheDocument();
    expect(
      screen.getByText(/Stabilized sleep schedule and committed 5 hours weekly/i)
    ).toBeInTheDocument();
    expect(screen.getByText('positive')).toBeInTheDocument();
    expect(screen.getByText('7.5h')).toBeInTheDocument();
    expect(screen.getByText('20%')).toBeInTheDocument();
  });

  it('does not render tooltip content when isVisible is false', () => {
    render(
      <MilestoneTooltip
        milestone={mockMilestone}
        personaId="current"
        isVisible={false}
      />
    );

    expect(screen.queryByText('Solidified Core Habits')).not.toBeInTheDocument();
  });

  it('renders negative mood badge and current path styling', () => {
    const negativeMilestone: TimelineMilestone = {
      year: 3,
      title: 'Stagnation Period',
      description: 'Career progression paused due to lack of deliberate practice.',
      mood: 'negative',
    };

    render(
      <MilestoneTooltip
        milestone={negativeMilestone}
        personaId="current"
        isVisible={true}
        position="bottom"
      />
    );

    expect(screen.getByText('Year 3 Horizon')).toBeInTheDocument();
    expect(screen.getByText('negative')).toBeInTheDocument();
    expect(screen.getByText('Stagnation Period')).toBeInTheDocument();
  });

  it('applies custom className and position classes', () => {
    render(
      <MilestoneTooltip
        milestone={mockMilestone}
        personaId="improved"
        isVisible={true}
        position="bottom"
        className="custom-tooltip-class"
      />
    );

    const tooltip = screen.getByTestId('milestone-tooltip-improved-1');
    expect(tooltip).toHaveClass('custom-tooltip-class');
    expect(tooltip).toHaveClass('top-full');
  });
});
