import { Tabs } from "expo-router";
import React from "react";
import { LayoutDashboard, ClipboardList, User } from "lucide-react-native";

export default function ModeratorTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: 70,
          paddingBottom: 12,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: "Duyệt tài liệu",
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
