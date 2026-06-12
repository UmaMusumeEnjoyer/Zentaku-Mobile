/**
 * App.tsx — Root component
 *
 * Startup order:
 *   1. index.ts imports localStorageShim (global.localStorage polyfill)
 *   2. App.tsx imports i18n config (initializes i18next)
 *   3. initSharedLogic() called at module level (configures API + storage)
 *   4. Providers wrap: Theme → Language → Auth → Navigation
 *   5. NavigationContainer hosts AuthScreen / HomeLoginScreen
 */

// --- MUST be first in App.tsx ---
import './src/i18n/config';

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initSharedLogic, useNotificationSocket } from '@umamusumeenjoyer/shared-logic';
import type { NotificationItem } from '@umamusumeenjoyer/shared-logic';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AnimeModalProvider } from './src/context/AnimeModalContext';
import { hydrateLocalStorage } from './src/utils/localStorageShim';
import { ENV } from './src/utils/env';

import AuthScreen from './src/screens/AuthScreen';
import MainLayout from './src/navigation/MainLayout';
import AnimeDetailScreen from './src/screens/AnimeDetailScreen';
import AnimeWatchScreen from './src/screens/AnimeWatchScreen';
import CharacterScreen from './src/screens/CharacterScreen';
import StaffScreen from './src/screens/StaffScreen';
import MangaReaderScreen from './src/screens/MangaReaderScreen';
import NovelReaderScreen from './src/screens/NovelReaderScreen';
import NewsDetailScreen from './src/screens/NewsDetailScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen/ResetPasswordScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen/VerifyEmailScreen';

import type { RootStackParamList } from './src/navigation/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ----------------------------------------------------------------
// initSharedLogic — gọi một lần khi module được load
// ----------------------------------------------------------------

initSharedLogic({
  storage: {
    getItem: (key: string) => AsyncStorage.getItem(key) as Promise<string | null>,
    setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
    removeItem: (key: string) => AsyncStorage.removeItem(key),
  },
  apiBaseUrl: ENV.API_BASE_URL || '/api',
  VITE_BACKEND_DOMAIN: ENV.BACKEND_DOMAIN,
});

// ----------------------------------------------------------------
// Root Navigator
//
// Cấu trúc:
//   RootStack
//   ├── Login  → AuthScreen   (chưa đăng nhập)
//   └── Main   → MainLayout   (có BottomNav, chứa Home/Browse/AnimeList/Profile)
//
// React Navigation tự động chuyển hướng khi `user` thay đổi:
//   - Đăng nhập thành công → user !== null → chỉ còn screen "Main"
//   - Đăng xuất → user === null → chỉ còn screen "Login"
// ----------------------------------------------------------------

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { user, isInitializing } = useAuth();
  const { theme } = useTheme();

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bgApp }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AnimeModalProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.bgApp },
            animation: 'slide_from_right',
          }}
        >
          {user ? (
            // ---- Đã đăng nhập ----
            <>
              <Stack.Screen name="Main" component={MainLayout} />
              <Stack.Screen name="AnimeDetail" component={AnimeDetailScreen} />
              <Stack.Screen name="AnimeWatch" component={AnimeWatchScreen} />
              <Stack.Screen name="CharacterDetail" component={CharacterScreen} />
              <Stack.Screen name="StaffDetail" component={StaffScreen} />
              <Stack.Screen name="MangaReader" component={MangaReaderScreen} />
              <Stack.Screen name="NovelReader" component={NovelReaderScreen} />
              <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
              <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
            </>
          ) : (
            // ---- Chưa đăng nhập ----
            <>
              {/* Guest cũng có thể vào Main (xem anime không cần login) */}
              <Stack.Screen name="Main" component={MainLayout} />
              {/* Màn hình Login/Signup */}
              <Stack.Screen
                name="Login"
                component={AuthScreen}
                options={{ animation: 'slide_from_bottom' }}
              />
              {/* Chi tiết anime — xem không cần đăng nhập */}
              <Stack.Screen name="AnimeDetail" component={AnimeDetailScreen} />
              <Stack.Screen name="AnimeWatch" component={AnimeWatchScreen} />
              <Stack.Screen name="CharacterDetail" component={CharacterScreen} />
              <Stack.Screen name="StaffDetail" component={StaffScreen} />
              <Stack.Screen name="MangaReader" component={MangaReaderScreen} />
              <Stack.Screen name="NovelReader" component={NovelReaderScreen} />
              <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} options={{ animation: 'slide_from_right' }} />
            </>
          )}
        </Stack.Navigator>
      </AnimeModalProvider>
    </NavigationContainer>
  );
};

// Component to initialize notification socket listener for mobile
const NotificationSetup: React.FC = () => {
  const { user } = useAuth();

  useNotificationSocket(
    user
      ? {
          onNewNotification: (notification: NotificationItem) => {
            Alert.alert(notification.title, notification.body || '', [
              { text: 'OK', style: 'default' },
            ]);
          },
        }
      : undefined
  );

  return null;
};

// ----------------------------------------------------------------
// HydrationGate — Đảm bảo localStorage shim được populate trước render
// ----------------------------------------------------------------

const HydrationGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    hydrateLocalStorage().finally(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#191919' }}>
        <ActivityIndicator size="large" color="#0084ff" />
      </View>
    );
  }

  return <>{children}</>;
};

// ----------------------------------------------------------------
// Root export
// ----------------------------------------------------------------

export default function App() {
  return (
    <SafeAreaProvider>
      <HydrationGate>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <NotificationSetup />
              <RootNavigator />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </HydrationGate>
    </SafeAreaProvider>
  );
}

