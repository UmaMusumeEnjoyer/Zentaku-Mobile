import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import AnimeCardSkeleton from './AnimeCardSkeleton';
import { spacing } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

interface AnimeSectionSkeletonProps {
  count?: number;
}

const AnimeSectionSkeleton: React.FC<AnimeSectionSkeletonProps> = ({ count = 5 }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={[styles.titleAccent, { backgroundColor: theme.primary }]} />
        <Skeleton width={140} height={20} borderRadius={6} />
      </View>

      {/* Horizontal Scroll of Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false} // Disable scroll on skeleton
      >
        {[...Array(count)].map((_, i) => (
          <AnimeCardSkeleton key={i} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing['5'],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['3'],
    paddingHorizontal: spacing['4'],
  },
  titleAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    marginRight: spacing['2'],
  },
  scrollContent: {
    paddingHorizontal: spacing['4'],
  },
});

export default AnimeSectionSkeleton;
