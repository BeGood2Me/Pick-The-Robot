import { describe, expect, it } from 'vitest';
import {
  detectVendorLogoMime,
  isAllowedVendorLogoUrl,
  VENDOR_LOGO_MAX_BYTES,
  VENDOR_LOGO_UPLOAD_GUIDANCE,
} from '../src/lib/vendor/logoUpload';

describe('vendor logo upload', () => {
  it('detects png, jpeg, and webp from file headers', () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
    const webp = Buffer.from('RIFFxxxxWEBP', 'ascii');

    expect(detectVendorLogoMime(png)).toBe('image/png');
    expect(detectVendorLogoMime(jpeg)).toBe('image/jpeg');
    expect(detectVendorLogoMime(webp)).toBe('image/webp');
    expect(detectVendorLogoMime(Buffer.from('not-an-image'))).toBeNull();
  });

  it('allows https and local upload paths', () => {
    expect(isAllowedVendorLogoUrl('https://cdn.example.com/logo.png')).toBe(true);
    expect(isAllowedVendorLogoUrl('/uploads/vendor-logos/locus-robotics-123.png')).toBe(true);
    expect(isAllowedVendorLogoUrl('http://insecure.example/logo.png')).toBe(false);
    expect(isAllowedVendorLogoUrl('/uploads/vendor-logos/../secret.png')).toBe(false);
  });

  it('caps uploads at 2 MB', () => {
    expect(VENDOR_LOGO_MAX_BYTES).toBe(2 * 1024 * 1024);
  });

  it('documents recommended logo dimensions for vendors', () => {
    expect(VENDOR_LOGO_UPLOAD_GUIDANCE).toMatch(/512/);
    expect(VENDOR_LOGO_UPLOAD_GUIDANCE).toMatch(/256/);
  });
});
