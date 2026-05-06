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
import { Info, Users, Wand2, BarChart2, MessageSquare, Play } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'AnimeDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 200;

const AnimeDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation(['MainContentArea', 'common', 'AnimeModal']);
  const { anime, loading, error, hasBanner, staffList, characterList, stats } = useAnimeDetail(id);
  const [activeTab, setActiveTab] = useState<'info' | 'characters' | 'staff' | 'stats' | 'reviews'>('info');

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

          {/* ── Tabs Navigation ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.tabContainer}
          >
            <TouchableOpacity
              style={[s.tabButton, activeTab === 'info' && s.activeTabButton]}
              onPress={() => setActiveTab('info')}
              activeOpacity={0.8}
            >
              <Info size={20} color={activeTab === 'info' ? theme.bgApp : theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tabButton, activeTab === 'characters' && s.activeTabButton]}
              onPress={() => setActiveTab('characters')}
              activeOpacity={0.8}
            >
              <Users size={20} color={activeTab === 'characters' ? theme.bgApp : theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tabButton, activeTab === 'staff' && s.activeTabButton]}
              onPress={() => setActiveTab('staff')}
              activeOpacity={0.8}
            >
              <Wand2 size={20} color={activeTab === 'staff' ? theme.bgApp : theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tabButton, activeTab === 'stats' && s.activeTabButton]}
              onPress={() => setActiveTab('stats')}
              activeOpacity={0.8}
            >
              <BarChart2 size={20} color={activeTab === 'stats' ? theme.bgApp : theme.textSecondary} />
            </TouchableOpacity>

          </ScrollView>

          {/* ── Tab Content ── */}
          {activeTab === 'info' && (
            <View style={s.section}>
              <InfoSidebar anime={anime as any} />
            </View>
          )}

          {activeTab === 'characters' && (
            <View style={s.section}>
              <SectionHeader title={t('MainContentArea:sections.characters')} />
              <CharactersSection data={characterList} />
            </View>
          )}

          {activeTab === 'staff' && (
            <View style={s.section}>
              <SectionHeader title={t('MainContentArea:sections.staff')} />
              <StaffSection data={staffList} />
            </View>
          )}

          {activeTab === 'stats' && (
            <>
              <View style={s.section}>
                <SectionHeader title={t('MainContentArea:sections.rankings')} />
                <RankingsSection rankings={(stats?.rankings as Ranking[]) || []} />
              </View>

              <View style={s.section}>
                <SectionHeader title={t('MainContentArea:sections.status_distribution')} />
                <StatusDistribution distribution={(stats?.status_distribution as StatusItem[]) || []} />
              </View>

              <View style={s.section}>
                <SectionHeader title={t('MainContentArea:sections.score_distribution')} />
                <ScoreDistribution distribution={(stats?.score_distribution as ScoreItem[]) || []} />
              </View>
            </>
          )}

        </View>

        {/* Bottom spacer */}
        <View style={s.bottomSpacer} />
      </ScrollView>

      <TouchableOpacity
        style={s.watchButton}
        onPress={() => navigation.navigate('AnimeWatch', { id })}
        activeOpacity={0.8}
      >
        <View style={s.watchIconWrap}>
          <View style={s.watchIconContainer}>
            <Play size={16} color={theme.btnPrimaryText} />
          </View>
          <Text style={s.watchButtonText}>{t('AnimeModal:Watch', { defaultValue: 'Watch' })}</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// ── Styles ──
const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.bgApp,
      position: 'relative',
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

    watchButton: {
      position: 'absolute',
      right: spacing['4'],
      bottom: spacing['4'],
      backgroundColor: theme.bgPanel,
      paddingVertical: spacing['2'],
      paddingHorizontal: spacing['3'],
      borderRadius: radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    watchIconWrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    watchIconContainer: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      backgroundColor: theme.btnPrimaryBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing['3'],
    },
    watchButtonText: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      letterSpacing: 0.2,
    },

    // Tabs
    tabContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing['5'],
      gap: spacing['2'],
    },
    tabButton: {
      width: 48,
      height: 48,
      borderRadius: radius.full,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing['2'],
    },
    activeTabButton: {
      backgroundColor: theme.textPrimary,
      borderColor: theme.textPrimary,
    },

    bottomSpacer: {
      height: spacing['10'],
    },
  });

export default AnimeDetailScreen;
