import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
  <View style={styles.card}>
    <View style={[styles.iconBox, { backgroundColor: data.accentBg }]}>
      {data.icon}
    </View>
    <Text style={styles.value}>{data.value}</Text>
    <Text style={styles.label}>{data.label}</Text>
    <View style={[styles.accentBar, { backgroundColor: data.accentColor }]} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 8,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
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
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
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
