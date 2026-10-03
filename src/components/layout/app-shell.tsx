'use client';

import * as React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { DisclaimerModal } from '@/components/layout/disclaimer-modal';

import { ToastProvider } from '@/components/ui/toast';

export interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Client-side application layout shell.
 * Coordinates Header, main content area, Footer, ToastProvider, and the Disclaimer modal.
 */
export function AppShell({ children }: AppShellProps) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = React.useState(false);

  return (
    <ToastProvider>
      <Header onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        autoPrompt={true}
      />
    </ToastProvider>
  );
}
