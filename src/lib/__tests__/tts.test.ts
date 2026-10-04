import {
  splitIntoSentences,
  isSpeechSynthesisSupported,
  getAvailableVoices,
  createTTSController,
} from '../tts';

describe('Text-to-Speech (TTS) Engine', () => {
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

  beforeEach(() => {
    mockSpeak = jest.fn();
    mockCancel = jest.fn();
    mockPause = jest.fn();
    mockResume = jest.fn();
    mockGetVoices = jest.fn().mockReturnValue([]);
    mockAddEventListener = jest.fn();
    mockRemoveEventListener = jest.fn();

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
      jest.fn().mockImplementation((text: string) => ({
        text,
        rate: 1,
        pitch: 1,
        volume: 1,
        voice: null,
        onstart: null,
        onend: null,
        onerror: null,
      }));
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

  describe('splitIntoSentences', () => {
    it('returns empty array for empty, undefined, or whitespace text', () => {
      expect(splitIntoSentences('')).toEqual([]);
      expect(splitIntoSentences('   ')).toEqual([]);
      expect(splitIntoSentences(null as unknown as string)).toEqual([]);
    });

    it('splits multiple sentences by standard punctuation', () => {
      const text =
        'Dear Alex. Look at where you stand today! Are you ready for what comes next? You did it.';
      const result = splitIntoSentences(text);
      expect(result).toEqual([
        'Dear Alex.',
        'Look at where you stand today!',
        'Are you ready for what comes next?',
        'You did it.',
      ]);
    });

    it('cleans markdown headers, blockquotes, and dividers before splitting', () => {
      const markdown = `
# Letter From Your Future Self
> Remember the small steps.
---
Every single day counts. You made great progress!
`;
      const result = splitIntoSentences(markdown);
      expect(result).toEqual([
        'Remember the small steps.',
        'Every single day counts.',
        'You made great progress!',
      ]);
    });

    it('returns full text when no terminal punctuation exists', () => {
      const text = 'This is a single thought without punctuation';
      expect(splitIntoSentences(text)).toEqual([
        'This is a single thought without punctuation',
      ]);
    });
  });

  describe('isSpeechSynthesisSupported', () => {
    it('returns true when window.speechSynthesis and SpeechSynthesisUtterance are defined', () => {
      expect(isSpeechSynthesisSupported()).toBe(true);
    });

    it('returns false when window.speechSynthesis is missing', () => {
      Object.defineProperty(window, 'speechSynthesis', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      expect(isSpeechSynthesisSupported()).toBe(false);
    });
  });

  describe('getAvailableVoices', () => {
    it('returns voices immediately if already loaded', async () => {
      const mockVoices = [
        { name: 'Alex Voice', lang: 'en-US', voiceURI: 'voice-1', default: true },
      ] as SpeechSynthesisVoice[];
      mockGetVoices.mockReturnValue(mockVoices);

      const voices = await getAvailableVoices();
      expect(voices).toEqual(mockVoices);
      expect(mockAddEventListener).not.toHaveBeenCalled();
    });

    it('listens to voiceschanged event if initial voices list is empty', async () => {
      const mockVoices = [
        { name: 'Future Voice', lang: 'en-GB', voiceURI: 'voice-2', default: false },
      ] as SpeechSynthesisVoice[];

      mockAddEventListener.mockImplementation((event: string, callback: () => void) => {
        if (event === 'voiceschanged') {
          mockGetVoices.mockReturnValue(mockVoices);
          setTimeout(callback, 10);
        }
      });

      const voices = await getAvailableVoices();
      expect(voices).toEqual(mockVoices);
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'voiceschanged',
        expect.any(Function)
      );
    });
  });

  describe('createTTSController', () => {
    it('manages play, sentence progression, and completion callback', () => {
      const onSentenceChange = jest.fn();
      const onStateChange = jest.fn();
      const onEnd = jest.fn();

      const controller = createTTSController({
        onSentenceChange,
        onStateChange,
        onEnd,
      });

      controller.play('First sentence. Second sentence.');

      expect(mockSpeak).toHaveBeenCalledTimes(1);
      expect(controller.getState()).toBe('playing');
      expect(onStateChange).toHaveBeenCalledWith('playing');

      // Simulate utterance onstart
      const firstUtterance = mockSpeak.mock.calls[0][0];
      firstUtterance.onstart();
      expect(onSentenceChange).toHaveBeenCalledWith(0, 'First sentence.');
      expect(controller.getCurrentSentenceIndex()).toBe(0);
      expect(controller.getTotalSentences()).toBe(2);

      // Simulate utterance onend for first sentence -> triggers second sentence
      firstUtterance.onend();
      expect(mockSpeak).toHaveBeenCalledTimes(2);

      const secondUtterance = mockSpeak.mock.calls[1][0];
      secondUtterance.onstart();
      expect(onSentenceChange).toHaveBeenCalledWith(1, 'Second sentence.');

      // Simulate second utterance onend -> triggers completion
      secondUtterance.onend();
      expect(controller.getState()).toBe('idle');
      expect(onEnd).toHaveBeenCalledTimes(1);
    });

    it('pauses and resumes playback cleanly', () => {
      const onStateChange = jest.fn();
      const controller = createTTSController({ onStateChange });

      controller.play('Sentence one. Sentence two.');
      expect(controller.getState()).toBe('playing');

      controller.pause();
      expect(controller.getState()).toBe('paused');
      expect(mockCancel).toHaveBeenCalled();
      expect(onStateChange).toHaveBeenCalledWith('paused');

      controller.resume();
      expect(controller.getState()).toBe('playing');
      expect(mockSpeak).toHaveBeenCalledTimes(2);
    });

    it('stops playback and resets sentence index to 0', () => {
      const onStateChange = jest.fn();
      const controller = createTTSController({ onStateChange });

      controller.play('Sentence one. Sentence two.');
      controller.stop();

      expect(controller.getState()).toBe('stopped');
      expect(controller.getCurrentSentenceIndex()).toBe(0);
      expect(mockCancel).toHaveBeenCalled();
      expect(onStateChange).toHaveBeenCalledWith('stopped');
    });

    it('updates rate and re-triggers sentence if actively playing', () => {
      const controller = createTTSController();
      controller.play('Sentence one. Sentence two.');

      controller.setRate(1.5);
      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalledTimes(2);

      const updatedUtterance = mockSpeak.mock.calls[1][0];
      expect(updatedUtterance.rate).toBe(1.5);
    });

    it('handles speech synthesis errors through onError callback', () => {
      const onError = jest.fn();
      const controller = createTTSController({ onError });

      controller.play('Test sentence.');
      const utterance = mockSpeak.mock.calls[0][0];

      utterance.onerror({ error: 'audio-busy' });
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('audio-busy') })
      );
      expect(controller.getState()).toBe('idle');
    });

    it('destroys and cleans up controller state', () => {
      const controller = createTTSController();
      controller.play('Sentence.');
      controller.destroy();

      expect(controller.getState()).toBe('idle');
      expect(controller.getTotalSentences()).toBe(0);
      expect(mockCancel).toHaveBeenCalled();
    });
  });
});
