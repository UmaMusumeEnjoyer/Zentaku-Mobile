/**
 * CharacterScreen — Character detail screen
 *
 * Mirrors pbl5_webFE/src/pages/CharacterPage/CharacterPage.tsx
 * Reuses business logic from shared-logic:
 *   - useCharacter(id) for data fetching & description parsing
 *
 * Layout: ScrollView
 *   BackButton → Image + Name/NativeName/Description → Media Grid
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCharacter } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';
import type { RootStackParamList } from '../../navigation/types';
import AnimeCard from '../../components/AnimeCard/AnimeCard';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Spoiler component (inline) ──
interface SpoilerProps {
  children: React.ReactNode;
}

const Spoiler: React.FC<SpoilerProps & { theme: ThemeTokens }> = ({ children, theme }) => {
  const [revealed, setRevealed] = useState(false);
  const { t } = useTranslation('CharacterPage');

  if (!revealed) {
    return (
      <Text
        style={{
          backgroundColor: theme.bgSubtle,
          color: theme.bgSubtle,
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4,
        }}
        onPress={() => setRevealed(true)}
      >
        {t('CharacterPage:spoiler.click_to_view')}
      </Text>
    );
  }
  return <Text style={{ color: theme.textSecondary }}>{children}</Text>;
};

// ── Main Screen ──
const CharacterScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation(['CharacterPage', 'common']);
  const { character, loading, error, cleanDescription } = useCharacter(id);

  const s = makeStyles(theme);

  // ── Render description with spoiler blocks ──
  const renderDescriptionWithSpoilers = (text: string) => {
    const parts = text.split(/(~!|!~)/g);
    let isSpoilerContent = false;

    return parts.map((part, index) => {
      if (part === '~!' || part === '!~') {
        if (part === '~!') isSpoilerContent = true;
        if (part === '!~') isSpoilerContent = false;
        return null;
      }
      return isSpoilerContent ? (
        <Spoiler key={index} theme={theme}>
          {part}
        </Spoiler>
      ) : (
        <Text key={index} style={s.descriptionText}>
          {part}
        </Text>
      );
    });
  };

  // ── Loading State ──
  if (loading) {
    return (
      <SafeAreaView style={s.safeArea}>
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.bgApp}
        />
        <View style={s.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={s.loadingText}>{t('common:loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <SafeAreaView style={s.safeArea}>
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.bgApp}
        />
        <View style={s.centerContainer}>
          <Text style={s.errorText}>{t('common:error', { message: error })}</Text>
          <TouchableOpacity
            style={s.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <Text style={s.backButtonText}>{t('common:buttons.go_back') || 'Go Back'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Not Found State ──
  if (!character) {
    return (
      <SafeAreaView style={s.safeArea}>
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.bgApp}
        />
        <View style={s.centerContainer}>
          <Text style={s.errorText}>{t('error.not_found')}</Text>
          <TouchableOpacity
            style={s.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
          >
            <Text style={s.backButtonText}>{t('common:buttons.go_back') || 'Go Back'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main Content ──
  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bgApp}
        translucent={Platform.OS === 'android'}
      />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back button overlay ── */}
        <TouchableOpacity
          style={s.backOverlay}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>

        {/* ── Main Info: Image + Name + Description ── */}
        <View style={s.contentWrapper}>
          {/* Character Image - centered */}
          <View style={s.imageContainer}>
            <Image
              source={{ uri: character.image }}
              style={s.characterImage}
              resizeMode="cover"
            />
          </View>

          {/* Character Info */}
          <View style={s.infoContainer}>
            <Text style={s.characterName}>{character.name_full}</Text>
            <Text style={s.nativeName}>{character.name_native}</Text>

            {/* Description with spoiler support */}
            <View style={s.descriptionContainer}>
              <Text style={s.descriptionText}>
                {renderDescriptionWithSpoilers(cleanDescription)}
              </Text>
            </View>
          </View>

          {/* ── Media Appearances Section ── */}
          {character.media && character.media.length > 0 && (
            <View style={s.mediaSection}>
              <Text style={s.mediaSectionTitle}>
                {t('sections.media_appearances')}
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.mediaScrollContent}
              >
                {character.media.map((item: any) => (
                  <AnimeCard
                    key={item.id}
                    anime={{
                      id: item.id,
                      title_romaji: item.title_romaji,
                      cover_image: item.cover_image,
                    } as any}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Bottom spacer */}
        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Styles ──
const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.bgApp,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: spacing['10'],
    },

    // Center container for loading/error
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing['4'],
    },
    loadingText: {
      marginTop: spacing['3'],
      color: theme.textSecondary,
      fontSize: typography.fontSize.base,
    },
    errorText: {
      color: theme.statusError,
      fontSize: typography.fontSize.md,
      textAlign: 'center',
      marginBottom: spacing['4'],
    },
    backButton: {
      backgroundColor: theme.btnPrimaryBg,
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['5'],
      borderRadius: radius.md,
    },
    backButtonText: {
      color: theme.btnPrimaryText,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
    },

    // Back overlay
    backOverlay: {
      position: 'absolute',
      top: Platform.OS === 'android' ? 40 : spacing['3'],
      left: spacing['3'],
      zIndex: 20,
      width: 36,
      height: 36,
      borderRadius: radius.full,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backArrow: {
      color: '#FFFFFF',
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      marginTop: -2,
    },

    // Content
    contentWrapper: {
      paddingHorizontal: spacing['4'],
      paddingTop: Platform.OS === 'android' ? 80 : 60,
    },

    // Character Image
    imageContainer: {
      alignItems: 'center',
      marginBottom: spacing['5'],
    },
    characterImage: {
      width: 200,
      height: 280,
      borderRadius: radius.md,
    },

    // Character Info
    infoContainer: {
      alignItems: 'center',
      marginBottom: spacing['5'],
    },
    characterName: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: spacing['1'],
    },
    nativeName: {
      fontSize: typography.fontSize.base,
      color: theme.textSecondary,
      fontStyle: 'italic',
      textAlign: 'center',
      marginBottom: spacing['5'],
    },

    // Description
    descriptionContainer: {
      width: '100%',
    },
    descriptionText: {
      fontSize: typography.fontSize.base,
      color: theme.textSecondary,
      lineHeight: typography.lineHeight.relaxed,
    },

    // Media Section
    mediaSection: {
      marginTop: spacing['6'],
      borderTopWidth: 1,
      borderTopColor: theme.borderSubtle,
      paddingTop: spacing['5'],
    },
    mediaSectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
      marginBottom: spacing['4'],
    },
    mediaScrollContent: {
      paddingRight: spacing['4'],
    },

    bottomSpacer: {
      height: spacing['10'],
    },
  });

export default CharacterScreen;
