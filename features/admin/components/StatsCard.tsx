import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';

interface StatsCardProps {
  title: string;
  value: string;
  progress: number; // 0 to 1
  color?: string;
  isDark?: boolean;
  onPress?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  progress, 
  color = '#3b82f6',
  isDark = false,
  onPress
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      style={[styles.container, isDark && styles.darkContainer]}
    >
      <Text style={[styles.value, isDark && styles.darkText]}>{value}</Text>
      <Text style={[styles.title, isDark && styles.darkTitle]}>{title}</Text>
      
      <View style={styles.footer}>
        <View style={styles.progressTrack}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${progress * 100}%`, backgroundColor: isDark ? 'white' : color }
            ]} 
          />
        </View>
        <View style={styles.percentageRow}>
          <Text style={[styles.percentLabel, isDark && styles.darkPercent]}>0%</Text>
          <Text style={[styles.percentLabel, isDark && styles.darkPercent]}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardLight,
    padding: 16,
    borderRadius: theme.borderRadius.xl,
    width: '48%',
    marginBottom: 16,
    ...theme.shadows.soft,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  darkContainer: {
    backgroundColor: theme.colors.cardDark,
    borderColor: theme.colors.cardDark,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimaryLight,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: theme.colors.textSecondaryLight,
    marginBottom: 20,
  },
  darkText: {
    color: theme.colors.textPrimaryDark,
  },
  darkTitle: {
    color: theme.colors.textSecondaryDark,
  },
  footer: {
    marginTop: 'auto',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  percentageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentLabel: {
    fontSize: 10,
    color: theme.colors.textSecondaryLight,
  },
  darkPercent: {
    color: theme.colors.textSecondaryDark,
  }
});
