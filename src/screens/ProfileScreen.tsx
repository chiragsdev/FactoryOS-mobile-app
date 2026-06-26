import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { AppHeader } from '../components/AppHeader';
import { COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from '../constants/theme';
import { UserRole } from '../types';

const ROLE_COLOR: Record<UserRole, string> = {
  Operator: COLORS.operation,
  Setupist: COLORS.replacement,
  Manager: COLORS.optionalStop,
};

export function ProfileScreen() {
  const { user, logout, unreadCount } = useApp();
  if (!user) return null;

  const roleColor = ROLE_COLOR[user.role];

  const notifMatrix = [
    {
      trigger: 'Machine → Waiting',
      operator: user.role === 'Operator' ? '✅ Immediate' : '—',
      setupist: user.role === 'Setupist' ? '—' : user.role === 'Operator' ? null : '—',
      you: user.role === 'Operator' ? true : false,
      label: user.role === 'Operator' ? 'You get this' : 'Not for your role',
      active: user.role === 'Operator',
    },
    {
      trigger: 'Machine → Error',
      you: user.role === 'Operator' || user.role === 'Setupist',
      label: user.role === 'Operator' || user.role === 'Setupist' ? 'You get this' : 'Not for your role',
      active: user.role === 'Operator' || user.role === 'Setupist',
    },
    {
      trigger: 'Waiting > 20 min',
      you: user.role === 'Manager',
      label: user.role === 'Manager' ? 'You get this (escalation)' : 'Manager only',
      active: user.role === 'Manager',
    },
    {
      trigger: 'Call Setupist pressed',
      you: user.role === 'Setupist',
      label: user.role === 'Setupist' ? 'You get this' : 'Setupist only',
      active: user.role === 'Setupist',
    },
  ];

  return (
    <View style={styles.safe}>
      <AppHeader
        userName={user.name}
        role={user.role}
        unreadCount={unreadCount}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile card */}
        <View style={[styles.profileCard, { borderTopColor: roleColor }]}>
          <View style={[styles.avatar, { borderColor: roleColor }]}>
            <Text style={[styles.avatarText, { color: roleColor }]}>
              {user.name[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={[styles.rolePill, { backgroundColor: roleColor + '22', borderColor: roleColor + '44' }]}>
            <Text style={[styles.roleText, { color: roleColor }]}>{user.role.toUpperCase()}</Text>
          </View>
          <Text style={styles.idText}>ID: {user.id}</Text>
        </View>

        {/* Notification Matrix */}
        <SectionHeader title="MY NOTIFICATION RULES" />
        <View style={styles.matrixCard}>
          {notifMatrix.map((row, i) => (
            <View
              key={i}
              style={[
                styles.matrixRow,
                i < notifMatrix.length - 1 && styles.matrixRowBorder,
              ]}
            >
              <View style={styles.matrixLeft}>
                <Text style={styles.triggerText}>{row.trigger}</Text>
                <Text style={[styles.matrixLabel, { color: row.active ? COLORS.operation : COLORS.textTertiary }]}>
                  {row.label}
                </Text>
              </View>
              <Text style={[styles.matrixStatus, { color: row.active ? COLORS.operation : COLORS.textTertiary }]}>
                {row.active ? '✓' : '✗'}
              </Text>
            </View>
          ))}
        </View>

        {/* Assigned machines */}
        <SectionHeader title="ASSIGNED MACHINES" />
        <View style={styles.matrixCard}>
          {user.assignedMachineIds.map((id, i) => (
            <View
              key={id}
              style={[
                styles.matrixRow,
                i < user.assignedMachineIds.length - 1 && styles.matrixRowBorder,
              ]}
            >
              <Text style={styles.triggerText}>{id}</Text>
              <View style={styles.liveChip}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>MONITORED</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>FactoryOS Mobile v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text style={styles.sectionHeader}>{title}</Text>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },
  profileCard: {
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 3,
    gap: SPACING.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.black,
  },
  userName: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
  },
  rolePill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  roleText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.black,
    letterSpacing: 1.5,
  },
  idText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  sectionHeader: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  matrixCard: {
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  matrixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    justifyContent: 'space-between',
  },
  matrixRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  matrixLeft: { flex: 1 },
  triggerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  matrixLabel: {
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  matrixStatus: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.sm,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.operation + '22',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.operation,
  },
  liveText: {
    fontSize: 9,
    color: COLORS.operation,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.8,
  },
  logoutBtn: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '44',
  },
  logoutText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.error,
    fontWeight: FONT_WEIGHT.semibold,
  },
  version: {
    textAlign: 'center',
    marginTop: SPACING.lg,
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
});
