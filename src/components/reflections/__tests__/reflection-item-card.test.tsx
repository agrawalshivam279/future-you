import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReflectionItemCard } from '../reflection-item-card';

describe('ReflectionItemCard Component', () => {
  it('renders a regret reflection with badge and accessible button role', () => {
    render(
      <ReflectionItemCard
        text="Procrastinating on launching side projects until perfect."
        type="regret"
        index={0}
      />
    );

    expect(screen.getByText('Regret')).toBeInTheDocument();
    expect(
      screen.getByText('Procrastinating on launching side projects until perfect.')
    ).toBeInTheDocument();

    const cardButton = screen.getByRole('button', {
      name: /Regret: Procrastinating on launching side projects/i,
    });
    expect(cardButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders a gratitude reflection with gratitude styling', () => {
    render(
      <ReflectionItemCard
        text="Showing up every morning for 30 minutes of deep focus."
        type="gratitude"
        index={1}
      />
    );

    expect(screen.getByText('Gratitude')).toBeInTheDocument();
    expect(
      screen.getByText('Showing up every morning for 30 minutes of deep focus.')
    ).toBeInTheDocument();
  });

  it('expands and collapses context when clicked or activated with Enter key', () => {
    render(
      <ReflectionItemCard
        text="Never taking the time to learn investing."
        type="regret"
      />
    );

    const cardButton = screen.getByRole('button');
    expect(cardButton).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Psychological Insight')).not.toBeInTheDocument();

    // Click to expand
    fireEvent.click(cardButton);
    expect(cardButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Psychological Insight')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(cardButton);
    expect(cardButton).toHaveAttribute('aria-expanded', 'false');

    // Press Enter to expand
    fireEvent.keyDown(cardButton, { key: 'Enter' });
    expect(cardButton).toHaveAttribute('aria-expanded', 'true');

    // Press Space to collapse
    fireEvent.keyDown(cardButton, { key: ' ' });
    expect(cardButton).toHaveAttribute('aria-expanded', 'false');
  });
});
