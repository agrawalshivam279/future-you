'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  isSpeechSynthesisSupported,
  getAvailableVoices,
  createTTSController,
  splitIntoSentences,
  TTSPlaybackState,
  TTSController,
} from '@/lib/tts';

export interface TTSPlayerProps {
  /** Full text or markdown content of the future-self letter */
  text: string;
  /** Active persona ID for accent theme styling ('current' amber vs 'improved' emerald) */
  personaId?: 'current' | 'improved';
  /** Optional callback fired when the active sentence changes (for letter highlighting) */
  onSentenceChange?: (sentenceIndex: number) => void;
  /** Optional callback fired when playback state changes */
  onPlaybackStateChange?: (state: TTSPlaybackState) => void;
  /** Custom wrapper styling */
  className?: string;
}

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5];

/**
 * Accessible audio player component for reading future-self letters aloud
 * via the native browser Web Speech API.
 */
export function TTSPlayer({
  text,
  personaId = 'improved',
  onSentenceChange,
  onPlaybackStateChange,
  className = '',
}: TTSPlayerProps): React.JSX.Element {
  const [isSupported, setIsSupported] = useState(true);
  const [playbackState, setPlaybackState] = useState<TTSPlaybackState>('idle');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [rate, setRate] = useState(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  const controllerRef = useRef<TTSController | null>(null);
  const sentences = React.useMemo(() => splitIntoSentences(text), [text]);
  const totalSentences = sentences.length;

  const accentColor =
    personaId === 'improved'
      ? 'border-accent-improved/30 bg-accent-improved/5 text-accent-improved'
      : 'border-accent-current/30 bg-accent-current/5 text-accent-current';

  const activeBadgeColor =
    personaId === 'improved'
      ? 'bg-accent-improved text-bg-primary'
      : 'bg-accent-current text-bg-primary';

  // Check Web Speech API support and retrieve available voices on mount
  useEffect(() => {
    const supported = isSpeechSynthesisSupported();
    setIsSupported(supported);

    if (supported) {
      getAvailableVoices().then((loadedVoices) => {
        setVoices(loadedVoices);
        if (loadedVoices.length > 0) {
          const defaultVoice =
            loadedVoices.find((v) => v.default || v.lang.startsWith('en')) ||
            loadedVoices[0];
          setSelectedVoiceURI(defaultVoice.voiceURI);
        }
      });
    }
  }, []);

  // Initialize or re-create TTS controller
  useEffect(() => {
    if (!isSupported) return;

    const controller = createTTSController({
      rate,
      onSentenceChange: (idx) => {
        setCurrentSentenceIndex(idx);
        onSentenceChange?.(idx);
      },
      onStateChange: (state) => {
        setPlaybackState(state);
        onPlaybackStateChange?.(state);
        if (state === 'stopped' || state === 'idle') {
          setCurrentSentenceIndex(0);
          onSentenceChange?.(0);
        }
      },
      onEnd: () => {
        setPlaybackState('idle');
        setCurrentSentenceIndex(0);
        onSentenceChange?.(0);
        onPlaybackStateChange?.('idle');
      },
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [isSupported, rate, onSentenceChange, onPlaybackStateChange]);

  // Handle Play / Resume
  const handlePlayToggle = useCallback(() => {
    const controller = controllerRef.current;
    if (!controller) return;

    if (playbackState === 'playing') {
      controller.pause();
    } else if (playbackState === 'paused') {
      controller.resume();
    } else {
      controller.play(sentences, currentSentenceIndex);
    }
  }, [playbackState, sentences, currentSentenceIndex]);

  // Handle Stop / Reset
  const handleStop = useCallback(() => {
    controllerRef.current?.stop();
    setCurrentSentenceIndex(0);
    onSentenceChange?.(0);
  }, [onSentenceChange]);

  // Handle Speed Selection
  const handleSpeedChange = (newRate: number) => {
    setRate(newRate);
    controllerRef.current?.setRate(newRate);
  };

  // Handle Voice Selection
  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uri = e.target.value;
    setSelectedVoiceURI(uri);
    const chosenVoice = voices.find((v) => v.voiceURI === uri) || null;
    controllerRef.current?.setVoice(chosenVoice);
  };

  if (!isSupported) {
    return (
      <div
        className={`p-4 rounded-xl border border-border-primary bg-bg-secondary text-text-secondary text-sm flex items-center gap-3 ${className}`}
        role="status"
        aria-label="Speech synthesis unavailable"
      >
        <VolumeX className="w-5 h-5 text-text-tertiary shrink-0" aria-hidden="true" />
        <p>Text-to-speech reading is not supported by your browser environment.</p>
      </div>
    );
  }

  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';

  return (
    <section
      aria-label="Letter audio narration player"
      className={`rounded-2xl border bg-bg-secondary/70 backdrop-blur-sm p-4 sm:p-5 shadow-sm space-y-4 transition-colors ${accentColor} ${className}`}
    >
      {/* Player Header & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-primary/40 pb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-sm tracking-wide">
            Audio Narration
          </span>
          <span
            className="text-xs uppercase px-2 py-0.5 rounded-full font-mono bg-bg-tertiary text-text-secondary"
            aria-live="polite"
          >
            {isPlaying ? 'Playing' : isPaused ? 'Paused' : 'Ready'}
          </span>
        </div>

        {totalSentences > 0 && (
          <div
            className="text-xs font-mono text-text-secondary"
            aria-label={`Sentence ${isPlaying || isPaused ? currentSentenceIndex + 1 : 1} of ${totalSentences}`}
          >
            Sentence {isPlaying || isPaused ? currentSentenceIndex + 1 : 1} / {totalSentences}
          </div>
        )}
      </div>

      {/* Primary Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handlePlayToggle}
            aria-label={isPlaying ? 'Pause reading letter' : 'Play reading letter aloud'}
            leftIcon={
              isPlaying ? (
                <Pause className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" aria-hidden="true" />
              )
            }
          >
            {isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Listen to Letter'}
          </Button>

          {(isPlaying || isPaused) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleStop}
              aria-label="Stop reading and reset to beginning"
              leftIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}
            >
              Reset
            </Button>
          )}
        </div>

        {/* Speed Controls */}
        <div
          className="flex items-center gap-1.5"
          role="group"
          aria-label="Playback speed"
        >
          <Gauge className="w-3.5 h-3.5 text-text-tertiary hidden sm:block" aria-hidden="true" />
          <span className="text-xs text-text-secondary font-medium mr-1 hidden sm:inline">
            Speed:
          </span>
          {SPEED_OPTIONS.map((speed) => {
            const isSelected = rate === speed;
            return (
              <button
                key={speed}
                type="button"
                onClick={() => handleSpeedChange(speed)}
                aria-label={`Set speed to ${speed}x`}
                aria-pressed={isSelected}
                className={`px-2 py-0.5 text-xs font-mono rounded-md transition-colors ${
                  isSelected
                    ? activeBadgeColor
                    : 'bg-bg-tertiary hover:bg-bg-elevated text-text-secondary'
                }`}
              >
                {speed}x
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice Selection Selector (When multiple browser voices available) */}
      {voices.length > 1 && (
        <div className="flex items-center gap-2 pt-1">
          <User className="w-3.5 h-3.5 text-text-tertiary shrink-0" aria-hidden="true" />
          <label htmlFor="tts-voice-select" className="text-xs text-text-secondary sr-only">
            Select Voice
          </label>
          <select
            id="tts-voice-select"
            aria-label="Select voice"
            value={selectedVoiceURI}
            onChange={handleVoiceChange}
            className="w-full text-xs bg-bg-tertiary border border-border-primary rounded-lg px-2 py-1.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary"
          >
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
      )}
    </section>
  );
}
