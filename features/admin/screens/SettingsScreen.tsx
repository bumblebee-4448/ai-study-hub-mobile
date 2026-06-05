import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { ChevronLeft, Save, Globe, Mail, Shield, Brain, Settings as SettingsIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export const SettingsScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={22} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Cài đặt hệ thống</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cấu hình nền tảng</Text>
          
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên ứng dụng</Text>
              <View style={styles.inputWrapper}>
                <Globe size={18} color="#94a3b8" />
                <TextInput style={styles.input} value="AcademicShare Hub" />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email quản trị</Text>
              <View style={styles.inputWrapper}>
                <Mail size={18} color="#94a3b8" />
                <TextInput style={styles.input} value="admin@academicshare.vn" />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục cài đặt</Text>
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: '#eff6ff' }]}>
                <Shield size={20} color="#3b82f6" />
              </View>
              <Text style={styles.menuLabel}>Bảo mật hệ thống</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: '#f5f3ff' }]}>
                <Brain size={20} color="#8b5cf6" />
              </View>
              <Text style={styles.menuLabel}>Cấu hình AI & Training</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Save size={20} color="white" />
          <Text style={styles.saveButtonText}>Lưu tất cả thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    ...Platform.select({
      ios: { paddingTop: 60 },
      android: { paddingTop: 40 }
    })
  },
  backButton: {
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  menuList: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuLabel: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    marginTop: 10,
    marginBottom: 40,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
