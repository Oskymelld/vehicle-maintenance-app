import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants';

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}

/** A labelled slider with a live value readout. */
export function SliderRow({ label, value, min, max, step, unit = '', onChange }: SliderRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {Math.round(value * 10) / 10}
          {unit}
        </Text>
      </View>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={COLORS.accent}
        maximumTrackTintColor={COLORS.border}
        thumbTintColor={COLORS.accent}
      />
      <View style={styles.scale}>
        <Text style={styles.scaleText}>
          {min}
          {unit}
        </Text>
        <Text style={styles.scaleText}>
          {max}
          {unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  value: { color: COLORS.accent, fontSize: 15, fontWeight: '700' },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  scaleText: { color: COLORS.textMuted, fontSize: 11 },
});
