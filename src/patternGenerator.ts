import {
  CARD_CLEARANCE_MM,
  CARD_HEIGHT_MM,
  CARD_WIDTH_MM,
  CORNER_RADIUS_MM,
  POCKET_REVEAL_MM,
  STITCH_HOLE_RADIUS_MM,
} from './constants';
import { Point, WalletConfig, WalletPattern } from './types';

/**
 * Clamp a value into the inclusive [min, max] range.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Distribute stitch holes evenly along a straight segment so that there is a
 * hole at each endpoint and the spacing sits as close as possible to the
 * requested target. Returns the points including both endpoints.
 */
function holesAlongSegment(start: Point, end: Point, targetSpacing: number): Point[] {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return [start];

  // Choose a whole number of gaps that keeps spacing nearest the target.
  const intervals = Math.max(1, Math.round(length / targetSpacing));
  const points: Point[] = [];
  for (let i = 0; i <= intervals; i++) {
    const t = i / intervals;
    points.push({ x: start.x + dx * t, y: start.y + dy * t });
  }
  return points;
}

/**
 * Walk a multi-segment path placing evenly spaced holes on each segment, then
 * drop duplicate points shared at the corners.
 */
function holesAlongPath(path: Point[], targetSpacing: number): Point[] {
  const holes: Point[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const segment = holesAlongSegment(path[i], path[i + 1], targetSpacing);
    for (const p of segment) {
      const last = holes[holes.length - 1];
      if (last && Math.hypot(last.x - p.x, last.y - p.y) < 0.05) continue;
      holes.push(p);
    }
  }
  return holes;
}

/**
 * Build a complete, render-ready wallet pattern from the user's configuration.
 *
 * The design is a stacked card holder: a single body panel with one open
 * pocket per card. Cards cascade downward, each peeking out by
 * POCKET_REVEAL_MM. The body is stitched down both sides and across the
 * bottom; the top edge is the open mouth of the first pocket.
 */
export function generateWalletPattern(config: WalletConfig): WalletPattern {
  const cardCount = Math.max(1, Math.round(config.cardCount));
  const border = config.borderWidth;
  const spacing = config.stitchSpacing;

  // Footprint of a card plus a little clearance so it slides in.
  const slotWidth = CARD_WIDTH_MM + CARD_CLEARANCE_MM;
  const slotHeight = CARD_HEIGHT_MM + CARD_CLEARANCE_MM;

  // The top card sits one border-width down from the top edge; each extra card
  // adds one reveal of height. Stitch border wraps the sides and bottom.
  const topMargin = border;
  const width = slotWidth + border * 2;
  const height = topMargin + (cardCount - 1) * POCKET_REVEAL_MM + slotHeight + border;

  const slotLeft = border;
  const slotRight = width - border;

  // Card reference outlines (dashed), top pocket first.
  const cardOutlines = Array.from({ length: cardCount }, (_, i) => ({
    x: slotLeft + CARD_CLEARANCE_MM / 2,
    y: topMargin + i * POCKET_REVEAL_MM + CARD_CLEARANCE_MM / 2,
    width: CARD_WIDTH_MM,
    height: CARD_HEIGHT_MM,
  }));

  // Pocket opening lines (dashed), top pocket first.
  const pocketLines = Array.from({ length: cardCount }, (_, i) => ({
    y: topMargin + i * POCKET_REVEAL_MM,
    x1: slotLeft,
    x2: slotRight,
  }));

  // U-shaped stitch line inset by the border width: down the left side, across
  // the bottom, up the right side. The top stays open.
  const stitchPath: Point[] = [
    { x: border, y: border },
    { x: border, y: height - border },
    { x: width - border, y: height - border },
    { x: width - border, y: border },
  ];

  const stitchHoles = holesAlongPath(stitchPath, spacing);

  return {
    config: { cardCount, stitchSpacing: spacing, borderWidth: border },
    width,
    height,
    cornerRadius: Math.min(CORNER_RADIUS_MM, border + 1),
    body: { x: 0, y: 0, width, height },
    cardOutlines,
    pocketLines,
    stitchPath,
    stitchHoles,
    stitchHoleRadius: STITCH_HOLE_RADIUS_MM,
  };
}

/** Round to one decimal place for display. */
export function mm(value: number): string {
  return `${Math.round(value * 10) / 10}`;
}
