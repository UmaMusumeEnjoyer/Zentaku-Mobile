// src/screens/HomeLoginScreen.tsx
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useHomePagelogin } from '@umamusumeenjoyer/shared-logic';

import AnimeSection from '../../components/AnimeSection/AnimeSection';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../styles/theme'; // Giữ lại spacing vì bạn có dùng inline style ở dưới cùng
import type { RootStackParamList } from '../../navigation/types';
import { ENV } from '../../utils/env';

// Import file styles vừa tách
import { makeStyles } from './HomeLogicScreen.style';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

const DEFAULT_AVATAR = ENV.DEFAULT_AVATAR_URL || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlZjpoc6BcEHSBXN83B8niRWSjcbNE-DArpg&s';

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------

const HomeLoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useTranslation(['HomePageLogin', 'mobile']);

  const { animeLists, loading } = useHomePagelogin();

  // Gọi hàm style và truyền theme hiện tại vào
  const s = makeStyles(theme);

  const handleLogout = () => {
    logout();
    navigation.replace('Login', { initialMode: 'login' });
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

export default HomeLoginScreen;