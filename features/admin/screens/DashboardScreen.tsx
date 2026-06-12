import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatsCard } from '../components/StatsCard';
import { UserListItem } from '../components/UserListItem';
import { UserAdmin } from '../types';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/features/auth/store/authStore';
import { LogOut } from 'lucide-react-native';

const RECENT_USERS: UserAdmin[] = [
  { id: '1', fullName: 'Nguyên Anh', email: 'anh.n@academy.vn', role: 'student', joinedDate: '12/05/2024', status: 'active' },
  { id: '2', fullName: 'Trần Thế Dân', email: 'dan.t@academy.vn', role: 'admin', joinedDate: '10/05/2024', status: 'active' },
  { id: '3', fullName: 'Hoàng Lan', email: 'lan.h@academy.vn', role: 'teacher', joinedDate: '08/05/2024', status: 'blocked' }
];

export const DashboardScreen = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState('Tuần');

  const filters = ['Tháng', 'Tuần', 'Ngày'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Chào mừng trở lại,</Text>
          <Text style={styles.title}>Quản trị viên</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/settings')} 
          style={styles.avatarContainer}
          activeOpacity={0.7}
        >
          <Image 
            source={{ uri: 'https://i.pravatar.cc/100?img=5' }} 
            style={styles.avatar} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Grid - Follow Original Content */}
        <View style={styles.statsGrid}>
          <StatsCard 
            title="Người dùng mới" 
            value="1,284" 
            progress={0.4} 
            isDark={true}
            onPress={() => router.push('/users')}
          />
          <StatsCard 
            title="Tài liệu mới" 
            value="4,562" 
            progress={0.6} 
            color="#3b82f6"
            onPress={() => router.push('/analytics')}
          />
          <StatsCard 
            title="Bài thảo luận" 
            value="892" 
            progress={0.25} 
            color="#94a3b8"
            onPress={() => router.push('/analytics')}
          />
          <StatsCard 
            title="Lượt xem" 
            value="12.5k" 
            progress={0.88} 
            color="#f43f5e"
            onPress={() => router.push('/analytics')}
          />
        </View>
        
        {/* Development Chart - "Phát triển hệ thống" */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Phát triển hệ thống</Text>
          </View>
          
          <View style={styles.placeholderChart}>
            <View style={styles.chartLinesRow}>
              {[15, 45, 25, 65, 30, 80, 40].map((h, i) => (
                <View key={i} style={styles.chartColumn}>
                  <View style={[styles.chartBar, { height: h * 1.5 }]} />
                  <Text style={styles.chartLabel}>{['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recently Registered Users */}
        <View style={styles.listSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Người dùng gần đây</Text>
            <TouchableOpacity onPress={() => router.push('/users')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.userList}>
            {RECENT_USERS.map(user => (
              <UserListItem 
                key={user.id} 
                user={user} 
                onPress={() => router.push({
                  pathname: '/modal',
                  params: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    joinedDate: user.joinedDate
                  }
                })}
              />
            ))}
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 2,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabItemActive: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tabItemText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  tabItemTextActive: {
    fontSize: 11,
    color: 'white',
    fontWeight: 'bold',
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
    backgroundColor: '#3b82f6',
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
  userList: {
    marginTop: 8,
  }
});
