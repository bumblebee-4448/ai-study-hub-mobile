import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { MenuItem, MenuItemData, ProfileHeader, StatsRow } from "../components";
import { useProfile } from "../hooks/useProfile";

const PRIMARY_MENU: MenuItemData[] = [
  { key: "my-documents", label: "Tài liệu của tôi", iconLib: "material-community", iconName: "file-document-outline" },
  { key: "saved", label: "Đã lưu", iconLib: "ionicons", iconName: "bookmark-outline" },
  { key: "contribute", label: "Đóng góp", iconLib: "material-community", iconName: "file-upload-outline" },
];

const SETTINGS_MENU: MenuItemData[] = [
  { key: "settings", label: "Cài đặt", iconLib: "ionicons", iconName: "settings-outline" },
];

const LOGOUT_ITEM: MenuItemData = {
  key: "logout",
  label: "Đăng xuất",
  iconLib: "material-community",
  iconName: "logout",
  destructive: true,
};

interface ProfileScreenProps {
  onMenuPress?: (key: string) => void;
  onLanguagePress?: () => void;
  onDarkModePress?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onMenuPress,
  onLanguagePress,
  onDarkModePress,
}) => {
  const router = useRouter();
  const { profile, handleLogout } = useProfile();

  const handleMenuPress = useCallback(
    (key: string) => {
      if (key === "logout") {
        Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
          { text: "Hủy", style: "cancel" },
          { text: "Đăng xuất", style: "destructive", onPress: handleLogout },
        ]);
        return;
      }
      if (key === "my-documents") {
        router.push("/my-documents" as any);
        return;
      }
      onMenuPress?.(key);
    },
    [handleLogout, onMenuPress, router]
  );

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>AcademiShare</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn} onPress={onLanguagePress} accessibilityLabel="Đổi ngôn ngữ">
            <MaterialCommunityIcons name="web" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onDarkModePress} accessibilityLabel="Chế độ tối">
            <Ionicons name="moon-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push("/profile-edit" as any)}
            accessibilityLabel="Chỉnh sửa hồ sơ"
          >
            <Ionicons name="pencil-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <ProfileHeader profile={profile} />
          <StatsRow
            documentCount={profile.documentCount}
            savedCount={profile.savedCount}
            points={profile.points}
          />
        </View>

        <View style={styles.menuSection}>
          {PRIMARY_MENU.map((item) => (
            <MenuItem key={item.key} item={item} onPress={handleMenuPress} />
          ))}

          <View style={styles.menuDivider} />

          {SETTINGS_MENU.map((item) => (
            <MenuItem key={item.key} item={item} onPress={handleMenuPress} />
          ))}

          <View style={{ height: SPACING.lg }} />

          <MenuItem item={LOGOUT_ITEM} onPress={handleMenuPress} />
        </View>

        <View style={{ height: SPACING.xl }} />
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
  headerIcons: {
    flexDirection: "row",
    gap: SPACING.base,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING["margin-mobile"],
    paddingTop: SPACING.lg,
    gap: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS["surface-container-low"],
    borderWidth: 1,
    borderColor: COLORS["outline-variant"],
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xl,
    alignItems: "center",
    gap: SPACING.md,
    overflow: "hidden",
  },
  menuSection: {
    gap: SPACING.base,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS["outline-variant"],
    marginVertical: SPACING.sm,
  },
});
