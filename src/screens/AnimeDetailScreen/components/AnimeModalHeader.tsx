/**
 * AnimeModalHeader.tsx - Header Component
 * Displays anime info, close button, favorite toggle, and save button
 */

import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import type { Anime_Modal } from '@umamusumeenjoyer/shared-logic'
import { spacing, radius, typography } from '../../../styles/theme'

type Props = {
  anime: Anime_Modal
  onClose: () => void
  onSave: () => void
  isFavorite: boolean
  toggleFavorite: () => void
  theme: any
}

const AnimeModalHeader: React.FC<Props> = ({
  anime,
  onClose,
  onSave,
  isFavorite,
  toggleFavorite,
  theme,
}) => {
  const { t } = useTranslation(['AnimeModal', 'common'])

  return (
    <View style={[styles.header, { backgroundColor: theme.bgPanel }]}>
      {/* Left: Close Button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>
          ✕
        </Text>
      </TouchableOpacity>

      {/* Center: Anime Info */}
      <View style={styles.centerContent}>
        {anime.cover_image && (
          <Image
            source={{ uri: anime.cover_image }}
            style={styles.coverImage}
          />
        )}
        <Text
          style={[styles.animeTitle, { color: theme.textPrimary }]}
          numberOfLines={2}
        >
          {anime.name_romaji}
        </Text>
      </View>

      {/* Right: Actions (Favorite + Save) */}
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[
            styles.favoriteBtn,
            isFavorite && { backgroundColor: theme.primary },
          ]}
          onPress={toggleFavorite}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.favoriteBtnText,
              {
                color: isFavorite ? '#fff' : theme.textSecondary,
              },
            ]}
          >
            ♥
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: theme.primary }]}
          onPress={onSave}
          activeOpacity={0.7}
        >
          <Text style={styles.saveBtnText}>{t('common:buttons.save')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[2],
  },
  closeBtnText: {
    fontSize: 24,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coverImage: {
    width: 40,
    height: 60,
    borderRadius: radius.sm,
    marginRight: spacing[2],
  },
  animeTitle: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: '700',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  favoriteBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  favoriteBtnText: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
  },
})

export default AnimeModalHeader
