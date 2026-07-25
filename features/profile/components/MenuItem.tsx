import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";

export type MenuItemIconLib = "ionicons" | "material-community";

export interface MenuItemData {
  key: string;
  label: string;
  iconLib: MenuItemIconLib;
  iconName: string;
  destructive?: boolean;
}

interface MenuItemProps {
  item: MenuItemData;
  onPress: (key: string) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, onPress }) => {
  const iconColor = item.destructive ? COLORS.error : COLORS.primary;
  const labelColor = item.destructive ? COLORS.error : COLORS["on-surface-variant"];

  const Icon =
    item.iconLib === "ionicons" ? (
      <Ionicons
        name={item.iconName as React.ComponentProps<typeof Ionicons>["name"]}
        size={22}
        color={iconColor}
      />
    ) : (
      <MaterialCommunityIcons
        name={item.iconName as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
        size={22}
        color={iconColor}
      />
    );

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress(item.key)}
      activeOpacity={0.7}
    >
      {Icon}
      <Text style={[styles.label, { color: labelColor }]}>{item.label}</Text>
      {!item.destructive && (
        <Ionicons name="chevron-forward" size={18} color={COLORS["outline-variant"]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.lg,
  },
  label: {
    ...TYPOGRAPHY["label-md"],
    flex: 1,
  },
});
