import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { UserProfile } from "../types";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => (
  <View style={styles.card}>
    <View style={styles.accentBlob} />

    <View style={styles.avatarRing}>
      <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} resizeMode="cover" />
    </View>

    <View style={styles.nameBlock}>
      <Text style={styles.userName}>{profile.name}</Text>
      <Text style={styles.university}>{profile.university}</Text>
      <View style={styles.yearRow}>
        <Ionicons name="school-outline" size={14} color={COLORS.secondary} />
        <Text style={styles.yearText}>{profile.yearMajor}</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS["surface-container-low"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
    gap: SPACING.md,
    overflow: "hidden",
  },
  accentBlob: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: COLORS["primary-container"],
    opacity: 0.15,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: "hidden",
    backgroundColor: COLORS["surface-container-high"],
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  nameBlock: {
    alignItems: "center",
    gap: SPACING.sm,
  },
  userName: {
    ...TYPOGRAPHY["headline-lg-mobile"],
    color: COLORS["on-surface"],
  },
  university: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
  },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  yearText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.secondary,
  },
});
