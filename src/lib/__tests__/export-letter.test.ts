import { formatLetterText, downloadLetterAsText } from '../export-letter';
import { HONESTY_DISCLAIMER } from '@/lib/constants';

describe('Letter Export Utility', () => {
  const sampleLetter = 'Remember that the choices you make every single day accumulate into the person you become.';

  describe('formatLetterText', () => {
    it('formats a letter with 5-year postdate header, trajectory, and honesty disclaimer', () => {
      const fixedDate = new Date('2026-10-04T12:00:00Z');
      const formatted = formatLetterText(sampleLetter, {
        personaName: 'Alex Morgan',
        personaId: 'improved',
        targetAge: 35,
        userName: 'Alex',
        currentDate: fixedDate,
      });

      expect(formatted).toContain('A LETTER FROM YOUR FUTURE SELF (5 YEARS AHEAD)');
      expect(formatted).toContain('Date: October 4, 2031 (Simulated)');
      expect(formatted).toContain('From: Alex Morgan (Age 35, Improved Path)');
      expect(formatted).toContain('To:   Alex');
      expect(formatted).toContain(sampleLetter);
      expect(formatted).toContain(HONESTY_DISCLAIMER);
      expect(formatted).toContain('This document was generated locally and stored exclusively on your device.');
    });

    it('formats Current Path trajectory with default recipient if userName omitted', () => {
      const fixedDate = new Date('2026-10-04T12:00:00Z');
      const formatted = formatLetterText(sampleLetter, {
        personaName: 'Taylor',
        personaId: 'current',
        currentDate: fixedDate,
      });

      expect(formatted).toContain('From: Taylor (Age N/A, Current Path)');
      expect(formatted).toContain('To:   Past Self');
      expect(formatted).toContain(sampleLetter);
      expect(formatted).toContain(HONESTY_DISCLAIMER);
    });
  });

  describe('downloadLetterAsText', () => {
    let originalCreateObjectURL: typeof URL.createObjectURL;
    let originalRevokeObjectURL: typeof URL.revokeObjectURL;
    let mockCreateObjectURL: jest.Mock;
    let mockRevokeObjectURL: jest.Mock;

    beforeEach(() => {
      originalCreateObjectURL = URL.createObjectURL;
      originalRevokeObjectURL = URL.revokeObjectURL;

      mockCreateObjectURL = jest.fn().mockReturnValue('blob:mock-url');
      mockRevokeObjectURL = jest.fn();

      URL.createObjectURL = mockCreateObjectURL;
      URL.revokeObjectURL = mockRevokeObjectURL;
    });

    afterEach(() => {
      URL.createObjectURL = originalCreateObjectURL;
      URL.revokeObjectURL = originalRevokeObjectURL;
    });

    it('creates Blob and triggers anchor download link', () => {
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');

      let clicked = false;
      const originalCreateElement = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = originalCreateElement(tagName);
        if (tagName === 'a') {
          el.click = () => {
            clicked = true;
          };
        }
        return el;
      });

      downloadLetterAsText(sampleLetter, {
        personaName: 'Taylor',
        personaId: 'improved',
        userName: 'Taylor Swift',
      });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      expect(appendChildSpy).toHaveBeenCalled();
      expect(clicked).toBe(true);
      expect(removeChildSpy).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });
});
