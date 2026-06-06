import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter } from 'lucide-react-native';

export const AnalyticsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Phân tích</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="black" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.overviewRow}>
          <View style={styles.statsSmallCard}>
            <View style={styles.iconBox}>
              <View style={[styles.barSmall, { height: 10 }]} />
              <View style={[styles.barSmall, { height: 15 }]} />
              <View style={[styles.barSmall, { height: 12 }]} />
            </View>
            <Text style={styles.statsValueSmall}>850K</Text>
            <Text style={styles.statsLabelSmall}>Tổng lượt xem</Text>
          </View>
          
          <View style={styles.statsSmallCard}>
            <View style={styles.iconBox}>
              <View style={styles.waveIcon} />
            </View>
            <Text style={styles.statsValueSmall}>12,500</Text>
            <Text style={styles.statsLabelSmall}>Trung bình/ngày</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Biểu đồ học tập</Text>
            <View style={styles.tabSelector}>
              <Text style={styles.tabItem}>Tháng</Text>
              <View style={styles.tabItemActive}>
                <Text style={styles.tabItemTextActive}>Tuần</Text>
              </View>
              <Text style={styles.tabItem}>Ngày</Text>
            </View>
          </View>
          
          <View style={styles.areaChartPlaceholder}>
            <View style={styles.areaFill} />
            <View style={styles.lineOverlay} />
            <View style={styles.chartLabelsLeft}>
              {[60, 50, 40, 30, 20, 10].map(v => (
                <Text key={v} style={styles.axisText}>{v}k</Text>
              ))}
            </View>
            <View style={styles.chartLabelsBottom}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((l, idx) => (
                <Text key={`${l}-${idx}`} style={styles.axisText}>{l}</Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tài liệu nổi bật</Text>
            <View style={styles.tabSelector}>
              <Text style={styles.tabItem}>Tháng</Text>
              <View style={styles.tabItemActive}>
                <Text style={styles.tabItemTextActive}>Tuần</Text>
              </View>
              <Text style={styles.tabItem}>Ngày</Text>
            </View>
          </View>

          {[
            { name: 'Toán cao cấp 1', category: 'Toán học', value: '1.2k', trend: 'Tải về +15%', color: '#10b981', image: 'https://images.unsplash.com/photo-1509228468518-180dd482195b?w=100' },
            { name: 'Lập trình Python', category: 'Công nghệ', value: '950', trend: 'Tải về -5%', color: '#f43f5e', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100' }
          ].map((item, idx) => (
            <View key={idx} style={styles.trendingItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemBrand}>{item.category}</Text>
              </View>
              <View style={styles.itemStats}>
                <Text style={styles.itemValue}>{item.value}</Text>
                <Text style={[styles.itemTrend, { color: item.color }]}>{item.trend}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statsSmallCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconBox: {
    width: 32,
    height: 32,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  barSmall: {
    width: 4,
    backgroundColor: '#94a3b8',
    borderRadius: 1,
  },
  waveIcon: {
    width: 16,
    height: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#94a3b8',
    transform: [{ rotate: '-45deg' }],
  },
  statsValueSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  statsLabelSmall: {
    fontSize: 12,
    color: '#94a3b8',
  },
  chartSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabItem: {
    fontSize: 10,
    paddingHorizontal: 10,
    color: '#94a3b8',
  },
  tabItemActive: {
    backgroundColor: 'black',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tabItemTextActive: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  areaChartPlaceholder: {
    height: 220,
    paddingLeft: 30,
    paddingBottom: 30,
    backgroundColor: 'white',
  },
  areaFill: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 0,
    height: 100,
    backgroundColor: '#000',
    opacity: 0.1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 100,
  },
  lineOverlay: {
    position: 'absolute',
    bottom: 130,
    left: 30,
    right: 0,
    height: 2,
    backgroundColor: '#000',
    opacity: 0.8,
  },
  chartLabelsLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 30,
    justifyContent: 'space-between',
  },
  chartLabelsBottom: {
    position: 'absolute',
    bottom: 0,
    left: 30,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisText: {
    fontSize: 10,
    color: '#94a3b8',
  },
  trendingSection: {
    marginBottom: 20,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  itemBrand: {
    fontSize: 12,
    color: '#94a3b8',
  },
  itemStats: {
    alignItems: 'flex-end',
  },
  itemValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  itemTrend: {
    fontSize: 10,
    fontWeight: '500',
  }
});
