import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserAdmin } from '../types';
import { MoreHorizontal, Edit2, Trash2, Eye } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { useAppTheme } from '@/features/theme';

interface UserListItemProps {
  user: UserAdmin;
  onPress?: () => void;
}

export const UserListItem: React.FC<UserListItemProps> = ({ user, onPress }) => {
  const { colors } = useAppTheme();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active': return { color: colors.successText, backgroundColor: colors.successMuted };
      case 'blocked': return { color: colors.dangerText, backgroundColor: colors.dangerMuted };
      case 'pending': return { color: colors.warningText, backgroundColor: colors.warningMuted };
      default: return { color: colors.textSubtle, backgroundColor: colors.surfaceSubtle };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'HOẠT ĐỘNG';
      case 'blocked': return 'BỊ KHÓA';
      case 'pending': return 'CHỜ DUYỆT';
      default: return status.toUpperCase();
    }
  };

  const statusStyle = getStatusStyles(user.status);

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.avatarContainer, { backgroundColor: colors.surfaceMuted }]}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <Text style={[styles.avatarText, { color: colors.textSubtle }]}>
            {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </Text>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{user.fullName}</Text>
        <Text style={[styles.email, { color: colors.textSubtle }]}>{user.email}</Text>
      </View>
      
      <View style={styles.actionsBox}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {getStatusText(user.status)}
          </Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton}>
            <Edit2 size={14} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Trash2 size={14} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.soft,
    borderWidth: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    fontSize: 12,
  },
  actionsBox: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.round,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
});
