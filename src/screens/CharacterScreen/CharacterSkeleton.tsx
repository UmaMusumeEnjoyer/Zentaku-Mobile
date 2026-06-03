import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, ScrollView } from 'react-native';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../styles/theme';
import AnimeCardSkeleton from '../../components/Skeleton/AnimeCardSkeleton';

const CharacterSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgApp }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Character Image */}
          <View style={styles.imageContainer}>
            <Skeleton width={200} height={280} borderRadius={radius.md} />
          </View>

          {/* Character Info */}
          <View style={styles.infoContainer}>
            <Skeleton width={180} height={32} borderRadius={4} style={{ marginBottom: spacing['1'] }} />
            <Skeleton width={120} height={20} borderRadius={4} style={{ marginBottom: spacing['5'] }} />

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              <Skeleton width="95%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              <Skeleton width="70%" height={16} borderRadius={4} />
            </View>
          </View>

          {/* Media Appearances Section */}
          <View style={[styles.mediaSection, { borderTopColor: theme.borderSubtle }]}>
            <Skeleton width={150} height={24} borderRadius={4} style={{ marginBottom: spacing['4'] }} />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mediaScrollContent}
              scrollEnabled={false}
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <AnimeCardSkeleton key={i} />
              ))}
            </ScrollView>
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
    paddingTop: Platform.OS === 'android' ? 80 : 60,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: spacing['5'],
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: spacing['5'],
  },
  descriptionContainer: {
    width: '100%',
  },
  mediaSection: {
    marginTop: spacing['6'],
    borderTopWidth: 1,
    paddingTop: spacing['5'],
  },
  mediaScrollContent: {
    paddingRight: spacing['4'],
  },
});

export default CharacterSkeleton;
