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
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initSharedLogic } from '@umamusumeenjoyer/shared-logic';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { hydrateLocalStorage } from './src/utils/localStorageShim';
import { ENV } from './src/utils/env';

import AuthScreen from './src/screens/AuthScreen';
import MainLayout from './src/navigation/MainLayout';
import AnimeDetailScreen from './src/screens/AnimeDetailScreen';

import type { RootStackParamList } from './src/navigation/types';

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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
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
    <HydrationGate>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HydrationGate>
  );
}

