/**
 * AnimeDetailScreen — Main screen for anime details
 *
 * Mirrors pbl5_webFE/src/pages/AnimeDetailPage/AnimeDetailPage.tsx
 * Reuses all business logic from shared-logic:
 *   - useAnimeDetail(id) for data fetching
 *   - Sub-component hooks for data transformation
 *
 * Layout: ScrollView
 *   Banner → SummarySection → InfoSidebar (horizontal) →
 *   Characters → Staff → Rankings → StatusDistribution →
 *   ScoreDistribution
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
  Dimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAnimeDetail } from '@umamusumeenjoyer/shared-logic';
import type { Ranking, StatusItem, ScoreItem } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';
import type { RootStackParamList } from '../../navigation/types';

// Sub-components
import SummarySection from './components/SummarySection';
import InfoSidebar from './components/InfoSidebar';
import SectionHeader from './components/SectionHeader';
import CharactersSection from './components/CharactersSection';
import StaffSection from './components/StaffSection';
import RankingsSection from './components/RankingsSection';
import StatusDistribution from './components/StatusDistribution';
import ScoreDistribution from './components/ScoreDistribution';

type Props = NativeStackScreenProps<RootStackParamList, 'AnimeDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

const AnimeDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation(['MainContentArea', 'common']);
  const { anime, loading, error, hasBanner, staffList, characterList, stats } = useAnimeDetail(id);

  const s = makeStyles(theme);

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
  if (error || !anime) {
    return (
      <SafeAreaView style={s.safeArea}>
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.bgApp}
        />
        <View style={s.centerContainer}>
          <Text style={s.errorText}>{error || 'Anime not found'}</Text>
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
        backgroundColor="transparent"
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

        {/* ── Banner ── */}
        {hasBanner ? (
          <Image
            source={{ uri: anime.banner_image }}
            style={s.bannerImage}
            resizeMode="cover"
          />
        ) : (
          <View style={s.bannerPlaceholder} />
        )}

        {/* ── Content wrapper ── */}
        <View style={s.contentWrapper}>
          {/* Summary: Cover + Title + Description */}
          <SummarySection anime={anime as any} hasBanner={hasBanner} />

          {/* Info Sidebar: Horizontal scroll */}
          <View style={s.section}>
            <InfoSidebar anime={anime as any} />
          </View>

          {/* Characters */}
          <View style={s.section}>
            <SectionHeader title={t('MainContentArea:sections.characters')} />
            <CharactersSection data={characterList} />
          </View>

          {/* Staff */}
          <View style={s.section}>
            <SectionHeader title={t('MainContentArea:sections.staff')} />
            <StaffSection data={staffList} />
          </View>

          {/* Rankings */}
          <View style={s.section}>
            <SectionHeader title={t('MainContentArea:sections.rankings')} />
            <RankingsSection rankings={(stats?.rankings as Ranking[]) || []} />
          </View>

          {/* Status Distribution */}
          <View style={s.section}>
            <SectionHeader title={t('MainContentArea:sections.status_distribution')} />
            <StatusDistribution distribution={(stats?.status_distribution as StatusItem[]) || []} />
          </View>

          {/* Score Distribution */}
          <View style={s.section}>
            <SectionHeader title={t('MainContentArea:sections.score_distribution')} />
            <ScoreDistribution distribution={(stats?.score_distribution as ScoreItem[]) || []} />
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

    // Banner
    bannerImage: {
      width: SCREEN_WIDTH,
      height: BANNER_HEIGHT,
    },
    bannerPlaceholder: {
      width: SCREEN_WIDTH,
      height: 50,
      backgroundColor: theme.bgPanel,
    },

    // Content
    contentWrapper: {
      paddingHorizontal: spacing['4'],
    },
    section: {
      marginTop: spacing['5'],
    },

    bottomSpacer: {
      height: spacing['10'],
    },
  });

export default AnimeDetailScreen;
