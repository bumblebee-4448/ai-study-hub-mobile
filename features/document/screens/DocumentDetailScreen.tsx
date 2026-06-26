/**
 * Document Feature — DocumentDetailScreen
 *
 * Màn hình chi tiết tài liệu, convert từ HTML mẫu sang React Native.
 *
 * Layout:
 *  - Overlay header (fixed): back ← | bookmark + more_vert
 *  - ScrollView:
 *      · Thumbnail ảnh (tỉ lệ 3:4)
 *      · Meta: tiêu đề, format badge, author avatar, ngày, views, downloads
 *      · Divider
 *      · Section "Mô tả tài liệu" + tag chips
 *      · Section "Tài liệu liên quan" (RelatedDocumentCard × n)
 *      · Spacer cho bottom bar
 *  - Bottom bar (fixed): nút Share (outlined) + nút Tải về (primary filled)
 */

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { BORDER_RADIUS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useAppTheme, type AppThemeColors } from "@/features/theme";
import { DocumentDetail, RelatedDocument } from "../types";

// ── Constants ─────────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get("window").width;
// Thumbnail: full width, 3:4 aspect ratio
const THUMBNAIL_HEIGHT = (SCREEN_WIDTH * 4) / 3;

// ── Demo / default data ────────────────────────────────────────────────────────

