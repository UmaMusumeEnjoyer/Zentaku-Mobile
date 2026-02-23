/**
 * src/utils/localStorageShim.ts
 *
 * Polyfill đồng bộ cho localStorage bằng in-memory store + AsyncStorage persistence.
 * Cần thiết vì shared-logic dùng localStorage.getItem/setItem trực tiếp.
 *
 * Cách dùng:
 *   1. Import file này TRước mọi import shared-logic (đặt ở đầu index.ts)
 *   2. Gọi hydrateLocalStorage() trong App trước khi render
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---- In-memory store (synchronous) ----
const memoryStore: Record<string, string> = {};

// ---- Keys cần hydrate từ AsyncStorage khi khởi động ----
export const AUTH_STORAGE_KEYS = ['authToken', 'refreshToken', 'username'] as const;

// ---- Shim object ----
const localStorageShim = {
  getItem(key: string): string | null {
    return memoryStore[key] ?? null;
  },

  setItem(key: string, value: string): void {
    memoryStore[key] = value;
    // Fire-and-forget: persist sang AsyncStorage
    AsyncStorage.setItem(key, value).catch(() => {});
  },

  removeItem(key: string): void {
    delete memoryStore[key];
    AsyncStorage.removeItem(key).catch(() => {});
  },

  clear(): void {
    Object.keys(memoryStore).forEach((k) => delete memoryStore[k]);
    AsyncStorage.clear().catch(() => {});
  },

  key(_index: number): string | null {
    return null;
  },

  get length(): number {
    return Object.keys(memoryStore).length;
  },
};

// ---- Cài đặt polyfill vào global ----
if (typeof global !== 'undefined' && typeof (global as any).localStorage === 'undefined') {
  (global as any).localStorage = localStorageShim;
}

/**
 * Gọi hàm này khi App khởi động (trước khi render bất kỳ component nào dùng shared-logic).
 * Hydrate in-memory store từ AsyncStorage để auth tokens được khôi phục.
 */
export const hydrateLocalStorage = async (): Promise<void> => {
  await Promise.all(
    AUTH_STORAGE_KEYS.map(async (key) => {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        memoryStore[key] = value;
      }
    })
  );
};

export default localStorageShim;
