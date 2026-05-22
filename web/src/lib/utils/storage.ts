/**
 * Safe LocalStorage utilities for VisaMate (Next.js/SSR-compatible).
 */

export const STORAGE_KEYS = {
  APPLICANT_DATA: "visamate_applicant_data",
  CARD_STATE: "visamate_card_state",
  LANDING_STATE: "visamate_landing_state",
} as const;

export const storage = {
  /**
   * Safely get a parsed JSON value from localStorage.
   */
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`[Storage] Failed to get key "${key}":`, e);
      return fallback;
    }
  },

  /**
   * Safely set a stringified JSON value in localStorage.
   */
  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`[Storage] Failed to set key "${key}":`, e);
    }
  },

  /**
   * Safely remove a key from localStorage.
   */
  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`[Storage] Failed to remove key "${key}":`, e);
    }
  },

  /**
   * Safely clear all VisaMate session data.
   */
  clearSession(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEYS.APPLICANT_DATA);
      localStorage.removeItem(STORAGE_KEYS.CARD_STATE);
      localStorage.removeItem(STORAGE_KEYS.LANDING_STATE);
    } catch (e) {
      console.error("[Storage] Failed to clear session:", e);
    }
  },
};
