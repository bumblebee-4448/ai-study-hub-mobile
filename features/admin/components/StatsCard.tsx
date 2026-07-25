import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import { useAppTheme } from '@/features/theme';

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
  color,
  isDark = false,
  onPress
}) => {
  const { colors, isDark: isAppDark } = useAppTheme();
  const accentColor = color ?? colors.primary;
  const highlightedBackground = isAppDark ? colors.surfaceRaised : colors.inverseSurface;
  const highlightedBorder = isAppDark ? colors.borderStrong : colors.inverseSurface;
  const highlightedText = isAppDark ? colors.text : colors.inverseText;
  const highlightedSubtleText = isAppDark ? colors.textMuted : colors.inverseText;

  const cardColors = {
    backgroundColor: isDark ? highlightedBackground : colors.surface,
    borderColor: isDark ? highlightedBorder : colors.border,
  };
  const primaryTextColor = isDark ? highlightedText : colors.text;
  const secondaryTextColor = isDark ? highlightedSubtleText : colors.textSubtle;
  const progressTrackColor = isDark && !isAppDark ? 'rgba(255, 255, 255, 0.25)' : colors.surfaceSubtle;
  const progressColor = isDark && !isAppDark ? colors.inverseText : accentColor;

  return (
    <TouchableOpacity 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      style={[styles.container, cardColors, { shadowColor: colors.shadow }]}
    >
      <Text style={[styles.value, { color: primaryTextColor }]}>{value}</Text>
      <Text style={[styles.title, { color: secondaryTextColor }]}>{title}</Text>
      
      <View style={styles.footer}>
        <View style={[styles.progressTrack, { backgroundColor: progressTrackColor }]}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${progress * 100}%`, backgroundColor: progressColor }
            ]} 
          />
        </View>
        <View style={styles.percentageRow}>
          <Text style={[styles.percentLabel, { color: secondaryTextColor }]}>0%</Text>
          <Text style={[styles.percentLabel, { color: secondaryTextColor }]}>{Math.round(progress * 100)}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: theme.borderRadius.xl,
    width: '48%',
    marginBottom: 16,
    ...theme.shadows.soft,
    borderWidth: 1,
    shadowColor: theme.colors.backgroundDark,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    marginBottom: 20,
  },
  footer: {
    marginTop: 'auto',
  },
  progressTrack: {
    height: 6,
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
  }
});
