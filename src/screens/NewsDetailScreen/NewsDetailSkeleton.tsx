import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../styles/theme';

const NewsDetailSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgApp }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <Skeleton width={180} height={20} borderRadius={4} />
        <Skeleton width={32} height={32} borderRadius={16} />
      </View>

      <View style={styles.contentContainer}>
        {/* Hero Image */}
        <Skeleton width="100%" height={220} borderRadius={0} />
        
        <View style={styles.bodyContent}>
          {/* Title */}
          <Skeleton width="90%" height={28} borderRadius={4} style={{ marginBottom: spacing['4'] }} />
          <Skeleton width="60%" height={28} borderRadius={4} style={{ marginBottom: spacing['6'] }} />

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

          {/* Paragraphs */}
          <View style={styles.paragraphsContainer}>
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} style={{ marginBottom: spacing['5'] }}>
                <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
                <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
                <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
                <Skeleton width="95%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              </View>
            ))}
          </View>

          {/* Quote Box */}
          <View style={[styles.quoteBox, { backgroundColor: theme.bgPanel, borderLeftColor: theme.primary }]}>
            <Skeleton width="80%" height={20} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
            <Skeleton width="60%" height={20} borderRadius={4} style={{ marginBottom: spacing['3'] }} />
            <Skeleton width={100} height={14} borderRadius={4} style={{ alignSelf: 'flex-end' }} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? spacing['4'] : spacing['2'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['2'],
    height: 56,
    borderBottomWidth: 1,
  },
  contentContainer: {
    flex: 1,
  },
  bodyContent: {
    padding: spacing['4'],
  },
  divider: {
    height: 1,
    marginBottom: spacing['4'],
  },
  paragraphsContainer: {
    marginBottom: spacing['4'],
  },
  quoteBox: {
    borderLeftWidth: 4,
    padding: spacing['4'],
    borderRadius: radius.md,
    marginTop: spacing['4'],
  },
});

export default NewsDetailSkeleton;
