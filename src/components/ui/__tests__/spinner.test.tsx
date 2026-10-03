import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../spinner';

describe('Spinner Primitive Component', () => {
  it('renders with default size, variant, and accessible role', () => {
    render(<Spinner />);
    const container = screen.getByRole('status');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('aria-label', 'Loading...');

    const svg = screen.getByTestId('spinner-svg');
    expect(svg).toHaveClass('h-6', 'w-6', 'text-text-tertiary', 'motion-safe:animate-spin');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders all sizes correctly', () => {
    const { rerender } = render(<Spinner size="sm" />);
    expect(screen.getByTestId('spinner-svg')).toHaveClass('h-4', 'w-4');

    rerender(<Spinner size="md" />);
    expect(screen.getByTestId('spinner-svg')).toHaveClass('h-6', 'w-6');

    rerender(<Spinner size="lg" />);
    expect(screen.getByTestId('spinner-svg')).toHaveClass('h-8', 'w-8');

    rerender(<Spinner size="xl" />);
    expect(screen.getByTestId('spinner-svg')).toHaveClass('h-12', 'w-12');
  });

  it('renders all color variants correctly', () => {
    const { rerender } = render(<Spinner variant="primary" />);
    expect(screen.getByTestId('spinner-svg')).toHaveClass('text-text-primary');

    rerender(<Spinner variant="current" />);
    expect(screen.getByTestId('spinner-svg')).toHaveClass('text-amber-500');

    rerender(<Spinner variant="improved" />);
    expect(screen.getByTestId('spinner-svg')).toHaveClass('text-emerald-500');
  });

  it('supports custom accessible label', () => {
    render(<Spinner label="Generating your future self..." />);
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-label', 'Generating your future self...');
    expect(screen.getByText('Generating your future self...')).toBeInTheDocument();
  });

  it('merges custom className on container', () => {
    render(<Spinner className="my-custom-spinner" />);
    expect(screen.getByRole('status')).toHaveClass('my-custom-spinner');
  });
});
