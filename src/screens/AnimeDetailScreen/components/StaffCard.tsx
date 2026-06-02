/**
 * StaffCard — Single staff member display
 * Mirrors web StaffCard.tsx
 */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { StaffCardProps } from '@umamusumeenjoyer/shared-logic';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { typography, spacing, radius } from '../../../styles/theme';
import type { ThemeTokens } from '../../../styles/theme';

const StaffCard: React.FC<StaffCardProps> = ({ staffMember: edge }) => {
  const { theme } = useTheme();
  const { t } = useTranslation(['StaffSection', 'common']);
  const s = makeStyles(theme);

  const node = (edge as any).node || edge;
  const role = (edge as any).role || node.role;
  const imageUrl = node.image?.large || node.image || node.image_url || '';
  const name = node.name?.full || node.name_full || 'Unknown';

  const hasDefaultImage = imageUrl.includes('default.jpg');

  return (
    <View style={s.card}>
      {hasDefaultImage || !imageUrl ? (
        <View style={s.noImagePlaceholder}>
          <Text style={s.noImageText}>{t('common:staff.no_image')}</Text>
        </View>
      ) : (
        <Image
          source={{ uri: imageUrl }}
          style={s.avatar}
          resizeMode="cover"
        />
      )}
      <View style={s.details}>
        <Text style={s.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={s.role} numberOfLines={1}>
          {role}
        </Text>
      </View>
    </View>
  );
};

const makeStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing['3'],
      backgroundColor: theme.bgPanel,
      borderRadius: radius.md,
      height: 72,
      overflow: 'hidden',
      paddingRight: spacing['3'],
      borderWidth: 1,
      borderColor: theme.borderSubtle,
    },
    avatar: {
      width: 52,
      height: '100%',
    },
    noImagePlaceholder: {
      width: 52,
      height: '100%',
      backgroundColor: theme.bgSubtle,
      justifyContent: 'center',
      alignItems: 'center',
    },
    noImageText: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.bold,
    },
    details: {
      flex: 1,
      paddingVertical: spacing['1'],
      justifyContent: 'center',
      minWidth: 0,
    },
    name: {
      color: theme.textPrimary,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      marginBottom: 2,
    },
    role: {
      color: theme.textSecondary,
      fontSize: typography.fontSize.xs,
    },
  });

export default StaffCard;
