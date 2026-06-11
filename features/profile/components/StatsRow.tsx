import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { UserProfile } from "../types";

interface StatsRowProps {
  documentCount: UserProfile["documentCount"];
  savedCount: UserProfile["savedCount"];
  points: UserProfile["points"];
}

interface StatCellProps {
  value: number;
  label: string;
  bordered?: boolean;
}

const StatCell: React.FC<StatCellProps> = ({ value, label, bordered }) => (
  <View style={[styles.cell, bordered && styles.cellBordered]}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

export const StatsRow: React.FC<StatsRowProps> = ({
  documentCount,
  savedCount,
  points,
}) => (
  <View style={styles.row}>
    <StatCell value={documentCount} label="Tài liệu" />
    <StatCell value={savedCount} label="Lưu" bordered />
    <StatCell value={points} label="Điểm" />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: COLORS["outline-variant"],
    paddingTop: SPACING.md,
    marginTop: SPACING.sm,
  },
  cell: {
    flex: 1,
    alignItems: "center",
    gap: SPACING.sm,
  },
  cellBordered: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS["outline-variant"],
  },
  value: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS.primary,
  },
  label: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
});
