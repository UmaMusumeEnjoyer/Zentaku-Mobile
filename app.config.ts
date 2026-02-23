/**
 * app.config.ts
 *
 * Đọc biến env từ .env (VITE_ prefix — dùng chung với pbl5_webFE)
 * và expose chúng qua Constants.expoConfig.extra
 *
 * Tương tự pbl5_webFE đọc import.meta.env.VITE_*
 */
import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'pbl5_mobileFE',
  slug: 'pbl5_mobileFE',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic', // supports light/dark
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#191919',
  },
  ios: { supportsTablet: true },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#191919',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: { favicon: './assets/favicon.png' },

  // Map VITE_ vars → extra (accessible via Constants.expoConfig?.extra)
  extra: {
    apiBaseUrl: process.env.VITE_API_BASE_URL ?? '',
    backendDomain: process.env.VITE_BACKEND_DOMAIN ?? '',
    defaultAvatarUrl: process.env.VITE_DEFAULT_AVATAR_URL ?? '',
    defaultAvatarSearch: process.env.VITE_DEFAULT_AVATAR_SEARCH ?? '',
    youtubeEmbedUrl: process.env.VITE_YOUTUBE_EMBED_URL ?? 'https://www.youtube.com/embed',
  },
});
