import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Search, MoreVertical } from 'lucide-react-native';

const MOCK_USERS = [
  { id: '1', name: 'Nguyễn Văn Anh', email: 'nguyenvan@example.com', role: 'Member', date: '21 Th05, 2024', status: 'Hoạt động', initial: 'NA' },
  { id: '2', name: 'Trần Minh Quân', email: 'dan.t@academy.vn', role: 'Admin', date: '21 Th05, 2024', status: 'Hoạt động', initial: 'MQ' },
  { id: '3', name: 'Lê Thị Lan', email: 'lan.h@academy.vn', role: 'Guest', date: '20 Th05, 2024', status: 'Khóa', initial: 'LL' },
  { id: '4', name: 'Phạm Gia Bảo', email: 'phamminh@example.com', role: 'Member', date: '19 Th05, 2024', status: 'Hoạt động', initial: 'GB' }
];

export const UsersScreen = () => {
  const [activeRange, setActiveRange] = useState('Tuần');
  const ranges = ['Năm', 'Tháng', 'Tuần', 'Ngày'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý học viên</Text>
        <TouchableOpacity style={styles.filterToggle}>
          <Filter size={20} color="black" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Registration Analytics Chart */}
        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tăng trưởng học viên</Text>
          </View>
          
          <View style={styles.barChartPlaceholder}>
            <View style={styles.barsContainer}>
              {[45, 60, 35, 75, 40, 55, 65].map((h, i) => (
                <View key={i} style={styles.barColumn}>
                  <View style={[styles.barMain, { height: h * 1.5 }]} />
                  <Text style={styles.axisText}>{['19', '20', '21', '22', '23', '24', '25'][i]}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* User Search & List */}
        <View style={styles.listSection}>
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Search size={18} color="#94a3b8" />
              <TextInput 
                placeholder="Tìm kiếm người dùng..."
                style={styles.searchInput}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>HỌ TÊN / EMAIL</Text>
            <Text style={styles.headerText}>TRẠNG THÁI</Text>
          </View>

          {MOCK_USERS.map((user) => (
            <TouchableOpacity key={user.id} style={styles.userCard}>
              <View style={styles.userInfoRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.initial}</Text>
                </View>
                <View style={styles.nameContent}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              </View>
              
              <View style={styles.statusRow}>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: user.status === 'Khóa' ? '#fff1f2' : '#f0fdf4' }
                ]}>
                  <Text style={[
                      styles.statusText, 
                      { color: user.status === 'Khóa' ? '#e11d48' : '#16a34a' }
                  ]}>
                    {user.status}
                  </Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical size={16} color="#64748b" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  filterToggle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  chartSection: {
    marginBottom: 32,
    backgroundColor: '#fbfcfd',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 2,
    borderRadius: 8,
  },
  tabItem: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tabItemActive: {
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  tabItemText: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  tabItemTextActive: {
    fontSize: 10,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  barChartPlaceholder: {
    height: 140,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barColumn: {
    alignItems: 'center',
    width: 30,
  },
  barMain: {
    width: 12,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    marginBottom: 8,
  },
  axisText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  listSection: {
    marginTop: 10,
  },
  searchRow: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#1e293b',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748b',
  },
  nameContent: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 11,
    color: '#94a3b8',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 4,
  }
});
