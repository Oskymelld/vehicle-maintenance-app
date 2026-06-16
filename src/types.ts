/** User-controlled inputs that fully describe a wallet pattern. */
export interface WalletConfig {
  /** Number of stacked card pockets. */
  cardCount: number;
  /** Distance between adjacent stitch holes, in mm. */
  stitchSpacing: number;
  /** Width of the stitch border between the cut edge and the stitch line, in mm. */
  borderWidth: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * A fully resolved, render-ready pattern. All coordinates are in millimetres
 * with the origin at the top-left of the wallet body. The same geometry feeds
 * both the on-screen wireframe and the exported SVG/PDF.
 */
export interface WalletPattern {
  config: WalletConfig;
  /** Overall bounding size of the wallet body. */
  width: number;
  height: number;
  cornerRadius: number;
  /** Outer cut outline of the wallet body. */
  body: Rect;
  /** Dashed reference outline of each card, top pocket first. */
  cardOutlines: Rect[];
  /** Dashed pocket-opening lines, top pocket first. */
  pocketLines: { y: number; x1: number; x2: number }[];
  /** The continuous stitch line (U-shaped: left, bottom, right). */
  stitchPath: Point[];
  /** Individual stitch holes spaced along the stitch path. */
  stitchHoles: Point[];
  /** Stitch hole radius, in mm. */
  stitchHoleRadius: number;
}
