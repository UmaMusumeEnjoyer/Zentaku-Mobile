/**
 * EditProfileModal — Modal for editing user profile.
 *
 * Mirrors web EditProfileModal, reusing useEditProfileModal from shared-logic.
 * Avatar upload uses placeholder (expo-image-picker not installed).
 */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  useEditProfileModal,
  type EditProfileModalProps as SharedEditProfileModalProps,
} from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from '../ProfileScreen.style';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SharedEditProfileModalProps['currentUser'];
  onUpdateSuccess: SharedEditProfileModalProps['onUpdateSuccess'];
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateSuccess,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation('EditProfileModal');
  const s = createStyles(theme);

  const {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
  } = useEditProfileModal(isOpen, currentUser, onUpdateSuccess, onClose);

  // Adapter: React Native TextInput doesn't use HTML ChangeEvent
  const handleInputChange = (name: string, value: string) => {
    // Simulate the web onChange event structure
    const syntheticEvent = {
      target: { name, value, type: 'text' },
    } as any;
    handleChange(syntheticEvent);
  };

  // Adapter: Form submit doesn't use HTML FormEvent
  const handleFormSubmit = () => {
    const syntheticEvent = {
      preventDefault: () => {},
    } as any;
    handleSubmit(syntheticEvent);
  };

  const handleUploadPress = () => {
    Alert.alert(
      t('avatar.label'),
      'Avatar upload requires expo-image-picker. Please install it first.',
      [{ text: 'OK' }],
    );
  };

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <TouchableOpacity
        style={s.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={s.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t('title')}</Text>
              <TouchableOpacity
                style={s.modalCloseBtn}
                onPress={onClose}
              >
                <Text style={s.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Error */}
            {error && (
              <View style={s.errorMsg}>
                <Text style={s.errorMsgText}>{error}</Text>
              </View>
            )}

            {/* Avatar Section */}
            <View style={s.avatarSection}>
              <Text style={s.formLabel}>{t('avatar.label')}</Text>
              <View style={s.avatarActions}>
                <TouchableOpacity
                  style={s.btnAvatarAction}
                  onPress={handleUploadPress}
                  disabled={loading}
                >
                  <Text style={s.btnAvatarActionText}>
                    {t('avatar.upload')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.btnAvatarAction, s.btnAvatarDelete]}
                  onPress={handleUploadPress}
                  disabled={loading || !currentUser?.avatar_url}
                >
                  <Text
                    style={[s.btnAvatarActionText, s.btnAvatarDeleteText]}
                  >
                    {t('avatar.delete')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Display Name */}
            <View style={s.formGroup}>
              <Text style={s.formLabel}>
                {t('fields.display_name.label', 'Display Name')}
              </Text>
              <TextInput
                style={s.formInput}
                value={formData.displayName}
                onChangeText={(text) =>
                  handleInputChange('displayName', text)
                }
                placeholderTextColor={theme.textDisabled}
              />
            </View>

            {/* Bio */}
            <View style={s.formGroup}>
              <Text style={s.formLabel}>
                {t('fields.bio.label', 'Bio')}
              </Text>
              <TextInput
                style={[s.formInput, { minHeight: 80, textAlignVertical: 'top' }]}
                value={formData.bio}
                onChangeText={(text) =>
                  handleInputChange('bio', text)
                }
                multiline
                placeholderTextColor={theme.textDisabled}
              />
            </View>

            {/* Location */}
            <View style={s.formGroup}>
              <Text style={s.formLabel}>
                {t('fields.location.label', 'Location')}
              </Text>
              <TextInput
                style={s.formInput}
                value={formData.location}
                onChangeText={(text) =>
                  handleInputChange('location', text)
                }
                placeholderTextColor={theme.textDisabled}
              />
            </View>

            {/* Website */}
            <View style={s.formGroup}>
              <Text style={s.formLabel}>
                {t('fields.website.label', 'Website')}
              </Text>
              <TextInput
                style={s.formInput}
                value={formData.website}
                onChangeText={(text) =>
                  handleInputChange('website', text)
                }
                autoCapitalize="none"
                keyboardType="url"
                placeholderTextColor={theme.textDisabled}
              />
            </View>

            {/* Footer */}
            <View style={s.modalFooter}>
              <TouchableOpacity style={s.btnCancel} onPress={onClose}>
                <Text style={s.btnCancelText}>{t('actions.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.btnSave, loading && s.btnCreateDisabled]}
                onPress={handleFormSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={s.btnSaveText}>{t('actions.save')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default EditProfileModal;
