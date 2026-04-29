/**
 * InfoBlock & InfoListBlock — Small info cards for the sidebar
 * Mirrors web InfoComponents.tsx using shared-logic types
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { InfoBlockProps, InfoListBlockProps } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

const BRAND_COLOR = '#3DB4F2';

export const InfoBlock: React.FC<InfoBlockProps> = ({ label, value, isAiring = false }) => {
  if (value === null || value === undefined || value === '') return null;

  const { theme } = useTheme();
  const s = makeStyles(theme);

  return (
    <View style={s.block}>
      <Text style={[s.label, isAiring && s.airingText]}>{label}</Text>
      <Text style={[s.value, isAiring && s.airingText]}>{String(value)}</Text>
    </View>
  );
};

export const InfoListBlock: React.FC<InfoListBlockProps> = ({ label, items }) => {
  if (!items || items.length === 0) return null;

  const { theme } = useTheme();
  const s = makeStyles(theme);

  return (
    <View style={s.block}>
      <Text style={s.label}>{label}</Text>
      {items.map((item, index) => (
        <Text key={index} style={[s.value, s.listItem]}>
          {item}
        </Text>
      ))}
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    block: {
      width: 160,
      minWidth: 160,
      backgroundColor: theme.bgSubtle,
      padding: spacing['3'],
      borderRadius: radius.md,
    },
    label: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
      marginBottom: spacing['1'],
    },
    value: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
      textTransform: 'capitalize',
    },
    listItem: {
      marginBottom: 2,
    },
    airingText: {
      color: BRAND_COLOR,
    },
  });
