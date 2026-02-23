/**
 * src/context/ThemeContext.tsx
 *
 * Mirror của pbl5_webFE/src/context/ThemeContext.tsx
 * Thay localStorage → AsyncStorage cho React Native.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { darkTheme, lightTheme, type ThemeTokens } from '../styles/theme';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  /** Tên chế độ hiện tại: 'light' | 'dark' */
  themeMode: ThemeMode;
  /** Object token màu sắc tương ứng với chế độ hiện tại */
  theme: ThemeTokens;
  /** Đổi qua lại giữa light và dark */
  toggleTheme: () => void;
  /** Đặt thẳng chế độ muốn dùng */
  setThemeMode: (mode: ThemeMode) => void;
  /** True khi đang load theme từ storage (tránh flash) */
  isLoading: boolean;
}

// ----------------------------------------------------------------
// Context
// ----------------------------------------------------------------

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'app_theme';

// ----------------------------------------------------------------
// Provider
// ----------------------------------------------------------------

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [isLoading, setIsLoading] = useState(true);

  // Đọc theme đã lưu khi khởi động
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark') {
          setThemeModeState(saved);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  }, [themeMode, setThemeMode]);

  const theme: ThemeTokens = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, theme, toggleTheme, setThemeMode, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
