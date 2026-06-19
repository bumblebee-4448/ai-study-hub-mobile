import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface UserScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export const UserScreenHeader: React.FC<UserScreenHeaderProps> = ({
  title,
  subtitle,
}) => (
  <View style={styles.header}>
    <Text style={styles.eyebrow}>AcademiShare</Text>
    <Text style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  header: {
    gap: 4,
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748b",
  },
});
