import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { useDocument, useDocumentSearch, useQuickPrompts } from "../hooks";
import { Document, Course, QuickPrompt } from "../types";

const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

const formatIcon = (format: Document["format"]) => {
  const map: Record<Document["format"], string> = {
    pdf: "📄",
    docx: "📝",
    pptx: "📊",
    zip: "🗜️",
  };
  return map[format];
};

interface DocumentRowProps {
  doc: Document;
  onPress?: (id: string) => void;
}

const DocumentRow: React.FC<DocumentRowProps> = ({ doc, onPress }) => (
  <TouchableOpacity
    style={styles.docRow}
    onPress={() => onPress?.(doc.id)}
    activeOpacity={0.7}
  >
    <Text style={styles.docIcon}>{formatIcon(doc.format)}</Text>
    <View style={styles.docInfo}>
      <Text style={styles.docTitle} numberOfLines={2}>{doc.title}</Text>
      <Text style={styles.docMeta}>{formatCount(doc.downloads)} lượt tải</Text>
    </View>
    <Ionicons name="download-outline" size={20} color={COLORS["on-surface-variant"]} />
  </TouchableOpacity>
);

interface CourseCardProps {
  course: Course;
  onPress?: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => (
  <TouchableOpacity
    style={styles.courseCard}
    onPress={() => onPress?.(course.id)}
    activeOpacity={0.7}
  >
    <View style={styles.courseBadge}>
      <Text style={styles.courseBadgeText}>{course.category}</Text>
    </View>
    <Text style={styles.courseTitle} numberOfLines={2}>{course.title}</Text>
    <Text style={styles.courseInstructor}>{course.instructor}</Text>
  </TouchableOpacity>
);

interface QuickChipProps {
  prompt: QuickPrompt;
  onPress?: (label: string) => void;
}

const QuickChip: React.FC<QuickChipProps> = ({ prompt, onPress }) => (
  <TouchableOpacity
    style={styles.chip}
    onPress={() => onPress?.(prompt.label)}
    activeOpacity={0.7}
  >
    <Text style={styles.chipText}>{prompt.label}</Text>
  </TouchableOpacity>
);

interface DocumentHomeScreenProps {
  onDocumentPress?: (id: string) => void;
  onCoursePress?: (id: string) => void;
}

export const DocumentHomeScreen: React.FC<DocumentHomeScreenProps> = ({
  onDocumentPress,
  onCoursePress,
}) => {
  const { trendingDocuments, recommendedCourses } = useDocument();
  const { searchQuery, handleSearch } = useDocumentSearch();
  const { quickPrompts, handlePromptPress } = useQuickPrompts();

  void searchQuery;
  void handleSearch;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>AcademiShare</Text>
        <Ionicons name="notifications-outline" size={24} color={COLORS["on-surface"]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chipRow}>
          {quickPrompts.map((p) => (
            <QuickChip key={p.id} prompt={p} onPress={handlePromptPress} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài liệu nổi bật</Text>
          {trendingDocuments.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onPress={onDocumentPress} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khoá học gợi ý</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.courseList}>
            {recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course} onPress={onCoursePress} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingHorizontal: SPACING["margin-mobile"],
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS["outline-variant"],
  },
  logo: {
    ...TYPOGRAPHY["headline-md"],
    fontWeight: "700",
    color: COLORS.primary,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingVertical: SPACING.lg,
    gap: SPACING.xl,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.base,
    paddingHorizontal: SPACING["margin-mobile"],
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.base,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    backgroundColor: COLORS["surface-container-low"],
  },
  chipText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },

  section: {
    gap: SPACING.md,
    paddingHorizontal: SPACING["margin-mobile"],
  },
  sectionTitle: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS["on-surface"],
  },

  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.lg,
  },
  docIcon: {
    fontSize: 28,
  },
  docInfo: { flex: 1 },
  docTitle: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  docMeta: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
    marginTop: 2,
  },

  courseList: {
    gap: SPACING.md,
  },
  courseCard: {
    width: 200,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.base,
  },
  courseBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.base,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS["surface-container"],
  },
  courseBadgeText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
  courseTitle: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
  },
  courseInstructor: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
});
