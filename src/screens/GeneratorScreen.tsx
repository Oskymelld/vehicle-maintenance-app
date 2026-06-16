import { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OutputModal } from '../components/OutputModal';
import { SliderRow } from '../components/SliderRow';
import { StepperRow } from '../components/StepperRow';
import { WireframePreview } from '../components/WireframePreview';
import { BORDER_WIDTH, CARD_COUNT, COLORS, STITCH_SPACING } from '../constants';
import { generateWalletPattern } from '../patternGenerator';
import { WalletConfig, WalletPattern } from '../types';

const DEFAULT_CONFIG: WalletConfig = {
  cardCount: CARD_COUNT.default,
  stitchSpacing: STITCH_SPACING.default,
  borderWidth: BORDER_WIDTH.default,
};

function sameConfig(a: WalletConfig, b: WalletConfig): boolean {
  return (
    a.cardCount === b.cardCount &&
    a.stitchSpacing === b.stitchSpacing &&
    a.borderWidth === b.borderWidth
  );
}

export function GeneratorScreen() {
  const [config, setConfig] = useState<WalletConfig>(DEFAULT_CONFIG);
  // The pattern currently rendered as a wireframe (set when "Make" is tapped).
  const [pattern, setPattern] = useState<WalletPattern | null>(null);
  const [outputOpen, setOutputOpen] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });

  const update = <K extends keyof WalletConfig>(key: K, value: WalletConfig[K]) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const handleMake = () => setPattern(generateWalletPattern(config));

  const onPreviewLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setPreviewSize({ width, height });
  };

  // True once the live config has drifted from what's on screen.
  const stale = useMemo(
    () => pattern !== null && !sameConfig(pattern.config, config),
    [pattern, config],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Wallet Pattern</Text>
        <Text style={styles.tagline}>Stacked card holder · one pocket per card</Text>

        <View style={styles.previewFrame} onLayout={onPreviewLayout}>
          {pattern ? (
            <WireframePreview
              pattern={pattern}
              maxWidth={previewSize.width}
              maxHeight={previewSize.height}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderTitle}>No pattern yet</Text>
              <Text style={styles.placeholderText}>
                Set your options below, then tap Make to generate the wireframe.
              </Text>
            </View>
          )}
          {stale && (
            <View style={styles.staleBadge}>
              <Text style={styles.staleText}>Options changed — tap Make</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>DESIGN</Text>
          <StepperRow
            label="Card pockets"
            value={config.cardCount}
            min={CARD_COUNT.min}
            max={CARD_COUNT.max}
            onChange={(v) => update('cardCount', v)}
          />

          <Text style={[styles.sectionLabel, styles.sectionSpacer]}>STITCHING</Text>
          <SliderRow
            label="Stitch spacing"
            value={config.stitchSpacing}
            min={STITCH_SPACING.min}
            max={STITCH_SPACING.max}
            step={STITCH_SPACING.step}
            unit="mm"
            onChange={(v) => update('stitchSpacing', v)}
          />
          <SliderRow
            label="Border width"
            value={config.borderWidth}
            min={BORDER_WIDTH.min}
            max={BORDER_WIDTH.max}
            step={BORDER_WIDTH.step}
            unit="mm"
            onChange={(v) => update('borderWidth', v)}
          />
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.makeBtn, pressed && styles.makeBtnPressed]}
          onPress={handleMake}
        >
          <Text style={styles.makeText}>{pattern ? 'Remake' : 'Make'}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.outputBtn,
            !pattern && styles.outputBtnDisabled,
            pressed && pattern && styles.outputBtnPressed,
          ]}
          onPress={() => pattern && setOutputOpen(true)}
          disabled={!pattern}
        >
          <Text style={[styles.outputText, !pattern && styles.outputTextDisabled]}>Output</Text>
        </Pressable>
      </View>

      <OutputModal visible={outputOpen} pattern={pattern} onClose={() => setOutputOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  heading: { color: COLORS.text, fontSize: 28, fontWeight: '800', marginTop: 4 },
  tagline: { color: COLORS.textMuted, fontSize: 13, marginTop: 4, marginBottom: 16 },
  previewFrame: {
    height: 320,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  placeholder: { alignItems: 'center', paddingHorizontal: 30 },
  placeholderTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  placeholderText: { color: COLORS.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 19 },
  staleBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.accentMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  staleText: { color: COLORS.text, fontSize: 11, fontWeight: '600' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
  },
  sectionLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 14 },
  sectionSpacer: { marginTop: 6 },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
    gap: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  makeBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  makeBtnPressed: { opacity: 0.85 },
  makeText: { color: '#0b1020', fontSize: 16, fontWeight: '800' },
  outputBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  outputBtnPressed: { backgroundColor: COLORS.border },
  outputBtnDisabled: { opacity: 0.45 },
  outputText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  outputTextDisabled: { color: COLORS.textMuted },
});
