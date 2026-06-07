/**
 * Document Feature - Document Card Component
 * Card for displaying trending documents in carousel
 */

import { COLORS, TYPOGRAPHY } from "@/constants/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Document } from "../types";

interface DocumentCardProps {
  document: Document;
  onPress?: (documentId: string) => void;
}

const CARD_WIDTH = 180;

/** Map icon name → MaterialCommunityIcons icon name + color */
function resolveIcon(icon: Document["icon"]): {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
} {
  switch (icon) {
    case "picture_as_pdf":
      return { name: "file-pdf-box", color: COLORS.primary };
    case "description":
      return { name: "file-document-outline", color: COLORS.secondary };
    case "folder_zip":
      return { name: "folder-zip-outline", color: COLORS.primary };
    default:
      return { name: "file-outline", color: COLORS.primary };
  }
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
}) => {
  const { name: iconName, color: iconColor } = resolveIcon(document.icon);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(document.id)}
      activeOpacity={0.75}
    >
      {/* Icon Section */}
      <View style={styles.iconSection}>
        <MaterialCommunityIcons name={iconName} size={48} color={iconColor} />
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.title} numberOfLines={2}>
          {document.title}
        </Text>

        <View style={styles.downloadRow}>
          <Ionicons
            name="download-outline"
            size={13}
            color={COLORS["on-surface-variant"]}
          />
          <Text style={styles.downloadText}>
            {document.downloads > 999
              ? `${(document.downloads / 1000).toFixed(1)}k`
              : document.downloads}
          </Text>
        </View>
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
  iconSection: {
    height: 112,
    backgroundColor: COLORS["surface-container-low"],
    borderBottomColor: COLORS["outline-variant"],
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  contentSection: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    ...TYPOGRAPHY["label-md"],
    color: COLORS["on-surface"],
    marginBottom: 8,
  },
  downloadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  downloadText: {
    ...TYPOGRAPHY["label-sm"],
    color: COLORS["on-surface-variant"],
  },
});
