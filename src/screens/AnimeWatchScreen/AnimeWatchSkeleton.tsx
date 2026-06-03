import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, ScrollView, Dimensions } from 'react-native';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../styles/theme';

const { width } = Dimensions.get('window');
const bannerHeight = Math.min(Math.max(width * 0.56, 220), 320);

const AnimeWatchSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgApp }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner Mockup */}
        <View style={{ height: bannerHeight }}>
          <Skeleton width="100%" height="100%" borderRadius={0} />
        </View>

        <View style={styles.contentWrapper}>
          {/* Header Card Mockup */}
          <View style={[styles.headerCard, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
            <Skeleton width={110} height={156} borderRadius={radius.md} style={{ marginRight: spacing['3'] }} />
            <View style={styles.headerContent}>
              <Skeleton width="90%" height={24} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              <Skeleton width="60%" height={24} borderRadius={4} />

              <View style={styles.metaRow}>
                <Skeleton width={60} height={14} borderRadius={4} style={{ marginRight: spacing['2'] }} />
                <Skeleton width={60} height={14} borderRadius={4} />
              </View>

              <Skeleton width="100%" height={12} borderRadius={4} style={{ marginTop: spacing['2'], marginBottom: 4 }} />
              <Skeleton width="100%" height={12} borderRadius={4} style={{ marginBottom: 4 }} />
              <Skeleton width="80%" height={12} borderRadius={4} />
              
              <Skeleton width="100%" height={32} borderRadius={radius.md} style={{ marginTop: spacing['3'] }} />
            </View>
          </View>

          {/* Player Mockup */}
          <View style={[styles.playerCard, { borderColor: theme.borderSubtle }]}>
            <Skeleton width="100%" height="100%" borderRadius={0} />
          </View>

          {/* Controls Mockup */}
          <View style={[styles.controlsCard, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
            <View style={styles.controlsRow}>
              <Skeleton width={60} height={40} borderRadius={radius.md} />
              <Skeleton width="40%" height={40} borderRadius={radius.md} style={{ marginHorizontal: spacing['2'] }} />
              <Skeleton width={60} height={40} borderRadius={radius.md} />
            </View>

            {/* Server Chips */}
            <View style={styles.serverRow}>
              <Skeleton width={120} height={32} borderRadius={16} style={{ marginRight: spacing['2'] }} />
              <Skeleton width={100} height={32} borderRadius={16} />
            </View>

            {/* Episode Chips */}
            <View style={styles.episodeRow}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} width={68} height={36} borderRadius={radius.md} style={{ marginRight: spacing['2'] }} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['10'],
  },
  contentWrapper: {
    paddingHorizontal: spacing['4'],
    marginTop: spacing['4'],
  },
  headerCard: {
    flexDirection: 'row',
    padding: spacing['3'],
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: spacing['2'],
  },
  playerCard: {
    marginTop: spacing['4'],
    borderRadius: radius.lg,
    overflow: 'hidden',
    height: 220,
    borderWidth: 1,
  },
  controlsCard: {
    marginTop: spacing['4'],
    padding: spacing['3'],
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  serverRow: {
    flexDirection: 'row',
    marginTop: spacing['3'],
  },
  episodeRow: {
    flexDirection: 'row',
    marginTop: spacing['3'],
  },
});

export default AnimeWatchSkeleton;
