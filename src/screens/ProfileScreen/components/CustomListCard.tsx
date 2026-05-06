/**
 * CustomListCard — Card for displaying a custom anime list.
 *
 * Shows list name, description, private badge, and optional like count.
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from '../ProfileScreen.style';
import type { CustomList } from '@umamusumeenjoyer/shared-logic';

interface CustomListCardProps {
  list: CustomList;
  onPress: (list: CustomList) => void;
  showLikeCount?: boolean;
}

const CustomListCard: React.FC<CustomListCardProps> = ({
  list,
  onPress,
  showLikeCount = false,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation('ProfilePagePage');
  const s = createStyles(theme);

  return (
    <TouchableOpacity
      style={s.listCard}
      onPress={() => onPress(list)}
      activeOpacity={0.7}
    >
      <View style={s.listNameRow}>
        <Text style={s.listName} numberOfLines={1}>
          {list.list_name}
        </Text>
        {list.is_private && (
          <View style={s.privateBadge}>
            <Text style={s.privateBadgeText}>
              {t('anime_list.badges.private')}
            </Text>
          </View>
        )}
      </View>

      {list.description ? (
        <Text style={s.listDesc} numberOfLines={2}>
          {list.description}
        </Text>
      ) : null}

      {showLikeCount && list.like_count != null && (
        <Text style={s.listMeta}>
          {t('anime_list.likes_count', { count: list.like_count })}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomListCard;
