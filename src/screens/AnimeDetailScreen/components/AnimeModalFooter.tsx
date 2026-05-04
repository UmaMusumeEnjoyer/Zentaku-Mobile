/**
 * AnimeModalFooter.tsx - Footer Component
 * Displays delete button (only shown when in edit mode)
 */

import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native'
import { useTranslation } from 'react-i18next'
import { spacing, radius, typography } from '../../../styles/theme'

type Props = {
  onDelete: () => void
  theme: any
}

const AnimeModalFooter: React.FC<Props> = ({ onDelete, theme }) => {
  const { t } = useTranslation(['AnimeModal', 'common'])

  const handleDeletePress = () => {
    Alert.alert(
      t('AnimeModal:alerts.delete_title'),
      t('AnimeModal:alerts.delete_message'),
      [
        {
          text: t('common:buttons.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('common:buttons.delete'),
          onPress: onDelete,
          style: 'destructive',
        },
      ]
    )
  }

  return (
    <View style={[styles.footer, { backgroundColor: theme.bgPanel }]}>
      <TouchableOpacity
        style={[styles.deleteBtn, { backgroundColor: '#f55' }]}
        onPress={handleDeletePress}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteBtnText}>{t('common:buttons.delete')}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  deleteBtn: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: typography.fontSize.md,
    fontWeight: '700',
  },
})

export default AnimeModalFooter
