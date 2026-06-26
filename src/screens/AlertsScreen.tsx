import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { AlertCard } from '../components/AlertCard';
import { AppHeader } from '../components/AppHeader';
import { Alert } from '../types';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../constants/theme';

export function AlertsScreen() {
  const { user, alerts, dismissAlert, dismissAll } = useApp();

  if (!user) return null;

  const active = alerts.filter(a => !a.dismissed);
  const dismissed = alerts.filter(a => a.dismissed);

  const errorCount = active.filter(a => a.type === 'error').length;
  const waitingCount = active.filter(a => a.type === 'waiting').length;

  return (
    <View style={styles.safe}>
      <AppHeader
        userName={user.name}
        role={user.role}
        unreadCount={active.length}
      />

      <FlatList
        data={active}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            {/* Summary chips */}
            <View style={styles.summaryRow}>
              {errorCount > 0 && (
                <View style={[styles.chip, { borderColor: COLORS.error + '66' }]}>
                  <View style={[styles.chipDot, { backgroundColor: COLORS.error }]} />
                  <Text style={[styles.chipText, { color: COLORS.error }]}>
                    {errorCount} Error{errorCount > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
              {waitingCount > 0 && (
                <View style={[styles.chip, { borderColor: COLORS.waiting + '66' }]}>
                  <View style={[styles.chipDot, { backgroundColor: COLORS.waiting }]} />
                  <Text style={[styles.chipText, { color: COLORS.waiting }]}>
                    {waitingCount} Waiting
                  </Text>
                </View>
              )}
              <View style={styles.chipSpacer} />
              {active.length > 1 && (
                <TouchableOpacity onPress={dismissAll} activeOpacity={0.7}>
                  <Text style={styles.dismissAllText}>Dismiss all</Text>
                </TouchableOpacity>
              )}
            </View>

            {active.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>✅</Text>
                <Text style={styles.emptyTitle}>All clear</Text>
                <Text style={styles.emptySubtitle}>
                  No active alerts right now.{'\n'}You'll be notified immediately when
                  a machine needs attention.
                </Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <AlertCard alert={item} onDismiss={dismissAlert} />
        )}
        ListFooterComponent={
          dismissed.length > 0 ? (
            <View style={styles.dismissedSection}>
              <Text style={styles.dismissedLabel}>
                {dismissed.length} dismissed alert{dismissed.length !== 1 ? 's' : ''}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  list: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    backgroundColor: COLORS.surface,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.5,
  },
  chipSpacer: { flex: 1 },
  dismissAllText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    gap: SPACING.sm,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
  dismissedSection: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  dismissedLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
});
