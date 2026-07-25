/**
 * Document Feature - Carousel Section Component
 * Reusable section with title row + horizontal scrolling carousel
 */

import { COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CarouselSectionProps {
  title: string;
  onViewAll?: () => void;
  children: React.ReactNode;
}

export const CarouselSection: React.FC<CarouselSectionProps> = ({
  title,
  onViewAll,
  children,
}) => {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllLink}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel — paddingHorizontal only on contentContainer so shadows aren't clipped */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.carouselContent}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: SPACING["margin-mobile"],
    marginBottom: 16,
  },
  title: {
    ...TYPOGRAPHY["headline-md"],
    color: COLORS["on-surface"],
  },
  viewAllLink: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS.primary,
    marginBottom: 4,
  },
  carouselContent: {
    gap: 16,
    paddingHorizontal: SPACING["margin-mobile"],
    paddingBottom: 4,
  },
});
