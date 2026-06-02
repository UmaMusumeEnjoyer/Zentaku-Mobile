/**
 * src/screens/HomeScreen.tsx
 *
 * Màn hình Home hiển thị anime nổi bật và lịch chiếu.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHomeLogic } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../context/ThemeContext';
import { typography, spacing, radius } from '../styles/theme';
import type { ThemeTokens } from '../styles/theme';
import AnimeSection from '../components/AnimeSection/AnimeSection';
import NewsSection from '../components/NewsSection/NewsSection';
import Header from '../components/Header/Header';

// ----------------------------------------------------------------
// Main Screen
// ----------------------------------------------------------------

const HomeScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { t } = useTranslation(['HomePage', 'common', 'mobile']);
  
  // Lấy dữ liệu từ shared-logic
  const { trendingAnime, scheduledAnime, latestNews, isLoading } = useHomeLogic();

  const s = makeStyles(theme);

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bgApp}
      />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Header ---- */}
        <Header 
          title="AniApp" 
          subtitle={t('greeting', { ns: 'HomePage', name: 'User' })} 
          showDefaultRightActions 
        />

        {/* ---- Trending Section ---- */}
        <AnimeSection
          title={t('HomePage:sections.popular', 'Trending Now')}
          animeList={trendingAnime}
          isLoading={isLoading}
        />

        {/* ---- New Releases / Schedule Section ---- */}
        <AnimeSection
          title={t('HomePage:new_releases', 'New Releases')}
          animeList={scheduledAnime}
          isLoading={isLoading}
        />

        {/* ---- News Section ---- */}
        <NewsSection 
          newsList={latestNews} 
          isLoading={isLoading} 
        />

        {/* ---- Status Colors Demo (Khách hàng có thể giữ lại hoặc bỏ) ---- */}
        <View style={s.controlsCard}>
          <View style={[s.infoBox, { borderColor: theme.statusSuccess, backgroundColor: theme.bgSubtle }]}>
            <Text style={[s.infoText, { color: theme.statusSuccess }]}>
              ✓ Dữ liệu Home đã được tích hợp với API Zentaku_BE!
            </Text>
          </View>
          <View style={[s.infoBox, { borderColor: theme.borderFocus, backgroundColor: theme.bgSubtle }]}>
            <Text style={[s.infoText, { color: theme.textSecondary }]}>
              {t('footer.copyright', { ns: 'common', year: new Date().getFullYear() })}
            </Text>
          </View>
        </View>

        <View style={s.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ----------------------------------------------------------------
// Styles factories (depend on theme tokens)
// ----------------------------------------------------------------

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.bgApp,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.bgApp,
    },
    scrollContent: {
      paddingTop: Platform.OS === 'android' ? spacing['4'] : spacing['2'],
    },



    // Controls card
    controlsCard: {
      backgroundColor: theme.bgPanel,
      borderRadius: radius.lg,
      padding: spacing['4'],
      marginHorizontal: spacing['4'],
      marginBottom: spacing['4'],
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      marginTop: spacing['2']
    },
    infoBox: {
      borderWidth: 1,
      borderRadius: radius.md,
      padding: spacing['3'],
      marginTop: spacing['3'],
    },
    infoText: {
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.normal,
    },

    bottomSpacer: {
      height: spacing['10'],
    },
  });

export default HomeScreen;
