import { describe, it, expect, afterEach } from 'vitest';
import {
  buildVendorLoginEmail,
  defaultVendorLoginFromAddress,
  isVendorLoginEmailConfigured,
  parseVendorLoginFromAddress,
} from '../src/lib/email/vendorLoginEmail';

describe('vendor login email', () => {
  const originalApiKey = process.env.BREVO_API_KEY;
  const originalFrom = process.env.BREVO_FROM_EMAIL;

  afterEach(() => {
    if (originalApiKey === undefined) delete process.env.BREVO_API_KEY;
    else process.env.BREVO_API_KEY = originalApiKey;
    if (originalFrom === undefined) delete process.env.BREVO_FROM_EMAIL;
    else process.env.BREVO_FROM_EMAIL = originalFrom;
  });

  it('builds login email with the magic link', () => {
    const loginUrl = 'https://picktherobot.com/api/vendor/auth/verify?token=abc';
    const email = buildVendorLoginEmail(loginUrl);
    expect(email.subject).toContain('vendor portal');
    expect(email.text).toContain(loginUrl);
    expect(email.html).toContain(loginUrl);
    expect(email.html).toContain('/for-vendors/portal');
  });

  it('detects when Brevo is configured', () => {
    delete process.env.BREVO_API_KEY;
    expect(isVendorLoginEmailConfigured()).toBe(false);
    process.env.BREVO_API_KEY = 'xkeysib_test';
    expect(isVendorLoginEmailConfigured()).toBe(true);
  });

  it('uses a default from address', () => {
    delete process.env.BREVO_FROM_EMAIL;
    expect(defaultVendorLoginFromAddress()).toContain('vendors@picktherobot.com');
    process.env.BREVO_FROM_EMAIL = 'PickTheRobot <hello@picktherobot.com>';
    expect(defaultVendorLoginFromAddress()).toBe('PickTheRobot <hello@picktherobot.com>');
  });

  it('parses from name and email', () => {
    expect(parseVendorLoginFromAddress('PickTheRobot <vendors@picktherobot.com>')).toEqual({
      name: 'PickTheRobot',
      email: 'vendors@picktherobot.com',
    });
    expect(parseVendorLoginFromAddress('vendors@picktherobot.com')).toEqual({
      name: 'PickTheRobot',
      email: 'vendors@picktherobot.com',
    });
  });
});
