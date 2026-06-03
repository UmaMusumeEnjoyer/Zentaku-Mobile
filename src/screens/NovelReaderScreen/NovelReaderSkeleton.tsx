import React, { useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Skeleton from '../../components/Skeleton/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/theme';

const NovelReaderSkeleton: React.FC = () => {
  const { theme } = useTheme();

  // We can just use the default dark/light theme background for skeleton instead of reading viewSettings here
  // since skeleton is a placeholder before settings might even be fully loaded.

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bgApp }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        {/* Chapter Title Mockup */}
        <View style={{ alignItems: 'center', marginBottom: spacing['8'] }}>
          <Skeleton width="60%" height={28} borderRadius={4} />
        </View>

        {/* Paragraphs Mockup */}
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.paragraphMockup}>
            <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
            <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
            <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: spacing['2'] }} />
            <Skeleton width={Math.random() > 0.5 ? '80%' : '50%'} height={16} borderRadius={4} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing['5'],
    paddingTop: spacing['10'],
    paddingBottom: spacing['10'],
  },
  paragraphMockup: {
    marginBottom: spacing['6'],
  },
});

export default NovelReaderSkeleton;
