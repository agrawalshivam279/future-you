import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Footer } from '../footer';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

describe('Footer Layout Component', () => {
  it('renders with role="contentinfo" and displays honesty disclaimer', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(screen.getByText(HONESTY_DISCLAIMER)).toBeInTheDocument();
  });

  it('displays zero cloud storage privacy notice', () => {
    render(<Footer />);
    expect(
      screen.getByText(/zero cloud storage\. all inputs and personas remain strictly inside your browser\./i)
    ).toBeInTheDocument();
  });

  it('triggers onOpenDisclaimer when Full Disclaimer button is clicked', () => {
    const handleOpenDisclaimer = jest.fn();
    render(<Footer onOpenDisclaimer={handleOpenDisclaimer} />);

    const button = screen.getByRole('button', { name: /read full reflection disclaimer/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleOpenDisclaimer).toHaveBeenCalledTimes(1);
  });

  it('renders copyright year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});
