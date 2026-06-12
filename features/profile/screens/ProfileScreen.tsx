import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuthStore } from "@/features/auth";
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from "@/constants/theme";
import { MenuItem, MenuItemData, ProfileHeader, StatsRow } from "../components";
import { useProfile } from "../hooks/useProfile";
import { User, Settings, ShieldCheck, LogOut, FileText, Bookmark, Upload, Globe, Moon, Pencil } from 'lucide-react-native';

const PRIMARY_MENU: MenuItemData[] = [
  { key: "my-documents", label: "Tài liệu của tôi", iconLib: "material-community", iconName: "file-document-outline" },
  { key: "saved", label: "Đã lưu", iconLib: "ionicons", iconName: "bookmark-outline" },
  { key: "contribute", label: "Đóng góp", iconLib: "material-community", iconName: "file-upload-outline" },
];

export const ProfileScreen = () => {
  const router = useRouter();
  const { profile, handleLogout } = useProfile();
  const { role } = useAuthStore();

  const handleMenuPress = useCallback(
    (key: string) => {
      if (key === "logout") {
        Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
          { text: "Hủy", style: "cancel" },
          { text: "Đăng xuất", style: "destructive", onPress: handleLogout },
        ]);
        return;
      }
      if (key === "profile-edit") {
        router.push("/profile-edit" as any);
        return;
      }
      if (key === "my-documents") {
        router.push("/my-documents" as any);
        return;
      }
      if (key === "moderator-review") {
        router.push("/moderator-review" as any);
        return;
      }
    },
    [handleLogout, router]
  );

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Simple Name Header built into ScrollView */}
        <View style={styles.topSection}>
          <Text style={styles.welcomeText}>Cài đặt tài khoản</Text>
          <Text style={styles.pageTitle}>Hồ sơ cá nhân</Text>
        </View>

        {/* Profile Card - Premium Flat Design */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            {profile.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarDefault}>
                <User size={32} color="#64748b" />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{profile.name}</Text>
            <Text style={styles.userSub}>{profile.university}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{role?.toUpperCase() || 'STUDENT'}</Text>
            </View>
          </View>
        </View>

        {/* Statistics integrated like Admin Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.documentCount}</Text>
            <Text style={styles.statLabel}>Tài liệu</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={styles.statValue}>{profile.savedCount}</Text>
            <Text style={styles.statLabel}>Đã lưu</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.points}</Text>
            <Text style={styles.statLabel}>Điểm thưởng</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>QUẢN LÝ</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('profile-edit')}>
            <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
              <Pencil size={20} color="#3b82f6" />
            </View>
            <Text style={styles.menuLabel}>Chỉnh sửa thông tin</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('my-documents')}>
            <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
              <FileText size={20} color="#10b981" />
            </View>
            <Text style={styles.menuLabel}>Tài liệu của tôi</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('saved')}>
            <View style={[styles.iconBox, { backgroundColor: '#fffbeb' }]}>
              <Bookmark size={20} color="#f59e0b" />
            </View>
            <Text style={styles.menuLabel}>Đã lưu</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          {role === 'moderator' && (
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('moderator-review')}>
              <View style={[styles.iconBox, { backgroundColor: '#f5f3ff' }]}>
                <ShieldCheck size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.menuLabel}>Duyệt tài liệu (Mod)</Text>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          )}

          <Text style={[styles.menuTitle, { marginTop: 24 }]}>CÀI ĐẶT</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#f8fafc' }]}>
              <Globe size={20} color="#64748b" />
            </View>
            <Text style={styles.menuLabel}>Ngôn ngữ</Text>
            <Text style={styles.menuValue}>Tiếng Việt</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#f8fafc' }]}>
              <Moon size={20} color="#64748b" />
            </View>
            <Text style={styles.menuLabel}>Chế độ tối</Text>
            <View style={styles.switchPlaceholder} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.logoutButton} onPress={() => handleMenuPress('logout')}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  topSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e2e8f0',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarDefault: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  userSub: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'white',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 32,
    // Shadow like Admin cards
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#f1f5f9',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  menuSection: {
    gap: 12,
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  menuValue: {
    fontSize: 14,
    color: '#94a3b8',
    marginRight: 8,
  },
  switchPlaceholder: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ef4444',
  }
});
