/**
 * InfoSidebar — Horizontal scrolling info cards
 * Mirrors web InfoSidebar.tsx (mobile responsive layout)
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { InfoSidebarProps } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

const InfoSidebar: React.FC<InfoSidebarProps> = ({ anime }) => {
  const { t, i18n } = useTranslation(['AnimeDetail', 'common']);
  const { theme } = useTheme();
  const s = makeStyles(theme);

  const formatDateByLanguage = (dateString?: string) => {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);
    const currentLang = i18n.language;

    if (currentLang === 'jp') {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const renderField = (label: string, value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === '') return null;
    return (
      <View style={s.field}>
        <Text style={s.label}>{label}</Text>
        <Text style={s.value}>{value}</Text>
      </View>
    );
  };

  const renderVerticalField = (label: string, value: string | null | undefined) => {
    if (!value) return null;
    return (
      <View style={s.fieldFull}>
        <Text style={s.label}>{label}</Text>
        <Text style={s.value}>{value}</Text>
      </View>
    );
  };

  const renderListField = (label: string, items: string[] | undefined) => {
    if (!items || items.length === 0) return null;
    return (
      <View style={s.fieldFull}>
        <Text style={s.label}>{label}</Text>
        <Text style={s.value}>{items.join(', ')}</Text>
      </View>
    );
  };

  return (
    <View style={s.container}>
      {/* Card 1: Format, Duration, Episodes, Status */}
      <View style={s.card}>
        <View style={s.gridRow}>
          {renderField(t('AnimeDetail:sidebar.format', { defaultValue: 'FORMAT' }), anime.airing_format)}
          {renderField(t('AnimeDetail:sidebar.episode_duration', { defaultValue: 'DURATION' }), anime.duration ? `${anime.duration} min` : null)}
        </View>
        <View style={s.gridRow}>
          {renderField(t('AnimeDetail:sidebar.episodes', { defaultValue: 'EPISODES' }), anime.airing_episodes ? `${anime.airing_episodes} episodes` : null)}
          {renderField(t('AnimeDetail:sidebar.status', { defaultValue: 'STATUS' }), anime.airing_status?.replace(/_/g, ' '))}
        </View>
      </View>

      {/* Card 2: Start Date, End Date, Season, Source */}
      <View style={s.card}>
        <View style={s.gridRow}>
          {renderField(t('AnimeDetail:sidebar.start_date', { defaultValue: 'START DATE' }), formatDateByLanguage(anime.starting_time))}
          {renderField(t('AnimeDetail:sidebar.end_date', { defaultValue: 'END DATE' }), formatDateByLanguage(anime.ending_time))}
        </View>
        <View style={s.gridRow}>
          {renderField(t('AnimeDetail:sidebar.season', { defaultValue: 'SEASON' }), anime.season && anime.season_year ? `${anime.season} ${anime.season_year}` : null)}
          {renderField(t('AnimeDetail:sidebar.source', { defaultValue: 'SOURCE' }), anime.source)}
        </View>
      </View>

      {/* Card 3: Titles */}
      <View style={s.card}>
        {renderVerticalField('ROMAJI', (anime as any).name_romaji || (anime as any).name)}
        {renderVerticalField('ENGLISH', anime.name_english)}
        {renderVerticalField('NATIVE', anime.name_native)}
      </View>

      {/* Card 4: Scores & Popularity */}
      {(anime.average_score || anime.mean_score || anime.popularity || anime.favourites) && (
        <View style={s.card}>
          <View style={s.gridRow}>
            {renderField(t('AnimeDetail:sidebar.average_score', { defaultValue: 'AVERAGE SCORE' }), anime.average_score ? `${anime.average_score}%` : null)}
            {renderField(t('AnimeDetail:sidebar.mean_score', { defaultValue: 'MEAN SCORE' }), anime.mean_score ? `${anime.mean_score}%` : null)}
          </View>
          <View style={s.gridRow}>
            {renderField(t('AnimeDetail:sidebar.popularity', { defaultValue: 'POPULARITY' }), anime.popularity?.toLocaleString())}
            {renderField(t('AnimeDetail:sidebar.favorites', { defaultValue: 'FAVORITES' }), anime.favourites?.toLocaleString())}
          </View>
        </View>
      )}

      {/* Card 5: Studios & Producers */}
      {((anime.studios && anime.studios.length > 0) || (anime.producers && anime.producers.length > 0)) && (
        <View style={s.card}>
          {renderListField(t('AnimeDetail:sidebar.studios', { defaultValue: 'STUDIOS' }), anime.studios)}
          {renderListField(t('AnimeDetail:sidebar.producers', { defaultValue: 'PRODUCERS' }), anime.producers)}
        </View>
      )}
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: {
      gap: spacing['3'],
      paddingBottom: spacing['4'],
    },
    card: {
      backgroundColor: theme.bgPanel,
      borderRadius: radius.md,
      padding: spacing['4'],
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      gap: spacing['4'],
    },
    gridRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    field: {
      flex: 1,
      paddingRight: spacing['2'],
    },
    fieldFull: {
      width: '100%',
    },
    label: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.medium,
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    value: {
      fontSize: typography.fontSize.sm,
      color: theme.textPrimary,
      fontWeight: typography.fontWeight.regular,
      textTransform: 'capitalize',
    },
  });

export default InfoSidebar;
