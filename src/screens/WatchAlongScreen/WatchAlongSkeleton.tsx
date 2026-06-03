import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../styles/theme';

const WatchAlongSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bgApp }]}>
      {/* Video Player Mockup */}
      <View style={styles.videoWrapper}>
        <Skeleton width="100%" height="100%" borderRadius={0} />
      </View>

      {/* Info Row Mockup */}
      <View style={styles.infoRow}>
        <View style={styles.titleBlock}>
          <Skeleton width={200} height={20} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width={150} height={14} borderRadius={4} />
        </View>
        <View style={styles.liveBlock}>
          <Skeleton width={50} height={24} borderRadius={4} style={{ marginBottom: 4 }} />
          <Skeleton width={70} height={12} borderRadius={4} />
        </View>
      </View>

      {/* Participants Mockup */}
      <View style={styles.sidebarStrip}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={i} style={styles.sidebarItemMobile}>
            <Skeleton width={32} height={32} borderRadius={16} style={{ marginBottom: 4 }} />
            <Skeleton width={40} height={10} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* Chat Section Mockup */}
      <View style={[styles.chatContainer, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
        <View style={styles.chatHeaderRow}>
          <Skeleton width={100} height={16} borderRadius={4} />
          <Skeleton width={60} height={14} borderRadius={4} />
        </View>

        <View style={styles.chatMessages}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={i} style={styles.chatMessageRow}>
              <Skeleton width={60} height={14} borderRadius={4} style={{ marginRight: 8 }} />
              <Skeleton width={150} height={14} borderRadius={4} />
            </View>
          ))}
        </View>

        <View style={styles.chatInputRow}>
          <Skeleton width="80%" height={40} borderRadius={radius.md} style={{ marginRight: 8 }} />
          <Skeleton width={60} height={40} borderRadius={radius.md} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? spacing['4'] : 0,
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing['4'],
    alignItems: 'center',
  },
  titleBlock: {
    flex: 1,
  },
  liveBlock: {
    alignItems: 'flex-end',
    marginLeft: spacing['4'],
  },
  sidebarStrip: {
    flexDirection: 'row',
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['4'],
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sidebarItemMobile: {
    alignItems: 'center',
    marginRight: spacing['4'],
  },
  chatContainer: {
    flex: 1,
    padding: spacing['4'],
    borderTopWidth: 1,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['4'],
  },
  chatMessages: {
    flex: 1,
  },
  chatMessageRow: {
    flexDirection: 'row',
    marginBottom: spacing['3'],
  },
  chatInputRow: {
    flexDirection: 'row',
    marginTop: spacing['2'],
  },
});

export default WatchAlongSkeleton;
