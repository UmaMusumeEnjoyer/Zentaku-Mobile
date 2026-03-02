/**
 * src/navigation/types.ts
 * Định nghĩa kiểu cho React Navigation Stack
 */

// ----------------------------------------------------------------
// Auth Stack — chưa đăng nhập
// ----------------------------------------------------------------
export type AuthStackParamList = {
  /** Màn hình login/signup */
  Login: { initialMode?: 'login' | 'signup' };
};

// ----------------------------------------------------------------
// Main Stack — đã đăng nhập hoặc guest (có BottomNav)
// ----------------------------------------------------------------
export type MainStackParamList = {
  Home: undefined;
  Browse: undefined;
  AnimeList: undefined;
  Profile: undefined;
};

// ----------------------------------------------------------------
// Root Stack — dùng để navigate giữa Auth và Main
// ----------------------------------------------------------------
export type RootStackParamList = {
  /** Wrapper screen chứa BottomNav + tất cả main screens */
  Main: undefined;
  /** Màn hình login/signup */
  Login: { initialMode?: 'login' | 'signup' } | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
