import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../skeleton';

describe('Skeleton Primitive Component', () => {
  it('renders with role="status" and default styles', () => {
    render(<Skeleton data-testid="skeleton" />);
    const el = screen.getByRole('status');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('motion-safe:animate-pulse');
    expect(el).toHaveClass('rounded-md');
  });

  it('renders all predefined variants correctly', () => {
    const { rerender } = render(<Skeleton variant="circular" />);
    expect(screen.getByRole('status')).toHaveClass('rounded-full');

    rerender(<Skeleton variant="text" />);
    expect(screen.getByRole('status')).toHaveClass('h-4');
    expect(screen.getByRole('status')).toHaveClass('w-full');

    rerender(<Skeleton variant="card" />);
    expect(screen.getByRole('status')).toHaveClass('h-32');
    expect(screen.getByRole('status')).toHaveClass('rounded-lg');
  });

  it('applies custom inline width and height styles', () => {
    render(<Skeleton width={200} height={50} />);
    const el = screen.getByRole('status');
    expect(el).toHaveStyle({ width: '200px', height: '50px' });
  });

  it('supports string width and height percentages', () => {
    render(<Skeleton width="75%" height="2rem" />);
    const el = screen.getByRole('status');
    expect(el).toHaveStyle({ width: '75%', height: '2rem' });
  });

  it('merges custom className', () => {
    render(<Skeleton className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });

  it('provides screen reader accessible text', () => {
    render(<Skeleton />);
    expect(screen.getByText('Loading content...')).toBeInTheDocument();
  });
});
