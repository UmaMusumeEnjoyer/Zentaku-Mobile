/**
 * src/utils/env.ts
 *
 * Typed accessor cho biến môi trường.
 * Đọc từ Constants.expoConfig.extra (được set trong app.config.ts).
 *
 * Tương tự pbl5_webFE dùng import.meta.env.VITE_*
 */
import Constants from 'expo-constants';

type Extra = {
  apiBaseUrl: string;
  backendDomain: string;
  defaultAvatarUrl: string;
  defaultAvatarSearch: string;
  youtubeEmbedUrl: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Partial<Extra>;

export const ENV = {
  API_BASE_URL: extra.apiBaseUrl ?? '',
  BACKEND_DOMAIN: extra.backendDomain ?? '',
  DEFAULT_AVATAR_URL: extra.defaultAvatarUrl ?? '',
  DEFAULT_AVATAR_SEARCH: extra.defaultAvatarSearch ?? '',
  YOUTUBE_EMBED_URL: extra.youtubeEmbedUrl ?? 'https://www.youtube.com/embed',
} as const;
