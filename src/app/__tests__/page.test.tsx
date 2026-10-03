import { render, screen } from '@testing-library/react';
import React from 'react';
import HomePage from '../page';

describe('HomePage Landing View', () => {
  it('renders the main reflection headline', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/meet the person you're becoming/i);
  });

  it('renders an accessible Begin button linking to onboarding', () => {
    render(<HomePage />);
    const beginLink = screen.getByRole('link', { name: /begin onboarding flow/i });
    expect(beginLink).toBeInTheDocument();
    expect(beginLink).toHaveAttribute('href', '/onboarding');
  });
});
