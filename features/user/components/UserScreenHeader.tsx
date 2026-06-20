import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/features/theme";

interface UserScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export const UserScreenHeader: React.FC<UserScreenHeaderProps> = ({
  title,
  subtitle,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.eyebrow, { color: colors.textSubtle }]}>
        AcademicShare
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSubtle }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 4,
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
