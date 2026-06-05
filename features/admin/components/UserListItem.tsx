import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserAdmin } from '../types';
import { MoreHorizontal, Edit2, Trash2, Eye } from 'lucide-react-native';

interface UserListItemProps {
  user: UserAdmin;
  onPress?: () => void;
}

export const UserListItem: React.FC<UserListItemProps> = ({ user, onPress }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active': return { color: '#10b981', backgroundColor: '#ecfdf5' };
      case 'blocked': return { color: '#f43f5e', backgroundColor: '#fff1f2' };
      case 'pending': return { color: '#f59e0b', backgroundColor: '#fffbe6' };
      default: return { color: '#64748b', backgroundColor: '#f8fafc' };
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
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
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
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 18,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 16,
  },
  email: {
    color: '#94a3b8',
    fontSize: 12,
  },
  actionsBox: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
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
