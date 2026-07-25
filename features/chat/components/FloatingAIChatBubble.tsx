import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useAppTheme } from "@/features/theme";

const PROMPT = "Bạn có tài liệu vừa upload, hỏi đáp ngay ?";

interface FloatingAIChatBubbleProps {
  hasReadyDocuments: boolean;
  onPress: () => void;
  onDismiss?: () => void;
}

export const FloatingAIChatBubble: React.FC<FloatingAIChatBubbleProps> = ({
  hasReadyDocuments,
  onPress,
  onDismiss,
}) => {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  let tabBarHeight = 60;
  try {
    tabBarHeight = useBottomTabBarHeight();
  } catch {
    tabBarHeight = 60;
  }
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    if (hasReadyDocuments) setShowPrompt(true);
  }, [hasReadyDocuments]);

  if (!hasReadyDocuments) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        { bottom: tabBarHeight + insets.bottom + SPACING.md },
      ]}
    >
      {showPrompt && (
        <View
          style={[
            styles.promptCard,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.promptContent}
            onPress={onPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={PROMPT}
          >
            <Ionicons
              name="sparkles-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={[styles.promptText, { color: colors.text }]}>
              {PROMPT}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowPrompt(false);
              onDismiss?.();
            }}
            style={styles.dismissButton}
            accessibilityRole="button"
            accessibilityLabel="Đóng gợi ý AI"
          >
            <Ionicons name="close" size={16} color={colors.textSubtle} />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: colors.primary, shadowColor: colors.shadow },
        ]}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Mở AI Study Coach"
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          color={colors.onPrimary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: SPACING["margin-mobile"],
    alignItems: "flex-end",
    gap: SPACING.sm,
    zIndex: 100,
    elevation: 100,
  },
  promptCard: {
    width: 250,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.sm,
    paddingVertical: SPACING.sm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  promptContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: SPACING.sm,
    marginRight: 4,
  },
  promptText: {
    ...TYPOGRAPHY["label-sm"],
    flex: 1,
    flexWrap: "wrap",
    fontSize: 12,
    lineHeight: 16,
  },
  dismissButton: {
    padding: SPACING.sm,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
});
