/**
 * CreateListModal — Modal for creating a new custom anime list.
 *
 * Mirrors the inline "Create List" modal from web ProfilePage.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { createStyles } from '../ProfileScreen.style';
import type { NewListData } from '@umamusumeenjoyer/shared-logic';

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  newListData: NewListData;
  creating: boolean;
  onSubmit: (e: any) => void;
  onInputChange: (e: any) => void;
}

const CreateListModal: React.FC<CreateListModalProps> = ({
  isOpen,
  onClose,
  newListData,
  creating,
  onSubmit,
  onInputChange,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation('ProfilePagePage');
  const s = createStyles(theme);

  // Adapter: bridge RN TextInput to web onChange pattern
  const handleTextChange = (name: string, value: string) => {
    const syntheticEvent = {
      target: { name, value, type: 'text' },
    } as any;
    onInputChange(syntheticEvent);
  };

  const handleToggle = (value: boolean) => {
    const syntheticEvent = {
      target: {
        name: 'is_private',
        checked: value,
        type: 'checkbox',
        value: '',
      },
    } as any;
    onInputChange(syntheticEvent);
  };

  const handleFormSubmit = () => {
    const syntheticEvent = {
      preventDefault: () => {},
    } as any;
    onSubmit(syntheticEvent);
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
          {/* Header */}
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>
              {t('create_list_modal.title')}
            </Text>
            <TouchableOpacity
              style={s.modalCloseBtn}
              onPress={onClose}
            >
              <Text style={s.modalCloseText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* List Name */}
          <View style={s.formGroup}>
            <Text style={s.formLabel}>
              {t('create_list_modal.fields.list_name.label') ||
                'List Name'}
            </Text>
            <TextInput
              style={s.formInput}
              value={newListData.list_name}
              onChangeText={(text) =>
                handleTextChange('list_name', text)
              }
              placeholderTextColor={theme.textDisabled}
            />
          </View>

          {/* Description */}
          <View style={s.formGroup}>
            <Text style={s.formLabel}>
              {t('create_list_modal.fields.description.label') ||
                'Description'}
            </Text>
            <TextInput
              style={s.formTextarea}
              value={newListData.description}
              onChangeText={(text) =>
                handleTextChange('description', text)
              }
              multiline
              numberOfLines={3}
              placeholderTextColor={theme.textDisabled}
            />
          </View>

          {/* Private Toggle */}
          <View style={[s.formGroup, s.formCheckboxRow]}>
            <Switch
              value={newListData.is_private}
              onValueChange={handleToggle}
              trackColor={{
                false: theme.borderSubtle,
                true: theme.primary,
              }}
              thumbColor="#FFFFFF"
            />
            <Text style={s.formLabel}>
              {t('create_list_modal.fields.is_private.label') ||
                'Private List'}
            </Text>
          </View>

          {/* Footer */}
          <View style={s.modalFooter}>
            <TouchableOpacity style={s.btnCancel} onPress={onClose}>
              <Text style={s.btnCancelText}>
                {t('create_list_modal.actions.cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                s.btnCreate,
                creating && s.btnCreateDisabled,
              ]}
              onPress={handleFormSubmit}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={s.btnCreateText}>
                  {t('create_list_modal.actions.create')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CreateListModal;
