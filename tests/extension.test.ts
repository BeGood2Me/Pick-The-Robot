import { describe, expect, it } from 'vitest';
import {
  CHROME_EXTENSION_ID,
  CHROME_EXTENSION_STORE_URL,
  EXTENSION_PAGE_PATH,
} from '@/lib/content/extension';

describe('Chrome extension page', () => {
  it('uses the published Web Store listing ID', () => {
    expect(CHROME_EXTENSION_ID).toBe('jpfhebaojbnjfealeleiegbddghjhcmi');
    expect(CHROME_EXTENSION_STORE_URL).toContain(CHROME_EXTENSION_ID);
  });

  it('exposes the public landing page path', () => {
    expect(EXTENSION_PAGE_PATH).toBe('/extension');
  });
});
