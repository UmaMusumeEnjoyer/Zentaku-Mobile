/**
 * StaffScreen — Staff/Voice Actor detail screen
 *
 * Mirrors pbl5_webFE/src/pages/StaffPage/StaffPage.tsx
 * Reuses business logic from shared-logic:
 *   - useStaffPage(id) for data fetching, roles grouping, description expand
 *
 * Layout: ScrollView
 *   BackButton → Image + Name/NativeName + Info Grid + Description →
 *   Roles grouped by year
 */
import React from 'react';
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
  Linking,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useStaffPage } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'StaffDetail'>;

// ── Description Renderer (handles markdown-like links and bold) ──
interface DescriptionRendererProps {
  text?: string;
  theme: ThemeTokens;
}

const DescriptionRenderer: React.FC<DescriptionRendererProps> = ({ text, theme }) => {
  if (!text) return null;

  const parts = text.split(/(\[.*?\]\(.*?\))/g);

  return (
    <Text style={{ fontSize: typography.fontSize.base, color: theme.textSecondary, lineHeight: typography.lineHeight.relaxed }}>
      {parts.map((part, index) => {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          return (
            <Text
              key={index}
              style={{ color: theme.btnPrimaryBg, textDecorationLine: 'underline' }}
              onPress={() => Linking.openURL(match[2])}
            >
              {match[1]}
            </Text>
          );
        }
        if (part.startsWith('__')) {
          return (
            <Text key={index} style={{ fontWeight: typography.fontWeight.bold, color: theme.textPrimary }}>
              {part.replace(/__/g, '')}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

// ── Main Screen ──
const StaffScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { theme, themeMode } = useTheme();
  const { t, i18n } = useTranslation(['StaffPage', 'common']);
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    staff,
    loading,
    rolesByYear,
    sortedYears,
    isDescriptionExpanded,
    toggleDescription,
    shouldShowReadMore,
  } = useStaffPage(id);

  const s = makeStyles(theme);

  // Format date theo ngôn ngữ
  const formatDateByLanguage = (dateString?: string) => {
    if (!dateString) return t('info.not_available');

    const date = new Date(dateString);
    const currentLang = i18n.language;

    if (currentLang === 'jp') {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
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

  // ── Not Found State ──
  if (!staff) {
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

  const descriptionText = staff.description || '';

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

        <View style={s.contentWrapper}>
          {/* ── Staff Image ── */}
          <View style={s.imageContainer}>
            <Image
              source={{ uri: staff.image }}
              style={s.staffImage}
              resizeMode="cover"
            />
          </View>

          {/* ── Staff Info ── */}
          <View style={s.infoContainer}>
            <Text style={s.staffName}>{staff.name_full}</Text>
            <Text style={s.nativeName}>{staff.name_native}</Text>

            {/* Info Grid */}
            <View style={s.infoGrid}>
              <View style={s.infoItem}>
                <Text style={s.infoLabel}>{t('info.birth')}:</Text>
                <Text style={s.infoValue}>{formatDateByLanguage(staff.date_of_birth)}</Text>
              </View>
              <View style={s.infoItem}>
                <Text style={s.infoLabel}>{t('info.age')}:</Text>
                <Text style={s.infoValue}>{staff.age || t('info.not_available')}</Text>
              </View>
              <View style={s.infoItem}>
                <Text style={s.infoLabel}>{t('info.gender')}:</Text>
                <Text style={s.infoValue}>{staff.gender || t('info.not_available')}</Text>
              </View>
              <View style={s.infoItem}>
                <Text style={s.infoLabel}>{t('info.hometown')}:</Text>
                <Text style={s.infoValue}>{staff.home_town || t('info.not_available')}</Text>
              </View>
            </View>

            {/* Description with expand/collapse */}
            <View style={s.descriptionContainer}>
              <View
                style={[
                  s.descriptionWrapper,
                  !isDescriptionExpanded && shouldShowReadMore && s.descriptionCollapsed,
                ]}
              >
                <DescriptionRenderer text={descriptionText} theme={theme} />
              </View>

              {shouldShowReadMore && (
                <TouchableOpacity onPress={toggleDescription} activeOpacity={0.7}>
                  <Text style={s.readMoreButton}>
                    {isDescriptionExpanded ? t('actions.show_less') : t('actions.read_more')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Roles Section ── */}
          <View style={s.rolesSection}>
            {sortedYears.map((year) => (
              <View key={year} style={s.yearGroup}>
                <Text style={s.yearTitle}>{year}</Text>
                <View style={s.rolesGrid}>
                  {rolesByYear[year].map((role) => (
                    <TouchableOpacity
                      key={`${role.id}-${role.character_role || Math.random()}`}
                      style={s.roleCard}
                      activeOpacity={0.7}
                      onPress={() =>
                        nav.navigate('AnimeDetail', { id: String(role.id) })
                      }
                    >
                      <Image
                        source={{ uri: role.cover_image }}
                        style={s.roleImage}
                        resizeMode="cover"
                      />
                      <View style={s.roleDetails}>
                        <Text style={s.roleMainText} numberOfLines={1}>
                          {role.title_romaji}
                        </Text>
                        <Text style={s.roleSubText} numberOfLines={1}>
                          {role.format}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
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

    // Staff Image
    imageContainer: {
      alignItems: 'center',
      marginBottom: spacing['5'],
    },
    staffImage: {
      width: 180,
      height: 250,
      borderRadius: radius.md,
    },

    // Staff Info
    infoContainer: {
      alignItems: 'center',
      marginBottom: spacing['5'],
    },
    staffName: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: spacing['1'],
    },
    nativeName: {
      fontSize: typography.fontSize.base,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: spacing['4'],
    },

    // Info Grid
    infoGrid: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing['4'],
    },
    infoItem: {
      width: '50%',
      flexDirection: 'row',
      marginBottom: spacing['2'],
      paddingRight: spacing['2'],
    },
    infoLabel: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
      marginRight: spacing['1'],
    },
    infoValue: {
      fontSize: typography.fontSize.base,
      color: theme.textSecondary,
      flex: 1,
    },

    // Description
    descriptionContainer: {
      width: '100%',
    },
    descriptionWrapper: {
      overflow: 'hidden',
    },
    descriptionCollapsed: {
      maxHeight: 120,
    },
    readMoreButton: {
      color: theme.textSecondary,
      fontWeight: typography.fontWeight.bold,
      fontSize: typography.fontSize.base,
      marginTop: spacing['2'],
    },

    // Roles Section
    rolesSection: {
      marginTop: spacing['6'],
    },
    yearGroup: {
      marginBottom: spacing['6'],
    },
    yearTitle: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      marginBottom: spacing['4'],
      paddingBottom: spacing['2'],
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
    },
    rolesGrid: {
      gap: spacing['3'],
    },
    roleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['3'],
      backgroundColor: theme.bgPanel,
      borderRadius: radius.md,
      height: 72,
      overflow: 'hidden',
      paddingRight: spacing['3'],
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    roleImage: {
      width: 52,
      height: '100%',
    },
    roleDetails: {
      flex: 1,
      justifyContent: 'center',
      minWidth: 0,
    },
    roleMainText: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      marginBottom: 2,
    },
    roleSubText: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.xs,
      textTransform: 'capitalize',
    },

    bottomSpacer: {
      height: spacing['10'],
    },
  });

export default StaffScreen;
