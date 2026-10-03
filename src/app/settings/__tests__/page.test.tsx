import * as React from 'react';
import { render, screen } from '@testing-library/react';
import SettingsPage from '../page';
import { ToastProvider } from '@/components/ui/toast';

describe('SettingsPage View', () => {
  it('renders heading, back link, and API configuration form', () => {
    render(
      <ToastProvider>
        <SettingsPage />
      </ToastProvider>
    );

    expect(screen.getByRole('heading', { level: 1, name: /settings & preferences/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
    expect(screen.getByText('AI Provider Configuration')).toBeInTheDocument();
    expect(screen.getByText('Data & Privacy Management')).toBeInTheDocument();
  });
});