const DEFAULT_DOCUMENT: DocumentDetail = {
  id: "doc-detail-001",
  title: "Cấu trúc Dữ liệu và Giải thuật: Hướng dẫn Toàn diện",
  format: "PDF",
  fileSize: "2.4 MB",
  thumbnailUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDsCgWTLdwfMETw1p8JCJqlAAH3-XYOgZfQ6FlFJhwX7yycXKJFeyBMnPHhdituUL10MhffB9C0QloQcB4EYTWwxSQWz2CUlX3hbjrnXHcqtGCyCUP8erl2xyiaEAQwwq7pGtelNU4oc3oyuM7tEjRLYsGEnpMlclESj_Z2OAUVLOupurj63znsgj4QbcIaCdBzdIyu0quk7uXudDY3nm7tOMP6OtUB3jL0rBjhnm_8ajTeO5oO7DmewSlGCEuldwtnJ6a8IHPxHH4",
  author: "Nguyễn Văn A",
  authorAvatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC4fNdltV4v1igoX238m26-VtWBEtCw3G7zOj0seghFwovWENhda0jFQSKu0tHwxXsMUvCijE0H8Ev7RNITyZJP7n9FiGxft4CuSIXTEjXMsPZQZmNR-GsobEYJyOiPWE20sdJxRByE2OjRAebmNRkOG6aqWd_7R_oojVBvOHQqxR_JNiiYyJ3oVCKvnABNCrcncDYUYAqOlx5Kh_P1PbzQ8c2gZw9HPQWN5Qq2w-HNe9awZejRQoTMXlHgDmvL99E74OzTmiYLqPI",
  publishedAt: "12 Thg 10, 2023",
  views: 4200,
  downloads: 850,
  description:
    "Tài liệu này cung cấp một cái nhìn sâu sắc về các cấu trúc dữ liệu cơ bản và nâng cao, cùng với các thuật toán cốt lõi trong khoa học máy tính. Bao gồm các ví dụ thực tế và mã nguồn minh họa bằng ngôn ngữ C++ và Python.\n\nĐặc biệt hữu ích cho sinh viên năm 2 và năm 3 đang ôn tập cho kỳ thi cuối kỳ môn Cấu trúc Dữ liệu hoặc chuẩn bị cho các buổi phỏng vấn kỹ thuật.",
  tags: ["Khoa học Máy tính", "Lập trình", "Thuật toán"],
  relatedDocuments: [
    {
      id: "rel-001",
      title: "Lập trình Hướng đối tượng với Java",
      author: "Trần Thị B",
      thumbnailUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBOe9x2JFugjqOcspI5qZdr8jrDEnBEMnPV1Qx7kL8cjQ9Fdg4Fr3O3wSzRhP81pmJV5GHrEAiTQmpg2_kh-XuDmGqR_mL_DlLL9-IOCD-ktZboZK6uBDGMlq0TE7ZU7PFknrRxWssYoY2Q8PkGS9olqkxmRTmCy2iYjAuhUW08eAaGrv6a8LaVPv_6ojyjtfNzcf2wi5PpFI0gHEU9motCyK8d8fY_rMHJBKBJgpZ9UUVFn9VUTILc3bLNHNU_RvDcX2k76UJpK7A",
      downloads: 520,
    },
    {
      id: "rel-002",
      title: "Nhập môn Cơ sở dữ liệu Quan hệ",
      author: "Lê Văn C",
      thumbnailUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCzBy3OqSbLq3OQDKspyhvLRl7w76oxcHbI3EUnnpH7h6sjgC2GiqhxvOPY7a4E7E9IRn3OJ8BZoiW42FPengZld4Fw2fdgcxCJpCzm8mRDIw1o-1NrfF4RPJJlWgRBiTejzSWjR-fF1LRhdIN8a_ZhGYt3JKJy5XT4PxvibRiS6t19EWxEHeuFbnwF1zkyprIamlgGRdQpvoWtQI5d9Pq7UU9nk1W6Tzg9jLSL960cWt7rMsEdZRDavJqlR7AU_T5sdtFJrudDYWM",
      downloads: 1200,
    },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface RelatedDocumentCardProps {
  item: RelatedDocument;
  onPress?: (id: string) => void;
  colors: AppThemeColors;
}

const RelatedDocumentCard: React.FC<RelatedDocumentCardProps> = ({
  item,
  onPress,
  colors,
}) => {
  const cardStyle = useMemo(
    () => ({
      flexDirection: "row" as const,
      gap: 12,
      padding: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BORDER_RADIUS.lg,
    }),
    [colors]
  );

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={() => onPress?.(item.id)}
      activeOpacity={0.75}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={[staticStyles.relatedThumb, { backgroundColor: colors.surfaceSubtle }]}
        resizeMode="cover"
      />
      <View style={staticStyles.relatedInfo}>
        <Text style={[staticStyles.relatedTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={staticStyles.relatedMeta}>
          <Text style={[staticStyles.relatedAuthor, { color: colors.textSubtle }]}>
            {item.author}
          </Text>
          <View style={staticStyles.relatedDownloads}>
            <Ionicons
              name="download-outline"
              size={13}
              color={colors.textSubtle}
            />
            <Text style={[staticStyles.relatedDownloadText, { color: colors.textSubtle }]}>
              {formatCount(item.downloads)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Static styles for sub-components (no theme dependency)
const staticStyles = StyleSheet.create({
  relatedThumb: {
    width: 64,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
  },
  relatedInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  relatedTitle: {
    ...TYPOGRAPHY["label-md"],
  },
  relatedMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  relatedAuthor: {
    ...TYPOGRAPHY["label-sm"],
  },
  relatedDownloads: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  relatedDownloadText: {
    ...TYPOGRAPHY["label-sm"],
  },
});

// ── Main Component ─────────────────────────────────────────────────────────────

interface DocumentDetailScreenProps {
  document?: DocumentDetail;
  isLoading?: boolean;
  error?: string | null;
  onBack?: () => void;
  onBookmark?: (documentId: string) => void;
  onMoreOptions?: (documentId: string) => void;
  onDownload?: (documentId: string) => void;
  onRelatedPress?: (documentId: string) => void;
  onRetry?: () => void;
}

export const DocumentDetailScreen: React.FC<DocumentDetailScreenProps> = ({
  document: doc = DEFAULT_DOCUMENT,
  isLoading,
  error,
  onBack,
  onBookmark,
  onMoreOptions,
  onDownload,
  onRelatedPress,
  onRetry,
}) => {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = useCallback(() => {
    setIsBookmarked((prev) => !prev);
    onBookmark?.(doc.id);
  }, [doc.id, onBookmark]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `${doc.title} — AcademicShare`,
        title: doc.title,
      });
    } catch {
      // user cancelled
    }
  }, [doc.title]);

  const handleDownload = useCallback(() => {
    onDownload?.(doc.id);
  }, [doc.id, onDownload]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Đang tải chi tiết tài liệu...</Text>
      </SafeAreaView>
    );
  }

  if (error && (!doc || doc.id === "doc-detail-001")) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.center]}>
        <Text style={styles.errorText}>Lỗi: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backLink} onPress={onBack}>
          <Text style={styles.backLinkText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Overlay Header ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Quay lại"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleBookmark}
            accessibilityLabel={isBookmarked ? "Bỏ lưu" : "Lưu tài liệu"}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isBookmarked ? colors.primary : colors.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => onMoreOptions?.(doc.id)}
            accessibilityLabel="Tùy chọn khác"
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={colors.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Scrollable Body ─────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Thumbnail */}
        <View style={styles.thumbnailWrapper}>
          <Image
            source={{ uri: doc.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        </View>

        <View style={styles.body}>
          {/* ── Meta Header ───────────────────────────────────────── */}
          <View style={styles.metaHeader}>
            {/* Title row */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>{doc.title}</Text>
              <View style={styles.formatBadge}>
                <MaterialCommunityIcons
                  name={
                    doc.format?.toUpperCase() === "PDF"
                      ? "file-pdf-box"
                      : doc.format?.toUpperCase() === "DOC" || doc.format?.toUpperCase() === "DOCX"
                      ? "file-word"
                      : doc.format?.toUpperCase() === "PPT" || doc.format?.toUpperCase() === "PPTX"
                      ? "file-powerpoint"
                      : "file-document"
                  }
                  size={14}
                  color={colors.onPrimary}
                />
                <Text style={styles.formatText}>{doc.format}</Text>
              </View>
            </View>

            {/* Author + stats row */}
            <View style={styles.statsRow}>
              {/* Author */}
              <View style={styles.statItem}>
                <Image
                  source={{ uri: doc.authorAvatarUrl }}
                  style={styles.authorAvatar}
                />
                <Text style={styles.authorName}>{doc.author}</Text>
              </View>

              {/* Date */}
              <View style={styles.statItem}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={colors.textSubtle}
                />
                <Text style={styles.statText}>{doc.publishedAt}</Text>
              </View>

              {/* Views */}
              <View style={styles.statItem}>
                <Ionicons
                  name="eye-outline"
                  size={16}
                  color={colors.textSubtle}
                />
                <Text style={styles.statText}>
                  {formatCount(doc.views)} lượt xem
                </Text>
              </View>

              {/* Downloads */}
              <View style={styles.statItem}>
                <Ionicons
                  name="download-outline"
                  size={16}
                  color={colors.textSubtle}
                />
                <Text style={styles.statText}>
                  {formatCount(doc.downloads)} lượt tải
                </Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* ── Description ───────────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả tài liệu</Text>
            <Text style={styles.description}>{doc.description}</Text>

            {/* Tag chips */}
            <View style={styles.tagsRow}>
              {doc.tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Related Documents ─────────────────────────────────── */}
          {doc.relatedDocuments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tài liệu liên quan</Text>
              <View style={styles.relatedList}>
                {doc.relatedDocuments.map((related) => (
                  <RelatedDocumentCard
                    key={related.id}
                    item={related}
                    onPress={onRelatedPress}
                    colors={colors}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Bottom spacer for fixed bar */}
          <View style={{ height: 96 }} />
        </View>
      </ScrollView>

      {/* ── Fixed Bottom Action Bar ──────────────────────────────────── */}
      <View style={styles.bottomBar}>
        {/* Share */}
        <TouchableOpacity
          style={styles.btnShare}
          onPress={handleShare}
          activeOpacity={0.8}
          accessibilityLabel="Chia sẻ tài liệu"
        >
          <Ionicons
            name="share-outline"
            size={22}
            color={colors.icon}
          />
        </TouchableOpacity>

        {/* Download */}
        <TouchableOpacity
          style={styles.btnDownload}
          onPress={handleDownload}
          activeOpacity={0.8}
          accessibilityLabel={`Tải về ${doc.fileSize}`}
        >
          <Ionicons name="download-outline" size={20} color={colors.onPrimary} />
          <Text style={styles.btnDownloadText}>
            Tải về ({doc.fileSize})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const createStyles = (colors: AppThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // ── Header ──
    header: {
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: SPACING["margin-mobile"],
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      zIndex: 10,
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },

    // ── Scroll ──
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 0 },

    // ── Thumbnail ──
    thumbnailWrapper: {
      width: SCREEN_WIDTH,
      height: THUMBNAIL_HEIGHT,
      backgroundColor: colors.surfaceSubtle,
    },
    thumbnail: {
      width: "100%",
      height: "100%",
    },

    // ── Body ──
    body: {
      paddingHorizontal: SPACING["margin-mobile"],
      paddingTop: SPACING.lg,
    },

    // ── Meta Header ──
    metaHeader: {
      gap: SPACING.md,
      marginBottom: SPACING.lg,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    title: {
      flex: 1,
      ...TYPOGRAPHY["headline-lg-mobile"],
      color: colors.text,
    },
    formatBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      marginTop: 4,
    },
    formatText: {
      ...TYPOGRAPHY["label-sm"],
      color: colors.onPrimary,
    },
    statsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      rowGap: 10,
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    authorAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSubtle,
    },
    authorName: {
      ...TYPOGRAPHY["label-md"],
      color: colors.textSubtle,
    },
    statText: {
      ...TYPOGRAPHY["body-md"],
      color: colors.textSubtle,
    },

    // ── Divider ──
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: SPACING.lg,
    },

    // ── Sections ──
    section: {
      marginBottom: SPACING.xl,
      gap: SPACING.md,
    },
    sectionTitle: {
      ...TYPOGRAPHY["headline-md"],
      color: colors.text,
    },
    description: {
      ...TYPOGRAPHY["body-md"],
      color: colors.textMuted,
      lineHeight: 26,
    },

    // ── Tags ──
    tagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 4,
    },
    tagChip: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceSubtle,
    },
    tagText: {
      ...TYPOGRAPHY["label-sm"],
      color: colors.textMuted,
    },

    // ── Related Documents ──
    relatedList: {
      gap: 12,
    },
    relatedThumb: {
      width: 64,
      height: 80,
      borderRadius: BORDER_RADIUS.sm,
    },
    relatedInfo: {
      flex: 1,
      justifyContent: "space-between",
      paddingVertical: 2,
    },
    relatedTitle: {
      ...TYPOGRAPHY["label-md"],
    },
    relatedMeta: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    relatedAuthor: {
      ...TYPOGRAPHY["label-sm"],
    },
    relatedDownloads: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    relatedDownloadText: {
      ...TYPOGRAPHY["label-sm"],
    },

    // ── Bottom Bar ──
    bottomBar: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: SPACING["margin-mobile"],
      paddingVertical: SPACING.md,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    btnShare: {
      width: 48,
      height: 48,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
    },
    btnDownload: {
      flex: 1,
      height: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primary,
      borderRadius: BORDER_RADIUS.lg,
    },
    btnDownloadText: {
      ...TYPOGRAPHY["label-md"],
      color: colors.onPrimary,
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: colors.textSubtle,
    },
    errorText: {
      fontSize: 15,
      color: colors.danger,
      textAlign: "center",
      marginBottom: 16,
    },
    retryButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: colors.primary,
      borderRadius: 8,
      marginBottom: 12,
    },
    retryText: {
      color: colors.onPrimary,
      fontWeight: "bold",
    },
    backLink: {
      paddingVertical: 8,
    },
    backLinkText: {
      color: colors.textSubtle,
      fontSize: 14,
      textDecorationLine: "underline",
    },
  });
