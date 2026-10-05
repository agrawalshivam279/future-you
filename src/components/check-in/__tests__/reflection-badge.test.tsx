import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ReflectionBadge } from '../reflection-badge';

const mockShowToast = jest.fn();
jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

describe('ReflectionBadge Component', () => {
  const sampleReflection =
    'Looking across these 5 years, sleep was your greatest lever.\n\nMicro-adjustment: Protect 7 hours.\n\nStay steady.';

  let mockSpeak: jest.Mock;
  let mockCancel: jest.Mock;
  let mockPause: jest.Mock;
  let mockResume: jest.Mock;
  let lastUtterance: { onstart?: () => void; onend?: () => void } | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSpeak = jest.fn();
    mockCancel = jest.fn();
    mockPause = jest.fn();
    mockResume = jest.fn();
    lastUtterance = null;

    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        pause: mockPause,
        resume: mockResume,
        getVoices: jest.fn().mockReturnValue([]),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      },
      writable: true,
      configurable: true,
    });

    (global as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance =
      jest.fn().mockImplementation(() => {
        lastUtterance = {};
        return lastUtterance;
      });

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders reflection text, author header, and honesty disclaimer', () => {
    render(<ReflectionBadge reflection={sampleReflection} />);

    expect(screen.getByText('Future Self Voice Note')).toBeInTheDocument();
    expect(screen.getByText('5-Year Future Self • Improved Path')).toBeInTheDocument();
    expect(screen.getByText(/Looking across these 5 years/i)).toBeInTheDocument();
    expect(screen.getByText(/Micro-adjustment: Protect 7 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/A reflection tool, not a prediction engine/i)).toBeInTheDocument();
  });

  it('copies reflection note to clipboard and displays toast', async () => {
    render(<ReflectionBadge reflection={sampleReflection} />);

    const copyBtn = screen.getByRole('button', { name: /Copy Reflection to Clipboard/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(sampleReflection);
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success', title: 'Copied' })
    );
  });

  it('controls speech synthesis playback states (Play, Pause, Stop)', () => {
    render(<ReflectionBadge reflection={sampleReflection} />);

    const listenBtn = screen.getByRole('button', { name: /Listen to Reflection Audio/i });
    fireEvent.click(listenBtn);

    expect(mockSpeak).toHaveBeenCalled();

    // Trigger onstart event on utterance
    act(() => {
      lastUtterance?.onstart?.();
    });

    const pauseBtn = screen.getByRole('button', { name: /Pause Reflection Audio/i });
    expect(pauseBtn).toBeInTheDocument();

    const stopBtn = screen.getByRole('button', { name: /Stop Reflection Audio/i });
    expect(stopBtn).toBeInTheDocument();

    fireEvent.click(stopBtn);
    expect(mockCancel).toHaveBeenCalled();
  });
});
