import { render, screen } from '@testing-library/react';
import React from 'react';
import { Badge } from '../badge';

describe('Badge Primitive', () => {
  it('renders children and default neutral styling', () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText('Default Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-bg-tertiary');
  });

  it('renders persona variants properly', () => {
    const { rerender } = render(<Badge variant="current">Current Path</Badge>);
    expect(screen.getByText('Current Path')).toHaveClass('text-accent-current');

    rerender(<Badge variant="improved">Improved Path</Badge>);
    expect(screen.getByText('Improved Path')).toHaveClass('text-accent-improved');

    rerender(<Badge variant="danger">High Regret</Badge>);
    expect(screen.getByText('High Regret')).toHaveClass('text-accent-danger');
  });

  it('renders different sizes properly', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('text-xs');

    rerender(<Badge size="md">Medium</Badge>);
    expect(screen.getByText('Medium')).toHaveClass('text-sm');
  });
});
