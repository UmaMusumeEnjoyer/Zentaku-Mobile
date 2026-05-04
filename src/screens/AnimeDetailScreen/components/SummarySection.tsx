/**
 * SummarySection — Cover image, title, description, add-to-list button
 * Mirrors web SummarySection.tsx (simplified: no EditorModal, no NavBar)
 */
import React, { useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { SummarySectionProps } from '@umamusumeenjoyer/shared-logic';
import { useSummarySection } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';
import AnimeModal from './AnimeModal';

const BRAND_COLOR = '#3DB4F2';
const BRAND_COLOR_LIGHT = '#6bccf7';

const SummarySection: React.FC<SummarySectionProps> = ({ anime, hasBanner }) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['AnimeModal', 'common']);

  const [isExpanded, setIsExpanded] = useState(false);

  const {
    isModalOpen,
    currentStatusData,
    watchStatus,
    isLoadingStatus,
    isFollowing,
    handleBtnClick,
    handleCloseModal,
    handleSave,
    handleDelete,
  } = useSummarySection(anime);

  const buttonLabel = useMemo(() => {
    if (isLoadingStatus) return 'Loading...';
    if (isFollowing && watchStatus) {
      return t(`AnimeModal:status_options.${watchStatus}`);
    }
    return t('AnimeModal:status_options.default') || 'Add to List';
  }, [isLoadingStatus, isFollowing, watchStatus, t]);

  const s = makeStyles(theme);

  // Strip HTML tags for mobile (dangerouslySetInnerHTML not available in RN)
  const plainDescription = anime.desc
    ? anime.desc.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    : '';

  return (
    <View style={[s.container, !hasBanner && s.noBanner]}>
      {/* Left: Cover image + Button */}
      <View style={s.left}>
        <Image
          source={{ uri: anime.cover_image }}
          style={s.coverImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={s.addButton}
          onPress={handleBtnClick}
          activeOpacity={0.75}
        >
          <Text style={s.addButtonText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Right: Title + Description */}
      <View style={[s.right, !hasBanner && s.rightNoBanner]}>
        <Text style={s.title} numberOfLines={3}>
          {anime.name_romaji}
        </Text>

        {plainDescription ? (
          <>
            <Text
              style={s.description}
              numberOfLines={isExpanded ? undefined : 4}
            >
              {plainDescription}
            </Text>
            <TouchableOpacity
              onPress={() => setIsExpanded(!isExpanded)}
              activeOpacity={0.7}
            >
              <Text style={s.seeMoreBtn}>
                {isExpanded
                  ? t('common:buttons.show_less')
                  : t('common:buttons.read_more')}
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>

      {/* AnimeModal - Opened when button clicked */}
      <AnimeModal
        visible={isModalOpen}
        anime={anime}
        initialData={currentStatusData}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: spacing['3'],
      marginTop: -60,
      paddingBottom: spacing['3'],
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      zIndex: 10,
    },
    noBanner: {
      marginTop: spacing['4'],
    },
    left: {
      width: 130,
    },
    coverImage: {
      width: '100%',
      height: 185,
      borderRadius: radius.md,
      marginBottom: spacing['2'],
    },
    addButton: {
      width: '100%',
      backgroundColor: BRAND_COLOR,
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['3'],
      borderRadius: radius.md,
      alignItems: 'center',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.bold,
    },
    right: {
      flex: 1,
      paddingTop: 70,
      minWidth: 0,
    },
    rightNoBanner: {
      paddingTop: 0,
    },
    title: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.xl,
      fontWeight: '800',
      marginBottom: spacing['2'],
      lineHeight: typography.lineHeight.relaxed,
    },
    description: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.normal,
    },
    seeMoreBtn: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      marginTop: spacing['2'],
      opacity: 0.8,
    },
  });

export default SummarySection;
