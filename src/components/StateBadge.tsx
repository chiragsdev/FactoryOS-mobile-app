import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MachineState } from '../types';
import { getStateColor, isUrgentState } from '../utils';
import { COLORS, RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../constants/theme';

interface Props {
  state: MachineState;
  size?: 'sm' | 'md';
}

export function StateBadge({ state, size = 'md' }: Props) {
  const color = getStateColor(state);
  const urgent = isUrgentState(state);
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { borderColor: color },
        isSmall && styles.badgeSm,
      ]}
    >
      {/* Pulse dot */}
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text
        style={[
          styles.label,
          { color },
          isSmall && styles.labelSm,
        ]}
      >
        {state.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
  },
  labelSm: {
    fontSize: 9,
  },
});
