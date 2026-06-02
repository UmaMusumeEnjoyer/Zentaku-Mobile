import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Skeleton from '../../../components/Skeleton/Skeleton';
import { spacing, radius } from '../../../styles/theme';
import { useTheme } from '../../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AnimeDetailSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bgApp }]} showsVerticalScrollIndicator={false}>
      {/* Banner */}
      <Skeleton width="100%" height={200} borderRadius={0} />

      <View style={styles.contentWrapper}>
        {/* Poster & Header Info */}
        <View style={styles.headerContainer}>
          <Skeleton
            width={120}
            height={170}
            borderRadius={radius.lg}
            style={styles.poster}
          />
          <View style={styles.headerInfo}>
            {/* Title */}
            <Skeleton width="90%" height={24} borderRadius={6} style={styles.marginBottom} />
            <Skeleton width="70%" height={24} borderRadius={6} style={styles.marginBottom} />
            {/* Romanji/English */}
            <Skeleton width="50%" height={14} borderRadius={4} style={styles.marginBottom} />
            <Skeleton width="60%" height={14} borderRadius={4} style={styles.marginBottom} />
            
            {/* Actions Buttons */}
            <View style={styles.actionsRow}>
              <Skeleton width={100} height={36} borderRadius={radius.md} />
              <Skeleton width={36} height={36} borderRadius={radius.md} style={styles.marginLeft} />
              <Skeleton width={36} height={36} borderRadius={radius.md} style={styles.marginLeft} />
            </View>
          </View>
        </View>

        {/* Synopsis */}
        <View style={styles.section}>
          <Skeleton width="100%" height={14} borderRadius={4} style={styles.marginBottom} />
          <Skeleton width="100%" height={14} borderRadius={4} style={styles.marginBottom} />
          <Skeleton width="80%" height={14} borderRadius={4} />
        </View>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} width={60 + Math.random() * 40} height={28} borderRadius={14} style={styles.tag} />
          ))}
        </View>

        {/* Information Grid */}
        <View style={[styles.infoGrid, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={styles.infoItem}>
              <Skeleton width={60} height={12} borderRadius={4} style={styles.marginBottom} />
              <Skeleton width={80} height={14} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    padding: spacing['4'],
    marginTop: -80, // overlap with banner
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: spacing['6'],
  },
  poster: {
    marginRight: spacing['4'],
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 80, // Align text below banner overlap
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing['3'],
  },
  section: {
    marginBottom: spacing['6'],
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing['6'],
  },
  tag: {
    marginRight: spacing['2'],
    marginBottom: spacing['2'],
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: radius.lg,
    padding: spacing['4'],
    borderWidth: 1,
  },
  infoItem: {
    width: '50%',
    marginBottom: spacing['4'],
  },
  marginBottom: {
    marginBottom: spacing['2'],
  },
  marginLeft: {
    marginLeft: spacing['2'],
  },
});

export default AnimeDetailSkeleton;
