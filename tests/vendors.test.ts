import { describe, it, expect } from 'vitest';
import { getOutboundUrl } from '../src/lib/analytics/outbound';
import { VENDORS } from '../src/lib/matching/vendors';
import {
  BLOCKED_OUTBOUND_HOSTS,
  hostnameOf,
  validateAllVendorUrls,
} from '../src/lib/vendors/validateUrls';

describe('vendor outbound URLs', () => {
  it('all vendors pass official URL validation', () => {
    const errors = validateAllVendorUrls(VENDORS);
    expect(errors).toEqual([]);
  });

  it('never links to blocked domains', () => {
    for (const vendor of VENDORS) {
      const url = getOutboundUrl(vendor);
      const host = hostnameOf(url);
      expect(BLOCKED_OUTBOUND_HOSTS.has(host)).toBe(false);
    }
  });

  it('mir-mobile-industrial-robots links to MiR, not the car blog', () => {
    const vendor = VENDORS.find((v) => v.slug === 'mir-mobile-industrial-robots')!;
    expect(hostnameOf(vendor.outboundUrl)).toBe('mobile-industrial-robots.com');
    expect(hostnameOf(getOutboundUrl(vendor))).toBe('mobile-industrial-robots.com');
    expect(vendor.robotTypes).toContain('pallet_mover');
  });
});
