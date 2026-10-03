'use client';

import * as React from 'react';
import { ShieldCheck, Compass, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { STORAGE_PREFIX, HONESTY_DISCLAIMER } from '@/lib/constants';

export const DISCLAIMER_STORAGE_KEY = `${STORAGE_PREFIX}disclaimer-acknowledged`;

export interface DisclaimerModalProps {
  /** Controlled open state */
  isOpen?: boolean;
  /** Close callback */
  onClose?: () => void;
  /** Automatically prompt unacknowledged first-time visitors on mount */
  autoPrompt?: boolean;
}

/**
 * First-time visitor disclaimer modal.
 * Explains the reflection philosophy and local-first privacy model,
 * and records user acknowledgment to localStorage.
 */
export function DisclaimerModal({
  isOpen,
  onClose,
  autoPrompt = false,
}: DisclaimerModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  React.useEffect(() => {
    if (autoPrompt && typeof window !== 'undefined') {
      try {
        const acknowledged = localStorage.getItem(DISCLAIMER_STORAGE_KEY);
        if (acknowledged !== 'true') {
          setInternalOpen(true);
        }
      } catch {
        // Fallback for sandboxed or private browsing environments
        setInternalOpen(true);
      }
    }
  }, [autoPrompt]);

  const effectiveOpen = isOpen !== undefined ? isOpen : internalOpen;

  const handleDismiss = () => {
    setInternalOpen(false);
    onClose?.();
  };

  const handleAcknowledge = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');
      }
    } catch {
      // Ignore storage errors in restricted iframe/browser modes
    }
    handleDismiss();
  };

  return (
    <Modal
      isOpen={effectiveOpen}
      onClose={handleDismiss}
      title="A Tool for Reflection, Not Prediction"
      description="Important context before you begin your journey with Future You."
      className="max-w-lg"
    >
      <div className="space-y-4 py-2 text-sm text-text-secondary leading-relaxed">
        {/* Core Disclaimer Callout */}
        <div className="rounded-lg border border-accent-warning/30 bg-accent-warning/10 p-3.5 text-accent-warning text-xs">
          <p className="font-medium">{HONESTY_DISCLAIMER}</p>
        </div>

        {/* 3 Core Tenets */}
        <div className="space-y-3 pt-1">
          <div className="flex items-start space-x-3">
            <Compass className="h-5 w-5 text-accent-info mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider">
                1. Thought Experiment, Not Destiny
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Outputs simulate two hypothetical trajectories based on self-reported daily habits. They exist to illuminate habit leverage, not forecast unavoidable futures.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <ShieldCheck className="h-5 w-5 text-accent-success mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider">
                2. 100% Client-Side Privacy
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Zero telemetry, zero cloud databases, and zero tracking cookies. All data lives solely on this device in your browser&apos;s localStorage and IndexedDB.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Trash2 className="h-5 w-5 text-text-muted mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <h4 className="font-semibold text-text-primary text-xs uppercase tracking-wider">
                3. Total User Sovereignty
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                You retain complete ownership. You can clear your API keys, reflections, and chat transcripts at any time with a single click in Settings.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <Button
            variant="primary"
            size="md"
            onClick={handleAcknowledge}
            className="w-full sm:w-auto"
            aria-label="Acknowledge reflection disclaimer and proceed"
          >
            I Understand &amp; Begin
          </Button>
        </div>
      </div>
    </Modal>
  );
}
