/**
 * src/screens/AnimeListScreen.tsx
 * Placeholder — Màn hình danh sách anime của người dùng
 */
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const AnimeListScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bgApp }]}>
      <View style={styles.center}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Anime List</Text>
        <Text style={[styles.sub, { color: theme.textSecondary }]}>
          Danh sách anime theo dõi — đang phát triển
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

export default AnimeListScreen;
