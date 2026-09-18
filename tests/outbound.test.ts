import { describe, it, expect } from 'vitest';
import { getOutboundUrl } from '../src/lib/analytics/outbound';
import { getVendorById } from '../src/lib/matching/vendors';

describe('getOutboundUrl', () => {
  it('appends UTM parameters', () => {
    const vendor = getVendorById('wh-001')!;
    const url = getOutboundUrl(vendor, 'results');
    expect(url).toContain('utm_source=picktherobot');
    expect(url).toContain('utm_campaign=locus-robotics');
    expect(url).toContain('utm_content=results');
  });

  it('uses referral medium when no custom tracked outbound URL', () => {
    const vendor = getVendorById('wh-001')!;
    expect(vendor.affiliateUrl).toBeFalsy();
    const url = getOutboundUrl(vendor);
    expect(url).toContain('utm_medium=referral');
    expect(url.startsWith(vendor.outboundUrl.split('?')[0])).toBe(true);
  });

  it('uses tracked medium and custom outbound URL when set', () => {
    const vendor = {
      ...getVendorById('wh-001')!,
      affiliateUrl: 'https://locusrobotics.com/partners/picktherobot',
    };
    const url = getOutboundUrl(vendor, 'results');
    expect(url).toContain('utm_medium=tracked');
    expect(url).toContain('locusrobotics.com/partners/picktherobot');
    expect(url).toContain('utm_content=results');
  });
});
