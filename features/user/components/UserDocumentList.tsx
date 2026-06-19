import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FileText, RefreshCcw } from "lucide-react-native";

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
  if (isLoading) {
    return (
      <View style={styles.stateBox}>
        <ActivityIndicator size="small" color="#0f172a" />
        <Text style={styles.stateText}>Đang tải tài liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateBox}>
        <Text style={styles.stateText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCcw size={16} color="#0f172a" />
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (documents.length === 0) {
    return (
      <View style={styles.stateBox}>
        <Text style={styles.stateText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {documents.map((document) => (
        <TouchableOpacity
          key={document.id}
          style={styles.item}
          onPress={() => onDocumentPress?.(document.id)}
          activeOpacity={0.75}
        >
          <View style={styles.iconBox}>
            <FileText size={20} color="#0f172a" />
          </View>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle} numberOfLines={2}>
              {document.title}
            </Text>
            <Text style={styles.itemMeta} numberOfLines={1}>
              {document.subjectLabel} • {document.authorLabel}
            </Text>
            <Text style={styles.itemSubMeta} numberOfLines={1}>
              {document.formatLabel}
              {document.sizeLabel ? ` • ${document.sizeLabel}` : ""} •{" "}
              {document.createdAtLabel}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{document.statusLabel}</Text>
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
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    gap: 3,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  itemMeta: {
    fontSize: 12,
    color: "#64748b",
  },
  itemSubMeta: {
    fontSize: 11,
    color: "#94a3b8",
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#334155",
  },
  stateBox: {
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
  },
  retryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },
});
