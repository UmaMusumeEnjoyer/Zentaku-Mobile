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

// Tạm thời mock Component SearchModal nếu chưa chuyển đổi
const GlobalSearchModal = ({ isOpen, onClose }: any) => null;

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
  // Dùng logic lấy token của RN (vd: AsyncStorage thay vì localStorage)
  // Const này cần điều chỉnh theo auth context thực tế của bạn
  const isUserLoading = false; 

  const {
    isDropdownOpen,
    isSearchModalOpen,
    isNotiModalOpen,
    isSettingsModalOpen,
    notifications,
    notificationCount,
    toggleDropdown,
    openSearchModal,
    closeSearchModal,
    openNotificationModal,
    closeNotificationModal,
    openSettingsModal,
    closeSettingsModal,
    formatDateTime,
    getRelativeTime,
    getAvatarUrl
  } = useHeader({
    isAuthenticated,
    defaultAvatar: DEFAULT_AVATAR,
    backendDomain: BACKEND_DOMAIN,
  });

  const avatarUrl = useMemo(() => {
    return getAvatarUrl(user?.avatar_url, DEFAULT_AVATAR, BACKEND_DOMAIN);
  }, [user?.avatar_url, getAvatarUrl]);

  const handleLogout = () => {
    authLogout();
    toggleDropdown();
    // BottomNav nằm trong InnerStack (MainLayout), nên cần getParent()
    // để navigate tới 'Login' trong RootStack
    navigation.getParent()?.navigate('Login' as never);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const renderRelativeTime = (timeString: string) => {
    if (timeString === 'Aired') {
      return t('Header:notifications.aired');
    }
    return timeString;
  };

  // Hàm helper để check tab đang active
  const isActive = (routeName: string) => route.name === routeName;

  return (
    <>
      <View style={styles.bottomNavContainer}>
        {/* Nút Home */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home color={isActive('Home') ? theme.primary : theme.textSecondary} size={24} />
          <Text style={[styles.navText, isActive('Home') && styles.navTextActive]}>
            {t('Header:navigation.home')}
          </Text>
        </TouchableOpacity>

        {/* Nút Browse */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Browse')}>
          <Compass color={isActive('Browse') ? theme.primary : theme.textSecondary} size={24} />
          <Text style={[styles.navText, isActive('Browse') && styles.navTextActive]}>
            {t('Header:navigation.browse')}
          </Text>
        </TouchableOpacity>

        {isAuthenticated ? (
          <>
            {/* Nút Anime List */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('AnimeList')}>
              <ListVideo color={isActive('AnimeList') ? theme.primary : theme.textSecondary} size={24} />
              <Text style={[styles.navText, isActive('AnimeList') && styles.navTextActive]}>
                {t('Header:navigation.anime_list')}
              </Text>
            </TouchableOpacity>

            {/* Nút Menu / Profile */}
            <TouchableOpacity style={styles.navItem} onPress={toggleDropdown}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: avatarUrl }} 
                  style={[styles.avatarImg, isDropdownOpen && styles.avatarImgActive]} 
                />
                {notificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.navText, isDropdownOpen && styles.navTextActive]}>Menu</Text>
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

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />

      {/* User Menu Modal (thay thế cho Dropdown web) */}
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
              <TouchableOpacity style={styles.menuItem} onPress={() => { toggleDropdown(); navigation.navigate('Profile'); }}>
                <User color={theme.textSecondary} size={20} />
                <Text style={styles.menuItemText}>{t('Header:user_menu.profile')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={openSearchModal}>
                <Search color={theme.textSecondary} size={20} />
                <Text style={styles.menuItemText}>{t('Header:accessibility.search')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={openNotificationModal}>
                <Bell color={theme.textSecondary} size={20} />
                <Text style={styles.menuItemText}>{t('Header:notifications.title')}</Text>
                {notificationCount > 0 && (
                  <View style={[styles.badge, { position: 'relative', top: 0, right: 0, marginLeft: 'auto' }]}>
                    <Text style={styles.badgeText}>{notificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={openSettingsModal}>
                <Settings color={theme.textSecondary} size={20} />
                <Text style={styles.menuItemText}>{t('Header:user_menu.settings')}</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <LogOut color="#EF4444" size={20} />
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
                notifications.map((noti) => (
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

      {/* Settings Modal */}
      <Modal visible={isSettingsModalOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeSettingsModal}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('Header:settings.title')}</Text>
              <TouchableOpacity onPress={closeSettingsModal} style={styles.closeBtn}>
                <X color={theme.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.settingsBody}>
              {/* Theme Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>{t('Header:settings.theme.title')}</Text>
                <Text style={styles.settingsSectionDesc}>{t('Header:settings.theme.description')}</Text>
                <View style={styles.settingsOptions}>
                  <TouchableOpacity 
                    style={[styles.settingsBtn, themeMode === 'dark' && styles.settingsBtnActive]} 
                    onPress={() => themeMode === 'light' && toggleTheme()}
                  >
                    <Moon color={themeMode === 'dark' ? theme.btnPrimaryText : theme.textSecondary} size={20} />
                    <Text style={[styles.settingsBtnText, themeMode === 'dark' && styles.settingsBtnTextActive]}>
                      {t('Header:settings.theme.dark')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.settingsBtn, themeMode === 'light' && styles.settingsBtnActive]} 
                    onPress={() => themeMode === 'dark' && toggleTheme()}
                  >
                    <Sun color={themeMode === 'light' ? theme.btnPrimaryText : theme.textSecondary} size={20} />
                    <Text style={[styles.settingsBtnText, themeMode === 'light' && styles.settingsBtnTextActive]}>
                      {t('Header:settings.theme.light')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Language Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>{t('Header:settings.language.title')}</Text>
                <Text style={styles.settingsSectionDesc}>{t('Header:settings.language.description')}</Text>
                <View style={styles.settingsOptions}>
                  <TouchableOpacity 
                    style={[styles.settingsBtn, i18n.language === 'en' && styles.settingsBtnActive]} 
                    onPress={() => handleLanguageChange('en')}
                  >
                    <Globe color={i18n.language === 'en' ? theme.btnPrimaryText : theme.textSecondary} size={20} />
                    <Text style={[styles.settingsBtnText, i18n.language === 'en' && styles.settingsBtnTextActive]}>
                      English (UK)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.settingsBtn, i18n.language === 'jp' && styles.settingsBtnActive]} 
                    onPress={() => handleLanguageChange('jp')}
                  >
                    <Globe color={i18n.language === 'jp' ? theme.btnPrimaryText : theme.textSecondary} size={20} />
                    <Text style={[styles.settingsBtnText, i18n.language === 'jp' && styles.settingsBtnTextActive]}>
                      日本語 (JP)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default BottomNav;