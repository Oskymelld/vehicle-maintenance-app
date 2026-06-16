import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

import { COLORS } from '../constants';
import { mm } from '../patternGenerator';
import { WalletPattern } from '../types';

interface WireframePreviewProps {
  pattern: WalletPattern;
  /** Available width for the preview, in px. */
  maxWidth: number;
  /** Available height for the preview, in px. */
  maxHeight: number;
}

const PADDING = 24; // px of breathing room inside the preview frame

/**
 * On-screen wireframe of the wallet pattern. Draws in millimetre coordinates
 * via an SVG viewBox and scales the rendered size to fit the available area,
 * keeping the proportions true to the real template.
 */
export function WireframePreview({ pattern, maxWidth, maxHeight }: WireframePreviewProps) {
  const availW = Math.max(40, maxWidth - PADDING * 2);
  const availH = Math.max(40, maxHeight - PADDING * 2);
  const scale = Math.min(availW / pattern.width, availH / pattern.height);
  const renderW = pattern.width * scale;
  const renderH = pattern.height * scale;

  return (
    <View style={styles.container}>
      <Svg width={renderW} height={renderH} viewBox={`0 0 ${pattern.width} ${pattern.height}`}>
        {/* Card reference outlines */}
        {pattern.cardOutlines.map((c, i) => (
          <Rect
            key={`card-${i}`}
            x={c.x}
            y={c.y}
            width={c.width}
            height={c.height}
            fill="none"
            stroke={COLORS.card}
            strokeWidth={0.3}
            strokeDasharray="1.6 1.6"
          />
        ))}

        {/* Pocket opening lines */}
        {pattern.pocketLines.map((p, i) => (
          <Line
            key={`pocket-${i}`}
            x1={p.x1}
            y1={p.y}
            x2={p.x2}
            y2={p.y}
            stroke={COLORS.pocket}
            strokeWidth={0.4}
            strokeDasharray="2 1.5"
          />
        ))}

        {/* Outer cut outline */}
        <Rect
          x={0}
          y={0}
          width={pattern.width}
          height={pattern.height}
          rx={pattern.cornerRadius}
          ry={pattern.cornerRadius}
          fill="none"
          stroke={COLORS.cut}
          strokeWidth={0.6}
        />

        {/* Stitch line */}
        <Path
          d={pattern.stitchPath.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')}
          fill="none"
          stroke={COLORS.stitch}
          strokeWidth={0.25}
          strokeDasharray="0.8 0.8"
          opacity={0.8}
        />

        {/* Stitch holes */}
        {pattern.stitchHoles.map((h, i) => (
          <Circle key={`hole-${i}`} cx={h.x} cy={h.y} r={pattern.stitchHoleRadius} fill={COLORS.stitch} />
        ))}
      </Svg>

      <Text style={styles.dims}>
        {mm(pattern.width)} × {mm(pattern.height)} mm
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  dims: { marginTop: 12, color: COLORS.textMuted, fontSize: 12, letterSpacing: 0.5 },
});
