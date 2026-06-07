/**
 * Document Feature - AI Search Input Component
 * Sticky search bar with AI icon
 */

import { COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface AISearchInputProps {
  value: string;
  onChange: (text: string) => void;
  onAIIconPress?: () => void;
  placeholder?: string;
}

export const AISearchInput: React.FC<AISearchInputProps> = ({
  value,
  onChange,
  onAIIconPress,
  placeholder = "Hỏi AI hoặc tìm kiếm tài liệu...",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <Ionicons
        name="search-outline"
        size={20}
        color={COLORS.outline}
        style={styles.searchIcon}
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.outline}
        value={value}
        onChangeText={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <TouchableOpacity onPress={onAIIconPress} style={styles.aiIconContainer}>
        <MaterialCommunityIcons
          name="auto-fix"
          size={20}
          color={COLORS.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS["surface-container-lowest"],
    borderColor: COLORS["outline-variant"],
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: SPACING["margin-mobile"],
    marginVertical: SPACING.base,
  },
  containerFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface"],
    padding: 0,
  },
  aiIconContainer: {
    marginLeft: 12,
    padding: 4,
  },
});
