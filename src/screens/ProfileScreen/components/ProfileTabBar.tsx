/**
 * ProfileTabBar — Horizontal scrollable tab bar.
 *
 * Mirrors web ProfileBanner, reusing useProfileBanner from shared-logic.
 * Uses lucide-react-native icons instead of raw SVG paths (since react-native-svg
 * may not be installed separately).
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import {
  LayoutList,
  BookOpen,
  Star,
  Users,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useProfileBanner, type ProfileTabType } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from '../ProfileScreen.style';

interface ProfileTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Map tab keys to lucide icons
const TAB_ICONS: Record<string, React.FC<any>> = {
  Overview: LayoutList,
  'Anime List': BookOpen,
  Favorites: Star,
  Social: Users,
};

const ProfileTabBar: React.FC<ProfileTabBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation('ProfilePagePage');
  const s = createStyles(theme);

  const { tabs, handleTabClick } = useProfileBanner(onTabChange);

  const getTabLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      Overview: t('tabs.overview'),
      'Anime List': t('tabs.anime_list'),
      Favorites: t('tabs.favorites'),
      Social: t('tabs.social'),
    };
    return labelMap[key] || key;
  };

  return (
    <View style={s.tabBarContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabBarScroll}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const IconComponent = TAB_ICONS[tab.key] || LayoutList;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[s.tabItem, isActive && s.tabItemActive]}
              onPress={() => handleTabClick(tab.key as ProfileTabType)}
              activeOpacity={0.7}
            >
              <IconComponent
                size={16}
                color={isActive ? theme.textPrimary : theme.textSecondary}
              />
              <Text style={[s.tabText, isActive && s.tabTextActive]}>
                {getTabLabel(tab.key)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ProfileTabBar;
