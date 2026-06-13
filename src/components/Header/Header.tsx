import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useHeader } from '@umamusumeenjoyer/shared-logic';
import GlobalSearchModal from '../GlobalSearchModal/GlobalSearchModal';
import { createStyles } from './Header.style';
import type { MainStackParamList } from '../../navigation/types';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightActions?: React.ReactNode;
  showDefaultRightActions?: boolean;
  transparent?: boolean;
}

import { ENV } from '../../utils/env';

const BACKEND_DOMAIN = ENV.BACKEND_DOMAIN;
const DEFAULT_AVATAR = ENV.DEFAULT_AVATAR_URL;

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightActions,
  showDefaultRightActions = false,
  transparent = false,
}) => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { t } = useTranslation(['Header']);
  const { user, logout: authLogout } = useAuth();

  const isAuthenticated = !!user;
  
  // NOTE: notification fields are mocked here since they are missing from useHeader return type.
  const {
    isDropdownOpen,
    isSearchModalOpen,
    toggleDropdown,
    openSearchModal,
    closeSearchModal,
    formatDateTime,
    getRelativeTime,
    getAvatarUrl,
    // Add these missing fields manually or let them be undefined
    isNotiModalOpen = false,
    notifications = [],
    notificationCount = 0,
    openNotificationModal = () => {},
    closeNotificationModal = () => {},
  } = useHeader({
    isAuthenticated,
    defaultAvatar: DEFAULT_AVATAR,
    backendDomain: BACKEND_DOMAIN,
  }) as any;

  const avatarUrl = useMemo(() => {
    return getAvatarUrl(user?.avatar_url, DEFAULT_AVATAR, BACKEND_DOMAIN);
  }, [user?.avatar_url, getAvatarUrl]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleLogout = () => {
    authLogout();
    toggleDropdown();
    navigation.getParent()?.navigate('Login' as never);
  };

  const navigateToMainScreen = (screenName: keyof MainStackParamList, params?: any) => {
    navigation.navigate('Main', { screen: screenName, params });
  };

  const renderRelativeTime = (timeString: string) => {
    if (timeString === 'Aired') {
      return t('Header:notifications.aired');
    }
    return timeString;
  };

  return (
    <>
      <View style={[styles.headerContainer, transparent && styles.transparentHeader]}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
              <ChevronLeft color={theme.textPrimary} size={28} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightActions}
          {showDefaultRightActions && (
            <>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigateToMainScreen('AnimeSearch')}
              >
                <Search color={theme.textPrimary} size={24} />
              </TouchableOpacity>

              {isAuthenticated ? (
                <>
                  <TouchableOpacity style={styles.iconButton} onPress={openNotificationModal}>
                    <Bell color={theme.textPrimary} size={24} />
                    {notificationCount > 0 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.iconButton} onPress={toggleDropdown}>
                    <View style={styles.avatarContainer}>
                      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginButtonText}>{t('Header:buttons.login')}</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        onUserSelect={(username) => navigateToMainScreen('Profile', { username })}
      />

      {/* User Menu Modal */}
      <Modal visible={isDropdownOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleDropdown}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('Header:user_menu.profile')}</Text>
              <TouchableOpacity onPress={toggleDropdown} style={styles.closeBtn}>
                <X color={theme.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.menuList}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleDropdown(); navigateToMainScreen('Profile'); }}>
                <User color={theme.textSecondary} size={20} />
                <Text style={styles.menuItemText}>{t('Header:user_menu.profile')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleDropdown(); openSearchModal(); }}>
                <Search color={theme.textSecondary} size={20} />
                <Text style={styles.menuItemText}>{t('Header:accessibility.search')} Users</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleDropdown(); navigateToMainScreen('Settings'); }}>
                <Settings color={theme.textSecondary} size={20} />
                <Text style={styles.menuItemText}>{t('Header:user_menu.settings')}</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <LogOut color={theme.statusError} size={20} />
                <Text style={styles.menuItemTextDanger}>{t('Header:buttons.logout')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={isNotiModalOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeNotificationModal}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('Header:notifications.title')}</Text>
              <TouchableOpacity onPress={closeNotificationModal} style={styles.closeBtn}>
                <X color={theme.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.notiList}>
              {notifications.length > 0 ? (
                notifications.map((noti: any) => (
                  <TouchableOpacity key={noti.notification_id} style={styles.notiItem}>
                    <View style={styles.notiIconContainer}>
                      <Bell color={theme.primary} size={20} />
                    </View>
                    <View style={styles.notiInfo}>
                      <Text style={styles.notiText}>
                        <Text style={styles.notiBold}>{t('Header:notifications.episode')} {noti.episode_number}</Text>
                        {' - '}
                        <Text style={styles.animeHighlight}>
                          {noti.anime_title || `${t('Header:notifications.anime_id')}: ${noti.anilist_id}`}
                        </Text>
                      </Text>
                      <View style={styles.notiMetaRow}>
                        <Text style={styles.notiTime}>{t('Header:notifications.sent')}: {formatDateTime(noti.sent_at)}</Text>
                        <Text style={[styles.notiCountdown, getRelativeTime(noti.airing_at) === 'Aired' && styles.notiAired]}>
                          {renderRelativeTime(getRelativeTime(noti.airing_at))}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.notiEmpty}>{t('Header:notifications.empty')}</Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default Header;
