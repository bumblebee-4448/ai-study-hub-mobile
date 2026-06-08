import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { DocumentStatus, MyDocument } from "../types";

const STATUS_CONFIG: Record<DocumentStatus, { label: string; bg: string; color: string }> = {
  public: {
    label: "Công khai",
    bg: COLORS["secondary-fixed"],
    color: COLORS["on-secondary-fixed"],
  },
  pending: {
    label: "Đang chờ duyệt",
    bg: COLORS["secondary-container"],
    color: COLORS["on-secondary-container"],
  },
};

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];
type MCIName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const FORMAT_ICON: Record<MyDocument["format"], { lib: "mci"; name: MCIName } | { lib: "ion"; name: IoniconName }> = {
  pdf: { lib: "mci", name: "file-pdf-box" },
  docx: { lib: "mci", name: "file-word-box" },
  zip: { lib: "mci", name: "folder-zip" },
  pptx: { lib: "mci", name: "file-powerpoint-box" },
};

interface DocumentItemProps {
  item: MyDocument;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({ item, onEdit, onDelete }) => {
  const status = STATUS_CONFIG[item.status];
  const fmt = FORMAT_ICON[item.format];

  const handleDelete = () => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa "${item.title}" không?`,
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: () => onDelete(item.id) },
      ]
    );
  };

  const FileIcon =
    fmt.lib === "mci" ? (
      <MaterialCommunityIcons name={fmt.name as MCIName} size={24} color={COLORS.primary} />
    ) : (
      <Ionicons name={fmt.name as IoniconName} size={24} color={COLORS.primary} />
    );

  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>{FileIcon}</View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.meta}>{item.subject} · {item.size}</Text>
        <Text style={styles.date}>{item.uploadedAt}</Text>
      </View>

      <View style={styles.trailing}>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(item.id)} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
            <Ionicons name="pencil-outline" size={18} color={COLORS["on-surface-variant"]} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete} hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}>
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING["margin-mobile"],
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
    backgroundColor: COLORS["surface-container-lowest"],
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS["primary-fixed"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  title: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  meta: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  date: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.outline,
  },
  trailing: {
    alignItems: "flex-end",
    gap: SPACING.base,
    flexShrink: 0,
  },
  badge: {
    paddingHorizontal: SPACING.base,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeText: {
    ...TYPOGRAPHY["label-sm"],
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.base,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS["surface-container-low"],
  },
  deleteBtn: {
    backgroundColor: COLORS["error-container"],
  },
});
