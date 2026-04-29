/**
 * RankingsSection — List of ranking cards
 * Mirrors web RankingsSection.tsx
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRankingFilter } from '@umamusumeenjoyer/shared-logic';
import type { Ranking } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import RankingCard from './RankingCard';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

interface RankingsSectionProps {
  rankings: Ranking[] | undefined;
}

const RankingsSection: React.FC<RankingsSectionProps> = ({ rankings }) => {
  const { theme } = useTheme();
  const { t } = useTranslation('RankingSection');
  const filteredRankings = useRankingFilter(rankings);
  const s = makeStyles(theme);

  if (!filteredRankings || filteredRankings.length === 0) {
    return (
      <View style={s.noRankingsBox}>
        <Text style={s.noRankingsText}>{t('ranking.no_available')}</Text>
      </View>
    );
  }

  return (
    <View style={s.grid}>
      {filteredRankings.map((rank) => (
        <RankingCard key={rank.id} ranking={rank} />
      ))}
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    grid: {
      gap: spacing['3'],
    },
    noRankingsBox: {
      padding: spacing['4'],
      alignItems: 'center',
      borderRadius: radius.md,
      backgroundColor: theme.bgPanel,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    noRankingsText: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.sm,
    },
  });

export default RankingsSection;
