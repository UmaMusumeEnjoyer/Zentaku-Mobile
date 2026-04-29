/**
 * ScoreDistribution — Vertical bar chart for score distribution
 * Mirrors web ScoreDistribution.tsx
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ScoreDistributionProps } from '@umamusumeenjoyer/shared-logic';
import { useScoreDistribution } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

const ScoreDistribution: React.FC<ScoreDistributionProps> = ({ distribution }) => {
  const { theme } = useTheme();
  const { maxAmount, getScoreColor } = useScoreDistribution(distribution);
  const { t } = useTranslation(['StatisticsSection', 'common']);
  const s = makeStyles(theme);

  if (!distribution || distribution.length === 0) {
    return <Text style={s.noData}>{t('StatisticsSection:score_distribution.no_data')}</Text>;
  }

  return (
    <View style={s.container}>
      <View style={s.chart}>
        {distribution.map(({ score, amount }) => (
          <View key={score} style={s.barItem}>
            <Text style={s.barAmount}>{amount.toLocaleString()}</Text>
            <View style={s.barElementContainer}>
              <View
                style={[
                  s.barElement,
                  {
                    height: maxAmount > 0 ? `${(amount / maxAmount) * 100}%` : '0%',
                    backgroundColor: getScoreColor(score),
                  },
                ]}
              />
            </View>
            <Text style={s.barScore}>{score}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.bgPanel,
      borderRadius: radius.md,
      padding: spacing['3'],
      height: 180,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    noData: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.sm,
    },
    chart: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: '100%',
      width: '100%',
    },
    barItem: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
    },
    barAmount: {
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
      marginBottom: 3,
    },
    barElementContainer: {
      width: '60%',
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: 3,
    },
    barElement: {
      width: '100%',
      borderRadius: radius.sm,
    },
    barScore: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },
  });

export default ScoreDistribution;
