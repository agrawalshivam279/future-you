import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

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
 * dark theme configuration, and the mandatory persistent honesty disclaimer footer.
 *
 * @param props - Layout component properties containing child pages
 * @returns JSX Element for root HTML document
 */
export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen bg-bg-primary text-text-primary antialiased selection:bg-accent-info/30 selection:text-text-primary">
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Persistent Honesty Disclaimer Footer */}
        <footer
          role="contentinfo"
          className="border-t border-border-primary py-4 px-6 text-center text-xs text-text-tertiary select-none"
        >
          <p>
            Future You is a reflection tool, not a prediction engine. Results are illustrative and
            based on your self-reported inputs.
          </p>
        </footer>
      </body>
    </html>
  );
}
