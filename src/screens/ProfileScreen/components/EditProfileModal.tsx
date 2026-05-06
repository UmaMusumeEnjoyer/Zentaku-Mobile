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

            {/* First Name */}
            <View style={s.formGroup}>
              <Text style={s.formLabel}>
                {t('fields.first_name.label')}
              </Text>
              <TextInput
                style={s.formInput}
                value={formData.first_name}
                onChangeText={(text) =>
                  handleInputChange('first_name', text)
                }
                placeholderTextColor={theme.textDisabled}
              />
            </View>

            {/* Last Name */}
            <View style={s.formGroup}>
              <Text style={s.formLabel}>
                {t('fields.last_name.label')}
              </Text>
              <TextInput
                style={s.formInput}
                value={formData.last_name}
                onChangeText={(text) =>
                  handleInputChange('last_name', text)
                }
                placeholderTextColor={theme.textDisabled}
              />
            </View>

            {/* Username */}
            <View style={s.formGroup}>
              <Text style={s.formLabel}>
                {t('fields.username.label')}
              </Text>
              <TextInput
                style={s.formInput}
                value={formData.username}
                onChangeText={(text) =>
                  handleInputChange('username', text)
                }
                placeholderTextColor={theme.textDisabled}
              />
              <Text style={s.formHint}>
                {t('fields.username.hint')}
              </Text>
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
