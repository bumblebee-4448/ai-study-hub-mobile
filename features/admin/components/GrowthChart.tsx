import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  const maxValue = Math.max(...data);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Phát triển</Text>
        <View style={styles.tabContainer}>
          <Text style={styles.tabInactive}>Tháng</Text>
          <Text style={styles.tabActive}>Tuần</Text>
        </View>
      </View>
      
      <View style={[styles.chartArea, { height: maxHeight }]}>
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * maxHeight;
          return (
            <View key={index} style={styles.barWrapper}>
              <View 
                style={[styles.bar, { height: barHeight }]} 
              />
              <Text style={styles.label}>{labels[index]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f8fafc',
    shadowColor: '#000',
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
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tabInactive: {
    color: '#94a3b8',
    fontSize: 12,
  },
  tabActive: {
    color: '#3b82f6',
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
    backgroundColor: '#3b82f6',
  },
  label: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 8,
  },
});
