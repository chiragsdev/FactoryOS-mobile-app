import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertsScreen } from '../screens/AlertsScreen';
import { MachinesScreen } from '../screens/MachinesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useApp } from '../context/AppContext';
import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../constants/theme';

const Tab = createBottomTabNavigator();

function TabIcon({ icon, focused, badge }: { icon: string; focused: boolean; badge?: number }) {
  return (
    <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}>
      <Text style={{ fontSize: 26, opacity: focused ? 1 : 0.45 }}>{icon}</Text>
      {badge != null && badge > 0 && (
        <View style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: COLORS.error,
          borderRadius: 999,
          minWidth: 18,
          height: 18,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 3,
          borderWidth: 2,
          borderColor: COLORS.bg,
        }}>
          <Text style={{ fontSize: 9, color: COLORS.white, fontWeight: FONT_WEIGHT.bold }}>
            {badge > 9 ? '9+' : badge}
          </Text>
        </View>
      )}
    </View>
  );
}

export function MainNavigator() {
  const { unreadCount } = useApp();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 64 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: insets.bottom + SPACING.sm,
          paddingTop: SPACING.md,
          paddingHorizontal: SPACING.sm,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: FONT_WEIGHT.bold,
          letterSpacing: 0.5,
          marginTop: 0,
        },
        tabBarItemStyle: {
          paddingVertical: SPACING.xs,
          borderRadius: RADIUS.md,
        },
      }}
    >
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🔔" focused={focused} badge={unreadCount} />
          ),
        }}
      />
      <Tab.Screen
        name="Machines"
        component={MachinesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⚙️" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
