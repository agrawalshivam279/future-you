import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TimelineNode } from '../timeline-node';
import { TimelineMilestone } from '@/types/timeline.types';

describe('TimelineNode Component', () => {
  const milestoneY1: TimelineMilestone = {
    year: 1,
    title: 'Habit Anchor',
    description: 'Stabilized morning routines and workout habit.',
    mood: 'positive',
  };

  const milestoneY3: TimelineMilestone = {
    year: 3,
    title: 'Role Elevation',
    description: 'Promoted to Staff Architect.',
    mood: 'positive',
  };

  const milestoneY5: TimelineMilestone = {
    year: 5,
    title: 'Creative Independence',
    description: 'Directing research lab with sustained vitality.',
    mood: 'positive',
  };

  it('renders button with accessible aria-label and correct node size for Year 1', () => {
    render(<TimelineNode milestone={milestoneY1} personaId="improved" />);

    const btn = screen.getByRole('button', {
      name: `Year 1 milestone: ${milestoneY1.title}`,
    });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('w-3.5');
    expect(btn).toHaveClass('h-3.5');
  });

  it('renders correct node size for Year 3 and Year 5', () => {
    const { rerender } = render(
      <TimelineNode milestone={milestoneY3} personaId="improved" />
    );
    let btn = screen.getByRole('button', {
      name: `Year 3 milestone: ${milestoneY3.title}`,
    });
    expect(btn).toHaveClass('w-[18px]');
    expect(btn).toHaveClass('h-[18px]');

    rerender(<TimelineNode milestone={milestoneY5} personaId="current" />);
    btn = screen.getByRole('button', {
      name: `Year 5 milestone: ${milestoneY5.title}`,
    });
    expect(btn).toHaveClass('w-6');
    expect(btn).toHaveClass('h-6');
  });

  it('toggles tooltip visibility upon mouse enter and mouse leave', () => {
    render(<TimelineNode milestone={milestoneY1} personaId="improved" />);

    expect(screen.queryByText('Habit Anchor')).not.toBeInTheDocument();

    const nodeContainer = screen.getByTestId('timeline-node-improved-1').parentElement!;
    fireEvent.mouseEnter(nodeContainer);
    expect(screen.getByText('Habit Anchor')).toBeInTheDocument();

    fireEvent.mouseLeave(nodeContainer);
    expect(screen.queryByText('Habit Anchor')).not.toBeInTheDocument();
  });

  it('shows tooltip on button focus and hides on blur', () => {
    render(<TimelineNode milestone={milestoneY1} personaId="improved" />);

    const btn = screen.getByRole('button');
    fireEvent.focus(btn);
    expect(screen.getByText('Habit Anchor')).toBeInTheDocument();

    fireEvent.blur(btn);
    expect(screen.queryByText('Habit Anchor')).not.toBeInTheDocument();
  });

  it('displays tooltip unconditionally when isSelected is true', () => {
    render(
      <TimelineNode
        milestone={milestoneY1}
        personaId="current"
        isSelected={true}
      />
    );

    expect(screen.getByText('Habit Anchor')).toBeInTheDocument();
  });

  it('triggers onSelect callback when clicked', () => {
    const onSelectMock = jest.fn();
    render(
      <TimelineNode
        milestone={milestoneY1}
        personaId="improved"
        onSelect={onSelectMock}
      />
    );

    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(onSelectMock).toHaveBeenCalledTimes(1);
    expect(onSelectMock).toHaveBeenCalledWith(milestoneY1);
  });
});
