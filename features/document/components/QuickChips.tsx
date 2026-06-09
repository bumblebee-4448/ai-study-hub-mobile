/**
 * Document Feature - Quick Chips Component
 * Horizontal scrollable chips for quick prompts
 */

import { COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { QuickPrompt } from "../types";

interface QuickChipsProps {
  chips: QuickPrompt[];
  onChipPress?: (chipId: string) => void;
}

export const QuickChips: React.FC<QuickChipsProps> = ({
  chips,
  onChipPress,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {chips.map((chip) => (
        <TouchableOpacity
          key={chip.id}
          style={styles.chip}
          onPress={() => onChipPress?.(chip.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.chipText}>{chip.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.base,
  },
  contentContainer: {
    gap: 8,
    paddingHorizontal: SPACING["margin-mobile"],
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderColor: COLORS["outline-variant"],
    borderWidth: 1,
    backgroundColor: COLORS["surface-container-low"],
    justifyContent: "center",
    alignItems: "center",
  },
  chipText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
});
