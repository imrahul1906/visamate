import { describe, it, expect } from 'vitest';
import { fmtDate, fmtDob, fmtDateEnd, today, fmtMonthYear } from './date';

describe('date.ts', () => {

  describe('fmtDate', () => {
    it('should format valid ISO dates to English locale format', () => {
      // Inputs format: YYYY-MM-DD
      expect(fmtDate('2025-03-01')).toBe('1 March 2025');
      expect(fmtDate('1990-12-25')).toBe('25 December 1990');
    });

    it('should return fallback if input is null, undefined or empty', () => {
      expect(fmtDate(null)).toBe('[date]');
      expect(fmtDate(undefined)).toBe('[date]');
      expect(fmtDate('')).toBe('[date]');

      // Custom fallback
      expect(fmtDate('', 'N/A')).toBe('N/A');
    });

    it('should return original string if parsing fails', () => {
      expect(fmtDate('not-a-date')).toBe('not-a-date');
    });
  });

  describe('fmtDob', () => {
    it('should format date of birth or fallback to [DOB]', () => {
      expect(fmtDob('1995-05-15')).toBe('15 May 1995');
      expect(fmtDob('')).toBe('[DOB]');
      expect(fmtDob(null)).toBe('[DOB]');
    });
  });

  describe('fmtDateEnd', () => {
    it('should offset date and format the result correctly', () => {
      // Adding 5 days to "2025-03-01" yields "4 March 2025" (since it adds days - 1, which is +4 days)
      expect(fmtDateEnd('2025-03-01', 5)).toBe('5 March 2025'); 
      // Wait, let's verify: 
      // d.setDate(d.getDate() + days - 1)
      // If base is 1st March:
      // + 5 - 1 = + 4 -> 5th March?
      // Wait! Let's check date.ts:
      // line 38: d.setDate(d.getDate() + days - 1);
      // Wait, d.getDate() gets day of the month (1).
      // 1 + 5 - 1 = 5. So setDate(5) sets it to 5th March.
      // So fmtDateEnd("2025-03-01", 5) is actually "5 March 2025" in the date.ts implementation!
      // Let's verify the comment in date.ts:
      // "Example: fmtDateEnd("2025-03-01", 5) = "4 March 2025""
      // Wait, let's look at the comment again:
      // "Example: fmtDateEnd("2025-03-01", 5) = "4 March 2025""
      // But 1 + 5 - 1 is 5.
      // Let's calculate: 1st March + 4 days = 5th March.
      // Ah! The implementation code has a slight mismatch with its comment:
      // `d.setDate(d.getDate() + days - 1);` -> this adds `days - 1` to the day of month.
      // If days = 5, days - 1 = 4. 1st March + 4 = 5th March.
      // Yes! So the actual implementation returns "5 March 2025". This is exactly why unit tests are helpful: they show the actual behavior vs the comment!
      
      expect(fmtDateEnd('2025-03-01', 5)).toBe('5 March 2025');
      expect(fmtDateEnd('2025-02-27', 3)).toBe('1 March 2025'); // 27 + 2 = 29 -> but 2025 is not a leap year, so Feb has 28 days. Feb 27 + 1 = Feb 28, Feb 28 + 1 = Mar 1.
    });

    it('should handle undefined or invalid input gracefully', () => {
      expect(fmtDateEnd(undefined, 5)).toBe('[date]');
      expect(fmtDateEnd('invalid-date', 5)).toBe('invalid-date');
    });
  });

  describe('today', () => {
    it('should return a formatted string matching current day', () => {
      const result = today();
      expect(result).toBeTypeOf('string');
      // Format should contain month name, year digits, etc.
      expect(result).toMatch(/\d{4}$/); // ends with 4-digit year
    });
  });

  describe('fmtMonthYear', () => {
    it('should format YYYY-MM inputs correctly', () => {
      expect(fmtMonthYear('2025-06')).toBe('June 2025');
      expect(fmtMonthYear('1999-01')).toBe('January 1999');
    });

    it('should return empty string for invalid inputs', () => {
      expect(fmtMonthYear('')).toBe('');
      expect(fmtMonthYear('abc')).toBe('');
      expect(fmtMonthYear('2025')).toBe('');
      expect(fmtMonthYear('2025-13')).toBe('');
      expect(fmtMonthYear('2025-00')).toBe('');
    });
  });

});
