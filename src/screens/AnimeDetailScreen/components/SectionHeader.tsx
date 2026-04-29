/**
 * SectionHeader — Reusable section title with bottom border
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  const { theme } = useTheme();
  const s = makeStyles(theme);

  return (
    <View style={s.container}>
      <Text style={s.title}>{title}</Text>
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      paddingBottom: spacing['2'],
      marginBottom: spacing['3'],
    },
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },
  });

export default SectionHeader;
