/**
 * src/components/AnimeCard/AnimeCard.tsx
 *
 * Clone webFE AnimeCard — adapted cho React Native.
 * Hiển thị poster, title, episode info và progress.
 */
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  getAnimeTitle,
  getAnimeLinkId,
  getAnimeDisplayInfo,
  type AnimeData,
} from '@umamusumeenjoyer/shared-logic';

import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface AnimeCardProps {
  anime: AnimeData;
  style?: object;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, style }) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  // Ép kiểu để tránh lỗi — i18n.language có thể là 'en' | 'jp'
  const lang = (i18n.language === 'jp' ? 'jp' : 'en') as 'en' | 'jp';

  const title = getAnimeTitle(anime, lang);
  const linkId = getAnimeLinkId(anime);
  const displayInfo = getAnimeDisplayInfo(anime);

  const s = makeStyles(theme);

  // Progress ratio (chỉ hiển thị nếu có episode_progress)
  const progressRatio =
    anime.episode_progress != null && anime.episodes && anime.episodes > 0
      ? Math.min(anime.episode_progress / anime.episodes, 1)
      : null;

  return (
    <TouchableOpacity style={[s.card, style]} activeOpacity={0.85}>
      {/* ---- Thumbnail ---- */}
      <View style={s.imageWrapper}>
        {anime.cover_image ? (
          <Image
            source={{ uri: anime.cover_image }}
            style={s.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[s.image, s.imagePlaceholder]}>
            <Text style={s.imagePlaceholderText}>?</Text>
          </View>
        )}

        {/* ---- Episode badge ---- */}
        {anime.episodes != null && (
          <View style={s.epBadge}>
            <Text style={s.epBadgeText}>{anime.episodes} EP</Text>
          </View>
        )}
      </View>

      {/* ---- Info ---- */}
      <View style={s.info}>
        <Text style={s.title} numberOfLines={2}>{title}</Text>
        {displayInfo != null && (
          <Text style={s.subtitle} numberOfLines={1}>{displayInfo}</Text>
        )}

        {/* ---- Progress bar ---- */}
        {progressRatio !== null && (
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${progressRatio * 100}%` as any }]} />
          </View>
        )}

        {/* ---- Next airing ---- */}
        {anime.next_airing_ep != null && (
          <Text style={s.nextAiring} numberOfLines={1}>
            Next EP {anime.next_airing_ep.episode}
          </Text>
        )}

        {/* ---- Current progress text ---- */}
        {anime.episode_progress != null && (
          <Text style={s.progressText}>
            {anime.episode_progress}/{anime.episodes ?? '?'} EP
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ----------------------------------------------------------------
// Styles
// ----------------------------------------------------------------

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    card: {
      width: 130,
      marginRight: spacing['3'],
      borderRadius: radius.lg,
      backgroundColor: theme.bgPanel,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    imageWrapper: { position: 'relative' },
    image: { width: '100%', height: 180 },
    imagePlaceholder: {
      backgroundColor: theme.bgHover,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imagePlaceholderText: {
      fontSize: typography.fontSize['3xl'],
      color: theme.textDisabled,
    },
    epBadge: {
      position: 'absolute',
      bottom: spacing['1'],
      right: spacing['1'],
      backgroundColor: theme.primary + 'DD',
      borderRadius: radius.sm,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    epBadgeText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: theme.textOnPrimary,
    },
    info: { padding: spacing['2'] },
    title: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
      lineHeight: typography.lineHeight.tight,
      marginBottom: spacing['1'],
    },
    subtitle: {
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
      marginBottom: spacing['1'],
    },
    progressBg: {
      height: 3,
      backgroundColor: theme.borderSubtle,
      borderRadius: radius.full,
      marginVertical: spacing['1'],
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: radius.full,
    },
    nextAiring: {
      fontSize: typography.fontSize.xs,
      color: theme.statusWarning ?? theme.primary,
    },
    progressText: {
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
    },
  });

export default AnimeCard;
