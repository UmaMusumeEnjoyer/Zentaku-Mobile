/**
 * src/context/AuthContext.tsx
 *
 * Mirror pbl5_webFE/src/context/AuthContext.tsx
 * Thay: localStorage → via polyfill (localStorageShim)
 *       window.setInterval → setInterval (RN compatible)
 *       window.addEventListener → DeviceEventEmitter (RN)
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  useAuth as useSharedAuth,
  authService,
  type UseAuthReturn,
} from '@umamusumeenjoyer/shared-logic';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_STORAGE_KEYS } from '../utils/localStorageShim';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface AuthContextType extends UseAuthReturn {
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ----------------------------------------------------------------
// Provider
// ----------------------------------------------------------------

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authLogic = useSharedAuth();
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // ---- Refresh token ----
  const refreshAccessToken = async () => {
    try {
      const refreshToken = (global as any).localStorage?.getItem('refreshToken');
      if (!refreshToken) return;

      const response = await authService.refreshToken(refreshToken);
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh;

      (global as any).localStorage?.setItem('authToken', newAccessToken);
      if (newRefreshToken) {
        (global as any).localStorage?.setItem('refreshToken', newRefreshToken);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      authLogic.logout();
    }
  };

  const setupRefreshTimer = () => {
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    refreshTimerRef.current = setInterval(() => {
      const token = (global as any).localStorage?.getItem('authToken');
      if (token) refreshAccessToken();
    }, 10 * 60 * 1000); // mỗi 10 phút
  };

  // ---- Khôi phục phiên đăng nhập ----
  useEffect(() => {
    const initAuth = async () => {
      // Với localStorageShim, tokens đã được hydrate trước khi render App
      const token = (global as any).localStorage?.getItem('authToken');
      const username = (global as any).localStorage?.getItem('username');

      try {
        if (token && username && !authLogic.user) {
          await authLogic.fetchUserInfo(username);
          setupRefreshTimer();
        }
      } catch (error) {
        console.error('Lỗi khôi phục phiên đăng nhập:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    // Lắng nghe auth:logout event (phát ra từ apiClient)
    const subscription = DeviceEventEmitter.addListener('auth:logout', () => {
      authLogic.logout();
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    });

    initAuth();

    return () => {
      subscription.remove();
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Setup timer khi user login ----
  useEffect(() => {
    if (authLogic.user) {
      setupRefreshTimer();
    } else {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLogic.user]);

  // ---- Sync logout ra AsyncStorage ----
  const logout = () => {
    authLogic.logout();
    // Xóa cả AsyncStorage (shim đã xử lý memoryStore)
    AUTH_STORAGE_KEYS.forEach((key) => AsyncStorage.removeItem(key).catch(() => {}));
  };

  const value: AuthContextType = {
    ...authLogic,
    logout,
    isInitializing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ----------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
