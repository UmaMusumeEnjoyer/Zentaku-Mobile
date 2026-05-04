/**
 * AnimeModal.tsx - Main Editor Modal Component
 * MVVM Pattern: Uses useEditorModal hook from shared-logic for business logic
 * View Layer: React Native components with theme & i18n support
 */

import React from 'react'
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import type {
  Anime_Modal,
  UserStatusData_Modal,
  EditorModalProps,
} from '@umamusumeenjoyer/shared-logic'
import { useEditorModal } from '@umamusumeenjoyer/shared-logic'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../../context/ThemeContext'
import { spacing, radius, typography } from '../../../styles/theme'
import AnimeModalHeader from './AnimeModalHeader'
import AnimeModalForm from './AnimeModalForm'
import AnimeModalFooter from './AnimeModalFooter'

type Props = Omit<EditorModalProps, 'isOpen'> & {
  visible: boolean
}

const AnimeModal: React.FC<Props> = ({
  visible,
  anime,
  initialData,
  onClose,
  onSave,
  onDelete,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation(['AnimeModal', 'common'])

  // Logic from shared-logic (MVVM - Business Logic Layer)
  const {
    formData,
    isEditMode,
    handleChange,
    toggleFavorite,
    handleSaveClick,
    handleDeleteClick,
  } = useEditorModal(anime, initialData, onSave, onDelete, onClose)

  if (!anime || !visible) return null

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: theme.primary }]}>
        {/* Header */}
        <AnimeModalHeader
          anime={anime}
          onClose={onClose}
          onSave={handleSaveClick}
          isFavorite={formData.isFavorite}
          toggleFavorite={toggleFavorite}
          theme={theme}
        />

        {/* Form Content */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={true}
        >
          <AnimeModalForm
            formData={formData}
            handleChange={handleChange}
            isEditMode={isEditMode}
            theme={theme}
          />
        </ScrollView>

        {/* Footer - Delete Button (only in edit mode) */}
        {isEditMode && (
          <AnimeModalFooter
            onDelete={handleDeleteClick}
            theme={theme}
          />
        )}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
})

export default AnimeModal
