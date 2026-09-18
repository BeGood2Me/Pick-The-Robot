import type { FaqItem } from '@/lib/seo/schema';

/** Vendor portal only — not used on public marketing pages. */
export const VENDOR_PORTAL_TRACKED_OUTBOUND_PROMPT = 'Enter Link to track outbound links';

export const VENDOR_PORTAL_TRACKED_OUTBOUND_FAQS: FaqItem[] = [
  {
    question: 'What link should I enter?',
    answer:
      'Use the page you want buyers to land on — often contact, demo request, or a campaign landing page. Copy that URL from your browser. You can add your own query parameters first; we’ll append ours.',
  },
];
