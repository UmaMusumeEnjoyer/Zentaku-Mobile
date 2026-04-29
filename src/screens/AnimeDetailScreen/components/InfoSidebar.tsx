/**
 * InfoSidebar — Horizontal scrolling info cards
 * Mirrors web InfoSidebar.tsx (mobile responsive layout)
 */
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import type { InfoSidebarProps } from '@umamusumeenjoyer/shared-logic';
import { useInfoSidebar } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { InfoBlock, InfoListBlock } from './InfoComponents';
import { spacing } from '../../../styles/theme';

const InfoSidebar: React.FC<InfoSidebarProps> = ({ anime }) => {
  const { airingString } = useInfoSidebar(anime);
  const { t, i18n } = useTranslation(['AnimeDetail', 'common']);

  const formatDateByLanguage = (dateString?: string) => {
    if (!dateString) return t('info.not_available');

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
        month: 'long',
        day: 'numeric',
      });
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
    >
      <InfoBlock
        label={t('AnimeDetail:sidebar.airing')}
        value={airingString}
        isAiring={true}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.format')}
        value={anime.airing_format}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.episodes')}
        value={anime.airing_episodes}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.episode_duration')}
        value={anime.duration ? `${anime.duration} ${t('common:time.mins')}` : null}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.status')}
        value={anime.airing_status?.replace(/_/g, ' ')}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.start_date')}
        value={formatDateByLanguage(anime.starting_time)}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.end_date')}
        value={formatDateByLanguage(anime.ending_time)}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.season')}
        value={anime.season && anime.season_year ? `${anime.season} ${anime.season_year}` : null}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.average_score')}
        value={anime.average_score ? `${anime.average_score}%` : null}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.mean_score')}
        value={anime.mean_score ? `${anime.mean_score}%` : null}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.popularity')}
        value={anime.popularity?.toLocaleString()}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.favorites')}
        value={anime.favourites?.toLocaleString()}
      />
      <InfoListBlock
        label={t('AnimeDetail:sidebar.studios')}
        items={anime.studios}
      />
      <InfoListBlock
        label={t('AnimeDetail:sidebar.producers')}
        items={anime.producers}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.source')}
        value={anime.source}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.native_title')}
        value={anime.name_native}
      />
      <InfoBlock
        label={t('AnimeDetail:sidebar.english_title')}
        value={anime.name_english}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    gap: spacing['3'],
    paddingVertical: spacing['2'],
  },
});

export default InfoSidebar;
