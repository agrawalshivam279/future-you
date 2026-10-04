/**
 * Utility for formatting and downloading future-self letters as local text files.
 * Ensures zero cloud transmission and appends the mandatory reflection disclaimer.
 */

import { HONESTY_DISCLAIMER } from '@/lib/constants';

export interface ExportLetterOptions {
  /** Display name of the future persona */
  personaName: string;
  /** Trajectory trajectory identifier */
  personaId: 'current' | 'improved';
  /** Target future age (current age + 5) */
  targetAge?: number;
  /** Present user callsign or name */
  userName?: string;
  /** Current date for header timestamp */
  currentDate?: Date;
}

/**
 * Formats a future-self letter into an elegant plain-text document
 * complete with header, trajectory metadata, and honesty disclaimer.
 *
 * @param letter - Raw letter content
 * @param options - Formatting configuration options
 * @returns Fully formatted text string
 */
export function formatLetterText(letter: string, options: ExportLetterOptions): string {
  const dateObj = options.currentDate || new Date();
  const futureYear = dateObj.getFullYear() + 5;
  const monthName = dateObj.toLocaleString('default', { month: 'long' });
  const day = dateObj.getDate();

  const recipient = options.userName || 'Past Self';
  const trajectoryLabel =
    options.personaId === 'improved' ? 'Improved Path' : 'Current Path';

  const cleanLetter = letter.trim();

  return `================================================================================
A LETTER FROM YOUR FUTURE SELF (5 YEARS AHEAD)
================================================================================

Date: ${monthName} ${day}, ${futureYear} (Simulated)
From: ${options.personaName} (Age ${options.targetAge ?? 'N/A'}, ${trajectoryLabel})
To:   ${recipient}

--------------------------------------------------------------------------------

${cleanLetter}

--------------------------------------------------------------------------------
DISCLAIMER & REFLECTION NOTICE:
${HONESTY_DISCLAIMER}
This document was generated locally and stored exclusively on your device.
================================================================================
`;
}

/**
 * Triggers a client-side download of the future-self letter as a .txt file.
 *
 * @param letter - Raw letter content
 * @param options - Configuration options
 */
export function downloadLetterAsText(
  letter: string,
  options: ExportLetterOptions
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const formattedContent = formatLetterText(letter, options);
  const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const safeName = (options.userName || 'future-you')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `${safeName}-letter-${options.personaId}-${dateStamp}.txt`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.setAttribute('aria-hidden', 'true');

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
