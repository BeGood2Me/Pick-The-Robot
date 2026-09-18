import { describe, expect, it } from 'vitest';
import {
  VENDOR_PORTAL_TRACKED_OUTBOUND_FAQS,
  VENDOR_PORTAL_TRACKED_OUTBOUND_PROMPT,
} from '../src/lib/content/vendor-portal';

describe('vendor portal content', () => {
  it('prompts vendors to enter a tracked outbound link', () => {
    expect(VENDOR_PORTAL_TRACKED_OUTBOUND_PROMPT.toLowerCase()).toContain('enter link');
  });

  it('explains which URL to use in portal-only FAQs', () => {
    expect(VENDOR_PORTAL_TRACKED_OUTBOUND_FAQS[0]?.answer).toContain('contact, demo request');
  });
});
