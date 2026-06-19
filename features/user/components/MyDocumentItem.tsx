import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FileText,
  Pencil,
  Trash2,
} from "lucide-react-native";

import type { UserDocument, BackendDocumentStatus } from "../types";

const STATUS_CONFIG: Record<
  BackendDocumentStatus,
  { label: string; bg: string; color: string; dotColor: string }
> = {
  ACTIVE: {
    label: "Đã duyệt",
    bg: "#ecfdf5",
    color: "#059669",
    dotColor: "#10b981",
  },
  PENDING: {
    label: "Chờ duyệt",
    bg: "#fef3c7",
    color: "#d97706",
    dotColor: "#f59e0b",
  },
  REJECTED: {
    label: "Từ chối",
    bg: "#fef2f2",
    color: "#dc2626",
    dotColor: "#ef4444",
  },
  DELETED: {
    label: "Đã xóa",
    bg: "#f1f5f9",
    color: "#64748b",
    dotColor: "#94a3b8",
  },
};

const FORMAT_COLORS: Record<string, { bg: string; color: string }> = {
  PDF: { bg: "#fef2f2", color: "#dc2626" },
  DOC: { bg: "#eff6ff", color: "#2563eb" },
  DOCX: { bg: "#eff6ff", color: "#2563eb" },
  PPT: { bg: "#fdf2f8", color: "#db2777" },
  PPTX: { bg: "#fdf2f8", color: "#db2777" },
  FILE: { bg: "#f1f5f9", color: "#64748b" },
};

interface MyDocumentItemProps {
  document: UserDocument;
  onPress?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const MyDocumentItem: React.FC<MyDocumentItemProps> = ({
  document,
  onPress,
  onEdit,
  onDelete,
}) => {
  const statusConfig = STATUS_CONFIG[document.status] ?? STATUS_CONFIG.PENDING;
  const formatConfig = FORMAT_COLORS[document.formatLabel] ?? FORMAT_COLORS.FILE;

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa "${document.title}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => onDelete?.(document.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(document.id)}
      activeOpacity={0.7}
    >
      {/* Top row: format badge + status + actions */}
      <View style={styles.topRow}>
        <View style={[styles.formatBadge, { backgroundColor: formatConfig.bg }]}>
          <FileText size={14} color={formatConfig.color} />
          <Text style={[styles.formatText, { color: formatConfig.color }]}>
            {document.formatLabel}
          </Text>
        </View>

        <View style={styles.topRight}>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <View
              style={[styles.statusDot, { backgroundColor: statusConfig.dotColor }]}
            />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {document.title}
      </Text>

      {/* Meta info */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText} numberOfLines={1}>
          {document.subjectLabel}
        </Text>
        <Text style={styles.metaDivider}>•</Text>
        <Text style={styles.metaText}>{document.sizeLabel || "—"}</Text>
      </View>

      {/* Bottom row: date + actions */}
      <View style={styles.bottomRow}>
        <Text style={styles.dateText}>{document.createdAtLabel}</Text>

        <View style={styles.actionsRow}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onEdit(document.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Pencil size={15} color="#64748b" />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={handleDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={15} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Rejection reason */}
      {document.rejectionReason ? (
        <View style={styles.rejectionBox}>
          <Text style={styles.rejectionText}>
            Lý do: {document.rejectionReason}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  formatBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  formatText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 22,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  metaDivider: {
    fontSize: 12,
    color: "#cbd5e1",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f8fafc",
    paddingTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  deleteBtn: {
    backgroundColor: "#fef2f2",
  },
  rejectionBox: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#ef4444",
  },
  rejectionText: {
    fontSize: 12,
    color: "#dc2626",
    lineHeight: 17,
  },
});
