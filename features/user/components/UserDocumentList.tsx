import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FileText, RefreshCcw } from "lucide-react-native";

import { useAppTheme } from "@/features/theme";
import type { UserDocument } from "../types";

interface UserDocumentListProps {
  documents: UserDocument[];
  isLoading: boolean;
  error: string | null;
  emptyText: string;
  onRetry: () => void;
  onDocumentPress?: (id: string) => void;
}

export const UserDocumentList: React.FC<UserDocumentListProps> = ({
  documents,
  isLoading,
  error,
  emptyText,
  onRetry,
  onDocumentPress,
}) => {
  const { colors } = useAppTheme();

  if (isLoading) {
    return (
      <View
        style={[
          styles.stateBox,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[styles.stateText, { color: colors.textSubtle }]}>
          Đang tải tài liệu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.stateBox,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.stateText, { color: colors.textSubtle }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.surfaceMuted }]}
          onPress={onRetry}
        >
          <RefreshCcw size={16} color={colors.text} />
          <Text style={[styles.retryText, { color: colors.text }]}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (documents.length === 0) {
    return (
      <View
        style={[
          styles.stateBox,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.stateText, { color: colors.textSubtle }]}>
          {emptyText}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {documents.map((document) => (
        <TouchableOpacity
          key={document.id}
          style={[
            styles.item,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          onPress={() => onDocumentPress?.(document.id)}
          activeOpacity={0.75}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.surfaceMuted }]}>
            <FileText size={20} color={colors.text} />
          </View>
          <View style={styles.itemContent}>
            <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
              {document.title}
            </Text>
            <Text style={[styles.itemMeta, { color: colors.textSubtle }]} numberOfLines={1}>
              {document.subjectLabel} • {document.authorLabel}
            </Text>
            <Text style={[styles.itemSubMeta, { color: colors.textSubtle }]} numberOfLines={1}>
              {document.formatLabel}
              {document.sizeLabel ? ` • ${document.sizeLabel}` : ""} •{" "}
              {document.createdAtLabel}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.surfaceSubtle }]}>
            <Text style={[styles.statusText, { color: colors.textMuted }]}>
              {document.statusLabel}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    gap: 3,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  itemMeta: {
    fontSize: 12,
  },
  itemSubMeta: {
    fontSize: 11,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  stateBox: {
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
