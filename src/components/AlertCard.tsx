import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Alert, AlertType } from '../types';
import { getAlertColor, getAlertBg, formatTimeAgo } from '../utils';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';

interface Props {
  alert: Alert;
  onDismiss: (id: string) => void;
}

const TYPE_ICON: Record<AlertType, string> = {
  waiting: '⏳',
  error: '🚨',
  escalation: '⚠️',
  assistance: '🛠️',
};

const TYPE_LABEL: Record<AlertType, string> = {
  waiting: 'WAITING',
  error: 'ERROR',
  escalation: 'ESCALATION',
  assistance: 'ASSISTANCE',
};

export function AlertCard({ alert, onDismiss }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;

  const handleDismiss = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => onDismiss(alert.id));
  };

  const accentColor = getAlertColor(alert.type);
  const bgColor = getAlertBg(alert.type);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View
        style={[
          styles.card,
          { backgroundColor: bgColor, borderLeftColor: accentColor },
        ]}
      >
        {/* Left accent bar built via borderLeftWidth */}
        <View style={styles.inner}>
          <View style={styles.header}>
            <View style={styles.typeRow}>
              <Text style={styles.icon}>{TYPE_ICON[alert.type]}</Text>
              <Text style={[styles.typeLabel, { color: accentColor }]}>
                {TYPE_LABEL[alert.type]}
              </Text>
            </View>
            <Text style={styles.timeAgo}>{formatTimeAgo(alert.timestamp)}</Text>
          </View>

          <Text style={styles.machineName}>{alert.machineName}</Text>
          <Text style={styles.message}>{alert.message}</Text>

          <TouchableOpacity
            style={[styles.dismissBtn, { borderColor: accentColor }]}
            onPress={handleDismiss}
            activeOpacity={0.7}
          >
            <Text style={[styles.dismissText, { color: accentColor }]}>
              DISMISS
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  },
  card: {
    borderRadius: RADIUS.md,
    borderLeftWidth: 3,
    overflow: 'hidden',
  },
  inner: {
    padding: SPACING.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  icon: {
    fontSize: FONT_SIZE.sm,
  },
  typeLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.2,
  },
  timeAgo: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.medium,
  },
  machineName: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  message: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  dismissBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  dismissText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
  },
});
