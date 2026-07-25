import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useAppTheme } from "@/features/theme";
import type { ChatMessage } from "../types";
import { ChatCitation } from "./ChatCitation";

const SUGGESTIONS = [
  "Tóm tắt nội dung tài liệu",
  "Giải thích các khái niệm chính",
  "Tạo câu hỏi ôn tập",
  "Nội dung này nói về vấn đề gì?",
];

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  onSuggestionPress: (value: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading,
  isSending,
  onSuggestionPress,
}) => {
  const { colors } = useAppTheme();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.helperText, { color: colors.textSubtle }]}>
          Đang tải cuộc trò chuyện...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => {
        const isAssistant = item.role === "assistant";
        return (
          <View
            style={[
              styles.messageGroup,
              isAssistant ? styles.left : styles.right,
            ]}
          >
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: isAssistant
                    ? colors.surfaceSubtle
                    : colors.primary,
                  borderColor: isAssistant ? colors.border : colors.primary,
                },
              ]}
            >
              {isAssistant && (
                <View style={styles.assistantLabel}>
                  <Ionicons
                    name="sparkles-outline"
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={[styles.label, { color: colors.primary }]}>
                    AI Study Coach
                  </Text>
                </View>
              )}
              <Text
                style={[
                  styles.messageText,
                  { color: isAssistant ? colors.text : colors.onPrimary },
                ]}
              >
                {item.content}
              </Text>
              {isAssistant && item.citations.length > 0 && (
                <View>
                  {item.citations.map((citation) => (
                    <ChatCitation key={citation.chunkId} citation={citation} />
                  ))}
                </View>
              )}
            </View>
          </View>
        );
      }}
      ListHeaderComponent={
        messages.length === 0 ? (
          <View style={styles.welcomeBlock}>
            <View
              style={[
                styles.welcomeIcon,
                { backgroundColor: colors.primaryMuted },
              ]}
            >
              <Ionicons name="sparkles" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              Hỏi AI về tài liệu của bạn
            </Text>
            <Text style={[styles.welcomeText, { color: colors.textSubtle }]}>
              Mình sẽ trả lời dựa trên nội dung tài liệu đã chọn.
            </Text>
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  style={[
                    styles.suggestion,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.surfaceRaised,
                    },
                  ]}
                  onPress={() => onSuggestionPress(suggestion)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.suggestionText, { color: colors.textMuted }]}
                  >
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null
      }
      ListFooterComponent={
        isSending ? (
          <View style={[styles.messageGroup, styles.left]}>
            <View
              style={[
                styles.typingBubble,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.border,
                },
              ]}
            >
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.helperText, { color: colors.textSubtle }]}>
                AI đang suy nghĩ...
              </Text>
            </View>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    padding: SPACING["margin-mobile"],
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.md,
  },
  helperText: {
    ...TYPOGRAPHY["body-md"],
  },
  messageGroup: {
    width: "100%",
  },
  left: {
    alignItems: "flex-start",
  },
  right: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "88%",
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  assistantLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY["label-sm"],
  },
  messageText: {
    ...TYPOGRAPHY["body-md"],
  },
  welcomeBlock: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    gap: SPACING.md,
  },
  welcomeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeTitle: {
    ...TYPOGRAPHY["headline-md"],
    textAlign: "center",
  },
  welcomeText: {
    ...TYPOGRAPHY["body-md"],
    textAlign: "center",
  },
  suggestions: {
    width: "100%",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  suggestion: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  suggestionText: {
    ...TYPOGRAPHY["label-md"],
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
});
