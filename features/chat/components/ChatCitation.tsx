import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useAppTheme } from "@/features/theme";
import type { ChatCitation as ChatCitationModel } from "../types";

interface ChatCitationProps {
  citation: ChatCitationModel;
}

export const ChatCitation: React.FC<ChatCitationProps> = ({ citation }) => {
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState(false);
  const pageLabel = citation.pageStart
    ? citation.pageEnd && citation.pageEnd !== citation.pageStart
      ? `Trang ${citation.pageStart}-${citation.pageEnd}`
      : `Trang ${citation.pageStart}`
    : `Chunk ${citation.chunkIndex + 1}`;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.surfaceSubtle, borderColor: colors.border },
      ]}
      onPress={() => setExpanded((current) => !current)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons
            name="document-text-outline"
            size={14}
            color={colors.primary}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            {pageLabel}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={14}
          color={colors.textSubtle}
        />
      </View>
      {expanded && (
        <Text style={[styles.preview, { color: colors.textMuted }]}>
          {citation.preview || "Không có đoạn trích xem trước."}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY["label-sm"],
  },
  preview: {
    ...TYPOGRAPHY["body-md"],
    fontSize: 13,
    lineHeight: 20,
    marginTop: SPACING.sm,
  },
});
