import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from '../../components/Skeleton/Skeleton';
import { spacing, radius } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

const ScheduleSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={styles.eventCard}>
          <View style={styles.timeContainer}>
            <Skeleton width={36} height={16} borderRadius={4} />
          </View>
          
          <View style={[styles.eventContent, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
            <Skeleton width={70} height={100} borderRadius={0} />
            <View style={styles.eventInfo}>
              <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              <Skeleton width="60%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              
              <View style={styles.eventMeta}>
                <Skeleton width={40} height={16} borderRadius={4} style={{ marginRight: spacing['2'] }} />
                <Skeleton width={50} height={16} borderRadius={4} />
              </View>
            </View>
            <View style={styles.playBtn}>
              <Skeleton width={24} height={24} borderRadius={12} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing['4'],
    paddingBottom: 100,
  },
  eventCard: {
    flexDirection: 'row',
    marginBottom: spacing['4'],
    alignItems: 'flex-start',
  },
  timeContainer: {
    width: 50,
    alignItems: 'center',
    marginRight: spacing['3'],
    marginTop: spacing['1'],
  },
  eventContent: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  eventInfo: {
    flex: 1,
    padding: spacing['3'],
    justifyContent: 'center',
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing['1'],
  },
  playBtn: {
    padding: spacing['3'],
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScheduleSkeleton;
