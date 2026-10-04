import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LetterView } from '../letter-view';
import * as exportModule from '@/lib/export-letter';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

let mockOnSentenceChangeCallback: ((idx: number) => void) | undefined;
let mockOnPlaybackStateChangeCallback: ((state: string) => void) | undefined;

jest.mock('@/lib/export-letter', () => ({
  ...jest.requireActual('@/lib/export-letter'),
  downloadLetterAsText: jest.fn(),
}));

jest.mock('@/components/letter/tts-player', () => ({
  TTSPlayer: ({
    onSentenceChange,
    onPlaybackStateChange,
  }: {
    onSentenceChange?: (idx: number) => void;
    onPlaybackStateChange?: (state: string) => void;
  }) => {
    mockOnSentenceChangeCallback = onSentenceChange;
    mockOnPlaybackStateChangeCallback = onPlaybackStateChange;
    return <div data-testid="mock-tts-player">Mock TTS Player</div>;
  },
}));

describe('LetterView Component', () => {
  const sampleLetter = `Dear Morgan.
Five years have passed since you made the decision to focus on consistency. Look at you now.

You built the life you wanted one habit at a time. Be proud of the foundation you created.`;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSentenceChangeCallback = undefined;
    mockOnPlaybackStateChangeCallback = undefined;
  });

  it('renders personal letter with header, salutation, paragraphs, and disclaimer', () => {
    render(
      <LetterView
        letter={sampleLetter}
        personaId="improved"
        personaName="Morgan (Improved)"
        userName="Morgan"
        targetAge={35}
      />
    );

    expect(screen.getByText('Improved Path')).toBeInTheDocument();
    expect(screen.getByText(/From Morgan \(Improved\) \(Age 35\)/i)).toBeInTheDocument();
    expect(screen.getByText('Dear Morgan,')).toBeInTheDocument();
    expect(screen.getByText(/Five years have passed/i)).toBeInTheDocument();
    expect(screen.getByText(/You built the life you wanted/i)).toBeInTheDocument();
    expect(screen.getByText(HONESTY_DISCLAIMER)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Download letter as text file' })
    ).toBeInTheDocument();
  });

  it('renders Current Path trajectory styling and header when personaId is current', () => {
    render(
      <LetterView
        letter={sampleLetter}
        personaId="current"
        personaName="Morgan (Current)"
        userName="Morgan"
      />
    );

    expect(screen.getByText('Current Path')).toBeInTheDocument();
    expect(screen.getByText(/From Morgan \(Current\)/i)).toBeInTheDocument();
  });

  it('triggers downloadLetterAsText when Download button is clicked', () => {
    render(
      <LetterView
        letter={sampleLetter}
        personaId="improved"
        personaName="Morgan (Improved)"
        userName="Morgan"
        targetAge={35}
      />
    );

    const downloadButton = screen.getByRole('button', {
      name: 'Download letter as text file',
    });
    fireEvent.click(downloadButton);

    expect(exportModule.downloadLetterAsText).toHaveBeenCalledWith(sampleLetter, {
      personaName: 'Morgan (Improved)',
      personaId: 'improved',
      targetAge: 35,
      userName: 'Morgan',
    });
  });

  it('highlights the active sentence during audio narration and clears when stopped', () => {
    render(
      <LetterView
        letter={sampleLetter}
        personaId="improved"
        personaName="Morgan"
        userName="Morgan"
      />
    );

    expect(screen.getByTestId('mock-tts-player')).toBeInTheDocument();

    // Trigger sentence 1 highlight
    act(() => {
      mockOnSentenceChangeCallback?.(1);
    });

    const sentence1 = screen.getByText(/Five years have passed/i);
    expect(sentence1).toHaveClass('bg-accent-improved/20');

    // Trigger playback stop -> removes highlight
    act(() => {
      mockOnPlaybackStateChangeCallback?.('stopped');
    });

    expect(sentence1).not.toHaveClass('bg-accent-improved/20');
  });
});
