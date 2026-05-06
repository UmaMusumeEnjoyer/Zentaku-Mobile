/**
 * ProfileScreen — Full user profile screen.
 *
 * Mirrors pbl5_webFE/src/pages/ProfilePage/ProfilePage.tsx
 * Reuses business logic from shared-logic:
 *   - useProfilePage(username, callbacks) for all profile data & actions
 *
 * Layout (mobile-first):
 *   ScrollView
 *   ├── ProfileHeader (avatar, names, meta)
 *   ├── ProfileTabBar (Overview | Anime List | Favorites | Social)
 *   └── Tab Content
 *       ├── Overview: ActivityHistory + ActivityFeed
 *       ├── Anime List: CustomLists + LikedLists
 *       └── Favorites: AnimeCard grid
 *
 * Modals: EditProfileModal, CreateListModal
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  useProfilePage,
} from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { createStyles } from './ProfileScreen.style';
import { spacing } from '../../styles/theme';

// Sub-components
import ProfileHeader from './components/ProfileHeader';
import ProfileTabBar from './components/ProfileTabBar';
import ActivityHistorySection from './components/ActivityHistorySection';
import ActivityFeedSection from './components/ActivityFeedSection';
import EditProfileModal from './components/EditProfileModal';
import CreateListModal from './components/CreateListModal';
import CustomListCard from './components/CustomListCard';
import AnimeCard from '../../components/AnimeCard/AnimeCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - spacing['4'] * 2 - spacing['3'] * 2) / 3;

const ProfileScreen: React.FC = () => {
  const { theme, themeMode } = useTheme();
  const { updateUserInState: syncAuthUser } = useAuth();
  const { t } = useTranslation('ProfilePagePage');
  const s = createStyles(theme);

  // Get logged-in username from localStorage shim
  const loggedInUsername =
    (global as any).localStorage?.getItem('username') || undefined;

  const {
    targetUsername,
    isOwnProfile,
    userProfile,
    profileLoading,
    getDisplayName,
    getAvatarUrl,
    formatDateJoined,
    activeTab,
    handleTabChange,
    totalContributions,
    setTotalContributions,
    selectedDate,
    handleDateSelect,
    customLists,
    listsLoading,
    likedLists,
    likedListsLoading,
    handleListClick,
    favoriteList,
    favLoading,
    showEditModal,
    setShowEditModal,
    handleUpdateSuccess,
    showCreateModal,
    setShowCreateModal,
    newListData,
    creating,
    handleCreateListSubmit,
    handleNewListInputChange,
  } = useProfilePage(loggedInUsername, {
    onNavigateToList: (_listId) => {
      // TODO: Navigate to list detail when screen is implemented
    },
    onNavigateToUserProfile: (_newUsername) => {
      // Profile is the current screen, no navigation needed
    },
  });

  // Sync auth user when viewing own profile
  React.useEffect(() => {
    if (isOwnProfile && userProfile) {
      syncAuthUser(userProfile);
    }
  }, [isOwnProfile, userProfile, syncAuthUser]);

  // ── Loading State ──
  if (profileLoading) {
    return (
      <SafeAreaView style={s.safeArea}>
        <StatusBar
          barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.bgApp}
        />
        <View style={s.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={s.loadingText}>{t('loading') || 'Loading...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bgApp}
        translucent={Platform.OS === 'android'}
      />

      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Header (replaces sidebar) ── */}
        <ProfileHeader
          userProfile={userProfile}
          isOwnProfile={isOwnProfile}
          targetUsername={targetUsername}
          getDisplayName={getDisplayName}
          getAvatarUrl={getAvatarUrl}
          formatDateJoined={formatDateJoined}
          onEditProfile={() => setShowEditModal(true)}
        />

        {/* ── Tab Bar ── */}
        <ProfileTabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* ═══ TAB: OVERVIEW ═══ */}
        {activeTab === 'Overview' && (
          <>
            {/* Activity History (Heatmap) */}
            <View style={s.sectionContainer}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>
                  {t('overview.contributions.title', {
                    count: totalContributions,
                  })}
                </Text>
              </View>
            </View>
            <ActivityHistorySection
              username={targetUsername}
              onTotalCountChange={setTotalContributions}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />

            {/* Activity Feed */}
            <View style={s.sectionContainer}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>
                  {t('overview.activity.title') || 'Activity'}
                </Text>
              </View>
            </View>
            <ActivityFeedSection
              username={targetUsername}
              filterDate={selectedDate || undefined}
            />
          </>
        )}

        {/* ═══ TAB: ANIME LIST ═══ */}
        {activeTab === 'Anime List' && (
          <>
            {/* My Custom Lists */}
            <View style={s.sectionContainer}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>
                  {isOwnProfile || userProfile?.is_own_profile
                    ? t('anime_list.my_custom_lists')
                    : t('anime_list.users_lists', {
                        username: targetUsername,
                      })}
                </Text>
                {(isOwnProfile || userProfile?.is_own_profile) && (
                  <TouchableOpacity
                    style={s.btnEditProfile}
                    onPress={() => setShowCreateModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={s.btnEditProfileText}>
                      {t('anime_list.new_list')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {listsLoading ? (
                <ActivityIndicator
                  size="small"
                  color={theme.primary}
                  style={{ paddingVertical: spacing['5'] }}
                />
              ) : (
                <>
                  {customLists.map((list) => (
                    <CustomListCard
                      key={list.list_id}
                      list={list}
                      onPress={handleListClick}
                    />
                  ))}
                  {customLists.length === 0 && (
                    <Text style={s.emptyText}>
                      {t('anime_list.empty.no_lists')}
                    </Text>
                  )}
                </>
              )}
            </View>

            {/* Liked Lists */}
            {(isOwnProfile || userProfile?.is_own_profile) && (
              <View style={[s.sectionContainer, { marginTop: spacing['6'] }]}>
                <View style={s.sectionHeader}>
                  <Text style={s.sectionTitle}>
                    {t('anime_list.liked_lists')}
                  </Text>
                </View>

                {likedListsLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.primary}
                    style={{ paddingVertical: spacing['5'] }}
                  />
                ) : (
                  <>
                    {likedLists.map((list) => (
                      <CustomListCard
                        key={list.list_id}
                        list={list}
                        onPress={handleListClick}
                        showLikeCount
                      />
                    ))}
                    {likedLists.length === 0 && (
                      <Text style={s.emptyText}>
                        {t('anime_list.empty.no_liked_lists')}
                      </Text>
                    )}
                  </>
                )}
              </View>
            )}
          </>
        )}

        {/* ═══ TAB: FAVORITES ═══ */}
        {activeTab === 'Favorites' && (
          <View style={s.sectionContainer}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{t('favorites.title')}</Text>
            </View>

            {favLoading ? (
              <ActivityIndicator
                size="small"
                color={theme.primary}
                style={{ paddingVertical: spacing['5'] }}
              />
            ) : (
              <View style={s.favoritesGrid}>
                {favoriteList.map((anime) => (
                  <AnimeCard
                    key={anime.id || anime.anilist_id}
                    anime={anime}
                    style={{ width: CARD_WIDTH, marginRight: 0 }}
                  />
                ))}
                {favoriteList.length === 0 && (
                  <Text style={s.emptyText}>
                    {t('favorites.empty') || 'No favorites yet'}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ── Modals ── */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentUser={userProfile as any}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {showCreateModal &&
        (isOwnProfile || userProfile?.is_own_profile) && (
          <CreateListModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            newListData={newListData}
            creating={creating}
            onSubmit={handleCreateListSubmit}
            onInputChange={handleNewListInputChange}
          />
        )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
