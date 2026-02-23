/**
 * src/components/AnimeSection/AnimeSection.tsx
 *
 * Clone webFE AnimeSection — adapted cho React Native.
 * Hiển thị một tiêu đề section + danh sách AnimeCard nằm ngang.
 */
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { AnimeSectionProps, AnimeData } from '@umamusumeenjoyer/shared-logic';

import AnimeCard from '../AnimeCard/AnimeCard';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';

const INITIAL_DISPLAY_COUNT = 7;

interface NativeAnimeSectionProps {
  title: string;
  animeList: AnimeData[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const AnimeSection: React.FC<NativeAnimeSectionProps> = ({
  title,
  animeList,
  isLoading,
  emptyMessage,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['AnimeSection', 'mobile']);
  const [showAll, setShowAll] = useState(false);

  const s = makeStyles(theme);

  const displayedList = showAll ? animeList : animeList.slice(0, INITIAL_DISPLAY_COUNT);

  // ---- Loading skeleton ----
  if (isLoading) {
    return (
      <View style={s.container}>
        <View style={s.skeletonHeader} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.scrollRow}>
          {[...Array(INITIAL_DISPLAY_COUNT)].map((_, i) => (
            <View key={i} style={s.skeletonCard} />
          ))}
        </ScrollView>
      </View>
    );
  }

  // ---- Empty ----
  if (!animeList || animeList.length === 0) {
    return (
      <View style={s.container}>
        <Text style={s.sectionTitle}>{title}</Text>
        <Text style={s.emptyText}>{emptyMessage ?? t('AnimeSection:empty')}</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* ---- Header ---- */}
      <View style={s.headerRow}>
        <View style={s.titleAccent} />
        <Text style={s.sectionTitle}>{title}</Text>
        {animeList.length > INITIAL_DISPLAY_COUNT && (
          <TouchableOpacity onPress={() => setShowAll((p) => !p)} style={s.showMoreBtn}>
            <Text style={[s.showMoreText, { color: theme.primary }]}>
              {showAll ? t('AnimeSection:show_less') : t('AnimeSection:show_more')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ---- Cards ---- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {displayedList.map((anime) => (
          <AnimeCard key={anime.id ?? anime.name_romaji} anime={anime} />
        ))}
      </ScrollView>
    </View>
  );
};

// ----------------------------------------------------------------
// Styles
// ----------------------------------------------------------------

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: { marginBottom: spacing['5'] },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing['3'],
      paddingHorizontal: spacing['4'],
    },
    titleAccent: {
      width: 4,
      height: 18,
      backgroundColor: theme.primary,
      borderRadius: 2,
      marginRight: spacing['2'],
    },
    sectionTitle: {
      flex: 1,
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },
    showMoreBtn: { paddingLeft: spacing['3'] },
    showMoreText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
    scrollRow: {},
    scrollContent: { paddingHorizontal: spacing['4'] },
    emptyText: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
      paddingHorizontal: spacing['4'],
      paddingVertical: spacing['2'],
    },
    skeletonHeader: {
      width: 160,
      height: 20,
      backgroundColor: theme.bgHover,
      borderRadius: 6,
      marginBottom: spacing['3'],
      marginHorizontal: spacing['4'],
    },
    skeletonCard: {
      width: 130,
      height: 220,
      backgroundColor: theme.bgHover,
      borderRadius: 8,
      marginRight: spacing['3'],
      opacity: 0.6,
    },
  });

export default AnimeSection;
