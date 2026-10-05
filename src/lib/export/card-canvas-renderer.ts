/**
 * Pure client-side card canvas and vector SVG rendering engine.
 * Generates standalone SVG and raster Canvas blobs without cloud dependencies.
 */

import {
  ShareCardConfig,
  ShareCardData,
  ShareCardTheme,
  CARD_DIMENSIONS,
} from '@/types/share.types';

interface SVGThemePalette {
  bg: string;
  cardBg: string;
  border: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
}

const SVG_THEMES: Record<ShareCardTheme, SVGThemePalette> = {
  midnight: {
    bg: '#09090b',
    cardBg: '#18181b',
    border: '#27272a',
    accent: '#10b981',
    textPrimary: '#fafafa',
    textSecondary: '#a1a1aa',
  },
  emerald: {
    bg: '#022c1c',
    cardBg: '#064e3b',
    border: '#047857',
    accent: '#34d399',
    textPrimary: '#ecfdf5',
    textSecondary: '#a7f3d0',
  },
  amber: {
    bg: '#251404',
    cardBg: '#451a03',
    border: '#78350f',
    accent: '#fbbf24',
    textPrimary: '#fffbeb',
    textSecondary: '#fde68a',
  },
  monochrome: {
    bg: '#000000',
    cardBg: '#121212',
    border: '#27272a',
    accent: '#ffffff',
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
  },
};

/** Escapes XML special characters for safe SVG text embedding */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Serializes card simulation data into clean vector SVG markup.
 */
