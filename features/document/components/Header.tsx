/**
 * Document Feature - Header Component
 * Sticky header with logo and user avatar
 */

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
  isLoggedIn?: boolean;
  onLoginPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = "Student",
  avatarUrl,
  isLoggedIn = false,
  onLoginPress,
}) => {
  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuAQgyP51IX2z_34BVAwJF797GatcA3vKSHtYeBPvLhV-5v5vMOKAm4XYjOSjgjxzSPcIUXOlWEMg625Tqxubh4vxwB512SZ2NIr5xRgWOH4wEX06lX7p9e4Wv4fK7R4Pel36hJGKfkOsLyrFKVxj439Dgv15Wl-EEL3BdThqS8dm2JY2RQ_wDYnpIApeXvYRqjE6qtZWSsmsORQfvbYMIXGDwHCmBfYvE3Fq7JvV_rcLVzpo_b2kWMihUhWM8zlnGDaFrEEc4Isc9k";

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.logo}>AcademiShare</Text>
        {isLoggedIn ? (
          <Image source={{ uri: avatarUrl || defaultAvatar }} style={styles.avatar} />
        ) : (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={onLoginPress}
            activeOpacity={0.7}
          >
            <Text style={styles.loginBtnText}>Đăng nhập</Text>
          </TouchableOpacity>
        )}
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
  loginBtn: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  loginBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS.primary,
  },
});
