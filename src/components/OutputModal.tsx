import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants';
import { exportPdf, exportSvg, patternSummary } from '../export/exportPattern';
import { WalletPattern } from '../types';

interface OutputModalProps {
  visible: boolean;
  pattern: WalletPattern | null;
  onClose: () => void;
}

type Busy = 'pdf' | 'svg' | null;

/** Bottom-sheet style overlay that offers PDF or SVG download of the pattern. */
export function OutputModal({ visible, pattern, onClose }: OutputModalProps) {
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (kind: 'pdf' | 'svg') => {
    if (!pattern || busy) return;
    setError(null);
    setBusy(kind);
    try {
      if (kind === 'pdf') await exportPdf(pattern);
      else await exportSvg(pattern);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={busy ? undefined : onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Export pattern</Text>
          {pattern && <Text style={styles.subtitle}>{patternSummary(pattern)}</Text>}

          <Pressable
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            onPress={() => run('pdf')}
            disabled={!!busy}
          >
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>PDF</Text>
              <Text style={styles.optionDesc}>Print-ready, 1:1 scale. Best for tracing onto leather.</Text>
            </View>
            {busy === 'pdf' ? <ActivityIndicator color={COLORS.accent} /> : <Text style={styles.chevron}>›</Text>}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            onPress={() => run('svg')}
            disabled={!!busy}
          >
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>SVG</Text>
              <Text style={styles.optionDesc}>Vector file for editing or laser/CNC cutting.</Text>
            </View>
            {busy === 'svg' ? <ActivityIndicator color={COLORS.accent} /> : <Text style={styles.chevron}>›</Text>}
          </Pressable>

          {error && <Text style={styles.error}>{error}</Text>}

          <Pressable style={styles.cancel} onPress={onClose} disabled={!!busy}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginBottom: 14,
  },
  title: { color: COLORS.text, fontSize: 20, fontWeight: '700' },
  subtitle: { color: COLORS.textMuted, fontSize: 13, marginTop: 2, marginBottom: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  optionPressed: { backgroundColor: COLORS.border },
  optionText: { flex: 1, paddingRight: 12 },
  optionTitle: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  optionDesc: { color: COLORS.textMuted, fontSize: 12, marginTop: 3, lineHeight: 16 },
  chevron: { color: COLORS.textMuted, fontSize: 26, fontWeight: '300' },
  error: { color: '#ff6b6b', fontSize: 13, marginTop: 4, marginBottom: 4 },
  cancel: { alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  cancelText: { color: COLORS.textMuted, fontSize: 15, fontWeight: '600' },
});
