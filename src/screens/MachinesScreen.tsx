import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { MachineCard } from '../components/MachineCard';
import { StateBadge } from '../components/StateBadge';
import { AppHeader } from '../components/AppHeader';
import { Machine, MachineState } from '../types';
import { useTicker } from '../hooks/useTicker';
import { formatDuration, getStateColor } from '../utils';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../constants/theme';

const ALL_STATES: MachineState[] = [
  'Operation', 'Waiting', 'Replacement', 'Error', 'Stopped', 'Optional Stop'
];

export function MachinesScreen() {
  const { user, machines, unreadCount, simulateStateChange } = useApp();
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const now = useTicker();

  if (!user) return null;

  const myMachines = machines.filter(m =>
    user.assignedMachineIds.includes(m.id)
  );

  const urgentMachines = myMachines.filter(
    m => m.state === 'Error' || m.state === 'Waiting'
  );
  const normalMachines = myMachines.filter(
    m => m.state !== 'Error' && m.state !== 'Waiting'
  );
  const sorted = [...urgentMachines, ...normalMachines];

  return (
    <View style={styles.safe}>
      <AppHeader
        userName={user.name}
        role={user.role}
        unreadCount={unreadCount}
      />

      <FlatList
        data={sorted}
        keyExtractor={m => m.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MY MACHINES</Text>
            <Text style={styles.sectionCount}>{myMachines.length} assigned</Text>
          </View>
        }
        renderItem={({ item }) => (
          <MachineCard
            machine={item}
            onPress={() => setSelectedMachine(item)}
          />
        )}
      />

      {/* Machine Detail Modal */}
      <Modal
        visible={!!selectedMachine}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedMachine(null)}
      >
        {selectedMachine && (
          <MachineDetailModal
            machine={selectedMachine}
            now={now}
            onClose={() => setSelectedMachine(null)}
            onStateChange={(state) => {
              simulateStateChange(selectedMachine.id, state);
              setSelectedMachine(prev =>
                prev ? { ...prev, state, stateEnteredAt: Date.now() } : null
              );
            }}
          />
        )}
      </Modal>
    </View>
  );
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────
interface DetailProps {
  machine: Machine;
  now: number;
  onClose: () => void;
  onStateChange: (s: MachineState) => void;
}

function MachineDetailModal({ machine, now, onClose, onStateChange }: DetailProps) {
  const elapsed = now - machine.stateEnteredAt;
  const stateColor = getStateColor(machine.state);

  return (
    <View style={detail.container}>
      {/* Handle bar */}
      <View style={detail.handle} />

      <ScrollView contentContainerStyle={detail.scroll}>
        {/* Header */}
        <View style={detail.header}>
          <View>
            <Text style={detail.machineId}>{machine.name}</Text>
            {machine.order !== '-' && (
              <Text style={detail.orderText}>Order #{machine.order}</Text>
            )}
          </View>
          <StateBadge state={machine.state} />
        </View>

        {/* Timer Hero */}
        <View style={[detail.timerHero, { borderColor: stateColor + '44' }]}>
          <Text style={detail.timerHeroLabel}>TIME IN CURRENT STATE</Text>
          <Text style={[detail.timerHeroValue, { color: stateColor }]}>
            {formatDuration(elapsed)}
          </Text>
        </View>

        {/* Info Grid */}
        <View style={detail.grid}>
          <InfoCell label="PART" value={machine.part ?? '-'} />
          <InfoCell label="OPERATION" value={machine.operation ?? '-'} />
          <InfoCell label="PLANNED" value={String(machine.planned ?? 0)} />
          <InfoCell label="PRODUCED" value={String(machine.produced ?? 0)} />
          <InfoCell label="OPERATOR" value={machine.operatorName ?? '-'} span />
        </View>

        {/* Simulate state changes (demo feature) */}
        <View style={detail.simSection}>
          <Text style={detail.simTitle}>SIMULATE STATE CHANGE</Text>
          <Text style={detail.simSubtitle}>Demo: tap to trigger a state change and test notifications</Text>
          <View style={detail.simGrid}>
            {ALL_STATES.map(s => (
              <TouchableOpacity
                key={s}
                style={[
                  detail.simBtn,
                  s === machine.state && detail.simBtnActive,
                  s === machine.state && { borderColor: getStateColor(s) },
                ]}
                onPress={() => onStateChange(s)}
                activeOpacity={0.7}
              >
                <View style={[detail.simDot, { backgroundColor: getStateColor(s) }]} />
                <Text style={[detail.simBtnText, s === machine.state && { color: getStateColor(s) }]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={detail.closeBtn} onPress={onClose} activeOpacity={0.8}>
        <Text style={detail.closeBtnText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

function InfoCell({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <View style={[detail.cell, span && { width: '100%' }]}>
      <Text style={detail.cellLabel}>{label}</Text>
      <Text style={detail.cellValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const detail = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  scroll: {
    padding: SPACING.base,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.base,
  },
  machineId: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.black,
  },
  orderText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  timerHero: {
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.base,
    borderWidth: 1,
  },
  timerHeroLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  timerHeroValue: {
    fontSize: FONT_SIZE.xxxl + 8,
    fontWeight: FONT_WEIGHT.black,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },
  cell: {
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    width: '47.5%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cellLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  cellValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  simSection: {
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  simTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  simSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginBottom: SPACING.md,
    lineHeight: 16,
  },
  simGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  simBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  simBtnActive: {
    backgroundColor: COLORS.surfaceHigh,
  },
  simDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  simBtnText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  closeBtn: {
    margin: SPACING.base,
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeBtnText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  list: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.5,
  },
  sectionCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
});
