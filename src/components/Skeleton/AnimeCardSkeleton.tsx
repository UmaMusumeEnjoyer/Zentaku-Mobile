import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Skeleton from './Skeleton';
import { spacing, radius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

interface AnimeCardSkeletonProps {
  style?: ViewStyle;
}

const AnimeCardSkeleton: React.FC<AnimeCardSkeletonProps> = ({ style }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }, style]}>
      {/* Thumbnail */}
      <Skeleton width="100%" height={180} borderRadius={0} />
      
      {/* Info section */}
      <View style={styles.info}>
        {/* Title */}
        <Skeleton width="85%" height={14} borderRadius={4} style={styles.titleLine} />
        <Skeleton width="60%" height={14} borderRadius={4} style={styles.titleLine} />
        
        {/* Subtitle/Metadata */}
        <Skeleton width="40%" height={10} borderRadius={2} style={styles.subtitleLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 130,
    marginRight: spacing['3'],
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  info: {
    padding: spacing['2'],
  },
  titleLine: {
    marginBottom: 4,
  },
  subtitleLine: {
    marginTop: 4,
  },
});

export default AnimeCardSkeleton;
