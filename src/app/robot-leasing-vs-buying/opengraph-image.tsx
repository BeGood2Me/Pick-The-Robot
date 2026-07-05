import { DECISION_PAGES } from '@/lib/content/comparisons';
import { createOgImage } from '@/lib/seo/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  const page = DECISION_PAGES['robot-leasing-vs-buying'];
  return createOgImage(page.h1, page.metaDescription);
}
