/**
 * CharacterCard — Displays character + voice actor info
 * Mirrors web CharacterCard.tsx
 */
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { Character } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const { theme } = useTheme();
  const s = makeStyles(theme);
  const voiceActor = character.voice_actors?.[0];

  return (
    <View style={s.card}>
      {/* Character side */}
      <TouchableOpacity style={s.cardLink} activeOpacity={0.7}>
        <View style={s.personInfo}>
          <Image
            source={{ uri: character.image }}
            style={s.personAvatar}
            resizeMode="cover"
          />
          <View style={s.personDetails}>
            <Text style={s.personName} numberOfLines={2}>
              {character.name_full}
            </Text>
            <Text style={s.personRole}>{character.role}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Voice Actor side */}
      {voiceActor && (
        <TouchableOpacity style={[s.cardLink, s.vaPart]} activeOpacity={0.7}>
          <View style={[s.personInfo, s.vaInfo]}>
            <View style={[s.personDetails, s.vaDetails]}>
              <Text style={s.personName} numberOfLines={2}>
                {voiceActor.name_full}
              </Text>
              <Text style={s.personRole}>{voiceActor.language}</Text>
            </View>
            <Image
              source={{ uri: voiceActor.image }}
              style={s.personAvatar}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.bgPanel,
      borderRadius: radius.md,
      overflow: 'hidden',
      minHeight: 72,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    cardLink: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    vaPart: {
      justifyContent: 'flex-end',
    },
    personInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['2'],
      width: '100%',
      height: '100%',
    },
    personAvatar: {
      width: 52,
      alignSelf: 'stretch',
    },
    personDetails: {
      flex: 1,
      paddingVertical: spacing['1'],
      justifyContent: 'center',
      minWidth: 0,
    },
    personName: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      marginBottom: 2,
      lineHeight: typography.lineHeight.tight,
    },
    personRole: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.xs,
      textTransform: 'capitalize',
    },
    vaInfo: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
    },
    vaDetails: {
      alignItems: 'flex-end',
      paddingRight: spacing['2'],
      paddingLeft: 0,
    },
  });

export default CharacterCard;
