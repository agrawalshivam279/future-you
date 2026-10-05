import React from 'react';
import { render, screen } from '@testing-library/react';
import { AlignmentGauge } from '../alignment-gauge';

describe('AlignmentGauge Component', () => {
  it('renders meter role with correct ARIA attributes and text percentage', () => {
    render(<AlignmentGauge score={85} />);

    const meter = screen.getByRole('meter');
    expect(meter).toBeInTheDocument();
    expect(meter).toHaveAttribute('aria-valuenow', '85');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('Alignment')).toBeInTheDocument();
  });

  it('renders Strong Alignment badge and copy for scores >= 80', () => {
    render(<AlignmentGauge score={90} />);

    expect(screen.getByText('Strong Alignment')).toBeInTheDocument();
    expect(
      screen.getByText(/strongly anchored to your 5-year compounding vision/i)
    ).toBeInTheDocument();
  });

  it('renders Moderate Alignment badge and copy for scores between 50 and 79', () => {
    render(<AlignmentGauge score={65} />);

    expect(screen.getByText('Moderate Alignment')).toBeInTheDocument();
    expect(
      screen.getByText(/few habits drifting toward the status quo/i)
    ).toBeInTheDocument();
  });

  it('renders Drifting Trajectory badge and copy for scores < 50', () => {
    render(<AlignmentGauge score={35} />);

    expect(screen.getByText('Drifting Trajectory')).toBeInTheDocument();
    expect(
      screen.getByText(/pulling current daily habits toward old status quo defaults/i)
    ).toBeInTheDocument();
  });

  it('clamps out-of-bounds scores to [0, 100]', () => {
    const { rerender } = render(<AlignmentGauge score={150} />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();

    rerender(<AlignmentGauge score={-20} />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('hides description badge when showLabel is false', () => {
    render(<AlignmentGauge score={80} showLabel={false} />);

    expect(screen.queryByText('Strong Alignment')).not.toBeInTheDocument();
  });
});
