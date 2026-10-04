'use client';

import React, { useState, useMemo } from 'react';
import { Download, Sparkles, Calendar, User, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TTSPlayer } from '@/components/letter/tts-player';
import { splitIntoSentences } from '@/lib/tts';
import { downloadLetterAsText } from '@/lib/export-letter';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

export interface LetterViewProps {
  /** Raw letter content string */
  letter: string;
  /** Active persona trajectory identifier */
  personaId: 'current' | 'improved';
  /** Persona display name */
  personaName: string;
  /** User name / callsign */
  userName?: string;
  /** User target age 5 years from now */
  targetAge?: number;
  /** Optional custom styling classes */
  className?: string;
}

/**
 * Atmospheric personal letter view styled as paper stationery from the user's
 * 5-year future self, with synchronized audio narration and text download.
 */
export function LetterView({
  letter,
  personaId,
  personaName,
  userName = 'You',
  targetAge,
  className = '',
}: LetterViewProps): React.JSX.Element {
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);

  const isImproved = personaId === 'improved';
  const accentBorder = isImproved
    ? 'border-accent-improved/30 shadow-accent-improved/5'
    : 'border-accent-current/30 shadow-accent-current/5';
  const accentBadge = isImproved
    ? 'bg-accent-improved/10 text-accent-improved border-accent-improved/30'
    : 'bg-accent-current/10 text-accent-current border-accent-current/30';
  const highlightClass = isImproved
    ? 'bg-accent-improved/20 text-accent-improved font-medium rounded px-1 -mx-1 transition-colors duration-200'
    : 'bg-accent-current/20 text-accent-current font-medium rounded px-1 -mx-1 transition-colors duration-200';

  const futureDateString = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 5);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  // Split letter into paragraphs, and then into indexed sentences
  const paragraphsWithSentences = useMemo(() => {
    const rawParagraphs = letter
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    let runningIndex = 0;
    return rawParagraphs.map((para) => {
      const sentences = splitIntoSentences(para);
      const indexed = sentences.map((sent) => ({
        text: sent,
        index: runningIndex++,
      }));
      return indexed;
    });
  }, [letter]);

  const handleDownload = () => {
    downloadLetterAsText(letter, {
      personaName,
      personaId,
      targetAge,
      userName,
    });
  };

  return (
    <div className={`space-y-6 max-w-4xl mx-auto ${className}`}>
      {/* Audio Narration Controller Bar */}
      <TTSPlayer
        text={letter}
        personaId={personaId}
        onSentenceChange={(idx) => setActiveSentenceIndex(idx)}
        onPlaybackStateChange={(state) => {
          if (state === 'idle' || state === 'stopped') {
            setActiveSentenceIndex(null);
          }
        }}
      />

      {/* Personal Stationery Letter Sheet */}
      <Card
        className={`relative overflow-hidden rounded-3xl border bg-bg-secondary/90 backdrop-blur-md p-6 sm:p-10 lg:p-12 shadow-xl ${accentBorder}`}
      >
        {/* Subtle Watermark Accent */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-5 pointer-events-none blur-3xl bg-current"
          aria-hidden="true"
        />

        {/* Letterhead Header */}
        <header className="border-b border-border-primary/50 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${accentBadge}`}
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                {isImproved ? 'Improved Path' : 'Current Path'}
              </span>
              <span className="text-xs text-text-tertiary flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {futureDateString} (Simulated)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
              <User className="w-5 h-5 text-text-tertiary shrink-0" aria-hidden="true" />
              From {personaName} {targetAge ? `(Age ${targetAge})` : ''}
            </h2>
          </div>

          {/* Action: Download Button */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            aria-label="Download letter as text file"
            leftIcon={<Download className="w-4 h-4" aria-hidden="true" />}
            className="self-start sm:self-center"
          >
            Download .txt
          </Button>
        </header>

        {/* Salutation */}
        <div className="mb-6 font-serif text-lg sm:text-xl text-text-primary font-medium tracking-wide">
          Dear {userName},
        </div>

        {/* Letter Body Paragraphs with Sentence Highlighting */}
        <article
          aria-label="Future-self letter narrative"
          className="space-y-6 font-serif text-base sm:text-lg leading-relaxed text-text-secondary"
        >
          {paragraphsWithSentences.map((paragraph, pIdx) => (
            <p key={pIdx}>
              {paragraph.map((sentence) => {
                const isHighlighted = activeSentenceIndex === sentence.index;
                return (
                  <span
                    key={sentence.index}
                    className={`inline ${isHighlighted ? highlightClass : ''}`}
                    data-sentence-index={sentence.index}
                  >
                    {sentence.text}{' '}
                  </span>
                );
              })}
            </p>
          ))}
        </article>

        {/* Sign-off */}
        <footer className="mt-10 pt-8 border-t border-border-primary/50 space-y-4">
          <div className="font-serif italic text-base sm:text-lg text-text-primary">
            With honesty and perspective,
            <div className="font-sans font-bold not-italic text-lg text-text-primary mt-1">
              {personaName}
            </div>
          </div>

          {/* Mandatory Honesty Reflection Disclaimer */}
          <div className="pt-4 flex items-start gap-2 text-xs text-text-tertiary">
            <Quote className="w-4 h-4 shrink-0 mt-0.5 text-text-tertiary" aria-hidden="true" />
            <p>{HONESTY_DISCLAIMER}</p>
          </div>
        </footer>
      </Card>
    </div>
  );
}
