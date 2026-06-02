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

  const formatDateByLanguage = (dateObj: any, oldDateString?: string) => {
    if (dateObj?.year && dateObj?.month && dateObj?.day) {
      const date = new Date(dateObj.year, dateObj.month - 1, dateObj.day);
      const currentLang = i18n.language;
      if (currentLang === 'jp') {
        return `${dateObj.year}年${dateObj.month}月${dateObj.day}日`;
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    }
    
    if (!oldDateString) return 'Unknown';

    const date = new Date(oldDateString);
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

  const format = (anime as any).format || (anime as any).airing_format;
  const duration = (anime as any).duration;
  const episodes = (anime as any).episodes || (anime as any).airing_episodes;
  const status = (anime as any).status || (anime as any).airing_status;
  const season = (anime as any).season;
  const seasonYear = (anime as any).seasonYear || (anime as any).season_year;
  const source = (anime as any).source;
  const averageScore = (anime as any).averageScore || (anime as any).average_score;
  const meanScore = (anime as any).meanScore || (anime as any).mean_score;
  const popularity = (anime as any).popularity;
  const favourites = (anime as any).favourites;
  const studios = (anime as any).studios?.nodes?.map((s: any) => s.name) || (anime as any).studios;

  return (
    <View style={s.container}>
      {/* Card 1: Format, Duration, Episodes, Status */}
      <View style={s.card}>
        <View style={s.gridRow}>
          {renderField(t('AnimeDetail:sidebar.format', { defaultValue: 'FORMAT' }), format)}
          {renderField(t('AnimeDetail:sidebar.episode_duration', { defaultValue: 'DURATION' }), duration ? `${duration} min` : null)}
        </View>
        <View style={s.gridRow}>
          {renderField(t('AnimeDetail:sidebar.episodes', { defaultValue: 'EPISODES' }), episodes ? `${episodes} episodes` : null)}
          {renderField(t('AnimeDetail:sidebar.status', { defaultValue: 'STATUS' }), status?.replace(/_/g, ' '))}
        </View>
      </View>

      {/* Card 2: Start Date, End Date, Season, Source */}
      <View style={s.card}>
        <View style={s.gridRow}>
          {renderField(t('AnimeDetail:sidebar.start_date', { defaultValue: 'START DATE' }), formatDateByLanguage((anime as any).startDate, (anime as any).starting_time))}
          {renderField(t('AnimeDetail:sidebar.end_date', { defaultValue: 'END DATE' }), formatDateByLanguage((anime as any).endDate, (anime as any).ending_time))}
        </View>
        <View style={s.gridRow}>
          {renderField(t('AnimeDetail:sidebar.season', { defaultValue: 'SEASON' }), season && seasonYear ? `${season} ${seasonYear}` : null)}
          {renderField(t('AnimeDetail:sidebar.source', { defaultValue: 'SOURCE' }), source)}
        </View>
      </View>

      {/* Card 3: Titles */}
      <View style={s.card}>
        {renderVerticalField('ROMAJI', (anime as any).title?.romaji || (anime as any).name_romaji || (anime as any).name)}
        {renderVerticalField('ENGLISH', (anime as any).title?.english || (anime as any).name_english)}
        {renderVerticalField('NATIVE', (anime as any).title?.native || (anime as any).name_native)}
      </View>

      {/* Card 4: Scores & Popularity */}
      {(averageScore || meanScore || popularity || favourites) && (
        <View style={s.card}>
          <View style={s.gridRow}>
            {renderField(t('AnimeDetail:sidebar.average_score', { defaultValue: 'AVERAGE SCORE' }), averageScore ? `${averageScore}%` : null)}
            {renderField(t('AnimeDetail:sidebar.mean_score', { defaultValue: 'MEAN SCORE' }), meanScore ? `${meanScore}%` : null)}
          </View>
          <View style={s.gridRow}>
            {renderField(t('AnimeDetail:sidebar.popularity', { defaultValue: 'POPULARITY' }), popularity?.toLocaleString())}
            {renderField(t('AnimeDetail:sidebar.favorites', { defaultValue: 'FAVORITES' }), favourites?.toLocaleString())}
          </View>
        </View>
      )}

      {/* Card 5: Studios & Producers */}
      {studios && studios.length > 0 && (
        <View style={s.card}>
          {renderListField(t('AnimeDetail:sidebar.studios', { defaultValue: 'STUDIOS' }), studios)}
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
