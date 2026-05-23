import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage, STORAGE_KEYS } from './storage';

describe('storage.ts', () => {

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('SSR compatibility (no window object)', () => {
    it('should return fallback if window is undefined on get', () => {
      // Temporarily mock window to be undefined by deleting window from global context
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      try {
        const result = storage.get('some_key', 'fallback_value');
        expect(result).toBe('fallback_value');
      } finally {
        // Restore window context
        global.window = originalWindow;
      }
    });

    it('should not throw or set anything if window is undefined on set', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      try {
        expect(() => storage.set('some_key', 'value')).not.toThrow();
      } finally {
        global.window = originalWindow;
      }
    });

    it('should not throw or remove anything if window is undefined on remove', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      try {
        expect(() => storage.remove('some_key')).not.toThrow();
      } finally {
        global.window = originalWindow;
      }
    });

    it('should not throw or clear anything if window is undefined on clearSession', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      try {
        expect(() => storage.clearSession()).not.toThrow();
      } finally {
        global.window = originalWindow;
      }
    });
  });

  describe('Standard localStorage CRUD operations', () => {
    it('should set and get values correctly', () => {
      const testData = { name: 'Rahul', age: 30 };
      storage.set(STORAGE_KEYS.APPLICANT_DATA, testData);

      // Verify directly in localStorage
      const raw = localStorage.getItem(STORAGE_KEYS.APPLICANT_DATA);
      expect(raw).toBe(JSON.stringify(testData));

      // Verify using helper getter
      const retrieved = storage.get(STORAGE_KEYS.APPLICANT_DATA, null);
      expect(retrieved).toEqual(testData);
    });

    it('should return fallback value if key does not exist', () => {
      const result = storage.get('non_existent_key', { default: true });
      expect(result).toEqual({ default: true });
    });

    it('should handle and log JSON parse errors gracefully, returning fallback', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // Put invalid JSON in localStorage
      localStorage.setItem('bad_json_key', '{invalid_json}');

      const result = storage.get('bad_json_key', 'fallback_on_error');
      expect(result).toBe('fallback_on_error');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should remove items correctly', () => {
      storage.set('temp_key', 'value');
      expect(storage.get('temp_key', '')).toBe('value');

      storage.remove('temp_key');
      expect(storage.get('temp_key', 'removed')).toBe('removed');
    });

    it('should clear only VisaMate session keys on clearSession', () => {
      // Set VisaMate keys
      storage.set(STORAGE_KEYS.APPLICANT_DATA, { id: 1 });
      storage.set(STORAGE_KEYS.CARD_STATE, { step: 2 });
      storage.set(STORAGE_KEYS.LANDING_STATE, { source: 'google' });
      
      // Set unrelated key
      storage.set('unrelated_key', 'keep_me');

      // Clear session
      storage.clearSession();

      // VisaMate keys should be null (returning fallback)
      expect(storage.get(STORAGE_KEYS.APPLICANT_DATA, null)).toBeNull();
      expect(storage.get(STORAGE_KEYS.CARD_STATE, null)).toBeNull();
      expect(storage.get(STORAGE_KEYS.LANDING_STATE, null)).toBeNull();

      // Unrelated key should still exist
      expect(storage.get('unrelated_key', null)).toBe('keep_me');
    });
  });

});
