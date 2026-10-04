import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { TTSPlayer } from '../tts-player';

describe('TTSPlayer Component', () => {
  const sampleLetter =
    'Dear Morgan. Five years have passed since you made the decision to focus on consistency. Look at you now.';

  const originalSpeechSynthesis = window.speechSynthesis;
  const originalUtterance = (global as unknown as { SpeechSynthesisUtterance?: unknown })
    .SpeechSynthesisUtterance;

  let mockSpeak: jest.Mock;
  let mockCancel: jest.Mock;
  let mockPause: jest.Mock;
  let mockResume: jest.Mock;
  let mockGetVoices: jest.Mock;
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;
  let lastCreatedUtterance: {
    text: string;
    rate: number;
    pitch: number;
    volume: number;
    voice: SpeechSynthesisVoice | null;
    onstart: (() => void) | null;
    onend: (() => void) | null;
    onerror: ((e: { error: string }) => void) | null;
  } | null = null;

  beforeEach(() => {
    mockSpeak = jest.fn();
    mockCancel = jest.fn();
    mockPause = jest.fn();
    mockResume = jest.fn();
    mockGetVoices = jest.fn().mockReturnValue([]);
    mockAddEventListener = jest.fn();
    mockRemoveEventListener = jest.fn();
    lastCreatedUtterance = null;

    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        pause: mockPause,
        resume: mockResume,
        getVoices: mockGetVoices,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      },
      writable: true,
      configurable: true,
    });

    (global as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance =
      jest.fn().mockImplementation((text: string) => {
        lastCreatedUtterance = {
          text,
          rate: 1,
          pitch: 1,
          volume: 1,
          voice: null,
          onstart: null,
          onend: null,
          onerror: null,
        };
        return lastCreatedUtterance;
      });
  });

  afterEach(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      value: originalSpeechSynthesis,
      writable: true,
      configurable: true,
    });
    (global as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance =
      originalUtterance;
  });

  it('renders audio player with initial Ready status and play action', () => {
    render(<TTSPlayer text={sampleLetter} personaId="improved" />);

    expect(
      screen.getByRole('region', { name: 'Letter audio narration player' })
    ).toBeInTheDocument();
    expect(screen.getByText('Audio Narration')).toBeInTheDocument();
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('Sentence 1 / 3')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Play reading letter aloud' })
    ).toBeInTheDocument();
  });

  it('displays fallback banner when speech synthesis is unsupported', () => {
    Object.defineProperty(window, 'speechSynthesis', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    render(<TTSPlayer text={sampleLetter} />);

    expect(
      screen.getByRole('status', { name: 'Speech synthesis unavailable' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Text-to-speech reading is not supported/i)
    ).toBeInTheDocument();
  });

  it('handles play toggle to play, pause, and resume', () => {
    render(<TTSPlayer text={sampleLetter} personaId="improved" />);

    const playButton = screen.getByRole('button', {
      name: 'Play reading letter aloud',
    });

    // 1. Click Play
    fireEvent.click(playButton);
    expect(mockSpeak).toHaveBeenCalledTimes(1);

    // Trigger onstart callback on utterance to update player status
    act(() => {
      lastCreatedUtterance?.onstart?.();
    });

    const pauseButton = screen.getByRole('button', {
      name: 'Pause reading letter',
    });
    expect(pauseButton).toBeInTheDocument();
    expect(screen.getByText('Playing')).toBeInTheDocument();

    // 2. Click Pause
    fireEvent.click(pauseButton);
    expect(mockCancel).toHaveBeenCalled();
    expect(screen.getByText('Paused')).toBeInTheDocument();

    const resumeButton = screen.getByRole('button', {
      name: 'Play reading letter aloud',
    });
    expect(resumeButton).toHaveTextContent('Resume');

    // 3. Click Resume
    fireEvent.click(resumeButton);
    expect(mockSpeak).toHaveBeenCalledTimes(2);

    act(() => {
      lastCreatedUtterance?.onstart?.();
    });
    expect(screen.getByText('Playing')).toBeInTheDocument();
  });

  it('handles stop/reset button click', () => {
    const onSentenceChange = jest.fn();
    render(
      <TTSPlayer
        text={sampleLetter}
        onSentenceChange={onSentenceChange}
        personaId="current"
      />
    );

    // Start playing
    fireEvent.click(
      screen.getByRole('button', { name: 'Play reading letter aloud' })
    );

    act(() => {
      lastCreatedUtterance?.onstart?.();
    });

    const resetButton = screen.getByRole('button', {
      name: 'Stop reading and reset to beginning',
    });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);
    expect(mockCancel).toHaveBeenCalled();
    expect(onSentenceChange).toHaveBeenCalledWith(0);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('allows changing playback speed multiplier', () => {
    render(<TTSPlayer text={sampleLetter} />);

    const speed15Button = screen.getByRole('button', {
      name: 'Set speed to 1.5x',
    });
    expect(speed15Button).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(speed15Button);
    expect(speed15Button).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders voice selector dropdown when multiple voices exist', async () => {
    const mockVoices = [
      {
        name: 'Voice One',
        lang: 'en-US',
        voiceURI: 'v-1',
        default: true,
      } as SpeechSynthesisVoice,
      {
        name: 'Voice Two',
        lang: 'en-GB',
        voiceURI: 'v-2',
        default: false,
      } as SpeechSynthesisVoice,
    ];

    mockGetVoices.mockReturnValue(mockVoices);

    await act(async () => {
      render(<TTSPlayer text={sampleLetter} />);
    });

    const select = screen.getByLabelText('Select voice');
    expect(select).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'v-2' } });
    expect(select).toHaveValue('v-2');
  });

  it('notifies parent of sentence changes during narration and advances sentences', () => {
    const onSentenceChange = jest.fn();
    render(<TTSPlayer text={sampleLetter} onSentenceChange={onSentenceChange} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Play reading letter aloud' })
    );

    act(() => {
      lastCreatedUtterance?.onstart?.();
    });
    expect(onSentenceChange).toHaveBeenCalledWith(0);
    expect(screen.getByText('Sentence 1 / 3')).toBeInTheDocument();

    // End first sentence -> second sentence starts
    act(() => {
      lastCreatedUtterance?.onend?.();
    });
    act(() => {
      lastCreatedUtterance?.onstart?.();
    });

    expect(onSentenceChange).toHaveBeenCalledWith(1);
    expect(screen.getByText('Sentence 2 / 3')).toBeInTheDocument();
  });
});
