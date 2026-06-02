import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ChevronLeft, ChevronRight, Settings } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { spacing, typography } from '../../../styles/theme';

interface NovelControlsProps {
  title: string;
  chapterTitle: string;
  onNextChapter: () => void;
  onPrevChapter: () => void;
  onOpenSettings: () => void;
}

const NovelControls: React.FC<NovelControlsProps> = ({
  title,
  chapterTitle,
  onNextChapter,
  onPrevChapter,
  onOpenSettings,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.novelTitle} numberOfLines={1}>{title}</Text>
              <Text style={styles.chapterTitle} numberOfLines={1}>{chapterTitle}</Text>
            </View>
            <TouchableOpacity style={styles.iconBtn} onPress={onOpenSettings}>
              <Settings color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={{ flex: 1 }} pointerEvents="none" />

      {/* Bottom Controls */}
      <View style={[styles.bottomBar, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.bottomContent}>
            <TouchableOpacity onPress={onPrevChapter} style={styles.navBtn}>
              <ChevronLeft color="#fff" size={24} />
              <Text style={styles.navText}>Prev</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onNextChapter} style={styles.navBtn}>
              <Text style={styles.navText}>Next</Text>
              <ChevronRight color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing['3'],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing['2'],
    height: 56,
  },
  iconBtn: {
    padding: spacing['2'],
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: spacing['2'],
  },
  novelTitle: {
    color: '#fff',
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  chapterTitle: {
    color: '#aaa',
    fontSize: typography.fontSize.xs,
  },
  bottomBar: {
    paddingTop: spacing['3'],
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['4'],
    height: 56,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['2'],
  },
  navText: {
    color: '#fff',
    fontWeight: typography.fontWeight.medium,
    marginHorizontal: spacing['1'],
  },
});

export default NovelControls;
