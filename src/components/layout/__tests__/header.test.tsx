import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../header';

describe('Header Layout Component', () => {
  it('renders with role="banner" and displays default brand title', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(screen.getByText('Future You')).toBeInTheDocument();
    expect(screen.getByLabelText('Future You Home')).toHaveAttribute('href', '/');
  });

  it('renders custom title when provided', () => {
    render(<Header title="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders settings link with aria-label', () => {
    render(<Header />);
    const settingsLink = screen.getByLabelText('Settings');
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('triggers onOpenDisclaimer when disclaimer button is clicked', () => {
    const handleOpenDisclaimer = jest.fn();
    render(<Header onOpenDisclaimer={handleOpenDisclaimer} />);

    const disclaimerBtn = screen.getByRole('button', { name: /view reflection disclaimer/i });
    expect(disclaimerBtn).toBeInTheDocument();

    fireEvent.click(disclaimerBtn);
    expect(handleOpenDisclaimer).toHaveBeenCalledTimes(1);
  });

  it('hides navigation when showNav is false', () => {
    render(<Header showNav={false} onOpenDisclaimer={jest.fn()} />);
    expect(screen.queryByLabelText('Settings')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /view reflection disclaimer/i })).not.toBeInTheDocument();
  });
});
