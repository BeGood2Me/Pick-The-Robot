import { describe, expect, it } from 'vitest';
import {
  LEGAL_COMPANY_NAME,
  LEGAL_CONTACT_EMAIL,
  LEGAL_DOMAIN,
  LEGAL_GOVERNING_LAW,
  LEGAL_JURISDICTION,
  PRIVACY_LAST_UPDATED,
  TERMS_LAST_UPDATED,
} from '@/lib/content/legal';

describe('legal page constants', () => {
  it('uses picktherobot contact details', () => {
    expect(LEGAL_COMPANY_NAME).toBe('PickTheRobot');
    expect(LEGAL_DOMAIN).toBe('picktherobot.com');
    expect(LEGAL_CONTACT_EMAIL).toBe('hello@picktherobot.com');
  });

  it('is based in Ireland', () => {
    expect(LEGAL_JURISDICTION).toBe('Ireland');
    expect(LEGAL_GOVERNING_LAW).toBe('Ireland');
  });

  it('has last-updated dates', () => {
    expect(PRIVACY_LAST_UPDATED.length).toBeGreaterThan(0);
    expect(TERMS_LAST_UPDATED.length).toBeGreaterThan(0);
  });
});

describe('legal page modules', () => {
  it('exports privacy and terms content components', async () => {
    const privacy = await import('@/lib/content/privacy-policy');
    const terms = await import('@/lib/content/terms-of-use');

    expect(typeof privacy.PrivacyPolicyContent).toBe('function');
    expect(typeof terms.TermsOfUseContent).toBe('function');
  });
});
