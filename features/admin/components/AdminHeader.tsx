import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ChevronLeft, Bell, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, showBack = true }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={20} color="#1e293b" />
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <Search size={20} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <View style={styles.badge} />
          <Bell size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },
  rightSection: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: '#f43f5e',
    borderRadius: 4,
    zIndex: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
});
