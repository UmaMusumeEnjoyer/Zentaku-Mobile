/**
 * RankingCard — Single ranking badge
 * Mirrors web RankingCard.tsx
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Ranking } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

interface RankingCardProps {
  ranking: Ranking;
}

const RankingCard: React.FC<RankingCardProps> = ({ ranking }) => {
  const { theme } = useTheme();
  const { t } = useTranslation('RankingSection');
  const s = makeStyles(theme);

  const getIcon = () => {
    switch (ranking.type) {
      case 'RATED':
        return '⭐';
      case 'POPULAR':
        return '❤️';
      default:
        return '●';
    }
  };

  const getContextText = () => {
    const translatedSeason = ranking.season
      ? t(`ranking.season.${ranking.season.toLowerCase()}`)
      : '';

    return t('ranking.format', {
      rank: ranking.rank,
      context: ranking.context,
      season: translatedSeason,
      year: ranking.year,
    });
  };

  return (
    <View style={s.card}>
      <Text style={s.icon}>{getIcon()}</Text>
      <Text style={s.text}>{getContextText()}</Text>
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['3'],
      borderRadius: radius.md,
      paddingVertical: spacing['3'],
      paddingHorizontal: spacing['4'],
      backgroundColor: theme.bgPanel,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    icon: {
      fontSize: typography.fontSize.lg,
    },
    text: {
      flex: 1,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      textTransform: 'capitalize',
      color: theme.textPrimary,
    },
  });

export default RankingCard;
