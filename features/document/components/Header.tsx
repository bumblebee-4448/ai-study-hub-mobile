/**
 * Document Feature - Header Component
 * Sticky header with logo and user avatar
 */

import { COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = "Student",
  avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAQgyP51IX2z_34BVAwJF797GatcA3vKSHtYeBPvLhV-5v5vMOKAm4XYjOSjgjxzSPcIUXOlWEMg625Tqxubh4vxwB512SZ2NIr5xRgWOH4wEX06lX7p9e4Wv4fK7R4Pel36hJGKfkOsLyrFKVxj439Dgv15Wl-EEL3BdThqS8dm2JY2RQ_wDYnpIApeXvYRqjE6qtZWSsmsORQfvbYMIXGDwHCmBfYvE3Fq7JvV_rcLVzpo_b2kWMihUhWM8zlnGDaFrEEc4Isc9k",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.logo}>AcademiShare</Text>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderBottomColor: COLORS["outline-variant"],
    borderBottomWidth: 1,
    paddingHorizontal: SPACING["margin-mobile"],
    paddingVertical: SPACING.base,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
  },
  logo: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS.primary,
    fontWeight: "700",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: COLORS["outline-variant"],
    borderWidth: 1,
  },
});
