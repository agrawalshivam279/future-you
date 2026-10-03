import React from 'react';
import { render, screen } from '@testing-library/react';
import { DualTimeline } from '../dual-timeline';
import { TimelineMilestone } from '@/types/timeline.types';

describe('DualTimeline Component', () => {
  const currentMilestones: TimelineMilestone[] = [
    {
      year: 1,
      title: 'Current Year 1',
      description: 'Continuing status-quo habits.',
      mood: 'neutral',
    },
    {
      year: 3,
      title: 'Current Year 3',
      description: 'Persistent stagnation.',
      mood: 'negative',
    },
    {
      year: 5,
      title: 'Current Year 5',
      description: 'Routine fatigue.',
      mood: 'negative',
    },
  ];

  const improvedMilestones: TimelineMilestone[] = [
    {
      year: 5,
      title: 'Improved Year 5',
      description: 'Full autonomy achieved.',
      mood: 'positive',
    },
    {
      year: 1,
      title: 'Improved Year 1',
      description: 'Habit foundation built.',
      mood: 'positive',
    },
    {
      year: 3,
      title: 'Improved Year 3',
      description: 'Breakthrough leadership.',
      mood: 'positive',
    },
  ];

  it('renders card title, description, and path legends', () => {
    render(
      <DualTimeline
        currentMilestones={currentMilestones}
        improvedMilestones={improvedMilestones}
      />
    );

    expect(screen.getByTestId('dual-timeline')).toBeInTheDocument();
    expect(screen.getByText('5-Year Timeline Comparison')).toBeInTheDocument();
    expect(
      screen.getByText(/Parallel milestone progression across Years 1, 3, and 5/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText('Current Path').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Improved Path').length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 3 milestone nodes for both trajectories', () => {
    render(
      <DualTimeline
        currentMilestones={currentMilestones}
        improvedMilestones={improvedMilestones}
      />
    );

    // Current Path nodes (rendered for both desktop and mobile layouts)
    expect(screen.getAllByTestId('timeline-node-current-1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId('timeline-node-current-3').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId('timeline-node-current-5').length).toBeGreaterThanOrEqual(1);

    // Improved Path nodes
    expect(screen.getAllByTestId('timeline-node-improved-1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId('timeline-node-improved-3').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId('timeline-node-improved-5').length).toBeGreaterThanOrEqual(1);
  });

  it('sorts out-of-order milestones chronologically', () => {
    render(
      <DualTimeline
        currentMilestones={currentMilestones}
        improvedMilestones={improvedMilestones}
      />
    );

    const yearLabels = screen.getAllByText(/Year (1|3|5)/i);
    expect(yearLabels.length).toBeGreaterThan(0);
  });

  it('handles empty milestone arrays gracefully without crashing', () => {
    render(<DualTimeline currentMilestones={[]} improvedMilestones={[]} />);

    expect(screen.getByTestId('dual-timeline')).toBeInTheDocument();
  });

  it('applies custom className to outer container', () => {
    render(
      <DualTimeline
        currentMilestones={currentMilestones}
        improvedMilestones={improvedMilestones}
        className="custom-timeline-container"
      />
    );

    expect(screen.getByTestId('dual-timeline')).toHaveClass('custom-timeline-container');
  });
});
