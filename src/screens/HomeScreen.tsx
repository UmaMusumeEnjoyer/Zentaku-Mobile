/**
 * src/screens/HomeScreen.tsx
 *
 * Sample screen để test theme + i18n.
 * Sử dụng StyleSheet thuần — không có styled-components hay Tailwind.
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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import type { LangCode } from '../i18n/config';
import { typography, spacing, radius } from '../styles/theme';
import type { ThemeTokens } from '../styles/theme';

// ----------------------------------------------------------------
// Sub-components (pure StyleSheet)
// ----------------------------------------------------------------

/** Card preview đơn giản */
const AnimeCard: React.FC<{ title: string; theme: ThemeTokens }> = ({ title, theme }) => {
  const s = makeCardStyles(theme);
  return (
    <View style={s.card}>
      {/* Thumbnail placeholder */}
      <View style={s.thumbnail} />
      <Text style={s.cardTitle} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
};

/** Badge label */
const Badge: React.FC<{ label: string; theme: ThemeTokens; variant?: 'primary' | 'success' | 'warning' }> = ({
  label, theme, variant = 'primary',
}) => {
  const bg =
    variant === 'success' ? theme.statusSuccess :
    variant === 'warning' ? theme.statusWarning :
    theme.primary;

  return (
    <View style={[badgeStyles.badge, { backgroundColor: bg }]}>
      <Text style={[badgeStyles.label, { color: theme.textOnPrimary }]}>{label}</Text>
    </View>
  );
};

// ----------------------------------------------------------------
// Main Screen
// ----------------------------------------------------------------

const HomeScreen: React.FC = () => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const { language, setLanguage, languages } = useLanguage();
  const { t } = useTranslation(['HomePage', 'common', 'mobile']);

  const s = makeStyles(theme);

  // Danh sách anime giả
  const sampleAnime = [
    { id: '1', title: 'Sword Art Online' },
    { id: '2', title: 'Attack on Titan' },
    { id: '3', title: 'Demon Slayer: Kimetsu no Yaiba' },
    { id: '4', title: 'My Hero Academia' },
    { id: '5', title: 'Fullmetal Alchemist: Brotherhood' },
    { id: '6', title: 'Steins;Gate' },
  ];

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
        <View style={s.header}>
          <Text style={s.appName}>AniApp</Text>
          <Text style={s.subtitle}>{t('greeting', { ns: 'HomePage', name: 'User' })}</Text>
        </View>


        {/* ---- Trending Section ---- */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>{t('trending', { ns: 'HomePage' })}</Text>
            <TouchableOpacity>
              <Text style={[s.seeAll, { color: theme.primary }]}>
                {t('see_all', { ns: 'HomePage' })}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.horizontalList}
          >
            {sampleAnime.slice(0, 4).map((item) => (
              <AnimeCard key={item.id} title={item.title} theme={theme} />
            ))}
          </ScrollView>
        </View>

        {/* ---- New Releases Section ---- */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>{t('new_releases', { ns: 'HomePage' })}</Text>
            <TouchableOpacity>
              <Text style={[s.seeAll, { color: theme.primary }]}>
                {t('see_all', { ns: 'HomePage' })}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={s.gridList}>
            {sampleAnime.map((item) => (
              <View key={item.id} style={s.gridItem}>
                <AnimeCard title={item.title} theme={theme} />
              </View>
            ))}
          </View>
        </View>

        {/* ---- Status Colors Demo ---- */}
        <View style={s.controlsCard}>
          <Text style={s.sectionTitle}>Status Colors</Text>
          <View style={s.stateRow}>
            <Badge label="Success" theme={theme} variant="success" />
            <Badge label="Warning" theme={theme} variant="warning" />
            <Badge label="Primary" theme={theme} variant="primary" />
          </View>

          <View style={[s.infoBox, { borderColor: theme.statusSuccess, backgroundColor: theme.bgSubtle }]}>
            <Text style={[s.infoText, { color: theme.statusSuccess }]}>
              ✓ Theme & i18n đang hoạt động tốt!
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
      paddingHorizontal: spacing['4'],
      paddingTop: Platform.OS === 'android' ? spacing['4'] : spacing['2'],
    },

    // Header
    header: {
      paddingVertical: spacing['5'],
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      marginBottom: spacing['4'],
    },
    appName: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: theme.primary,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: typography.fontSize.base,
      color: theme.textSecondary,
      marginTop: spacing['1'],
    },

    // Controls card
    controlsCard: {
      backgroundColor: theme.bgPanel,
      borderRadius: radius.lg,
      padding: spacing['4'],
      marginBottom: spacing['4'],
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    controlRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing['3'],
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
    },
    controlLabel: {
      fontSize: typography.fontSize.md,
      color: theme.textPrimary,
      fontWeight: typography.fontWeight.medium,
    },
    toggleBtn: {
      paddingHorizontal: spacing['4'],
      paddingVertical: spacing['2'],
      borderRadius: radius.full,
    },
    toggleBtnText: {
      color: theme.textOnPrimary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semiBold,
    },
    langBtns: {
      flexDirection: 'row',
      gap: spacing['2'],
    },
    langBtn: {
      paddingHorizontal: spacing['3'],
      paddingVertical: spacing['2'],
      borderRadius: radius.md,
      borderWidth: 1,
    },
    langBtnActive: {
      backgroundColor: theme.btnPrimaryBg,
      borderColor: theme.btnPrimaryBg,
    },
    langBtnInactive: {
      backgroundColor: 'transparent',
      borderColor: theme.borderSubtle,
    },
    langBtnText: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
    stateRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing['2'],
      marginTop: spacing['3'],
    },

    // Sections
    section: {
      marginBottom: spacing['5'],
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing['3'],
    },
    sectionTitle: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.bold,
      color: theme.textPrimary,
    },
    seeAll: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
    },
    horizontalList: {
      paddingRight: spacing['4'],
      gap: spacing['3'],
    },
    gridList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing['3'],
    },
    gridItem: {
      width: '47%',
    },

    // Info boxes
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

const makeCardStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    card: {
      width: 130,
      backgroundColor: theme.bgPanel,
      borderRadius: radius.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    thumbnail: {
      width: '100%',
      height: 180,
      backgroundColor: theme.bgHover,
    },
    cardTitle: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      color: theme.textPrimary,
      padding: spacing['2'],
      lineHeight: typography.lineHeight.tight,
    },
  });

const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: radius.full,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
