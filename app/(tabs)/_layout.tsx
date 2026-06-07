/**
 * Tab Layout — AcademiShare Bottom Navigation
 * 4 tabs: Trang chủ (active), Thư viện, Tải lên, Profile
 * Icons from @expo/vector-icons Ionicons — no HapticTab dependency
 */

import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS["on-surface-variant"],
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* Trang chủ */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={(focused ? "home" : "home-outline") as IoniconName}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Thư viện */}
      <Tabs.Screen
        name="library"
        options={{
          title: "Thư viện",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                (focused
                  ? "library"
                  : "library-outline") as IoniconName
              }
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Tải lên */}
      <Tabs.Screen
        name="upload"
        options={{
          title: "Tải lên",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                (focused
                  ? "cloud-upload"
                  : "cloud-upload-outline") as IoniconName
              }
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={
                (focused ? "person" : "person-outline") as IoniconName
              }
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* Hide default explore tab */}
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS["surface-container-lowest"],
    borderTopColor: COLORS["outline-variant"],
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
});
