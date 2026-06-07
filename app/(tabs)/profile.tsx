/**
 * Profile Tab — placeholder screen
 */
import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Profile</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS["on-surface"],
  },
});
