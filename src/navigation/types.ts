/**
 * src/navigation/types.ts
 * Định nghĩa kiểu cho React Navigation Stack
 */

export type RootStackParamList = {
  /** Màn hình login/signup */
  Auth: { initialMode?: 'login' | 'signup' };
  /** Màn hình home sau khi đăng nhập */
  HomeLogin: undefined;
  /** Sample screen */
  Home: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
