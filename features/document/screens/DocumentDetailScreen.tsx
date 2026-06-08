import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
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
} from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { DocumentDetail, RelatedDocument } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const THUMBNAIL_HEIGHT = (SCREEN_WIDTH * 4) / 3;

const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

const DEMO_DOCUMENT: DocumentDetail = {
  id: "doc-detail-001",
  title: "Cấu trúc Dữ liệu và Giải thuật: Hướng dẫn Toàn diện",
  format: "PDF",
  fileSize: "2.4 MB",
  thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsCgWTLdwfMETw1p8JCJqlAAH3-XYOgZfQ6FlFJhwX7yycXKJFeyBMnPHhdituUL10MhffB9C0QloQcB4EYTWwxSQWz2CUlX3hbjrnXHcqtGCyCUP8erl2xyiaEAQwwq7pGtelNU4oc3oyuM7tEjRLYsGEnpMlclESj_Z2OAUVLOupurj63znsgj4QbcIaCdBzdIyu0quk7uXudDY3nm7tOMP6OtUB3jL0rBjhnm_8ajTeO5oO7DmewSlGCEuldwtnJ6a8IHPxHH4",
  author: "Nguyễn Văn A",
  authorAvatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4fNdltV4v1igoX238m26-VtWBEtCw3G7zOj0seghFwovWENhda0jFQSKu0tHwxXsMUvCijE0H8Ev7RNITyZJP7n9FiGxft4CuSIXTEjXMsPZQZmNR-GsobEYJyOiPWE20sdJxRByE2OjRAebmNRkOG6aqWd_7R_oojVBvOHQqxR_JNiiYyJ3oVCKvnABNCrcncDYUYAqOlx5Kh_P1PbzQ8c2gZw9HPQWN5Qq2w-HNe9awZejRQoTMXlHgDmvL99E74OzTmiYLqPI",
  publishedAt: "12 Thg 10, 2023",
  views: 4200,
  downloads: 850,
  description: "Tài liệu này cung cấp một cái nhìn sâu sắc về các cấu trúc dữ liệu cơ bản và nâng cao, cùng với các thuật toán cốt lõi trong khoa học máy tính. Bao gồm các ví dụ thực tế và mã nguồn minh họa bằng ngôn ngữ C++ và Python.\n\nĐặc biệt hữu ích cho sinh viên năm 2 và năm 3 đang ôn tập cho kỳ thi cuối kỳ hoặc chuẩn bị cho các buổi phỏng vấn kỹ thuật.",
  tags: ["Khoa học Máy tính", "Lập trình", "Thuật toán"],
  relatedDocuments: [
    {
      id: "rel-001",
      title: "Lập trình Hướng đối tượng với Java",
      author: "Trần Thị B",
      thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOe9x2JFugjqOcspI5qZdr8jrDEnBEMnPV1Qx7kL8cjQ9Fdg4Fr3O3wSzRhP81pmJV5GHrEAiTQmpg2_kh-XuDmGqR_mL_DlLL9-IOCD-ktZboZK6uBDGMlq0TE7ZU7PFknrRxWssYoY2Q8PkGS9olqkxmRTmCy2iYjAuhUW08eAaGrv6a8LaVPv_6ojyjtfNzcf2wi5PpFI0gHEU9motCyK8d8fY_rMHJBKBJgpZ9UUVFn9VUTILc3bLNHNU_RvDcX2k76UJpK7A",
      downloads: 520,
    },
    {
      id: "rel-002",
      title: "Nhập môn Cơ sở dữ liệu Quan hệ",
      author: "Lê Văn C",
      thumbnailUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzBy3OqSbLq3OQDKspyhvLRl7w76oxcHbI3EUnnpH7h6sjgC2GiqhxvOPY7a4E7E9IRn3OJ8BZoiW42FPengZld4Fw2fdgcxCJpCzm8mRDIw1o-1NrfF4RPJJlWgRBiTejzSWjR-fF1LRhdIN8a_ZhGYt3JKJy5XT4PxvibRiS6t19EWxEHeuFbnwF1zkyprIamlgGRdQpvoWtQI5d9Pq7UU9nk1W6Tzg9jLSL960cWt7rMsEdZRDavJqlR7AU_T5sdtFJrudDYWM",
      downloads: 1200,
    },
  ],
};

interface RelatedCardProps {
  item: RelatedDocument;
  onPress?: (id: string) => void;
}

