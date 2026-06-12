import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatsCard } from '@/features/admin/components/StatsCard';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useProfileStore } from '@/features/profile/store/profileStore';
import { ChevronRight, Clock, FileText, AlertTriangle, CheckCircle } from 'lucide-react-native';

const RECENT_REVIEWS = [
  { id: '1', title: 'Giải tích 1 - Đề thi 2023', author: 'Sinh viên A', time: '2 phút trước', status: 'pending' },
  { id: '2', title: 'Nhập môn Triết học Mác-Lênin', author: 'Giảng viên B', time: '15 phút trước', status: 'approved' },
  { id: '3', title: 'Lập trình Python cơ bản', author: 'Sinh viên C', time: '1 giờ trước', status: 'rejected' },
];

export const ModeratorDashboardScreen = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { profile } = useProfileStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Chào mừng trở lại,</Text>
          <Text style={styles.title}>Moderator</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/(moderator-tabs)/profile')} 
          style={styles.avatarContainer}
          activeOpacity={0.7}
        >
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <Image 
              source={{ uri: 'https://i.pravatar.cc/100?img=12' }} 
              style={styles.avatar} 
            />
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Grid - Aligned with Admin Design */}
        <View style={styles.statsGrid}>
          <StatsCard 
            title="Tài liệu chờ duyệt" 
            value="12" 
            progress={0.2} 
            isDark={true}
            onPress={() => router.push('/(moderator-tabs)/review')}
          />
          <StatsCard 
            title="Báo cáo vi phạm" 
            value="05" 
            progress={0.1} 
            color="#f43f5e"
            onPress={() => {}}
          />
          <StatsCard 
            title="Đã duyệt (Tuần)" 
            value="145" 
            progress={0.75} 
            color="#10b981"
            onPress={() => {}}
          />
          <StatsCard 
            title="Tốc độ xử lý" 
            value="4.5m" 
            progress={0.9} 
            color="#3b82f6"
            onPress={() => {}}
          />
        </View>
        
        {/* Weekly Efficiency Chart */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hiệu suất duyệt tuần này</Text>
          </View>
          
          <View style={styles.placeholderChart}>
            <View style={styles.chartLinesRow}>
              {[20, 55, 30, 85, 45, 90, 60].map((h, i) => (
                <View key={i} style={styles.chartColumn}>
                  <View style={[styles.chartBar, { height: h * 1.5, backgroundColor: i === 5 ? '#0f172a' : '#3b82f6' }]} />
                  <Text style={styles.chartLabel}>{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recently Reviewed List */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tác vụ gần đây</Text>
            <TouchableOpacity onPress={() => router.push('/(moderator-tabs)/review')}>
              <Text style={styles.seeAll}>Xem hàng đợi</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewList}>
            {RECENT_REVIEWS.map(item => (
              <TouchableOpacity key={item.id} style={styles.reviewItem}>
                <View style={[styles.iconBox, 
                  item.status === 'pending' ? styles.pendingIcon : 
                  item.status === 'approved' ? styles.approvedIcon : styles.rejectedIcon]}>
                  {item.status === 'pending' ? <Clock size={18} color="#f59e0b" /> :
                   item.status === 'approved' ? <CheckCircle size={18} color="#10b981" /> :
                   <AlertTriangle size={18} color="#f43f5e" />}
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.itemAuthor}>{item.author} • {item.time}</Text>
                </View>
                <ChevronRight size={18} color="#cbd5e1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Tools */}
        <View style={styles.toolsSection}>
          <Text style={styles.sectionTitle}>Công cụ quản trị</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={styles.toolButton}>
              <FileText size={20} color="#3b82f6" />
              <Text style={styles.toolLabel}>Tờ trình</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toolButton}>
              <AlertTriangle size={20} color="#f59e0b" />
              <Text style={styles.toolLabel}>Khiếu nại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  chartSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  placeholderChart: {
    height: 180,
    paddingTop: 20,
  },
  chartLinesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  chartColumn: {
    alignItems: 'center',
    width: 35,
  },
  chartBar: {
    width: 14,
    borderRadius: 4,
    opacity: 0.8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 8,
  },
  listSection: {
    marginTop: 10,
  },
  seeAll: {
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  reviewList: {
    marginTop: 8,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pendingIcon: { backgroundColor: '#fffbeb' },
  approvedIcon: { backgroundColor: '#f0fdf4' },
  rejectedIcon: { backgroundColor: '#fef2f2' },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  itemAuthor: {
    fontSize: 12,
    color: '#64748b',
  },
  toolsSection: {
    marginTop: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  toolButton: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 8,
  },
  toolLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  }
});
