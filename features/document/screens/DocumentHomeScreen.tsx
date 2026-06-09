/**
 * Document Feature - Home Screen
 * Main screen displaying trending documents and recommended courses
 */

import { COLORS, SPACING } from "@/constants/theme";
import React, { useCallback } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  AISearchInput,
  CarouselSection,
  CourseCard,
  DocumentCard,
  Header,
  QuickChips,
} from "../components";
import { useDocument, useDocumentSearch, useQuickPrompts } from "../hooks";

interface DocumentHomeScreenProps {
  onDocumentPress?: (id: string) => void;
  onCoursePress?: (id: string) => void;
  onAIIconPress?: () => void;
  onViewAllDocuments?: () => void;
  onViewAllCourses?: () => void;
}

export const DocumentHomeScreen: React.FC<DocumentHomeScreenProps> = ({
  onDocumentPress,
  onCoursePress,
  onAIIconPress,
  onViewAllDocuments,
  onViewAllCourses,
}) => {
  const { searchQuery, handleSearch } = useDocumentSearch();
  const { quickPrompts, handlePromptPress } = useQuickPrompts();
  const { trendingDocuments, recommendedCourses } = useDocument();

  const handleAIIconPress = useCallback(() => {
    onAIIconPress?.();
  }, [onAIIconPress]);

  const handleDocumentPress = useCallback((documentId: string) => {
    onDocumentPress?.(documentId);
  }, [onDocumentPress]);

  const handleCoursePress = useCallback((courseId: string) => {
    onCoursePress?.(courseId);
  }, [onCoursePress]);

  const handleViewAllDocuments = useCallback(() => {
    onViewAllDocuments?.();
  }, [onViewAllDocuments]);

  const handleViewAllCourses = useCallback(() => {
    onViewAllCourses?.();
  }, [onViewAllCourses]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky Header Section */}
        <View style={styles.stickyHeader}>
          <Header />
          <AISearchInput
            value={searchQuery}
            onChange={handleSearch}
            onAIIconPress={handleAIIconPress}
          />
          <QuickChips chips={quickPrompts} onChipPress={handlePromptPress} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Trending Documents Section */}
          <CarouselSection
            title="Tài liệu thịnh hành"
            onViewAll={handleViewAllDocuments}
          >
            {trendingDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onPress={handleDocumentPress}
              />
            ))}
          </CarouselSection>

          {/* Recommended Courses Section */}
          <CarouselSection
            title="Khóa học đề xuất"
            onViewAll={handleViewAllCourses}
          >
            {recommendedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={handleCoursePress}
              />
            ))}
          </CarouselSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  stickyHeader: {
    backgroundColor: COLORS.surface,
  },
  mainContent: {
    paddingVertical: SPACING.xl,
    paddingBottom: 80, // Space for bottom navigation
  },
});
