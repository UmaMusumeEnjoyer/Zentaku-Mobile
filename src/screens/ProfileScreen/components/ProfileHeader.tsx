/**
 * ProfileHeader — Replaces web sidebar.
 *
 * Shows avatar, display name, username, joined date, staff badge.
 * "Edit Profile" button visible only on own profile.
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from '../ProfileScreen.style';
import type { UserProfile_ProfilePage } from '@umamusumeenjoyer/shared-logic';

interface ProfileHeaderProps {
  userProfile: UserProfile_ProfilePage | null;
  isOwnProfile: boolean;
  targetUsername: string;
  getDisplayName: () => string;
  getAvatarUrl: (url?: string | null) => string;
  formatDateJoined: (dateString?: string) => string;
  onEditProfile: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  isOwnProfile,
  targetUsername,
  getDisplayName,
  getAvatarUrl,
  formatDateJoined,
  onEditProfile,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation('ProfilePagePage');
  const s = createStyles(theme);

  return (
    <View style={s.headerContainer}>
      {/* Avatar */}
      <View style={s.avatarWrapper}>
        <Image
          source={{ uri: getAvatarUrl(userProfile?.avatar_url) }}
          style={s.avatar}
        />
      </View>

      {/* Names */}
      <View style={s.namesContainer}>
        <Text style={s.displayName}>{getDisplayName()}</Text>
        <Text style={s.username}>
          {userProfile?.username || targetUsername}
        </Text>
      </View>

      {/* Edit Profile Button */}
      {(isOwnProfile || userProfile?.is_own_profile) && (
        <TouchableOpacity
          style={s.btnEditProfile}
          onPress={onEditProfile}
          activeOpacity={0.7}
        >
          <Text style={s.btnEditProfileText}>{t('sidebar.edit_profile')}</Text>
        </TouchableOpacity>
      )}

      {/* Joined Date */}
      {userProfile?.date_joined && (
        <View style={s.metaContainer}>
          <Clock size={14} color={theme.textSecondary} />
          <Text style={s.metaText}>
            {t('sidebar.joined', {
              date: formatDateJoined(userProfile.date_joined),
            })}
          </Text>
        </View>
      )}

      {/* Separator + Staff Badge */}
      {userProfile?.is_staff && (
        <>
          <View style={s.separator} />
          <Text style={s.badgeTitle}>{t('sidebar.badges.title')}</Text>
          <View style={s.staffBadge}>
            <Text style={s.staffBadgeText}>
              ✦ {t('sidebar.badges.staff')}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default ProfileHeader;
