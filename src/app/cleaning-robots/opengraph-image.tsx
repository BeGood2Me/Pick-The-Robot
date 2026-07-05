import { CATEGORY_CONTENT } from '@/lib/content/categories';
import { createOgImage } from '@/lib/seo/og';

export const alt = 'Cleaning robots — PickTheRobot';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  const content = CATEGORY_CONTENT.cleaning;
  return createOgImage(content.h1, content.metaDescription);
}
