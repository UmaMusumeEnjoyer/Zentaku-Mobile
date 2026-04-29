/**
 * src/screens/SettingsScreen.tsx
 *
 * Trang Settings riêng biệt — thay thế modal Settings trong Navigation.
 * Bao gồm: Theme toggle, Language selector, App Info, Logout.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  Moon,
  Sun,
  Globe,
  ChevronLeft,
  LogOut,
  Info,
  Palette,
  Languages,
  Check,
} from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import type { LangCode } from '../i18n/config';
import { typography, spacing, radius } from '../styles/theme';
import type { ThemeTokens } from '../styles/theme';

// ----------------------------------------------------------------
// Main Screen
// ----------------------------------------------------------------

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { theme, themeMode, toggleTheme } = useTheme();
  const { language, setLanguage, languages } = useLanguage();
  const { user, logout: authLogout } = useAuth();
  const { t, i18n } = useTranslation(['mobile', 'Header', 'common']);

  const s = makeStyles(theme);
  const isAuthenticated = !!user;

  const handleLogout = () => {
    authLogout();
    navigation.getParent()?.navigate('Login' as never);
  };

  const handleLanguageChange = (lang: LangCode) => {
    setLanguage(lang);
    i18n.changeLanguage(lang as string);
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bgApp}
      />

      {/* ---- Header ---- */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ChevronLeft color={theme.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>
          {t('settings.title', { ns: 'mobile' })}
        </Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Theme Section ---- */}
        <View style={s.section}>
          <View style={s.sectionHeaderRow}>
            <Palette color={theme.primary} size={20} />
            <Text style={s.sectionTitle}>
              {t('Header:settings.theme.title')}
            </Text>
          </View>
          <Text style={s.sectionDesc}>
            {t('Header:settings.theme.description')}
          </Text>

          <View style={s.optionsGrid}>
            {/* Dark mode */}
            <TouchableOpacity
              style={[
                s.optionCard,
                themeMode === 'dark' && s.optionCardActive,
              ]}
              onPress={() => themeMode === 'light' && toggleTheme()}
              activeOpacity={0.7}
            >
              <View style={s.optionIconWrap}>
                <Moon
                  color={
                    themeMode === 'dark'
                      ? theme.textOnPrimary
                      : theme.textSecondary
                  }
                  size={22}
                />
              </View>
              <Text
                style={[
                  s.optionLabel,
                  themeMode === 'dark' && s.optionLabelActive,
                ]}
              >
                {t('Header:settings.theme.dark')}
              </Text>
              {themeMode === 'dark' && (
                <View style={s.checkBadge}>
                  <Check color={theme.textOnPrimary} size={14} />
                </View>
              )}
            </TouchableOpacity>

            {/* Light mode */}
            <TouchableOpacity
              style={[
                s.optionCard,
                themeMode === 'light' && s.optionCardActive,
              ]}
              onPress={() => themeMode === 'dark' && toggleTheme()}
              activeOpacity={0.7}
            >
              <View style={s.optionIconWrap}>
                <Sun
                  color={
                    themeMode === 'light'
                      ? theme.textOnPrimary
                      : theme.textSecondary
                  }
                  size={22}
                />
              </View>
              <Text
                style={[
                  s.optionLabel,
                  themeMode === 'light' && s.optionLabelActive,
                ]}
              >
                {t('Header:settings.theme.light')}
              </Text>
              {themeMode === 'light' && (
                <View style={s.checkBadge}>
                  <Check color={theme.textOnPrimary} size={14} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- Language Section ---- */}
        <View style={s.section}>
          <View style={s.sectionHeaderRow}>
            <Languages color={theme.primary} size={20} />
            <Text style={s.sectionTitle}>
              {t('Header:settings.language.title')}
            </Text>
          </View>
          <Text style={s.sectionDesc}>
            {t('Header:settings.language.description')}
          </Text>

          <View style={s.optionsGrid}>
            {/* English */}
            <TouchableOpacity
              style={[
                s.optionCard,
                i18n.language === 'en' && s.optionCardActive,
              ]}
              onPress={() => handleLanguageChange('en')}
              activeOpacity={0.7}
            >
              <View style={s.optionIconWrap}>
                <Globe
                  color={
                    i18n.language === 'en'
                      ? theme.textOnPrimary
                      : theme.textSecondary
                  }
                  size={22}
                />
              </View>
              <Text
                style={[
                  s.optionLabel,
                  i18n.language === 'en' && s.optionLabelActive,
                ]}
              >
                English (UK)
              </Text>
              {i18n.language === 'en' && (
                <View style={s.checkBadge}>
                  <Check color={theme.textOnPrimary} size={14} />
                </View>
              )}
            </TouchableOpacity>

            {/* Japanese */}
            <TouchableOpacity
              style={[
                s.optionCard,
                i18n.language === 'jp' && s.optionCardActive,
              ]}
              onPress={() => handleLanguageChange('jp')}
              activeOpacity={0.7}
            >
              <View style={s.optionIconWrap}>
                <Globe
                  color={
                    i18n.language === 'jp'
                      ? theme.textOnPrimary
                      : theme.textSecondary
                  }
                  size={22}
                />
              </View>
              <Text
                style={[
                  s.optionLabel,
                  i18n.language === 'jp' && s.optionLabelActive,
                ]}
              >
                日本語 (JP)
              </Text>
              {i18n.language === 'jp' && (
                <View style={s.checkBadge}>
                  <Check color={theme.textOnPrimary} size={14} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ---- App Info Section ---- */}
        <View style={s.section}>
          <View style={s.sectionHeaderRow}>
            <Info color={theme.primary} size={20} />
            <Text style={s.sectionTitle}>App Info</Text>
          </View>

          <View style={s.infoCard}>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>App</Text>
              <Text style={s.infoValue}>AniApp</Text>
            </View>
            <View style={s.infoDivider} />
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Version</Text>
              <Text style={s.infoValue}>1.0.0</Text>
            </View>
            <View style={s.infoDivider} />
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>
                {t('settings.theme', { ns: 'mobile' })}
              </Text>
              <View style={s.infoBadge}>
                <Text style={s.infoBadgeText}>
                  {themeMode === 'dark'
                    ? t('settings.dark_mode', { ns: 'mobile' })
                    : t('settings.light_mode', { ns: 'mobile' })}
                </Text>
              </View>
            </View>
            <View style={s.infoDivider} />
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>
                {t('settings.language', { ns: 'mobile' })}
              </Text>
              <View style={s.infoBadge}>
                <Text style={s.infoBadgeText}>
                  {languages[language]?.nativeLabel ?? language}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ---- Logout ---- */}
        {isAuthenticated && (
          <View style={s.section}>
            <TouchableOpacity
              style={s.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <LogOut color="#EF4444" size={20} />
              <Text style={s.logoutText}>
                {t('Header:buttons.logout')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ---- Footer ---- */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            {t('footer.copyright', {
              ns: 'common',
              year: new Date().getFullYear(),
            })}
          </Text>
        </View>

        <View style={s.bottomSpacer} />
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
      paddingHorizontal: spacing['4'],
      paddingVertical: spacing['3'],
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      backgroundColor: theme.bgPanel,
    },
    backBtn: {
      padding: spacing['1'],
      marginRight: spacing['2'],
    },
    headerTitle: {
      flex: 1,
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },
    headerSpacer: {
      width: 32,
    },

    // Scroll
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing['4'],
      paddingTop: spacing['4'],
    },

    // Section
    section: {
      marginBottom: spacing['5'],
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['2'],
      marginBottom: spacing['1'],
    },
    sectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },
    sectionDesc: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
      marginBottom: spacing['3'],
      marginLeft: spacing['1'],
    },

    // Option cards
    optionsGrid: {
      gap: spacing['2'],
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing['4'],
      backgroundColor: theme.bgPanel,
      borderWidth: 2,
      borderColor: theme.borderSubtle,
      borderRadius: radius.lg,
      gap: spacing['3'],
    },
    optionCardActive: {
      backgroundColor: theme.btnPrimaryBg,
      borderColor: theme.btnPrimaryBg,
    },
    optionIconWrap: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      backgroundColor: 'rgba(255,255,255,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionLabel: {
      flex: 1,
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
    },
    optionLabelActive: {
      color: theme.textOnPrimary,
    },
    checkBadge: {
      width: 24,
      height: 24,
      borderRadius: radius.full,
      backgroundColor: 'rgba(255,255,255,0.25)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Info card
    infoCard: {
      backgroundColor: theme.bgPanel,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      overflow: 'hidden',
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing['4'],
      paddingVertical: spacing['3'],
    },
    infoLabel: {
      fontSize: typography.fontSize.base,
      color: theme.textSecondary,
    },
    infoValue: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
    },
    infoDivider: {
      height: 1,
      backgroundColor: theme.borderSubtle,
      marginHorizontal: spacing['4'],
    },
    infoBadge: {
      backgroundColor: theme.bgSubtle,
      paddingHorizontal: spacing['3'],
      paddingVertical: spacing['1'],
      borderRadius: radius.full,
    },
    infoBadgeText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.primary,
    },

    // Logout
    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing['2'],
      padding: spacing['4'],
      backgroundColor: theme.bgPanel,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: '#EF444433',
    },
    logoutText: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.semiBold,
      color: '#EF4444',
    },

    // Footer
    footer: {
      alignItems: 'center',
      paddingVertical: spacing['4'],
    },
    footerText: {
      fontSize: typography.fontSize.xs,
      color: theme.textSecondary,
    },

    bottomSpacer: {
      height: spacing['16'],
    },
  });

export default SettingsScreen;
