import { Tabs } from 'expo-router';
import React from 'react';
import { LayoutDashboard, BarChart2, Users, Settings } from 'lucide-react-native';
import { RoleGate } from '@/features/auth';
import { COMMON_TAB_BAR_OPTIONS } from '@/constants/theme';

export default function TabLayout() {
  return (
    <RoleGate allowedRoles={['admin']}>
      <Tabs screenOptions={COMMON_TAB_BAR_OPTIONS}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color }) => <BarChart2 size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Users',
            tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
          }}
        />
      </Tabs>
    </RoleGate>
  );
}
