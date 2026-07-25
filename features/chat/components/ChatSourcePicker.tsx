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
import type { ChatReadyDocument } from "../types";

interface ChatSourcePickerProps {
  documents: ChatReadyDocument[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  selectingDocumentId: string | null;
  onSelect: (documentId: string) => void;
  onRetry: () => void;
}

export const ChatSourcePicker: React.FC<ChatSourcePickerProps> = ({
  documents,
  isLoading,
  isRefreshing,
  error,
  selectingDocumentId,
  onSelect,
  onRetry,
}) => {
  const { colors } = useAppTheme();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.helperText, { color: colors.textSubtle }]}>
          Đang tải tài liệu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="warning-outline" size={32} color={colors.danger} />
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onRetry}
        >
          <Text style={[styles.retryText, { color: colors.onPrimary }]}>
            Thử lại
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={documents}
      keyExtractor={(item) => item.id}
      refreshing={isRefreshing}
      onRefresh={onRetry}
      contentContainerStyle={
        documents.length === 0 ? styles.emptyList : styles.list
      }
      renderItem={({ item }) => {
        const isSelecting = selectingDocumentId === item.id;
        return (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: colors.surfaceRaised,
                borderColor: colors.border,
              },
            ]}
            onPress={() => onSelect(item.id)}
            disabled={Boolean(selectingDocumentId)}
            activeOpacity={0.8}
          >
            <View
              style={[styles.iconBox, { backgroundColor: colors.primaryMuted }]}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={colors.primary}
              />
            </View>
            <View style={styles.cardBody}>
              <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text style={[styles.meta, { color: colors.textSubtle }]}>
                {item.format} · {item.sizeLabel} · {item.subjectName}
              </Text>
              <View
                style={[
                  styles.readyBadge,
                  { backgroundColor: colors.successMuted },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={13}
                  color={colors.successText}
                />
                <Text style={[styles.readyText, { color: colors.successText }]}>
                  Sẵn sàng hỏi đáp
                </Text>
              </View>
            </View>
            {isSelecting ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textSubtle}
              />
            )}
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={
        <View style={styles.center}>
          <Ionicons name="sparkles-outline" size={38} color={colors.primary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Chưa có tài liệu sẵn sàng
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSubtle }]}>
            Tài liệu cần được xử lý xong trước khi bạn có thể hỏi đáp với AI.
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: SPACING["margin-mobile"],
    gap: SPACING.md,
  },
  emptyList: {
    flexGrow: 1,
  },
  card: {
    minHeight: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY["label-md"],
  },
  meta: {
    ...TYPOGRAPHY["label-sm"],
  },
  readyBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  readyText: {
    ...TYPOGRAPHY["label-sm"],
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING["2xl"],
    gap: SPACING.md,
  },
  helperText: {
    ...TYPOGRAPHY["body-md"],
  },
  errorText: {
    ...TYPOGRAPHY["body-md"],
    textAlign: "center",
  },
  retryButton: {
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  retryText: {
    ...TYPOGRAPHY["label-md"],
  },
  emptyTitle: {
    ...TYPOGRAPHY["headline-md"],
    textAlign: "center",
  },
  emptyText: {
    ...TYPOGRAPHY["body-md"],
    textAlign: "center",
  },
});
