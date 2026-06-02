import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  Modal, 
  ScrollView, 
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  Home, 
  Compass, 
  ListVideo, 
  User, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Moon, 
  Sun, 
  Globe, 
  X 
} from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useHeader } from '@umamusumeenjoyer/shared-logic';
import { createStyles } from './Navigation.style';
import type { MainStackParamList } from '../../navigation/types';

import GlobalSearchModal from '../GlobalSearchModal/GlobalSearchModal';
const BACKEND_DOMAIN = process.env.EXPO_PUBLIC_BACKEND_DOMAIN;
const DEFAULT_AVATAR = process.env.EXPO_PUBLIC_DEFAULT_AVATAR_URL;

const BottomNav: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  const { theme, toggleTheme, themeMode } = useTheme();
  const styles = createStyles(theme);
  
  const { user, logout: authLogout } = useAuth();
  const { t, i18n } = useTranslation(['Header']);

  const isAuthenticated = !!user;

  // Helper: navigate to a screen within the Main inner navigator.
  // Some contexts may resolve to a navigator that doesn't directly expose inner routes,
  // so route via Root -> Main to ensure the inner screen exists.
  const navigateToMainScreen = (screenName: keyof MainStackParamList, params?: any) => {
    // BottomNav is rendered inside MainLayout (a Root 'Main' screen),
    // and useNavigation() here returns the Root navigator. To target
    // Inner navigator screens, always navigate to Root.Main with a
    // nested screen param.
    navigation.navigate('Main', { screen: screenName, params });
  };

  const getActiveMainRoute = (): keyof MainStackParamList | null => {
    const state = navigation.getState?.();
    if (!state?.routes?.length) return null;

    const activeRoot = state.routes[state.index ?? 0] as any;
    const nestedState = activeRoot?.state;
    if (!nestedState?.routes?.length) return null;

    const activeInner = nestedState.routes[nestedState.index ?? 0];
    return (activeInner?.name as keyof MainStackParamList) ?? null;
  };



  // Hàm helper để check tab đang active
  const activeMainRoute = getActiveMainRoute();
  const isActive = (routeName: keyof MainStackParamList) => activeMainRoute === routeName || route.name === routeName;

  return (
    <>
      <View style={styles.bottomNavContainer}>
        {/* Nút Home */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigateToMainScreen('Home')}>
          <Home color={isActive('Home') ? theme.primary : theme.textSecondary} size={24} />
          <Text style={[styles.navText, isActive('Home') && styles.navTextActive]}>
            {t('Header:navigation.home')}
          </Text>
        </TouchableOpacity>

        {/* Nút Browse */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigateToMainScreen('Browse')}>
          <Compass color={isActive('Browse') ? theme.primary : theme.textSecondary} size={24} />
          <Text style={[styles.navText, isActive('Browse') && styles.navTextActive]}>
            {t('Header:navigation.browse')}
          </Text>
        </TouchableOpacity>


        {/* Nút Settings — luôn hiển thị cho cả guest và user */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigateToMainScreen('Settings')}>
          <Settings color={isActive('Settings') ? theme.primary : theme.textSecondary} size={24} />
          <Text style={[styles.navText, isActive('Settings') && styles.navTextActive]}>
            {t('Header:user_menu.settings')}
          </Text>
        </TouchableOpacity>

        {isAuthenticated ? (
          <>
            {/* Nút Anime List */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigateToMainScreen('AnimeList')}>
              <ListVideo color={isActive('AnimeList') ? theme.primary : theme.textSecondary} size={24} />
              <Text style={[styles.navText, isActive('AnimeList') && styles.navTextActive]}>
                {t('Header:navigation.anime_list')}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          /* Nút Đăng nhập cho Guest */
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Login')}>
            <User color={theme.textSecondary} size={24} />
            <Text style={styles.navText}>{t('Header:buttons.login')}</Text>
          </TouchableOpacity>
        )}
      </View>



    </>
  );
};

export default BottomNav;