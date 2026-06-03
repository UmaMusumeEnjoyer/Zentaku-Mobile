import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, ScrollView } from 'react-native';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { spacing, radius } from '../../styles/theme';

const StaffSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bgApp }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {/* Staff Image */}
          <View style={styles.imageContainer}>
            <Skeleton width={180} height={250} borderRadius={radius.md} />
          </View>

          {/* Staff Info */}
          <View style={styles.infoContainer}>
            <Skeleton width={160} height={28} borderRadius={4} style={{ marginBottom: spacing['1'] }} />
            <Skeleton width={100} height={18} borderRadius={4} style={{ marginBottom: spacing['4'] }} />

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <View key={i} style={styles.infoItem}>
                  <Skeleton width={50} height={16} borderRadius={4} style={{ marginRight: spacing['1'] }} />
                  <Skeleton width={80} height={16} borderRadius={4} />
                </View>
              ))}
            </View>

            {/* Description */}
            <View style={styles.descriptionContainer}>
              <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              <Skeleton width="90%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
              <Skeleton width="60%" height={16} borderRadius={4} />
            </View>
          </View>

          {/* Roles Section */}
          <View style={styles.rolesSection}>
            <View style={styles.yearGroup}>
              <Skeleton width={80} height={20} borderRadius={4} style={{ marginBottom: spacing['4'] }} />
              <View style={styles.rolesGrid}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <View key={i} style={[styles.roleCard, { backgroundColor: theme.bgPanel, borderColor: theme.borderSubtle }]}>
                    <Skeleton width={52} height="100%" borderRadius={0} />
                    <View style={styles.roleDetails}>
                      <Skeleton width="80%" height={14} borderRadius={4} style={{ marginBottom: 4 }} />
                      <Skeleton width="40%" height={12} borderRadius={4} />
                    </View>
                  </View>
                ))}
              </View>
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
  infoGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing['4'],
  },
  infoItem: {
    width: '50%',
    flexDirection: 'row',
    marginBottom: spacing['2'],
    paddingRight: spacing['2'],
  },
  descriptionContainer: {
    width: '100%',
  },
  rolesSection: {
    marginTop: spacing['6'],
  },
  yearGroup: {
    marginBottom: spacing['6'],
  },
  rolesGrid: {
    gap: spacing['3'],
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    borderRadius: radius.md,
    height: 72,
    overflow: 'hidden',
    paddingRight: spacing['3'],
    borderWidth: 1,
  },
  roleDetails: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default StaffSkeleton;
