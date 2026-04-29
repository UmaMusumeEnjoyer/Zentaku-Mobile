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
  Settings: undefined;
};

// ----------------------------------------------------------------
// Root Stack — dùng để navigate giữa Auth và Main
// ----------------------------------------------------------------
export type RootStackParamList = {
  /** Wrapper screen chứa BottomNav + tất cả main screens */
  Main: undefined;
  /** Màn hình login/signup */
  Login: { initialMode?: 'login' | 'signup' } | undefined;
  /** Màn hình chi tiết anime */
  AnimeDetail: { id: string };
  /** Màn hình xem anime */
  AnimeWatch: { id: string };
  /** Màn hình chi tiết character */
  CharacterDetail: { id: string };
  /** Màn hình chi tiết staff/voice actor */
  StaffDetail: { id: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
