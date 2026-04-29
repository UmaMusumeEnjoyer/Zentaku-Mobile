/**
 * StatusDistribution — Legend buttons + progress bar
 * Mirrors web StatusDistribution.tsx
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StatusDistributionProps } from '@umamusumeenjoyer/shared-logic';
import { useStatusDistribution } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

const StatusDistribution: React.FC<StatusDistributionProps> = ({ distribution }) => {
  const { theme } = useTheme();
  const { sortedDistribution, totalUsers, getStatusColor } = useStatusDistribution(distribution);
  const { t } = useTranslation(['StatisticsSection', 'common']);
  const s = makeStyles(theme);

  if (!distribution || distribution.length === 0) {
    return <Text style={s.noData}>{t('StatisticsSection:status_distribution.no_data')}</Text>;
  }

  return (
    <View style={s.container}>
      {/* Legend */}
      <View style={s.legend}>
        {sortedDistribution.map(({ status, amount }) => (
          <View key={status} style={s.legendItem}>
            <View style={[s.legendButton, { backgroundColor: getStatusColor(status) }]}>
              <Text style={s.legendButtonText}>{status}</Text>
            </View>
            <Text style={s.legendUsers}>
              {t('common:users_count', { count: amount })}
            </Text>
          </View>
        ))}
      </View>

      {/* Progress Bar */}
      <View style={s.progressBar}>
        {sortedDistribution.map(({ status, amount }) => (
          <View
            key={status}
            style={[
              s.progressSegment,
              {
                flex: totalUsers > 0 ? amount / totalUsers : 0,
                backgroundColor: getStatusColor(status),
              },
            ]}
          />
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
      padding: spacing['4'],
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    noData: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.sm,
    },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing['2'],
      marginBottom: spacing['3'],
      justifyContent: 'center',
    },
    legendItem: {
      alignItems: 'center',
      minWidth: 80,
      maxWidth: 120,
    },
    legendButton: {
      width: '100%',
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['2'],
      borderRadius: radius.md,
      marginBottom: spacing['1'],
      alignItems: 'center',
    },
    legendButtonText: {
      color: '#FFFFFF',
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      textTransform: 'capitalize',
    },
    legendUsers: {
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
    },
    progressBar: {
      flexDirection: 'row',
      width: '100%',
      height: 16,
      borderRadius: radius.sm,
      overflow: 'hidden',
    },
    progressSegment: {
      height: '100%',
    },
  });

export default StatusDistribution;
