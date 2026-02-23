/**
 * src/context/LanguageContext.tsx
 *
 * Quản lý ngôn ngữ của ứng dụng.
 * Thay localStorage → AsyncStorage cho React Native.
 * Gọi i18n.changeLanguage() để sync với react-i18next.
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
import i18n, { LANGUAGES, type LangCode } from '../i18n/config';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface LanguageContextType {
  /** Mã ngôn ngữ hiện tại: 'en' | 'jp' */
  language: LangCode;
  /** Đổi ngôn ngữ */
  setLanguage: (lang: LangCode) => void;
  /** Danh sách ngôn ngữ hỗ trợ */
  languages: typeof LANGUAGES;
  /** True khi đang load ngôn ngữ từ storage */
  isLoading: boolean;
}

// ----------------------------------------------------------------
// Context
// ----------------------------------------------------------------

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'app_language';

// ----------------------------------------------------------------
// Provider
// ----------------------------------------------------------------

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LangCode>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Đọc ngôn ngữ đã lưu khi khởi động
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        const lang = saved as LangCode | null;
        if (lang && lang in LANGUAGES) {
          setLanguageState(lang);
          i18n.changeLanguage(lang as string);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setLanguage = useCallback((lang: LangCode) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang as string);
    AsyncStorage.setItem(STORAGE_KEY, lang as string);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: LANGUAGES, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
