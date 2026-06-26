import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../constants/theme';
import { UserRole } from '../types';

interface Props {
  userName: string;
  role: UserRole;
  unreadCount: number;
  onBellPress?: () => void;
}

const ROLE_COLOR: Record<UserRole, string> = {
  Operator: COLORS.operation,
  Setupist: COLORS.replacement,
  Manager: COLORS.optionalStop,
};

export function AppHeader({ userName, role, unreadCount, onBellPress }: Props) {
  const roleColor = ROLE_COLOR[role];
  const firstName = userName.split(' ')[0];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
      <View style={styles.left}>
        <View style={[styles.avatar, { borderColor: roleColor }]}>
          <Text style={[styles.avatarText, { color: roleColor }]}>
            {firstName[0].toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.greeting}>Hello, {firstName}</Text>
          <View style={[styles.rolePill, { backgroundColor: roleColor + '22', borderColor: roleColor + '44' }]}>
            <Text style={[styles.roleText, { color: roleColor }]}>{role.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.right}>
        <TouchableOpacity style={styles.bellBtn} onPress={onBellPress} activeOpacity={0.7} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <View style={styles.bellWrap}>
            <Text style={styles.bellIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  greeting: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  rolePill: {
    marginTop: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellBtn: {
    padding: SPACING.sm,
  },
  bellWrap: {
    position: 'relative',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bellIcon: {
    fontSize: FONT_SIZE.lg,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  badgeText: {
    fontSize: 9,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
  },
});
