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

import { useAppTheme, type AppThemeColors } from "@/features/theme";
import type { UserDocument, BackendDocumentStatus } from "../types";

const getStatusConfig = (colors: AppThemeColors): Record<
  BackendDocumentStatus,
  { label: string; bg: string; color: string; dotColor: string }
> => ({
  ACTIVE: {
    label: "Đã duyệt",
    bg: colors.successMuted,
    color: colors.successText,
    dotColor: colors.success,
  },
  PENDING: {
    label: "Chờ duyệt",
    bg: colors.warningMuted,
    color: colors.warningText,
    dotColor: colors.warning,
  },
  REJECTED: {
    label: "Từ chối",
    bg: colors.dangerMuted,
    color: colors.dangerText,
    dotColor: colors.danger,
  },
  DELETED: {
    label: "Đã xóa",
    bg: colors.surfaceSubtle,
    color: colors.textSubtle,
    dotColor: colors.textSubtle,
  },
});

const getFormatColors = (colors: AppThemeColors): Record<string, { bg: string; color: string }> => ({
  PDF: { bg: colors.dangerMuted, color: colors.dangerText },
  DOC: { bg: colors.primaryMuted, color: colors.primary },
  DOCX: { bg: colors.primaryMuted, color: colors.primary },
  PPT: { bg: colors.warningMuted, color: colors.warningText },
  PPTX: { bg: colors.warningMuted, color: colors.warningText },
  FILE: { bg: colors.surfaceSubtle, color: colors.textSubtle },
});

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
  const { colors } = useAppTheme();
  const statusConfigByStatus = getStatusConfig(colors);
  const formatColorsByType = getFormatColors(colors);
  const statusConfig = statusConfigByStatus[document.status] ?? statusConfigByStatus.PENDING;
  const formatConfig = formatColorsByType[document.formatLabel] ?? formatColorsByType.FILE;

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
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
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
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {document.title}
      </Text>

      {/* Meta info */}
      <View style={styles.metaRow}>
        <Text style={[styles.metaText, { color: colors.textSubtle }]} numberOfLines={1}>
          {document.subjectLabel}
        </Text>
        <Text style={[styles.metaDivider, { color: colors.borderStrong }]}>•</Text>
        <Text style={[styles.metaText, { color: colors.textSubtle }]}>
          {document.sizeLabel || "—"}
        </Text>
      </View>

      {/* Bottom row: date + actions */}
      <View style={[styles.bottomRow, { borderTopColor: colors.border }]}>
        <Text style={[styles.dateText, { color: colors.textSubtle }]}>
          {document.createdAtLabel}
        </Text>

        <View style={styles.actionsRow}>
          {onEdit && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.surfaceMuted }]}
              onPress={() => onEdit(document.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Pencil size={15} color={colors.icon} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.dangerMuted },
              ]}
              onPress={handleDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={15} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Rejection reason */}
      {document.rejectionReason ? (
        <View
          style={[
            styles.rejectionBox,
            {
              backgroundColor: colors.dangerMuted,
              borderLeftColor: colors.danger,
            },
          ]}
        >
          <Text style={[styles.rejectionText, { color: colors.dangerText }]}>
            Lý do: {document.rejectionReason}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
    fontWeight: "500",
  },
  metaDivider: {
    fontSize: 12,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 10,
  },
  dateText: {
    fontSize: 12,
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
  },
  rejectionBox: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  rejectionText: {
    fontSize: 12,
    lineHeight: 17,
  },
});
