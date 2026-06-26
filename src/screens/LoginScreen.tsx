import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_USERS } from '../mock/data';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';
import { UserRole } from '../types';

const ROLE_COLOR: Record<UserRole, string> = {
  Operator: COLORS.operation,
  Setupist: COLORS.replacement,
  Manager: COLORS.optionalStop,
};

const ROLE_ICON: Record<UserRole, string> = {
  Operator: '⚙️',
  Setupist: '🔧',
  Manager: '📊',
};

export function LoginScreen() {
  const { login } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.container}>
        {/* Logo area */}
        <View style={styles.logoArea}>
          <View style={styles.logoMark}>
            <Text style={styles.logoSymbol}>F</Text>
          </View>
          <Text style={styles.appName}>FactoryOS</Text>
          <Text style={styles.tagline}>Machine monitoring · Real-time alerts</Text>
        </View>

        {/* Decorative line */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>SELECT WORKER</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* User cards */}
        <View style={styles.userList}>
          {MOCK_USERS.map(user => {
            const color = ROLE_COLOR[user.role];
            const icon = ROLE_ICON[user.role];
            return (
              <TouchableOpacity
                key={user.id}
                style={[styles.userCard, { borderLeftColor: color }]}
                onPress={() => login(user.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.userAvatar, { borderColor: color }]}>
                  <Text style={styles.userAvatarText}>{icon}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View style={styles.metaRow}>
                    <View style={[styles.rolePill, { backgroundColor: color + '22' }]}>
                      <Text style={[styles.roleText, { color }]}>{user.role}</Text>
                    </View>
                    <Text style={styles.machineCount}>
                      {user.assignedMachineIds.length} machines
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color }]}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.version}>Version 1.0.0 · Demo Mode</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: {
    flex: 1,
    padding: SPACING.base,
    justifyContent: 'center',
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoSymbol: {
    fontSize: FONT_SIZE.xxxl,
    color: COLORS.bg,
    fontWeight: FONT_WEIGHT.black,
  },
  appName: {
    fontSize: FONT_SIZE.xxl,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.black,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.5,
  },
  userList: {
    gap: SPACING.sm,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.md,
    padding: SPACING.base,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: FONT_SIZE.xl,
  },
  userInfo: {
    flex: 1,
    gap: SPACING.xs,
  },
  userName: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rolePill: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  roleText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
  },
  machineCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  chevron: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT.bold,
    marginTop: -2,
  },
  version: {
    textAlign: 'center',
    marginTop: SPACING.xxl,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
});
