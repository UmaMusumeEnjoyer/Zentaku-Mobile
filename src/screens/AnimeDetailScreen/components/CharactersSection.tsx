/**
 * CharactersSection — Grid of character cards
 * Mirrors web CharactersSection.tsx
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAnimeCharacters } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import CharacterCard from './CharacterCard';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

interface CharactersSectionProps {
  data: any[];
}

const CharactersSection: React.FC<CharactersSectionProps> = ({ data }) => {
  const { theme } = useTheme();
  const { t } = useTranslation('CharactersSection');
  const { characters } = useAnimeCharacters(data);
  const s = makeStyles(theme);

  if (!characters || characters.length === 0) {
    return <Text style={s.noInfo}>{t('characters.no_info')}</Text>;
  }

  return (
    <View style={s.grid}>
      {characters.map((char: any) => (
        <CharacterCard key={char.id} character={char} />
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

export default CharactersSection;
