/**
 * src/navigation/MainLayout.tsx
 *
 * Wrapper screen bao quanh tất cả các màn hình chính (Home, Browse, AnimeList, Profile).
 * BottomNav được render ở đây như một overlay — xuất hiện ở tất cả screen bên trong.
 *
 * Cấu trúc:
 *   MainLayout (RootStack screen)
 *   └── View (flex:1)
 *       ├── InnerStack.Navigator
 *       │   ├── Home
 *       │   ├── Browse
 *       │   ├── AnimeList
 *       │   └── Profile
 *       └── BottomNav (absolute overlay)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import BrowseScreen from '../screens/BrowseScreen';
import AnimeListScreen from '../screens/AnimeListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BottomNav from '../components/Navigation/Navigation';
import { useAuth } from '../context/AuthContext';
import HomeLoginScreen from '../screens/HomeScreen/HomeLoginScreen';

import type { MainStackParamList } from './types';

const Inner = createNativeStackNavigator<MainStackParamList>();

const MainLayout: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: theme.bgApp }]}>
      {/* Nested navigator — chiếm toàn bộ không gian */}
      <Inner.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.bgApp,
            // Thêm padding bottom để nội dung không bị BottomNav che khuất
            paddingBottom: 70,
          },
        }}
      >
        {/* Screen mặc định tùy trạng thái login */}
        <Inner.Screen
          name="Home"
          children={(props) => user ? <HomeLoginScreen {...props as any} /> : <HomeScreen {...props as any} />}
        />
        <Inner.Screen name="Browse" component={BrowseScreen} />
        {/* AnimeList và Profile chỉ hữu ích khi đã đăng nhập,
            nhưng vẫn đăng ký để Navigation.tsx không throw lỗi navigate */}
        <Inner.Screen name="AnimeList" component={AnimeListScreen} />
        <Inner.Screen name="Profile" component={ProfileScreen} />
        <Inner.Screen name="Settings" component={SettingsScreen} />
      </Inner.Navigator>

      {/* BottomNav — absolute, hiển thị trên tất cả screen bên trong */}
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainLayout;
