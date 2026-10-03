import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';

export const metadata: Metadata = {
  title: 'Future You — AI Reflection & Habit Simulation',
  description:
    'Simulate two future versions of yourself five years from now based on your habits, goals, and values.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * RootLayout component wrapping the application with metadata,
 * dark theme configuration, and the persistent AppShell layout.
 *
 * @param props - Layout component properties containing child pages
 * @returns JSX Element for root HTML document
 */
export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-bg-primary text-text-primary antialiased selection:bg-accent-info/30 selection:text-text-primary">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
