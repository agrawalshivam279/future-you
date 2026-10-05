import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Copy, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import {
  createTTSController,
  isSpeechSynthesisSupported,
  TTSController,
  TTSPlaybackState,
} from '@/lib/tts';
import { cn } from '@/lib/utils';

export interface ReflectionBadgeProps {
  reflection: string;
  authorTitle?: string;
  className?: string;
}

/**
 * Reflection note card from the 5-Year Future Self with TTS voice readout and copy actions.
 */
export function ReflectionBadge({
  reflection,
  authorTitle = '5-Year Future Self • Improved Path',
  className,
}: ReflectionBadgeProps): React.JSX.Element {
  const { showToast } = useToast();
  const [ttsSupported, setTtsSupported] = useState(false);
  const [playbackState, setPlaybackState] = useState<TTSPlaybackState>('idle');
  const controllerRef = useRef<TTSController | null>(null);

  useEffect(() => {
    const supported = isSpeechSynthesisSupported();
    setTtsSupported(supported);

    if (supported) {
      const controller = createTTSController({
        onStateChange: (state) => setPlaybackState(state),
        onEnd: () => setPlaybackState('idle'),
        onError: () => {
          setPlaybackState('idle');
          showToast({
            type: 'error',
            title: 'Audio Playback Failed',
            message: 'Unable to synthesize speech in this browser.',
          });
        },
      });
      controllerRef.current = controller;
    }

    return () => {
      controllerRef.current?.destroy();
    };
  }, [showToast]);

  const handlePlayToggle = () => {
    if (!controllerRef.current) return;

    if (playbackState === 'playing') {
      controllerRef.current.pause();
    } else if (playbackState === 'paused') {
      controllerRef.current.resume();
    } else {
      controllerRef.current.play(reflection);
    }
  };

  const handleStop = () => {
    if (controllerRef.current) {
      controllerRef.current.stop();
      setPlaybackState('idle');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reflection);
      showToast({
        type: 'success',
        title: 'Copied',
        message: 'Reflection note copied to clipboard.',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Copy Failed',
        message: 'Could not access clipboard.',
      });
    }
  };

  const paragraphs = reflection
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Card className={cn('border-accent-improved/30 bg-bg-card shadow-sm', className)}>
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-accent-improved/10 flex items-center justify-center text-accent-improved">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-text-primary">
                Future Self Voice Note
              </CardTitle>
              <CardDescription className="text-xs text-text-muted">
                {authorTitle}
              </CardDescription>
            </div>
          </div>
          <Badge variant="improved" size="sm">
            Improved Path
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Reflection Paragraphs */}
        <div className="space-y-2 text-sm leading-relaxed text-text-secondary">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-border/30 gap-2">
          {/* TTS Audio Controls */}
          <div className="flex items-center space-x-2">
            {ttsSupported && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handlePlayToggle}
                  aria-label={
                    playbackState === 'playing'
                      ? 'Pause Reflection Audio'
                      : playbackState === 'paused'
                      ? 'Resume Reflection Audio'
                      : 'Listen to Reflection Audio'
                  }
                  className="flex items-center space-x-1.5"
                >
                  {playbackState === 'playing' ? (
                    <>
                      <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Pause</span>
                    </>
                  ) : playbackState === 'paused' ? (
                    <>
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Listen</span>
                    </>
                  )}
                </Button>

                {(playbackState === 'playing' || playbackState === 'paused') && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleStop}
                    aria-label="Stop Reflection Audio"
                    className="p-1.5"
                  >
                    <Square className="w-3.5 h-3.5" aria-hidden="true" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Copy to Clipboard */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            aria-label="Copy Reflection to Clipboard"
            className="flex items-center space-x-1 text-xs text-text-muted hover:text-text-primary"
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Copy</span>
          </Button>
        </div>

        {/* Mandatory Honesty Disclaimer */}
        <div className="text-[11px] text-text-muted/80 text-center italic border-t border-border/20 pt-2 select-none">
          A reflection tool, not a prediction engine.
        </div>
      </CardContent>
    </Card>
  );
}
