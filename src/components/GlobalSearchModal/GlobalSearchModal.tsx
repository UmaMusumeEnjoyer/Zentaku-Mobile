import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react-native';
import { useGlobalSearch } from '@umamusumeenjoyer/shared-logic';
import type { SearchResultUser } from '@umamusumeenjoyer/shared-logic/dist/components/GlobalSearch/GlobalSearch.types';
import { useHeader } from '@umamusumeenjoyer/shared-logic';

import { useTheme } from '../../context/ThemeContext';
import { typography, spacing, radius } from '../../styles/theme';
import type { ThemeTokens } from '../../styles/theme';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect: (username: string) => void;
}

const BACKEND_DOMAIN = process.env.EXPO_PUBLIC_BACKEND_DOMAIN;
const DEFAULT_AVATAR = process.env.EXPO_PUBLIC_DEFAULT_AVATAR_URL;

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onUserSelect,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['Header']);
  const s = makeStyles(theme);

  // We use useHeader's getAvatarUrl to format avatars properly
  const { getAvatarUrl } = useHeader({
    isAuthenticated: false,
    defaultAvatar: DEFAULT_AVATAR,
    backendDomain: BACKEND_DOMAIN,
  });

  const {
    searchTerm,
    results,
    loading,
    handleInputChange,
    handleUserClick,
  } = useGlobalSearch(isOpen, onClose, onUserSelect);

  // Wrapper for handleInputChange to convert RN string to simulated event
  const onChangeText = (text: string) => {
    handleInputChange({ target: { value: text } } as any);
  };

  const renderItem = ({ item }: { item: SearchResultUser }) => {
    const avatarUrl = getAvatarUrl(item.avatar_url, DEFAULT_AVATAR, BACKEND_DOMAIN);
    return (
      <TouchableOpacity
        style={s.userItem}
        onPress={() => handleUserClick(item.username)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: avatarUrl }} style={s.avatar} />
        <View style={s.userInfo}>
          <Text style={s.username}>{item.username}</Text>
          {item.display_name && (
            <Text style={s.displayName}>{item.display_name}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={s.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.modalContainer}>
          <View style={s.header}>
            <View style={s.searchBarContainer}>
              <Search color={theme.textSecondary} size={20} style={s.searchIcon} />
              <TextInput
                style={s.searchInput}
                placeholder={t('Header:accessibility.search', 'Search users...')}
                placeholderTextColor={theme.textSecondary}
                value={searchTerm}
                onChangeText={onChangeText}
                autoFocus
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchTerm.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')} style={s.clearBtn}>
                  <X color={theme.textSecondary} size={16} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={s.cancelBtn}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={s.content}>
            {loading ? (
              <View style={s.centerContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : results.length > 0 ? (
              <FlatList
                data={results}
                keyExtractor={(item) => item.username}
                renderItem={renderItem}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={s.listContent}
              />
            ) : searchTerm.trim().length > 0 ? (
              <View style={s.centerContainer}>
                <Text style={s.emptyText}>No users found</Text>
              </View>
            ) : (
              <View style={s.centerContainer}>
                <Text style={s.emptyText}>Type to search for users</Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'flex-start',
    },
    modalContainer: {
      backgroundColor: theme.bgPanel,
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 50 : 20, // Leave some space at top
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing['4'],
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      backgroundColor: theme.bgApp,
    },
    searchBarContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.bgSubtle,
      borderRadius: radius.md,
      paddingHorizontal: spacing['3'],
      height: 40,
    },
    searchIcon: {
      marginRight: spacing['2'],
    },
    searchInput: {
      flex: 1,
      color: theme.textPrimary,
      fontSize: typography.fontSize.base,
      height: '100%',
    },
    clearBtn: {
      padding: spacing['1'],
    },
    cancelBtn: {
      marginLeft: spacing['3'],
    },
    cancelText: {
      color: theme.primary,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
    },
    content: {
      flex: 1,
    },
    listContent: {
      padding: spacing['2'],
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing['6'],
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.base,
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing['3'],
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: spacing['3'],
      backgroundColor: theme.bgSubtle,
    },
    userInfo: {
      flex: 1,
    },
    username: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semiBold,
      color: theme.textPrimary,
    },
    displayName: {
      fontSize: typography.fontSize.sm,
      color: theme.textSecondary,
      marginTop: 2,
    },
  });

export default GlobalSearchModal;
