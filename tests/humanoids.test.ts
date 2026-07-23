import { describe, it, expect } from 'vitest';
import {
  getAllHumanoids,
  getHumanoidBySlug,
  HUMANOID_HUB_PATH,
  humanoidProfilePath,
} from '../src/lib/content/humanoids';
import { COMPARISONS } from '../src/lib/content/comparisons';

describe('humanoids track layer', () => {
  it('loads six humanoid profiles including Tesla Optimus', () => {
    expect(getAllHumanoids()).toHaveLength(6);
    expect(getHumanoidBySlug('figure-ai')?.name).toBe('Figure AI');
    expect(getHumanoidBySlug('tesla-optimus')?.readiness).toBe('research');
  });

  it('uses unique slugs and profile paths', () => {
    const slugs = getAllHumanoids().map((h) => h.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(humanoidProfilePath('apptronik')).toBe('/humanoids/apptronik');
  });

  it('has humanoid vs amr comparison', () => {
    expect(COMPARISONS['humanoid-vs-amr']).toBeDefined();
    expect(COMPARISONS['humanoid-vs-amr'].relatedLinks.some((l) => l.href === HUMANOID_HUB_PATH)).toBe(
      true,
    );
  });

  it('excludes humanoids from matcher vendors dataset', async () => {
    const { VENDORS } = await import('../src/lib/matching/vendors');
    const vendorSlugs = new Set(VENDORS.map((v) => v.slug));
    for (const h of getAllHumanoids()) {
      expect(vendorSlugs.has(h.slug)).toBe(false);
    }
  });
});
