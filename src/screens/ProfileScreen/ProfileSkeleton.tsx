import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, ScrollView } from 'react-native';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../styles/theme';

const ProfileSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgApp }]}>
      {/* Header Mockup */}
      <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <Skeleton width={120} height={20} borderRadius={4} />
        <Skeleton width={32} height={32} borderRadius={16} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header Mockup */}
        <View style={styles.profileHeader}>
          <Skeleton width={100} height={100} borderRadius={50} style={{ marginBottom: spacing['4'] }} />
          <Skeleton width={150} height={24} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
          <Skeleton width={100} height={16} borderRadius={4} style={{ marginBottom: spacing['4'] }} />
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Skeleton width={40} height={20} borderRadius={4} style={{ marginBottom: spacing['1'] }} />
              <Skeleton width={60} height={14} borderRadius={4} />
            </View>
            <View style={styles.statItem}>
              <Skeleton width={40} height={20} borderRadius={4} style={{ marginBottom: spacing['1'] }} />
              <Skeleton width={60} height={14} borderRadius={4} />
            </View>
            <View style={styles.statItem}>
              <Skeleton width={40} height={20} borderRadius={4} style={{ marginBottom: spacing['1'] }} />
              <Skeleton width={60} height={14} borderRadius={4} />
            </View>
          </View>
        </View>

        {/* Tab Bar Mockup */}
        <View style={[styles.tabBar, { borderBottomColor: theme.borderSubtle }]}>
          <Skeleton width={80} height={16} borderRadius={4} />
          <Skeleton width={80} height={16} borderRadius={4} />
          <Skeleton width={80} height={16} borderRadius={4} />
        </View>

        {/* Content Mockup (Overview tab default) */}
        <View style={styles.contentSection}>
          <Skeleton width={150} height={20} borderRadius={4} style={{ marginBottom: spacing['4'] }} />
          
          {/* Heatmap Mockup */}
          <View style={[styles.heatmapMockup, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <View key={rowIndex} style={styles.heatmapRow}>
                {Array.from({ length: 15 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} width={12} height={12} borderRadius={2} style={{ margin: 2 }} />
                ))}
              </View>
            ))}
          </View>

          <Skeleton width={120} height={20} borderRadius={4} style={{ marginTop: spacing['6'], marginBottom: spacing['4'] }} />
          
          {/* Activity Feed Mockup */}
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={i} style={[styles.activityItem, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
              <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: spacing['3'] }} />
              <View style={{ flex: 1 }}>
                <Skeleton width="80%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
                <Skeleton width="50%" height={12} borderRadius={4} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['10'],
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing['6'],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing['6'],
    marginTop: spacing['4'],
  },
  statItem: {
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing['4'],
    borderBottomWidth: 1,
  },
  contentSection: {
    padding: spacing['4'],
  },
  heatmapMockup: {
    padding: spacing['4'],
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  heatmapRow: {
    flexDirection: 'row',
  },
  activityItem: {
    flexDirection: 'row',
    padding: spacing['4'],
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing['3'],
    alignItems: 'center',
  },
});

export default ProfileSkeleton;
