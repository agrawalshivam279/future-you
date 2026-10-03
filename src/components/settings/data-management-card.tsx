'use client';

import React, { useState } from 'react';
import { Download, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { downloadDataAsJSON, deleteAllLocalData } from '@/lib/storage/data-manager';

export interface DataManagementCardProps {
  className?: string;
}

/**
 * Settings card component managing local data backup export and irreversible data deletion.
 *
 * @param props - DataManagementCard component properties
 * @returns JSX Element rendering the data management and privacy card
 */
export function DataManagementCard({ className }: DataManagementCardProps): React.JSX.Element {
  const { showToast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExport = () => {
    try {
      downloadDataAsJSON();
      showToast({
        type: 'success',
        title: 'Export Complete',
        message: 'Your data has been exported to a JSON backup.',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export data backup. Please try again.',
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAllLocalData();
      setIsConfirmOpen(false);
      showToast({
        type: 'success',
        title: 'Data Deleted',
        message: 'All local data, credentials, and reflections have been erased.',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Deletion Failed',
        message: 'An error occurred while wiping local storage.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <ShieldCheck className="w-5 h-5 text-accent-improved" aria-hidden="true" />
            Data & Privacy Management
          </CardTitle>
          <CardDescription>
            Future You operates with zero cloud storage. All your reflection logs, habit lever
            simulations, and API keys reside exclusively on this device.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-text-primary">Export Data Backup</h4>
              <p className="text-xs text-text-muted">
                Download a complete JSON file containing all your local settings, reflections, and
                conversations.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleExport}
              leftIcon={<Download className="w-4 h-4" aria-hidden="true" />}
              aria-label="Export all local data as JSON"
              className="shrink-0"
            >
              Export JSON
            </Button>
          </div>

          <div className="border-t border-border-primary/50" />

          {/* Delete Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-accent-danger">Delete All Stored Data</h4>
              <p className="text-xs text-text-muted">
                Permanently purge all onboarding responses, generated personas, chat logs, and API
                keys from this browser.
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              onClick={() => setIsConfirmOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4" aria-hidden="true" />}
              aria-label="Open delete all data confirmation dialog"
              className="shrink-0"
            >
              Delete All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => !isDeleting && setIsConfirmOpen(false)}
        title="Permanently Delete All Data?"
        description="This action cannot be undone. All your self-reflections, generated future personas, conversation history, and saved API keys will be erased immediately from this browser."
      >
        <div className="space-y-6 pt-2">
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-accent-danger/10 border border-accent-danger/20 text-accent-danger text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Because Future You has no remote servers or accounts, deleted data cannot be
              recovered unless you previously exported a JSON backup.
            </span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isDeleting}
              aria-label="Cancel data deletion"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              leftIcon={<Trash2 className="w-4 h-4" aria-hidden="true" />}
              aria-label="Confirm permanent deletion of all data"
              className="w-full sm:w-auto"
            >
              Yes, Delete Everything
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
