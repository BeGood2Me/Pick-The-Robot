import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CONSENT_STORAGE_KEY,
  readAnalyticsConsent,
  writeAnalyticsConsent,
} from '../src/lib/analytics/consent';

describe('analytics consent', () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => store.clear(),
    };
    vi.stubGlobal('window', { localStorage: storage });
    vi.stubGlobal('localStorage', storage);
  });

  it('returns null when no choice stored', () => {
    expect(readAnalyticsConsent()).toBeNull();
  });

  it('persists accepted and declined choices', () => {
    writeAnalyticsConsent('accepted');
    expect(readAnalyticsConsent()).toBe('accepted');
    expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('accepted');

    writeAnalyticsConsent('declined');
    expect(readAnalyticsConsent()).toBe('declined');
  });
});
