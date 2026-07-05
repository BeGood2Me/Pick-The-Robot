import { CATEGORY_CONTENT } from '@/lib/content/categories';
import { createOgImage } from '@/lib/seo/og';

export const alt = 'Restaurant robots — PickTheRobot';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  const content = CATEGORY_CONTENT.restaurant;
  return createOgImage(content.h1, content.metaDescription);
}
