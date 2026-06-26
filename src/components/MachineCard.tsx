import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Machine } from '../types';
import { StateBadge } from './StateBadge';
import { useTicker } from '../hooks/useTicker';
import { formatDuration, getStateColor, isUrgentState } from '../utils';
import {
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  STATE_BG,
} from '../constants/theme';

interface Props {
  machine: Machine;
  onPress?: () => void;
}

export function MachineCard({ machine, onPress }: Props) {
  const now = useTicker();
  const elapsed = now - machine.stateEnteredAt;
  const stateColor = getStateColor(machine.state);
  const urgent = isUrgentState(machine.state);

  const progressPercent =
    machine.planned && machine.planned > 0
      ? Math.min((machine.produced ?? 0) / machine.planned, 1)
      : 0;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        urgent && { borderColor: stateColor + '44' },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={styles.idGroup}>
          <Text style={styles.machineId}>{machine.name}</Text>
          {machine.order !== '-' && (
            <Text style={styles.orderLabel}>Order #{machine.order}</Text>
          )}
        </View>
        <StateBadge state={machine.state} />
      </View>

      {/* Part info */}
      {machine.part && machine.part !== '-' && (
        <View style={styles.partRow}>
          <Text style={styles.partLabel}>PART</Text>
          <Text style={styles.partValue}>{machine.part}</Text>
          {machine.operation && (
            <>
              <View style={styles.separator} />
              <Text style={styles.partLabel}>OP</Text>
              <Text style={styles.partValue}>{machine.operation}</Text>
            </>
          )}
        </View>
      )}

      {/* Production progress */}
      {machine.planned != null && machine.planned > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressNumbers}>
            <Text style={styles.producedNum}>{machine.produced}</Text>
            <Text style={styles.plannedNum}> / {machine.planned}</Text>
            <Text style={styles.progressLabel}>  PRODUCED</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent * 100}%` as any,
                  backgroundColor: stateColor,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* State timer */}
      <View style={[styles.timerRow, { backgroundColor: STATE_BG[machine.state] }]}>
        <View style={styles.timerDot}>
          <View style={[styles.timerDotInner, { backgroundColor: stateColor }]} />
        </View>
        <Text style={styles.timerLabel}>IN STATE FOR</Text>
        <Text style={[styles.timerValue, { color: stateColor }]}>
          {formatDuration(elapsed)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  idGroup: {
    flex: 1,
  },
  machineId: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.3,
  },
  orderLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginTop: 2,
    fontWeight: FONT_WEIGHT.medium,
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
    flexWrap: 'wrap',
  },
  partLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
  },
  partValue: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  separator: {
    width: 1,
    height: 10,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  progressSection: {
    marginBottom: SPACING.sm,
  },
  progressNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  producedNum: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.black,
  },
  plannedNum: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.medium,
  },
  progressLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
  },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xs,
  },
  timerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timerLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
    flex: 1,
  },
  timerValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
});
