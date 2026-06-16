import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants';

interface StepperRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

/** A labelled +/- stepper for small integer counts. */
export function StepperRow({ label, value, min, max, onChange }: StepperRowProps) {
  const set = (next: number) => onChange(Math.min(max, Math.max(min, next)));

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controls}>
        <Pressable
          style={({ pressed }) => [styles.btn, value <= min && styles.btnDisabled, pressed && styles.btnPressed]}
          disabled={value <= min}
          onPress={() => set(value - 1)}
          accessibilityLabel={`Decrease ${label}`}
        >
          <Text style={styles.btnText}>−</Text>
        </Pressable>
        <Text style={styles.value}>{value}</Text>
        <Pressable
          style={({ pressed }) => [styles.btn, value >= max && styles.btnDisabled, pressed && styles.btnPressed]}
          disabled={value >= max}
          onPress={() => set(value + 1)}
          accessibilityLabel={`Increase ${label}`}
        >
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  label: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  controls: { flexDirection: 'row', alignItems: 'center' },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: { backgroundColor: COLORS.border },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: COLORS.text, fontSize: 22, lineHeight: 24, fontWeight: '600' },
  value: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
});
