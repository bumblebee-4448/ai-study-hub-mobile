import { Tabs } from 'expo-router';
import React from 'react';
import { BookOpen, LayoutDashboard, UserCircle, Users } from 'lucide-react-native';
import { RoleGate } from '@/features/auth';
import { getCommonTabBarOptions } from '@/constants/theme';
import { useAppTheme } from '@/features/theme';

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <RoleGate allowedRoles={['admin']}>
      <Tabs screenOptions={getCommonTabBarOptions(colors)}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Trang chủ',
            tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Người dùng',
            tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="subjects"
          options={{
            title: 'Môn học',
            tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Hồ sơ',
            tabBarIcon: ({ color }) => <UserCircle size={24} color={color} />,
          }}
        />
      </Tabs>
    </RoleGate>
  );
}
