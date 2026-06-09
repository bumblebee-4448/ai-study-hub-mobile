/**
 * Document Feature - Course Card Component
 * Card for displaying recommended courses in carousel
 */

import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Course } from "../types";

interface CourseCardProps {
  course: Course;
  onPress?: (courseId: string) => void;
}

const CARD_WIDTH = 240;

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const categoryColor =
    course.categoryColor === "primary" ? COLORS.primary : COLORS.secondary;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(course.id)}
      activeOpacity={0.7}
    >
      {/* Image Section */}
      <View style={styles.imageSection}>
        <Image
          source={{ uri: course.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={[styles.categoryBadge, { borderColor: categoryColor }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {course.category}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {course.title}
        </Text>

        <Text style={styles.instructor}>{course.instructor}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 8,
    borderColor: COLORS["outline-variant"],
    borderWidth: 1,
    backgroundColor: COLORS["surface-container-lowest"],
    overflow: "hidden",
  },
  imageSection: {
    height: 128,
    backgroundColor: COLORS["surface-container-low"],
    borderBottomColor: COLORS["outline-variant"],
    borderBottomWidth: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentSection: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 8,
  },
  categoryText: {
    ...TYPOGRAPHY["label-sm"],
    fontSize: 10,
  },
  title: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
    marginBottom: 8,
  },
  instructor: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
});
