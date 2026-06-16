/**
 * Shared constants for the wallet pattern generator.
 * All physical measurements are in millimetres (mm).
 */

// Standard credit / debit card, ISO/IEC 7810 ID-1, held in landscape.
export const CARD_WIDTH_MM = 85.6;
export const CARD_HEIGHT_MM = 53.98;

// A little breathing room so a real card slides into the finished pocket.
// Added to the card footprint before the stitch border is applied.
export const CARD_CLEARANCE_MM = 1.5;

// How far each stacked card peeks out below the one above it.
export const POCKET_REVEAL_MM = 14;

// Slider ranges exposed in the UI.
export const STITCH_SPACING = { min: 2, max: 6, step: 0.5, default: 4 } as const;
export const BORDER_WIDTH = { min: 2, max: 5, step: 0.5, default: 3 } as const;
export const CARD_COUNT = { min: 1, max: 6, step: 1, default: 3 } as const;

// Radius of a single stitch hole when drawn (cosmetic, mm).
export const STITCH_HOLE_RADIUS_MM = 0.5;

// Rounded corner radius of the wallet body (mm).
export const CORNER_RADIUS_MM = 4;

export const COLORS = {
  background: '#11151c',
  surface: '#1b2230',
  surfaceAlt: '#232c3d',
  border: '#33405a',
  text: '#eef2f8',
  textMuted: '#8c9bb5',
  accent: '#5b9dff',
  accentMuted: '#2d456b',
  // wireframe colours
  cut: '#5b9dff', // cut / fold outline
  stitch: '#ffd166', // stitch holes
  card: '#3a4a63', // card reference outline
  pocket: '#7a8aa8', // pocket opening lines
} as const;
