/**
 * AnimeModalForm.tsx - Form Component
 * Contains all editable fields for anime tracking:
 * - Status (Plan to Watch, Watching, Completed, Dropped, On Hold)
 * - Score (0-10)
 * - Episode Progress
 * - Start Date / Finish Date
 * - Total Rewatches
 * - Notes
 * - Private flag
 */

import React from 'react'
import {
  View,
  Text,
  TextInput,
  Picker,
  Switch,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import type { EditorFormData } from '@umamusumeenjoyer/shared-logic'
import { spacing, radius, typography } from '../../../styles/theme'

type Props = {
  formData: EditorFormData
  handleChange: (e: any) => void
  isEditMode: boolean | undefined
  theme: any
}

const AnimeModalForm: React.FC<Props> = ({
  formData,
  handleChange,
  isEditMode,
  theme,
}) => {
  const { t } = useTranslation(['AnimeModal'])

  // Helper to create change handler for different field types
  const createChangeHandler = (fieldName: string) => (value: any) => {
    const mockEvent = {
      target: {
        name: fieldName,
        value: value,
        type: fieldName === 'private' ? 'checkbox' : 'text',
        checked: value,
      },
    }
    handleChange(mockEvent)
  }

  return (
    <View style={styles.formContainer}>
      {/* --- STATUS GROUP --- */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {t('AnimeModal:labels.status')}
        </Text>
        <View
          style={[
            styles.selectContainer,
            {
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <Picker
            selectedValue={formData.status}
            onValueChange={createChangeHandler('status')}
            style={[styles.picker, { color: theme.textPrimary }]}
          >
            <Picker.Item
              label={t('AnimeModal:status_options.plan_to_watch')}
              value="plan_to_watch"
            />
            <Picker.Item
              label={t('AnimeModal:status_options.watching')}
              value="watching"
            />
            <Picker.Item
              label={t('AnimeModal:status_options.completed')}
              value="completed"
            />
            <Picker.Item
              label={t('AnimeModal:status_options.dropped')}
              value="dropped"
            />
            <Picker.Item
              label={t('AnimeModal:status_options.on_hold')}
              value="on_hold"
            />
          </Picker>
        </View>
      </View>

      {/* --- SCORE GROUP --- */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {t('AnimeModal:labels.score')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            },
          ]}
          placeholder="0-10"
          placeholderTextColor={theme.textSecondary}
          keyboardType="decimal-pad"
          value={String(formData.score)}
          onChangeText={createChangeHandler('score')}
        />
      </View>

      {/* --- EPISODE PROGRESS GROUP --- */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {t('AnimeModal:labels.episode_progress')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            },
          ]}
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          value={String(formData.progress)}
          onChangeText={createChangeHandler('progress')}
        />
      </View>

      {/* --- START DATE GROUP --- */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {t('AnimeModal:labels.start_date')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            },
          ]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.textSecondary}
          value={formData.startDate}
          onChangeText={createChangeHandler('startDate')}
        />
      </View>

      {/* --- FINISH DATE GROUP --- */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {t('AnimeModal:labels.finish_date')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            },
          ]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={theme.textSecondary}
          value={formData.finishDate}
          onChangeText={createChangeHandler('finishDate')}
        />
      </View>

      {/* --- TOTAL REWATCHES GROUP --- */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {t('AnimeModal:labels.total_rewatches')}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            },
          ]}
          placeholder="0"
          placeholderTextColor={theme.textSecondary}
          keyboardType="number-pad"
          value={String(formData.rewatches)}
          onChangeText={createChangeHandler('rewatches')}
        />
      </View>

      {/* --- NOTES GROUP --- */}
      <View style={[styles.formGroup, styles.notesGroup]}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {t('AnimeModal:labels.notes')}
        </Text>
        <TextInput
          style={[
            styles.textarea,
            {
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            },
          ]}
          placeholder={t('AnimeModal:placeholders.notes')}
          placeholderTextColor={theme.textSecondary}
          multiline
          numberOfLines={4}
          value={formData.notes}
          onChangeText={createChangeHandler('notes')}
          textAlignVertical="top"
        />
      </View>

      {/* --- CUSTOM LISTS INFO --- */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: theme.textPrimary }]}>
          {t('AnimeModal:labels.custom_lists')}
        </Text>
        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            {t('AnimeModal:placeholders.no_custom_lists')}
          </Text>
        </View>
      </View>

      {/* --- PRIVATE CHECKBOX --- */}
      <View style={[styles.formGroup, styles.checkboxGroup]}>
        <View style={styles.checkboxRow}>
          <Text style={[styles.checkboxLabel, { color: theme.textPrimary }]}>
            {t('AnimeModal:labels.private')}
          </Text>
          <Switch
            value={formData.private}
            onValueChange={createChangeHandler('private')}
            trackColor={{ false: '#ccc', true: theme.primary }}
            thumbColor={formData.private ? theme.primary : '#f0f0f0'}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  formContainer: {
    paddingBottom: spacing[4],
  },
  formGroup: {
    marginBottom: spacing[4],
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  selectContainer: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.fontSize.md,
    fontFamily: 'System',
  },
  textarea: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.fontSize.md,
    fontFamily: 'System',
    minHeight: 120,
  },
  notesGroup: {
    marginBottom: spacing[4],
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  checkboxGroup: {
    marginBottom: spacing[2],
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  checkboxLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: '500',
  },
})

export default AnimeModalForm
