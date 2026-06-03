import React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import Skeleton from '../../components/Skeleton/Skeleton';

const { width, height } = Dimensions.get('window');

const MangaReaderSkeleton: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Mockup */}
      <View style={styles.header}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <View style={styles.headerTitle}>
          <Skeleton width={150} height={16} borderRadius={4} style={{ marginBottom: 4 }} />
          <Skeleton width={100} height={12} borderRadius={4} />
        </View>
        <Skeleton width={32} height={32} borderRadius={16} />
      </View>

      {/* Manga Panels Mockup */}
      <View style={styles.panelsContainer}>
        {/* Panel 1 */}
        <View style={styles.panelRow}>
          <Skeleton width="100%" height={200} borderRadius={2} />
        </View>
        {/* Panel 2 & 3 */}
        <View style={[styles.panelRow, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Skeleton width="48%" height={150} borderRadius={2} />
          <Skeleton width="48%" height={150} borderRadius={2} />
        </View>
        {/* Panel 4 */}
        <View style={styles.panelRow}>
          <Skeleton width="100%" height={250} borderRadius={2} />
        </View>
      </View>

      {/* Bottom Controls Mockup */}
      <View style={styles.bottomControls}>
        <Skeleton width="100%" height={4} borderRadius={2} style={{ marginBottom: 16 }} />
        <View style={styles.bottomRow}>
          <Skeleton width={32} height={32} borderRadius={16} />
          <Skeleton width={80} height={16} borderRadius={4} />
          <Skeleton width={32} height={32} borderRadius={16} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Typically reader is dark
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  panelsContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: '#111',
  },
  panelRow: {
    marginBottom: 8,
  },
  bottomControls: {
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default MangaReaderSkeleton;
