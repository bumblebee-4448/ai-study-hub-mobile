import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserAdmin } from '../types';
import { MoreHorizontal, Edit2, Trash2, Eye } from 'lucide-react-native';
import { theme } from '@/constants/theme';

interface UserListItemProps {
  user: UserAdmin;
  onPress?: () => void;
}

export const UserListItem: React.FC<UserListItemProps> = ({ user, onPress }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active': return { color: theme.colors.success, backgroundColor: theme.colors.successBg };
      case 'blocked': return { color: theme.colors.danger, backgroundColor: theme.colors.dangerBg };
      case 'pending': return { color: theme.colors.warning, backgroundColor: theme.colors.warningBg };
      default: return { color: theme.colors.textSecondaryLight, backgroundColor: theme.colors.backgroundLight };
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
      style={styles.container}
    >
      <View style={styles.avatarContainer}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarText}>
            {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </Text>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      
      <View style={styles.actionsBox}>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {getStatusText(user.status)}
          </Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton}>
            <Edit2 size={14} color="#64748b" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Trash2 size={14} color="#f43f5e" />
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
    backgroundColor: theme.colors.cardLight,
    padding: 16,
    marginBottom: 12,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.soft,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.backgroundLight,
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
    color: theme.colors.textSecondaryLight,
    fontWeight: 'bold',
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    color: theme.colors.textPrimaryLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    color: theme.colors.textSecondaryLight,
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
