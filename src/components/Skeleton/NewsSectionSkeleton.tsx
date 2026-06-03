import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import { spacing, radius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

interface NewsSectionSkeletonProps {
  count?: number;
}

const NewsSectionSkeleton: React.FC<NewsSectionSkeletonProps> = ({ count = 3 }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.header}>
        <Skeleton width={150} height={24} borderRadius={6} />
      </View>

      {/* Horizontal Scroll of Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false}
      >
        {[...Array(count)].map((_, i) => (
          <View key={i} style={[styles.card, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
            <Skeleton width="100%" height={140} borderRadius={0} />
            <View style={styles.content}>
              <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
              <Skeleton width="100%" height={12} borderRadius={4} style={{ marginBottom: 4 }} />
              <Skeleton width="80%" height={12} borderRadius={4} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing['6'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing['4'],
    marginBottom: spacing['3'],
  },
  listContent: {
    paddingHorizontal: spacing['4'],
  },
  card: {
    width: 280,
    marginRight: spacing['4'],
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  content: {
    padding: spacing['3'],
  },
});

export default NewsSectionSkeleton;
