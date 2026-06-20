import { getCommonTabBarOptions } from "@/constants/theme";
import { RoleGate } from "@/features/auth";
import { useAppTheme } from "@/features/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconName;
  activeIcon: IoniconName;
}

const TAB_CONFIG: TabConfig[] = [
  { name: "index", title: "Trang chủ", icon: "home-outline", activeIcon: "home" },
  { name: "library", title: "Thư viện", icon: "library-outline", activeIcon: "library" },
  { name: "my-documents", title: "Tài liệu của tôi", icon: "document-text-outline", activeIcon: "document-text" },
  { name: "upload", title: "Đóng góp", icon: "cloud-upload-outline", activeIcon: "cloud-upload" },
  { name: "profile", title: "Hồ sơ", icon: "person-outline", activeIcon: "person" },
];

const HIDDEN_TABS = ["explore"];

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <RoleGate allowedRoles={["student"]}>
      <Tabs screenOptions={getCommonTabBarOptions(colors)}>
        {TAB_CONFIG.map(({ name, title, icon, activeIcon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons name={focused ? activeIcon : icon} size={24} color={color} />
              ),
            }}
          />
        ))}

        {HIDDEN_TABS.map((name) => (
          <Tabs.Screen key={name} name={name} options={{ href: null }} />
        ))}
      </Tabs>
    </RoleGate>
  );
}
