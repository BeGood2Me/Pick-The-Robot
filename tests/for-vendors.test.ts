import { describe, it, expect } from 'vitest';
import {
  FOR_VENDORS_PATH,
  VENDOR_FAQS,
  VENDOR_TIER_CARDS,
  VENDOR_VALUE_PROPS,
  VENDOR_VISIBILITY_SURFACES,
} from '../src/lib/content/for-vendors';

describe('FOR_VENDORS_PATH', () => {
  it('points to the vendor partner page', () => {
    expect(FOR_VENDORS_PATH).toBe('/for-vendors');
  });
});

describe('VENDOR_VALUE_PROPS', () => {
  it('frames vendor-facing benefits', () => {
    expect(VENDOR_VALUE_PROPS.length).toBeGreaterThanOrEqual(3);
    expect(VENDOR_VALUE_PROPS[0]?.title.toLowerCase()).toContain('buyer');
  });
});

describe('VENDOR_VISIBILITY_SURFACES', () => {
  it('separates directory from matcher placement', () => {
    expect(VENDOR_VISIBILITY_SURFACES).toHaveLength(2);
    expect(VENDOR_VISIBILITY_SURFACES.map((surface) => surface.title)).toEqual([
      'Vendor directory',
      'Matcher shortlists',
    ]);
  });
});

describe('VENDOR_TIER_CARDS', () => {
  it('leads with verified partner as the primary paid tier', () => {
    expect(VENDOR_TIER_CARDS[0]?.id).toBe('verified');
    expect(VENDOR_TIER_CARDS[0]?.highlighted).toBe(true);
    expect(VENDOR_TIER_CARDS[0]?.status).toBe('available');
    expect(VENDOR_TIER_CARDS.map((tier) => tier.id)).toEqual(['verified', 'sponsored']);
  });
});

describe('VENDOR_FAQS', () => {
  it('addresses vendor concerns about fit and pay-to-rank', () => {
    expect(VENDOR_FAQS.length).toBeGreaterThanOrEqual(4);
    expect(VENDOR_FAQS.some((faq) => faq.question.toLowerCase().includes('competitor'))).toBe(
      true,
    );
    expect(VENDOR_FAQS.some((faq) => faq.question.toLowerCase().includes('billing'))).toBe(true);
  });
});
