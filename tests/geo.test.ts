import { describe, it, expect } from 'vitest';
import { detectRegionFromBrowser } from '../src/lib/geo/region';

describe('detectRegionFromBrowser', () => {
  it('returns a supported region code', () => {
    const region = detectRegionFromBrowser();
    expect(['US', 'EU', 'UK', 'APAC']).toContain(region);
  });
});
