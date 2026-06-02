import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  getAnimeTitle,
  getAnimeLinkId,
  getAnimeDisplayInfo,
  type AnimeData,
} from '@umamusumeenjoyer/shared-logic';
import { Play } from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';
import type { RootStackParamList } from '../../navigation/types';

interface AnimeModalProps {
  visible: boolean;
  anime: AnimeData | null;
  onClose: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimeModal: React.FC<AnimeModalProps> = ({ visible, anime, onClose }) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const lang = (i18n.language === 'jp' ? 'jp' : 'en') as 'en' | 'jp';

  const s = makeStyles(theme);

  if (!anime) return null;

  const title = getAnimeTitle(anime, lang);
  const linkId = getAnimeLinkId(anime);
  const displayInfo = getAnimeDisplayInfo(anime);

  const handlePressDetails = () => {
    onClose();
    if (linkId) {
      navigation.navigate('AnimeDetail', { id: String(linkId) });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={s.overlay}>
          <TouchableWithoutFeedback>
            <View style={s.bottomSheet}>
              {/* Drag Handle Indicator (Visual Only) */}
              <View style={s.dragHandle} />

              <View style={s.content}>
                {/* Image */}
                {anime.coverImage?.large || anime.coverImage?.medium ? (
                  <Image
                    source={{ uri: (anime.coverImage.large || anime.coverImage.medium) as string }}
                    style={s.image}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[s.image, s.imagePlaceholder]}>
                    <Text style={s.imagePlaceholderText}>?</Text>
                  </View>
                )}

                {/* Details */}
                <View style={s.infoContainer}>
                  <Text style={s.title} numberOfLines={2}>
                    {title}
                  </Text>
                  
                  {displayInfo && (
                    <Text style={s.displayInfo}>{displayInfo}</Text>
                  )}

                  {anime.episodes != null && (
                    <Text style={s.episodesText}>
                      Episodes: {anime.episodes}
                    </Text>
                  )}
                </View>
              </View>

              {/* Actions */}
              <View style={s.actions}>
                <TouchableOpacity
                  style={s.primaryButton}
                  activeOpacity={0.8}
                  onPress={handlePressDetails}
                >
                  <Play size={20} color={theme.btnPrimaryText} style={s.btnIcon} />
                  <Text style={s.primaryButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'flex-end',
    },
    bottomSheet: {
      backgroundColor: theme.bgPanel,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      padding: spacing['4'],
      paddingBottom: spacing['8'], // Extra padding for safe area / modern look
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: theme.borderSubtle,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.5,
      shadowRadius: 32,
      elevation: 20,
    },
    dragHandle: {
      width: 40,
      height: 4,
      backgroundColor: theme.borderSubtle,
      borderRadius: radius.full,
      alignSelf: 'center',
      marginBottom: spacing['4'],
    },
    content: {
      flexDirection: 'row',
      marginBottom: spacing['4'],
    },
    image: {
      width: 100,
      height: 140,
      borderRadius: radius.md,
      marginRight: spacing['3'],
    },
    imagePlaceholder: {
      backgroundColor: theme.bgHover,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imagePlaceholderText: {
      fontSize: typography.fontSize['3xl'],
      color: theme.textDisabled,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
      marginBottom: spacing['2'],
    },
    displayInfo: {
      fontSize: typography.fontSize.sm,
      color: theme.statusWarning ?? theme.primary,
      fontWeight: typography.fontWeight.medium,
      marginBottom: spacing['1'],
    },
    episodesText: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
    },
    actions: {
      marginTop: spacing['2'],
    },
    primaryButton: {
      flexDirection: 'row',
      backgroundColor: theme.btnPrimaryBg,
      paddingVertical: spacing['3'],
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnIcon: {
      marginRight: spacing['2'],
    },
    primaryButtonText: {
      color: theme.btnPrimaryText,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
    },
  });

export default AnimeModal;
