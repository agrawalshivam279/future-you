import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppShell } from '../app-shell';
import { DISCLAIMER_STORAGE_KEY } from '../disclaimer-modal';

describe('AppShell Layout Component', () => {
  beforeEach(() => {
    localStorage.clear();
    // Simulate returning visitor by default in layout tests
    localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');
  });

  it('renders Header, main content, and Footer', () => {
    render(
      <AppShell>
        <div data-testid="page-content">Hello Future You</div>
      </AppShell>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('opens DisclaimerModal when footer disclaimer button is clicked', () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const footerBtn = screen.getByRole('button', { name: /read full reflection disclaimer/i });
    fireEvent.click(footerBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('A Tool for Reflection, Not Prediction')).toBeInTheDocument();
  });

  it('opens DisclaimerModal when header disclaimer button is clicked', () => {
    render(
      <AppShell>
        <div>Content</div>
      </AppShell>
    );

    const headerBtn = screen.getByRole('button', { name: /view reflection disclaimer/i });
    fireEvent.click(headerBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
