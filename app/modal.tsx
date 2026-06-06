import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';
import { User, Shield, Calendar, Ban, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function UserDetailModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
    joinedDate: string;
  }>();

  const [status, setStatus] = useState(params.status || 'active');

  const handleToggleStatus = async () => {
    const isBlocking = status === 'active';
    const actionText = isBlocking ? 'khóa' : 'kích hoạt lại';
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    Alert.alert(
      'Xác nhận hành động',
      `Bạn có chắc chắn muốn ${actionText} tài khoản của ${params.fullName}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: isBlocking ? 'Khóa' : 'Kích hoạt', 
          style: isBlocking ? 'destructive' : 'default',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setStatus(isBlocking ? 'blocked' : 'active');
            Alert.alert('Thành công', `Đã ${actionText} tài khoản.`);
          }
        }
      ]
    );
  };

  const getStatusBadgeStyles = () => {
    switch (status) {
      case 'active': return { color: theme.colors.success, backgroundColor: theme.colors.successBg, label: 'HOẠT ĐỘNG' };
      case 'blocked': return { color: theme.colors.danger, backgroundColor: theme.colors.dangerBg, label: 'BỊ KHÓA' };
      default: return { color: theme.colors.textSecondaryLight, backgroundColor: theme.colors.backgroundLight, label: 'CHỜ DUYỆT' };
    }
  };

  const badge = getStatusBadgeStyles();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color={theme.colors.textPrimaryLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết học viên</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>
              {params.fullName ? params.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US'}
            </Text>
          </View>
          <Text style={styles.name}>{params.fullName || 'N/A'}</Text>
          <Text style={styles.email}>{params.email || 'N/A'}</Text>
          
          <View style={[styles.statusBadge, { backgroundColor: badge.backgroundColor }]}>
            <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        </View>

        {/* Detailed Fields */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
          
          <View style={styles.infoRow}>
            <User size={18} color={theme.colors.textSecondaryLight} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Mã học viên</Text>
              <Text style={styles.infoValue}>#{params.id || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Shield size={18} color={theme.colors.textSecondaryLight} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Vai trò</Text>
              <Text style={styles.infoValue}>{(params.role || 'Member').toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={18} color={theme.colors.textSecondaryLight} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Ngày tham gia</Text>
              <Text style={styles.infoValue}>{params.joinedDate || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Activity Statistics */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Chỉ số học tập</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statsBox}>
              <Text style={styles.statsNumber}>42</Text>
              <Text style={styles.statsLabel}>Bài học</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={styles.statsNumber}>18</Text>
              <Text style={styles.statsLabel}>Tài liệu</Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={styles.statsNumber}>92%</Text>
              <Text style={styles.statsLabel}>Hoàn thành</Text>
            </View>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              status === 'active' ? styles.blockButton : styles.activateButton
            ]} 
            onPress={handleToggleStatus}
          >
            {status === 'active' ? (
              <>
                <Ban size={18} color="white" style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>Khóa tài khoản</Text>
              </>
            ) : (
              <>
                <CheckCircle size={18} color="white" style={styles.actionButtonIcon} />
                <Text style={styles.actionButtonText}>Kích hoạt tài khoản</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimaryLight,
  },
  scrollContent: {
    padding: 24,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    ...theme.shadows.soft,
    marginBottom: 24,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarTextLarge: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimaryLight,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: theme.colors.textSecondaryLight,
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.round,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsSection: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    padding: 20,
    ...theme.shadows.soft,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimaryLight,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondaryLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimaryLight,
  },
  statsSection: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.xl,
    padding: 20,
    ...theme.shadows.soft,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: theme.colors.textSecondaryLight,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.soft,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  blockButton: {
    backgroundColor: theme.colors.danger,
  },
  activateButton: {
    backgroundColor: theme.colors.success,
  },
});
