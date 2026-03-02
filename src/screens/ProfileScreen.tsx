/**
 * src/screens/ProfileScreen.tsx
 * Placeholder — Màn hình hồ sơ người dùng
 */
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bgApp }]}>
      <View style={styles.center}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Profile</Text>
        <Text style={[styles.sub, { color: theme.textSecondary }]}>
          {user?.avatar_url ? `Đăng nhập với: ${user.avatar_url}` : 'Hồ sơ người dùng — đang phát triển'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  sub: { fontSize: 15, textAlign: 'center' },
});

export default ProfileScreen;
