import { describe, it, expect } from 'vitest';
import { fmtDate } from '@/lib/utils/date'; // Using path alias to verify resolution

describe('Vitest Smoke Test', () => {
  it('should pass basic assertions', () => {
    expect(1 + 1).toBe(2);
  });

  it('should resolve path aliases and import correctly', () => {
    const formatted = fmtDate('2026-05-23');
    expect(formatted).toBe('23 May 2026');
  });
});
