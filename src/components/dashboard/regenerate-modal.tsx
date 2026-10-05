import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export interface RegenerateModalProps {
  /** Whether the modal dialog is open */
  isOpen: boolean;
  /** Callback invoked to close the modal */
  onClose: () => void;
  /** Callback invoked when the user confirms regeneration */
  onConfirm: () => void;
}

/**
 * Confirmation dialog for regenerating the 5-year AI simulation.
 */
export function RegenerateModal({
  isOpen,
  onClose,
  onConfirm,
}: RegenerateModalProps): JSX.Element {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Regenerate Your Futures?"
      className="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-sm text-text-secondary leading-relaxed">
          This will re-run the 5-stage AI simulation pipeline using your existing onboarding responses.
          Newly generated personas, timelines, and letters will replace your current ones.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            aria-label="Cancel regeneration"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            aria-label="Confirm regeneration"
          >
            Yes, Regenerate
          </Button>
        </div>
      </div>
    </Modal>
  );
}
