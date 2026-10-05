import {
  generateCardExportFilename,
  downloadCard,
  copyCardToClipboard,
} from '../card-export-actions';
import * as renderer from '../card-canvas-renderer';
import { DEFAULT_SHARE_CONFIG, ShareCardData } from '@/types/share.types';

jest.mock('../card-canvas-renderer', () => ({
  exportCardBlob: jest.fn(),
}));

const mockData: ShareCardData = {
  primaryGoal: 'Lead AI systems architecture',
  improvedHeadline: 'Principal Architect with balanced habits',
  generatedAt: '2026-10-06T12:00:00.000Z',
  habits: [],
};

describe('Card Export Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCardExportFilename', () => {
    it('creates formatted filename with date string', () => {
      const pngFilename = generateCardExportFilename(mockData, 'png');
      expect(pngFilename).toBe('future-you-simulation-2026-10-06.png');

      const svgFilename = generateCardExportFilename(mockData, 'svg');
      expect(svgFilename).toBe('future-you-simulation-2026-10-06.svg');
    });
  });

  describe('downloadCard', () => {
    it('creates object URL and triggers browser anchor download', async () => {
      const mockBlob = new Blob(['svg content'], { type: 'image/svg+xml' });
      (renderer.exportCardBlob as jest.Mock).mockResolvedValueOnce(mockBlob);

      const createObjectURLMock = jest.fn().mockReturnValue('blob:mock-url');
      const revokeObjectURLMock = jest.fn();
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;

      const clickMock = jest.fn();
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');

      const createElementOriginal = document.createElement.bind(document);
      jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = createElementOriginal(tagName);
        if (tagName === 'a') {
          el.click = clickMock;
        }
        return el;
      });

      const filename = await downloadCard(mockData, DEFAULT_SHARE_CONFIG);

      expect(renderer.exportCardBlob).toHaveBeenCalledWith(mockData, DEFAULT_SHARE_CONFIG);
      expect(createObjectURLMock).toHaveBeenCalledWith(mockBlob);
      expect(clickMock).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(filename).toBe('future-you-simulation-2026-10-06.png');

      // Cleanup spies
      jest.restoreAllMocks();
    });
  });

  describe('copyCardToClipboard', () => {
    it('writes PNG blob to navigator.clipboard using ClipboardItem', async () => {
      const mockBlob = new Blob(['png content'], { type: 'image/png' });
      (renderer.exportCardBlob as jest.Mock).mockResolvedValueOnce(mockBlob);

      const writeMock = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          write: writeMock,
        },
      });

      // Mock ClipboardItem constructor in global
      class MockClipboardItem {
        data: Record<string, Blob>;
        constructor(data: Record<string, Blob>) {
          this.data = data;
        }
      }
      (global as unknown as { ClipboardItem: unknown }).ClipboardItem = MockClipboardItem;

      const success = await copyCardToClipboard(mockData, DEFAULT_SHARE_CONFIG);

      expect(renderer.exportCardBlob).toHaveBeenCalledWith(
        mockData,
        expect.objectContaining({ format: 'png' })
      );
      expect(writeMock).toHaveBeenCalled();
      expect(success).toBe(true);
    });
  });
});
