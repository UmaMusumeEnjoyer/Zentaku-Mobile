/**
 * StaffSection — List of staff cards
 * Mirrors web StaffSection.tsx
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStaffData } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import StaffCard from './StaffCard';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

interface StaffSectionProps {
  data: any[];
}

const StaffSection: React.FC<StaffSectionProps> = ({ data }) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['StaffSection', 'common']);
  const { staff } = useStaffData(data);
  const s = makeStyles(theme);

  if (!staff || staff.length === 0) {
    return <Text style={s.noInfo}>{t('common:staff.no_info')}</Text>;
  }

  return (
    <View style={s.grid}>
      {staff.map((member: any) => (
        <StaffCard key={member.id} staffMember={member} />
      ))}
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    grid: {
      gap: spacing['3'],
    },
    noInfo: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.sm,
    },
  });

export default StaffSection;
