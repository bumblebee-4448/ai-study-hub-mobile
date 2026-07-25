import { Tabs } from "expo-router";
import React from "react";
import { LayoutDashboard, ClipboardList, User } from "lucide-react-native";
import { RoleGate } from "@/features/auth";
import { getCommonTabBarOptions } from "@/constants/theme";
import { useAppTheme } from "@/features/theme";

export default function ModeratorTabLayout() {
  const { colors } = useAppTheme();

  return (
    <RoleGate allowedRoles={["moderator"]}>
      <Tabs screenOptions={getCommonTabBarOptions(colors)}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
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
    </RoleGate>
  );
}
