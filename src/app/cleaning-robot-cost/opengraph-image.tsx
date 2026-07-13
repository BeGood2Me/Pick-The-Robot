import { GUIDE_PAGES } from '@/lib/content/guides';
import { createOgImage } from '@/lib/seo/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  const page = GUIDE_PAGES['cleaning-robot-cost'];
  return createOgImage(page.h1, page.metaDescription);
}