export function renderCardToSVG(data: ShareCardData, config: ShareCardConfig): string {
  const { width, height } = CARD_DIMENSIONS[config.aspectRatio] || CARD_DIMENSIONS.square;
  const theme = SVG_THEMES[config.theme] || SVG_THEMES.midnight;
  const { privacy, personaMode } = config;

  const formatValue = (val: string | number, isFin?: boolean): string => {
    if (privacy.maskFinances && (isFin || String(val).includes('$'))) {
      return '••••••';
    }
    return escapeXml(String(val));
  };

  const showImproved = personaMode === 'split' || personaMode === 'improved';
  const showCurrent = (personaMode === 'split' || personaMode === 'current') && !!data.currentHeadline;

  let habitsXml = '';
  if (privacy.includeHabits && data.habits && data.habits.length > 0) {
    const habitItems = data.habits.slice(0, 4).map((h, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 70 + col * 480;
      const y = 690 + row * 85;
      const baselineStr = formatValue(h.baseline, h.isFinancial);
      const targetStr = formatValue(h.target, h.isFinancial);
      return `
        <g transform="translate(${x}, ${y})">
          <rect width="450" height="70" rx="12" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1.5" />
          <text x="24" y="42" font-family="system-ui, sans-serif" font-size="20" fill="${theme.textSecondary}">${escapeXml(h.label)}</text>
          <text x="426" y="42" text-anchor="end" font-family="monospace, monospace" font-size="20" fill="${theme.accent}" font-weight="bold">
            <tspan fill="${theme.textSecondary}" font-weight="normal">${baselineStr} → </tspan>${targetStr}
          </text>
        </g>
      `;
    }).join('');

    habitsXml = `
      <text x="70" y="660" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" letter-spacing="1.5" fill="${theme.textSecondary}">KEY HABIT LEVERS</text>
      ${habitItems}
    `;
  }

  let quoteXml = '';
  if (privacy.includeLetterQuote && data.improvedQuote) {
    quoteXml = `
      <g transform="translate(70, 550)">
        <rect width="940" height="75" rx="14" fill="#ffffff" fill-opacity="0.03" stroke="${theme.border}" stroke-width="1" />
        <text x="30" y="45" font-family="system-ui, sans-serif" font-size="20" font-style="italic" fill="${theme.textPrimary}">
          &ldquo;${escapeXml(data.improvedQuote.slice(0, 85))}${data.improvedQuote.length > 85 ? '...' : ''}&rdquo;
        </text>
      </g>
    `;
  }

  let alignmentBadgeXml = '';
  if (privacy.includeAlignmentScore && data.alignmentScore !== undefined) {
    alignmentBadgeXml = `
      <g transform="translate(${width - 240}, 65)">
        <rect width="170" height="42" rx="21" fill="${theme.cardBg}" stroke="${theme.accent}" stroke-width="1.5" />
        <circle cx="28" cy="21" r="5" fill="${theme.accent}" />
        <text x="45" y="27" font-family="system-ui, sans-serif" font-size="17" font-weight="bold" fill="${theme.textPrimary}">${data.alignmentScore}% Aligned</text>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <radialGradient id="glow" cx="80%" cy="10%" r="50%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="${theme.bg}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${theme.bg}" />
  <rect width="${width}" height="${height}" fill="url(#glow)" />
  <rect x="25" y="25" width="${width - 50}" height="${height - 50}" rx="30" fill="none" stroke="${theme.border}" stroke-width="2" />

  <!-- Brand Header -->
  <g transform="translate(70, 75)">
    <text x="0" y="24" font-family="system-ui, sans-serif" font-size="24" font-weight="800" letter-spacing="4" fill="${theme.textPrimary}">FUTURE YOU</text>
    <text x="0" y="48" font-family="system-ui, sans-serif" font-size="14" letter-spacing="1.5" fill="${theme.textSecondary}">5-YEAR TRAJECTORY SIMULATION</text>
  </g>
  ${alignmentBadgeXml}

  <!-- Target Goal -->
  <g transform="translate(70, 185)">
    <text x="0" y="0" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" letter-spacing="2" fill="${theme.textSecondary}">TARGET TRAJECTORY</text>
    <text x="0" y="38" font-family="system-ui, sans-serif" font-size="30" font-weight="bold" fill="${theme.textPrimary}">${escapeXml(data.primaryGoal.slice(0, 55))}</text>
  </g>

  <!-- Personas Container -->
  ${showImproved ? `
  <g transform="translate(70, 275)">
    <rect width="${showCurrent ? 450 : 940}" height="230" rx="18" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1.5" />
    <text x="30" y="45" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="${theme.accent}">IMPROVED PATH (YEAR 5)</text>
    <text x="30" y="90" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="${theme.textPrimary}">
      <tspan x="30" dy="0">${escapeXml(data.improvedHeadline.slice(0, 36))}</tspan>
      ${data.improvedHeadline.length > 36 ? `<tspan x="30" dy="32">${escapeXml(data.improvedHeadline.slice(36, 75))}</tspan>` : ''}
    </text>
  </g>` : ''}

  ${showCurrent ? `
  <g transform="translate(${showImproved ? 560 : 70}, 275)">
    <rect width="${showImproved ? 450 : 940}" height="230" rx="18" fill="${theme.cardBg}" stroke="${theme.border}" stroke-width="1.5" />
    <text x="30" y="45" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" fill="#f59e0b">CURRENT PATH (YEAR 5)</text>
    <text x="30" y="90" font-family="system-ui, sans-serif" font-size="22" font-weight="600" fill="${theme.textSecondary}">
      <tspan x="30" dy="0">${escapeXml((data.currentHeadline || '').slice(0, 36))}</tspan>
      ${(data.currentHeadline || '').length > 36 ? `<tspan x="30" dy="32">${escapeXml((data.currentHeadline || '').slice(36, 75))}</tspan>` : ''}
    </text>
  </g>` : ''}

  ${quoteXml}
  ${habitsXml}

  <!-- Footer Disclaimer -->
  <g transform="translate(70, ${height - 70})">
    <text x="0" y="0" font-family="system-ui, sans-serif" font-size="16" fill="${theme.textSecondary}">futureyou.app</text>
    <text x="${width - 140}" y="0" text-anchor="end" font-family="system-ui, sans-serif" font-size="15" font-style="italic" fill="${theme.textSecondary}">
      A reflection tool, not a prediction engine
    </text>
  </g>
</svg>`;
}

/**
 * Converts raw SVG markup into a browser-safe base64 data URI.
 */
export function svgToDataUri(svgString: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

/**
 * Asynchronously renders vector SVG markup to an HTML5 Canvas.
 */
export function renderCardToCanvas(
  data: ShareCardData,
  config: ShareCardConfig
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    try {
      const { width, height } = CARD_DIMENSIONS[config.aspectRatio] || CARD_DIMENSIONS.square;
      const svgString = renderCardToSVG(data, config);
      const dataUri = svgToDataUri(svgString);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to acquire 2D canvas rendering context'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas);
      };
      img.onerror = (err) => {
        reject(new Error(`Failed to load SVG into image: ${String(err)}`));
      };
      img.src = dataUri;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Exports the card as an image Blob formatted as either 'image/svg+xml' or 'image/png'.
 */
export async function exportCardBlob(
  data: ShareCardData,
  config: ShareCardConfig
): Promise<Blob> {
  const svgString = renderCardToSVG(data, config);

  if (config.format === 'svg') {
    return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  }

  const canvas = await renderCardToCanvas(data, config);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas rasterization failed to produce PNG blob'));
      }
    }, 'image/png');
  });
}
