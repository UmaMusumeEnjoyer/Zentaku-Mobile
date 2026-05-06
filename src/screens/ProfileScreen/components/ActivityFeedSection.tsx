/**
 * ActivityFeedSection — Timeline-style activity feed.
 *
 * Mirrors web ActivityFeed, reusing useActivityFeed from shared-logic.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useActivityFeed } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from '../ProfileScreen.style';
import type { RootStackParamList } from '../../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ActivityFeedSectionProps {
  username: string;
  filterDate?: string;
}

const ActivityFeedSection: React.FC<ActivityFeedSectionProps> = ({
  username,
  filterDate,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['ActivityFeed']);
  const navigation = useNavigation<NavigationProp>();
  const s = createStyles(theme);

  const {
    loading,
    displayItems,
    canLoadMore,
    hasActivity,
    handleLoadMore,
    getTargetUrl,
    formatTimeAgo,
    getActionClass,
    getActionIconChar,
    getActionDescription,
    getTargetName,
  } = useActivityFeed({ username, filterDate, t });

  // Map action class strings to style objects
  const getIconStyle = (actionTypeClass: string) => {
    if (actionTypeClass.includes('add')) return s.feedIconAdd;
    if (actionTypeClass.includes('update')) return s.feedIconUpdate;
    return s.feedIconDefault;
  };

  const handleTargetClick = (item: any) => {
    const url = getTargetUrl(item);
    // Navigate based on URL pattern
    if (url.startsWith('/anime/')) {
      const id = url.replace('/anime/', '');
      navigation.navigate('AnimeDetail', { id });
    }
    // Lists don't have a dedicated screen yet, ignore for now
  };

  if (loading) {
    return (
      <View style={s.feedEmpty}>
        <Text style={s.feedEmptyText}>{t('ActivityFeed:loading')}</Text>
      </View>
    );
  }

  if (!hasActivity) {
    return (
      <View style={s.feedEmpty}>
        <Text style={s.feedEmptyText}>
          {filterDate
            ? t('ActivityFeed:empty_state.no_activity_on_date', {
                date: filterDate,
              })
            : t('ActivityFeed:empty_state.no_activity')}
        </Text>
      </View>
    );
  }

  return (
    <View style={s.feedContainer}>
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const actionClass = getActionClass(item.action_type);

        return (
          <View key={item.id} style={s.feedRow}>
            {/* Timeline Column */}
            <View style={s.feedTimeline}>
              <View style={[s.feedIconCircle, getIconStyle(actionClass)]}>
                <Text style={s.feedIconText}>
                  {getActionIconChar(item.action_type)}
                </Text>
              </View>
              {!isLast && <View style={s.feedLine} />}
            </View>

            {/* Content Column */}
            <View style={s.feedContentWrapper}>
              <View style={s.feedHeader}>
                <Text style={s.feedUser}>{username}</Text>
                <Text style={s.feedAction}>
                  {getActionDescription(item.action_type)}
                </Text>
                <TouchableOpacity
                  onPress={() => handleTargetClick(item)}
                  activeOpacity={0.7}
                >
                  <Text style={s.feedTarget}>{getTargetName(item)}</Text>
                </TouchableOpacity>
                <Text style={s.feedTime}>
                  {formatTimeAgo(item.ago_seconds)}
                </Text>
              </View>
            </View>
          </View>
        );
      })}

      {canLoadMore && (
        <TouchableOpacity
          style={s.btnLoadMore}
          onPress={handleLoadMore}
          activeOpacity={0.7}
        >
          <Text style={s.btnLoadMoreText}>
            {t('ActivityFeed:buttons.load_more')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ActivityFeedSection;
