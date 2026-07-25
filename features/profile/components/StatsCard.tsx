import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";

export interface StatsCardData {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}

interface StatsCardProps {
  data: StatsCardData;
}

export const StatsCard: React.FC<StatsCardProps> = ({ data }) => (
  <View style={styles.card}>
    <View style={[styles.iconBox, { backgroundColor: data.iconBg }]}>
      {data.icon}
    </View>
    <View style={styles.textBlock}>
      <Text style={styles.label}>{data.label}</Text>
      <Text style={styles.value}>{data.value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS["surface-container-lowest"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    width: 168,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: { gap: 2 },
  label: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  value: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS["on-surface"],
  },
});
