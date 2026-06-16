import { mm } from '../patternGenerator';
import { WalletPattern } from '../types';

// Print colours: solid black lines read best on paper templates.
const CUT = '#1a1a1a';
const STITCH = '#c84b31';
const CARD = '#9aa3b2';
const POCKET = '#6b7689';
const LABEL = '#444444';

function rect(x: number, y: number, w: number, h: number, extra: string): string {
  return `<rect x="${mm(x)}" y="${mm(y)}" width="${mm(w)}" height="${mm(h)}" ${extra} />`;
}

/**
 * Render a wallet pattern to a standalone SVG document, drawn 1:1 at real
 * physical size (mm units) so it can be printed without scaling.
 */
export function buildSvg(pattern: WalletPattern): string {
  const margin = 12; // mm of paper margin around the body for labels
  const docW = pattern.width + margin * 2;
  const docH = pattern.height + margin * 2 + 14; // extra room for the caption

  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
      `width="${mm(docW)}mm" height="${mm(docH)}mm" ` +
      `viewBox="0 0 ${mm(docW)} ${mm(docH)}">`,
  );

  // Everything is translated inside the paper margin.
  parts.push(`<g transform="translate(${margin} ${margin})">`);

  // Card reference outlines (dashed, light).
  for (const c of pattern.cardOutlines) {
    parts.push(
      rect(
        c.x,
        c.y,
        c.width,
        c.height,
        `fill="none" stroke="${CARD}" stroke-width="0.2" stroke-dasharray="1.5 1.5"`,
      ),
    );
  }

  // Pocket opening lines (dashed).
  for (const p of pattern.pocketLines) {
    parts.push(
      `<line x1="${mm(p.x1)}" y1="${mm(p.y)}" x2="${mm(p.x2)}" y2="${mm(p.y)}" ` +
        `stroke="${POCKET}" stroke-width="0.3" stroke-dasharray="2 1.5" />`,
    );
  }

  // Outer cut outline.
  parts.push(
    `<rect x="0" y="0" width="${mm(pattern.width)}" height="${mm(pattern.height)}" ` +
      `rx="${mm(pattern.cornerRadius)}" ry="${mm(pattern.cornerRadius)}" ` +
      `fill="none" stroke="${CUT}" stroke-width="0.4" />`,
  );

  // Stitch line.
  const d = pattern.stitchPath
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${mm(pt.x)} ${mm(pt.y)}`)
    .join(' ');
  parts.push(`<path d="${d}" fill="none" stroke="${STITCH}" stroke-width="0.2" stroke-dasharray="0.6 0.6" />`);

  // Stitch holes.
  for (const hole of pattern.stitchHoles) {
    parts.push(
      `<circle cx="${mm(hole.x)}" cy="${mm(hole.y)}" r="${mm(pattern.stitchHoleRadius)}" ` +
        `fill="${STITCH}" />`,
    );
  }

  parts.push('</g>');

  // Caption with the spec and a printed scale-check note.
  const { cardCount, stitchSpacing, borderWidth } = pattern.config;
  const caption =
    `${cardCount} pocket${cardCount > 1 ? 's' : ''}  ·  ` +
    `${mm(stitchSpacing)}mm stitch spacing  ·  ` +
    `${mm(borderWidth)}mm border  ·  ` +
    `${mm(pattern.width)} × ${mm(pattern.height)}mm  ·  ${pattern.stitchHoles.length} holes`;
  parts.push(
    `<text x="${margin}" y="${mm(docH - 6)}" font-family="Helvetica, Arial, sans-serif" ` +
      `font-size="3.2" fill="${LABEL}">${caption}</text>`,
  );
  parts.push(
    `<text x="${margin}" y="${mm(docH - 1.5)}" font-family="Helvetica, Arial, sans-serif" ` +
      `font-size="2.4" fill="${LABEL}">Print at 100% (no scaling). Body should measure ` +
      `${mm(pattern.width)}mm wide.</text>`,
  );

  parts.push('</svg>');
  return parts.join('\n');
}
