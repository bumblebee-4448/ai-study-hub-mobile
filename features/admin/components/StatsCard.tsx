import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string;
  progress: number; // 0 to 1
  color?: string;
  isDark?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  progress, 
  color = '#3b82f6',
  isDark = false 
}) => {
  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  darkContainer: {
    backgroundColor: '#121212',
    borderColor: '#121212',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 20,
  },
  darkText: {
    color: 'white',
  },
  darkTitle: {
    color: '#94a3b8',
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
    color: '#94a3b8',
  },
  darkPercent: {
    color: '#64748b',
  }
});
