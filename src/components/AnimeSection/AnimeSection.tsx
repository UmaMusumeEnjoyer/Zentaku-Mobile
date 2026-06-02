/**
 * src/components/AnimeSection/AnimeSection.tsx
 *
 * Clone webFE AnimeSection — adapted cho React Native.
 * Hiển thị một tiêu đề section + danh sách AnimeCard nằm ngang.
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import type { AnimeData } from '@umamusumeenjoyer/shared-logic';

import AnimeCard from '../AnimeCard/AnimeCard';
import AnimeSectionSkeleton from '../Skeleton/AnimeSectionSkeleton';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';

const INITIAL_DISPLAY_COUNT = 7;

interface NativeAnimeSectionProps {
  title: string;
  animeList: AnimeData[];
  isLoading?: boolean;
  emptyMessage?: string;
  onViewAll?: () => void;
  viewAllLabel?: string;
}

const AnimeSection: React.FC<NativeAnimeSectionProps> = ({
  title,
  animeList,
  isLoading,
  emptyMessage,
  onViewAll,
  viewAllLabel,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['AnimeSection', 'mobile']);
  const [showAll, setShowAll] = useState(false);

  const s = makeStyles(theme);

  // ---- Loading skeleton ----
  if (isLoading) {
    return <AnimeSectionSkeleton count={INITIAL_DISPLAY_COUNT} />;
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
        {onViewAll ? (
          <TouchableOpacity onPress={onViewAll} style={s.showMoreBtn}>
            <Text style={[s.showMoreText, { color: theme.primary }]}>
              {viewAllLabel ?? t('common:buttons.view_all', 'View All')}
            </Text>
          </TouchableOpacity>
        ) : animeList.length > INITIAL_DISPLAY_COUNT ? (
          <TouchableOpacity onPress={() => setShowAll((p) => !p)} style={s.showMoreBtn}>
            <Text style={[s.showMoreText, { color: theme.primary }]}>
              {showAll ? t('AnimeSection:show_less') : t('AnimeSection:show_more')}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ---- Cards ---- */}
      <View style={{ height: 260, width: '100%' }}>
        <FlashList
          data={showAll ? animeList : animeList.slice(0, INITIAL_DISPLAY_COUNT)}
          keyExtractor={(item: any, index: number) => String(item?.id ?? item?.anilist_id ?? index)}
          renderItem={({ item }) => (
            <AnimeCard anime={item as AnimeData} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
        />
      </View>
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
  });

export default AnimeSection;
