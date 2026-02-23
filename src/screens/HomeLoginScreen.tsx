/**
 * src/screens/HomeLoginScreen.tsx
 *
 * Clone HomePagelogin của pbl5_webFE — adapted cho React Native.
 * Sử dụng useHomePagelogin() từ shared-logic:
 *   - Hook đọc localStorage.getItem('username') (hoạt động qua polyfill)
 *   - Trả về: animeLists { watching, completed, onHold, dropped, planning }, loading
 * Hiển thị 5 sections với AnimeSection component.
 */
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useHomePagelogin } from '@umamusumeenjoyer/shared-logic';

import AnimeSection from '../components/AnimeSection/AnimeSection';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { typography, spacing, radius } from '../styles/theme';
import type { ThemeTokens } from '../styles/theme';
import type { RootStackParamList } from '../navigation/types';
import { ENV } from '../utils/env';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type Props = NativeStackScreenProps<RootStackParamList, 'HomeLogin'>;

const DEFAULT_AVATAR = ENV.DEFAULT_AVATAR_URL || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlZjpoc6BcEHSBXN83B8niRWSjcbNE-DArpg&s';

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

const HomeLoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useTranslation(['HomePageLogin', 'mobile']);

  // ---- Data từ shared-logic ----
  const { animeLists, loading } = useHomePagelogin();

  const s = makeStyles(theme);

  const handleLogout = () => {
    logout();
    navigation.replace('Auth', { initialMode: 'login' });
  };

  const username = user?.username ?? (global as any).localStorage?.getItem('username') ?? '';

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bgApp}
      />

      {/* ---- Fixed Header ---- */}
      <View style={s.header}>
        <Text style={s.headerTitle}>AniApp</Text>
        <View style={s.headerRight}>
          {/* Theme Toggle */}
          <TouchableOpacity style={s.iconBtn} onPress={toggleTheme}>
            <Text style={s.iconBtnText}>{themeMode === 'dark' ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>

          {/* User + Logout */}
          {username !== '' && (
            <View style={s.userRow}>
              <Text style={s.usernameText} numberOfLines={1}>{username}</Text>
              <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
                <Text style={s.logoutBtnText}>{t('mobile:nav.logout')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* ---- Welcome banner ---- */}
      <View style={s.welcomeBanner}>
        <Text style={s.welcomeText}>
          {t('HomePageLogin:welcome', { name: username })}
        </Text>
        <Text style={s.welcomeSubtext}>
          {t('HomePageLogin:subtitle')}
        </Text>
      </View>

      {/* ---- Anime Sections ---- */}
      <ScrollView
        style={s.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        <AnimeSection
          title={t('HomePageLogin:sections.watching')}
          animeList={animeLists.watching}
          isLoading={loading}
          emptyMessage={t('HomePageLogin:empty.watching')}
        />
        <AnimeSection
          title={t('HomePageLogin:sections.planning')}
          animeList={animeLists.planning}
          isLoading={loading}
          emptyMessage={t('HomePageLogin:empty.planning')}
        />
        <AnimeSection
          title={t('HomePageLogin:sections.completed')}
          animeList={animeLists.completed}
          isLoading={loading}
          emptyMessage={t('HomePageLogin:empty.completed')}
        />
        <AnimeSection
          title={t('HomePageLogin:sections.onHold')}
          animeList={animeLists.onHold}
          isLoading={loading}
          emptyMessage={t('HomePageLogin:empty.onHold')}
        />
        <AnimeSection
          title={t('HomePageLogin:sections.dropped')}
          animeList={animeLists.dropped}
          isLoading={loading}
          emptyMessage={t('HomePageLogin:empty.dropped')}
        />

        {/* Bottom padding */}
        <View style={{ height: spacing['8'] }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ----------------------------------------------------------------
// Styles
// ----------------------------------------------------------------

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.bgApp,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing['4'],
      paddingVertical: spacing['3'],
      backgroundColor: theme.bgPanel,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
    },
    headerTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: theme.primary,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['2'],
    },
    iconBtn: {
      padding: spacing['2'],
    },
    iconBtnText: {
      fontSize: typography.fontSize.lg,
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['2'],
    },
    usernameText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: theme.textPrimary,
      maxWidth: 100,
    },
    logoutBtn: {
      backgroundColor: theme.statusError,
      paddingHorizontal: spacing['3'],
      paddingVertical: spacing['1'],
      borderRadius: radius.full,
    },
    logoutBtnText: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
      color: '#fff',
    },

    // Welcome
    welcomeBanner: {
      paddingHorizontal: spacing['4'],
      paddingVertical: spacing['4'],
      backgroundColor: theme.bgPanel,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
    },
    welcomeText: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },
    welcomeSubtext: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
      marginTop: spacing['1'],
    },

    // Main content
    scrollView: { flex: 1 },
    scrollContent: {
      paddingTop: spacing['4'],
    },
  });

export default HomeLoginScreen;