const RelatedCard: React.FC<RelatedCardProps> = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.relatedCard}
    onPress={() => onPress?.(item.id)}
    activeOpacity={0.75}
  >
    <Image source={{ uri: item.thumbnailUrl }} style={styles.relatedThumb} resizeMode="cover" />
    <View style={styles.relatedInfo}>
      <Text style={styles.relatedTitle} numberOfLines={2}>{item.title}</Text>
      <View style={styles.relatedMeta}>
        <Text style={styles.relatedAuthor}>{item.author}</Text>
        <View style={styles.relatedDownloads}>
          <Ionicons name="download-outline" size={13} color={COLORS["on-surface-variant"]} />
          <Text style={styles.relatedCount}>{formatCount(item.downloads)}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

interface DocumentDetailScreenProps {
  document?: DocumentDetail;
  onBack?: () => void;
  onBookmark?: (documentId: string) => void;
  onMoreOptions?: (documentId: string) => void;
  onDownload?: (documentId: string) => void;
  onRelatedPress?: (documentId: string) => void;
}

export const DocumentDetailScreen: React.FC<DocumentDetailScreenProps> = ({
  document: doc = DEMO_DOCUMENT,
  onBack,
  onBookmark,
  onMoreOptions,
  onDownload,
  onRelatedPress,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = useCallback(() => {
    setIsBookmarked((prev) => !prev);
    onBookmark?.(doc.id);
  }, [doc.id, onBookmark]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({ message: `${doc.title} — AcademiShare`, title: doc.title });
    } catch { /* user cancelled */ }
  }, [doc.title]);

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
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleBookmark}>
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isBookmarked ? COLORS.primary : COLORS["on-surface"]}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => onMoreOptions?.(doc.id)}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color={COLORS["on-surface"]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.thumbnailBox}>
          <Image source={{ uri: doc.thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{doc.title}</Text>
            <View style={styles.formatBadge}>
              <MaterialCommunityIcons name="file-pdf-box" size={14} color={COLORS["on-primary-container"]} />
              <Text style={styles.formatText}>{doc.format}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.authorItem}>
              <Image source={{ uri: doc.authorAvatarUrl }} style={styles.avatar} />
              <Text style={styles.authorName}>{doc.author}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={16} color={COLORS["on-surface-variant"]} />
              <Text style={styles.statText}>{doc.publishedAt}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={16} color={COLORS["on-surface-variant"]} />
              <Text style={styles.statText}>{formatCount(doc.views)} lượt xem</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="download-outline" size={16} color={COLORS["on-surface-variant"]} />
              <Text style={styles.statText}>{formatCount(doc.downloads)} lượt tải</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả tài liệu</Text>
            <Text style={styles.description}>{doc.description}</Text>
            <View style={styles.tagsRow}>
              {doc.tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {doc.relatedDocuments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tài liệu liên quan</Text>
              <View style={styles.relatedList}>
                {doc.relatedDocuments.map((related) => (
                  <RelatedCard key={related.id} item={related} onPress={onRelatedPress} />
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 96 }} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={22} color={COLORS["on-surface"]} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => onDownload?.(doc.id)}
          activeOpacity={0.8}
        >
          <Ionicons name="download-outline" size={20} color={COLORS["on-primary"]} />
          <Text style={styles.downloadBtnText}>Tải về ({doc.fileSize})</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING["margin-mobile"],
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { flex: 1 },

  thumbnailBox: {
    width: SCREEN_WIDTH,
    height: THUMBNAIL_HEIGHT,
    backgroundColor: COLORS["surface-container-highest"],
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },

  body: {
    paddingHorizontal: SPACING["margin-mobile"],
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.md,
  },
  title: {
    flex: 1,
    ...TYPOGRAPHY["headline-lg-mobile"],
    color: COLORS["on-surface"],
  },
  formatBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS["primary-container"],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: SPACING.sm,
  },
  formatText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-primary-container"],
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
    rowGap: 10,
  },
  authorItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    backgroundColor: COLORS["surface-variant"],
  },
  authorName: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface-variant"],
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  statText: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
  },

  divider: {
    height: 1,
    backgroundColor: COLORS["outline-variant"],
  },

  section: { gap: SPACING.md },
  sectionTitle: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS["on-surface"],
  },
  description: {
    ...TYPOGRAPHY["body-md"],
    color: COLORS["on-surface-variant"],
    lineHeight: 26,
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.base,
  },
  tagChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    backgroundColor: COLORS["surface-container-low"],
  },
  tagText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },

  relatedList: { gap: SPACING.md },
  relatedCard: {
    flexDirection: "row",
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.lg,
  },
  relatedThumb: {
    width: 64,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS["surface-container-highest"],
  },
  relatedInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  relatedTitle: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  relatedMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  relatedAuthor: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  relatedDownloads: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  relatedCount: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },

  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING["margin-mobile"],
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS["outline-variant"],
  },
  shareBtn: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    alignItems: "center",
    justifyContent: "center",
  },
  downloadBtn: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.base,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
  },
  downloadBtnText: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-primary"],
  },
});
