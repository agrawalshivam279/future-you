import React, { useState } from 'react';
import { Download, Copy, FileCode, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/toast';
import { ShareCardConfig, ShareCardData } from '@/types/share.types';
import { downloadCard, copyCardToClipboard } from '@/lib/export/card-export-actions';

export interface ShareActionsProps {
  /** Simulation snapshot to export */
  data: ShareCardData;
  /** Active card styling and privacy configuration */
  config: ShareCardConfig;
  /** Optional container style override */
  className?: string;
  /** Optional callback fired after successful export */
  onExportSuccess?: (action: 'png' | 'svg' | 'clipboard') => void;
}

/**
 * Action button bar for downloading and copying the shareable result card.
 * Provides accessible loading states and toast notifications.
 */
export function ShareActions({
  data,
  config,
  className = '',
  onExportSuccess,
}: ShareActionsProps): JSX.Element {
  const { showToast } = useToast();
  const [activeAction, setActiveAction] = useState<'png' | 'svg' | 'clipboard' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = async (format: 'png' | 'svg') => {
    setActiveAction(format);
    try {
      const exportConfig: ShareCardConfig = { ...config, format };
      const filename = await downloadCard(data, exportConfig);
      showToast({
        title: `${format.toUpperCase()} Downloaded`,
        message: `Saved as ${filename}`,
        type: 'success',
      });
      onExportSuccess?.(format);
    } catch (error) {
      showToast({
        title: 'Download Failed',
        message: error instanceof Error ? error.message : 'Failed to export card image.',
        type: 'error',
      });
    } finally {
      setActiveAction(null);
    }
  };

  const handleCopyClipboard = async () => {
    setActiveAction('clipboard');
    try {
      await copyCardToClipboard(data, config);
      setCopied(true);
      showToast({
        title: 'Copied to Clipboard',
        message: 'Card image copied. You can paste it into any app or message.',
        type: 'success',
      });
      setTimeout(() => setCopied(false), 2500);
      onExportSuccess?.('clipboard');
    } catch (error) {
      showToast({
        title: 'Copy Failed',
        message:
          error instanceof Error
            ? error.message
            : 'Clipboard copy failed. Try downloading PNG instead.',
        type: 'error',
      });
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div
      role="group"
      aria-label="Share Export Actions"
      className={`flex flex-wrap items-center gap-3 ${className}`}
    >
      {/* PNG Download Button */}
      <Button
        type="button"
        variant="primary"
        size="md"
        disabled={activeAction !== null}
        onClick={() => handleDownload('png')}
        aria-label="Download PNG Card Image"
        className="flex-1 sm:flex-initial"
      >
        {activeAction === 'png' ? (
          <>
            <Spinner size="sm" className="mr-2" />
            <span>Rendering PNG...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            <span>Download PNG</span>
          </>
        )}
      </Button>

      {/* SVG Download Button */}
      <Button
        type="button"
        variant="secondary"
        size="md"
        disabled={activeAction !== null}
        onClick={() => handleDownload('svg')}
        aria-label="Download Vector SVG Card"
        className="flex-1 sm:flex-initial"
      >
        {activeAction === 'svg' ? (
          <>
            <Spinner size="sm" className="mr-2" />
            <span>Generating SVG...</span>
          </>
        ) : (
          <>
            <FileCode className="w-4 h-4 mr-2" />
            <span>Download SVG</span>
          </>
        )}
      </Button>

      {/* Copy to Clipboard Button */}
      <Button
        type="button"
        variant="ghost"
        size="md"
        disabled={activeAction !== null}
        onClick={handleCopyClipboard}
        aria-label="Copy Card Image to Clipboard"
        className="flex-1 sm:flex-initial border border-zinc-800 hover:border-zinc-700"
      >
        {activeAction === 'clipboard' ? (
          <>
            <Spinner size="sm" className="mr-2" />
            <span>Copying...</span>
          </>
        ) : copied ? (
          <>
            <Check className="w-4 h-4 mr-2 text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            <span>Copy Image</span>
          </>
        )}
      </Button>
    </div>
  );
}
