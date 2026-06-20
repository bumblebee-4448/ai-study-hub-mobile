import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft, Bell, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SCREEN_HEADER_TOP_PADDING } from '@/constants/safeArea';
import { useAppTheme } from '@/features/theme';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, showBack = true }) => {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity 
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: colors.surfaceMuted }]}
          >
            <ChevronLeft size={20} color={colors.text} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: colors.textSubtle }]}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surfaceMuted }]}>
          <Search size={20} color={colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.surfaceMuted }]}>
          <View style={[styles.badge, { backgroundColor: colors.danger, borderColor: colors.surface }]} />
          <Bell size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: SCREEN_HEADER_TOP_PADDING,
    paddingBottom: 16,
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
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
  },
  rightSection: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 10,
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 10,
    borderWidth: 2,
  },
});
