import {
  renderCardToSVG,
  svgToDataUri,
  exportCardBlob,
} from '../card-canvas-renderer';
import {
  ShareCardConfig,
  ShareCardData,
  DEFAULT_SHARE_CONFIG,
  CARD_DIMENSIONS,
} from '@/types/share.types';

const mockData: ShareCardData = {
  primaryGoal: 'Architect high-leverage AI systems & lead teams',
  improvedHeadline: 'Staff Engineer leading autonomy initiatives with balanced habits',
  improvedQuote: 'The small daily boundaries you set became the foundation for everything.',
  currentHeadline: 'Overworked Senior Developer juggling firefighting',
  alignmentScore: 88,
  habits: [
    { label: 'Deep Work', baseline: '10 hrs/wk', target: '25 hrs/wk', isFinancial: false },
    { label: 'Monthly Savings', baseline: '$1,000', target: '$3,000', isFinancial: true },
  ],
  anxieties: ['Imposter syndrome', 'Burnout risk'],
  generatedAt: '2026-10-06T00:00:00.000Z',
};

describe('Card Canvas & SVG Renderer', () => {
  describe('renderCardToSVG', () => {
    it('generates valid SVG markup with brand header and mandatory reflection disclaimer', () => {
      const svg = renderCardToSVG(mockData, DEFAULT_SHARE_CONFIG);

      expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('FUTURE YOU');
      expect(svg).toContain('5-YEAR TRAJECTORY SIMULATION');
      expect(svg).toContain('A reflection tool, not a prediction engine');
      expect(svg).toContain('futureyou.app');
    });

    it('matches configured aspect ratio dimensions', () => {
      const landscapeConfig: ShareCardConfig = {
        ...DEFAULT_SHARE_CONFIG,
        aspectRatio: 'landscape',
      };
      const svg = renderCardToSVG(mockData, landscapeConfig);

      const { width, height } = CARD_DIMENSIONS.landscape;
      expect(svg).toContain(`viewBox="0 0 ${width} ${height}"`);
      expect(svg).toContain(`width="${width}"`);
      expect(svg).toContain(`height="${height}"`);
    });

    it('masks financial values by default when maskFinances is true', () => {
      const svg = renderCardToSVG(mockData, DEFAULT_SHARE_CONFIG);

      expect(svg).toContain('Deep Work');
      expect(svg).toContain('10 hrs/wk');
      expect(svg).toContain('••••••');
      expect(svg).not.toContain('$1,000');
      expect(svg).not.toContain('$3,000');
    });

    it('displays raw financial values when maskFinances is false', () => {
      const unmaskedConfig: ShareCardConfig = {
        ...DEFAULT_SHARE_CONFIG,
        privacy: {
          ...DEFAULT_SHARE_CONFIG.privacy,
          maskFinances: false,
        },
      };
      const svg = renderCardToSVG(mockData, unmaskedConfig);

      expect(svg).toContain('$1,000');
      expect(svg).toContain('$3,000');
    });

    it('toggles quote and alignment score based on privacy config', () => {
      const hiddenConfig: ShareCardConfig = {
        ...DEFAULT_SHARE_CONFIG,
        privacy: {
          ...DEFAULT_SHARE_CONFIG.privacy,
          includeLetterQuote: false,
          includeAlignmentScore: false,
        },
      };
      const svg = renderCardToSVG(mockData, hiddenConfig);

      expect(svg).not.toContain('The small daily boundaries');
      expect(svg).not.toContain('88% Aligned');
    });

    it('escapes XML special characters in goals and headlines', () => {
      const dangerousData: ShareCardData = {
        ...mockData,
        primaryGoal: 'Tech <Lead> & "Architect" with 100% \'Focus\'',
      };
      const svg = renderCardToSVG(dangerousData, DEFAULT_SHARE_CONFIG);

      expect(svg).toContain('Tech &lt;Lead&gt; &amp; &quot;Architect&quot;');
      expect(svg).not.toContain('<Lead>');
    });

    it('applies theme color tokens across themes', () => {
      const emeraldSvg = renderCardToSVG(mockData, {
        ...DEFAULT_SHARE_CONFIG,
        theme: 'emerald',
      });
      expect(emeraldSvg).toContain('#022c1c');

      const amberSvg = renderCardToSVG(mockData, {
        ...DEFAULT_SHARE_CONFIG,
        theme: 'amber',
      });
      expect(amberSvg).toContain('#251404');
    });
  });

  describe('svgToDataUri', () => {
    it('produces encoded SVG data URI', () => {
      const svg = '<svg><text>Hello</text></svg>';
      const dataUri = svgToDataUri(svg);

      expect(dataUri.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);
      expect(dataUri).toContain(encodeURIComponent(svg));
    });
  });

  describe('exportCardBlob', () => {
    it('returns SVG blob when format is svg', async () => {
      const svgConfig: ShareCardConfig = {
        ...DEFAULT_SHARE_CONFIG,
        format: 'svg',
      };
      const blob = await exportCardBlob(mockData, svgConfig);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('image/svg+xml;charset=utf-8');
    });
  });
});
