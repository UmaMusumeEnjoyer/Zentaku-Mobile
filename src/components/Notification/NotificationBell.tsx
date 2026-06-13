/**
 * src/components/Notification/NotificationBell.tsx
 *
 * Notification bell icon with badge for React Native.
 * Shows unread count and navigates to a notification list or triggers a bottom sheet.
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNotificationStore } from '@umamusumeenjoyer/shared-logic';
import { useTheme } from '../../context/ThemeContext';

interface NotificationBellProps {
  onPress?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.bgPanel || 'rgba(255,255,255,0.1)' }]}>
        <Text style={[styles.icon, { color: theme.textPrimary || '#fff' }]}>🔔</Text>
      </View>
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ff4757',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default NotificationBell;
