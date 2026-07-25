import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/features/theme";

export interface MyDocStatsCardData {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string;
  accentBg: string;
}

interface MyDocStatsCardProps {
  data: MyDocStatsCardData;
}

export const MyDocStatsCard: React.FC<MyDocStatsCardProps> = ({ data }) => (
  <ThemedMyDocStatsCard data={data} />
);

const ThemedMyDocStatsCard: React.FC<MyDocStatsCardProps> = ({ data }) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: data.accentBg }]}>
        {data.icon}
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{data.value}</Text>
      <Text style={[styles.label, { color: colors.textSubtle }]}>
        {data.label}
      </Text>
      <View style={[styles.accentBar, { backgroundColor: data.accentColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  accentBar: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 3,
    borderRadius: 2,
  },
});
