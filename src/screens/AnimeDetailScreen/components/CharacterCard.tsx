/**
 * CharacterCard — Displays character + voice actor info
 * Mirrors web CharacterCard.tsx
 *
 * Press character side → CharacterDetail screen
 * Press voice actor side → StaffDetail screen
 */
import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { Character } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';
import type { RootStackParamList } from '../../../navigation/types';

interface CharacterCardProps {
  character: Character;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const s = makeStyles(theme);
  const node = (character as any).node || character;
  const role = (character as any).role || node.role;
  const voiceActors = (character as any).voiceActors || node.voiceActors || node.voice_actors;
  const voiceActor = voiceActors?.[0];

  const getPersonName = (personNode: any) => {
    if (!personNode) return '';
    return personNode.name?.full || personNode.name_full || 'Unknown';
  };

  const getPersonImage = (personNode: any) => {
    if (!personNode) return '';
    return personNode.image?.large || personNode.image || personNode.image_url || '';
  };

  const handleCharacterPress = useCallback(() => {
    if (node.id) {
      navigation.navigate('CharacterDetail', { id: String(node.id) });
    }
  }, [node.id, navigation]);

  const handleVoiceActorPress = useCallback(() => {
    if (voiceActor?.id) {
      navigation.navigate('StaffDetail', { id: String(voiceActor.id) });
    }
  }, [voiceActor?.id, navigation]);

  return (
    <View style={s.card}>
      {/* Character side */}
      <TouchableOpacity
        style={s.cardLink}
        activeOpacity={0.7}
        onPress={handleCharacterPress}
      >
        <View style={s.personInfo}>
          <Image
            source={{ uri: getPersonImage(node) }}
            style={s.personAvatar}
            resizeMode="cover"
          />
          <View style={s.personDetails}>
            <Text style={s.personName} numberOfLines={2}>
              {getPersonName(node)}
            </Text>
            <Text style={s.personRole}>{role}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Voice Actor side */}
      {voiceActor && (
        <TouchableOpacity
          style={[s.cardLink, s.vaPart]}
          activeOpacity={0.7}
          onPress={handleVoiceActorPress}
        >
          <View style={[s.personInfo, s.vaInfo]}>
            <View style={[s.personDetails, s.vaDetails]}>
              <Text style={s.personName} numberOfLines={2}>
                {getPersonName(voiceActor)}
              </Text>
              <Text style={s.personRole}>{voiceActor.languageV2 || voiceActor.language}</Text>
            </View>
            <Image
              source={{ uri: getPersonImage(voiceActor) }}
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

