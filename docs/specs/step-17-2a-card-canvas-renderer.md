# Technical Specification: Step 17.2a — Client-Side Card Canvas & SVG Renderer

## 1. Overview
Step 17.2a implements `card-canvas-renderer.ts` in `src/lib/export/card-canvas-renderer.ts`.
This module provides a pure client-side, zero-cloud rendering engine that turns `ShareCardData` and `ShareCardConfig` into high-resolution vector SVG markup and raster HTML5 Canvas blobs. It powers both SVG downloads and PNG exports without any third-party rasterization libraries or server-side endpoints.

---

## 2. File Layout & LOC Budget
- **Renderer Module**: `src/lib/export/card-canvas-renderer.ts` ($\le 270$ LOC)
- **Barrel Export**: `src/lib/export/index.ts`
- **Unit Tests**: `src/lib/export/__tests__/card-canvas-renderer.test.ts` ($\le 200$ LOC)

---

## 3. Function Signatures & API Contract

```typescript
/**
 * Serializes simulation card data and styling into standalone vector SVG markup.
 */
export function renderCardToSVG(
  data: ShareCardData,
  config: ShareCardConfig
): string;

/**
 * Converts raw SVG markup into a browser-compatible base64 data URI.
 */
export function svgToDataUri(svgString: string): string;

/**
 * Asynchronously paints the generated vector SVG onto a raster HTML5 Canvas.
 */
export function renderCardToCanvas(
  data: ShareCardData,
  config: ShareCardConfig
): Promise<HTMLCanvasElement>;

/**
 * Exports the card as an image Blob formatted as either 'image/svg+xml' or 'image/png'.
 */
export function exportCardBlob(
  data: ShareCardData,
  config: ShareCardConfig
): Promise<Blob>;
```

---

## 4. Architectural & Privacy Invariants
- **Zero Cloud Leakage**: All rasterization and vector rendering occur strictly in the browser.
- **Client-Side Redaction**: Privacy masks (financial figures, private anxieties) are applied prior to SVG tag construction.
- **Mandatory Reflection Disclaimer**: The vector SVG must embed the permanent footer:
  `"Future You · A reflection tool, not a prediction engine"`
- **LOC Limit**: Maximum 300 LOC per file.
