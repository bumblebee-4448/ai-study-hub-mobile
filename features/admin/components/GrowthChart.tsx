import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/features/theme';

interface GrowthChartProps {
  data: number[];
  labels: string[];
  maxHeight?: number;
}

export const GrowthChart: React.FC<GrowthChartProps> = ({ 
  data, 
  labels,
  maxHeight = 150 
}) => {
  const { colors } = useAppTheme();
  const maxValue = Math.max(...data);
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Phát triển</Text>
        <View style={styles.tabContainer}>
          <Text style={[styles.tabInactive, { color: colors.textSubtle }]}>Tháng</Text>
          <Text style={[styles.tabActive, { color: colors.primary }]}>Tuần</Text>
        </View>
      </View>
      
      <View style={[styles.chartArea, { height: maxHeight }]}>
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * maxHeight;
          return (
            <View key={index} style={styles.barWrapper}>
              <View 
                style={[styles.bar, { height: barHeight, backgroundColor: colors.primary }]} 
              />
              <Text style={[styles.label, { color: colors.textSubtle }]}>{labels[index]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tabInactive: {
    fontSize: 12,
  },
  tabActive: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 32,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  label: {
    fontSize: 10,
    marginTop: 8,
  },
});
