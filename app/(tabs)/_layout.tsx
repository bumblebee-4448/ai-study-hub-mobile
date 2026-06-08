import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { COLORS } from "@/constants/theme";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconName;
  activeIcon: IoniconName;
}

const TAB_CONFIG: TabConfig[] = [
  { name: "index", title: "Trang chủ", icon: "home-outline", activeIcon: "home" },
  { name: "upload", title: "Tải lên", icon: "cloud-upload-outline", activeIcon: "cloud-upload" },
  { name: "library", title: "Thư viện", icon: "library-outline", activeIcon: "library" },
  { name: "profile", title: "Hồ sơ", icon: "person-outline", activeIcon: "person" },
];

const HIDDEN_TABS = ["explore"];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS["on-surface-variant"],
        tabBarStyle: {
          backgroundColor: COLORS["surface-container-lowest"],
          borderTopColor: COLORS["outline-variant"],
        },
      }}
    >
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
  );
}
