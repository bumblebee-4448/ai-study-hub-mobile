import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { DocumentItem } from "../components/DocumentItem";
import { StatsCard, StatsCardData } from "../components/StatsCard";
import { MyDocument } from "../types";

const STATS_DATA: StatsCardData[] = [
  {
    label: "Tổng tài liệu",
    value: "0",
    iconBg: COLORS["primary-fixed"],
    icon: <MaterialCommunityIcons name="file-document-outline" size={22} color={COLORS.primary} />,
  },
  {
    label: "Lượt xem",
    value: "0",
    iconBg: COLORS["secondary-fixed"],
    icon: <Ionicons name="eye-outline" size={22} color={COLORS.secondary} />,
  },
  {
    label: "Lượt tải",
    value: "0",
    iconBg: COLORS["tertiary-fixed"],
    icon: <Ionicons name="download-outline" size={22} color={COLORS.tertiary} />,
  },
  {
    label: "Đóng góp",
    value: "N/A",
    iconBg: COLORS["secondary-container"],
    icon: <Ionicons name="trophy-outline" size={22} color={COLORS["on-secondary-container"]} />,
  },
];

interface MyDocumentScreenProps {
  onBack?: () => void;
  onUpload?: () => void;
  onEdit?: (id: string) => void;
}

export const MyDocumentScreen: React.FC<MyDocumentScreenProps> = ({
  onBack,
  onUpload,
  onEdit,
}) => {
  const [documents, setDocuments] = useState<MyDocument[]>([]);

  const handleDelete = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleEdit = useCallback(
    (id: string) => onEdit?.(id),
    [onEdit]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS["on-surface"]} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Tài liệu của tôi</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Lọc">
            <Ionicons name="filter-outline" size={22} color={COLORS["on-surface-variant"]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Sắp xếp">
            <MaterialCommunityIcons name="sort" size={22} color={COLORS["on-surface-variant"]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsRow}
        style={styles.statsScroll}
      >
        {STATS_DATA.map((stat) => (
          <StatsCard key={stat.label} data={stat} />
        ))}
      </ScrollView>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Danh sách tài liệu</Text>
        <Text style={styles.listCount}>
          {documents.length} / 124 tài liệu
        </Text>
      </View>

      <FlatList
        data={documents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DocumentItem item={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.uploadBtn} onPress={onUpload} activeOpacity={0.85}>
          <Ionicons name="add" size={20} color={COLORS["on-primary"]} />
          <Text style={styles.uploadBtnText}>Tải lên tài liệu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING["margin-mobile"],
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
  },
  headerTitle: {
    flex: 1,
    ...TYPOGRAPHY["headline-md"],
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  statsScroll: {
    flexGrow: 0,
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.md,
    paddingHorizontal: SPACING["margin-mobile"],
    paddingVertical: SPACING.lg,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["margin-mobile"],
    paddingVertical: SPACING.md,
    backgroundColor: COLORS["surface-container-low"],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS["outline-variant"],
  },
  listTitle: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  listCount: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },

  listContent: {
    paddingBottom: 100,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING["margin-mobile"],
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS["outline-variant"],
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md,
  },
  uploadBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
  },
});
