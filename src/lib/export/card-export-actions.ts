/**
 * Client-side card download and clipboard actions.
 * Saves vector SVG or raster PNG files locally with zero server communication.
 */

import { ShareCardConfig, ShareCardData, CardExportFormat } from '@/types/share.types';
import { exportCardBlob } from './card-canvas-renderer';

/**
 * Generates a clean, date-stamped filename for the exported artifact.
 */
export function generateCardExportFilename(
  data: ShareCardData,
  format: CardExportFormat
): string {
  const dateStr = (data.generatedAt || new Date().toISOString()).split('T')[0];
  return `future-you-simulation-${dateStr}.${format}`;
}

/**
 * Downloads the simulation card directly to the user's browser device.
 */
export async function downloadCard(
  data: ShareCardData,
  config: ShareCardConfig,
  customFilename?: string
): Promise<string> {
  const filename = customFilename || generateCardExportFilename(data, config.format);
  const blob = await exportCardBlob(data, config);

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke object URL after slight delay to ensure browser completes download
  setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);

  return filename;
}

/**
 * Copies the rasterized PNG representation of the card directly to the system clipboard.
 */
export async function copyCardToClipboard(
  data: ShareCardData,
  config: ShareCardConfig
): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    throw new Error('Clipboard API is not available in this browser environment');
  }

  // Ensure format is PNG for clipboard item compatibility
  const pngConfig: ShareCardConfig = { ...config, format: 'png' };
  const blob = await exportCardBlob(data, pngConfig);

  if (typeof ClipboardItem !== 'undefined') {
    const item = new ClipboardItem({ 'image/png': blob });
    await navigator.clipboard.write([item]);
    return true;
  }

  throw new Error('ClipboardItem API is not supported in this browser');
}
