import { createOgImage } from '@/lib/seo/og';

export const runtime = 'edge';
export const alt = 'PickTheRobot — Pick the right robot for your business';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return createOgImage(
    'Pick the right robot for your business',
    'Warehouse, cleaning, and restaurant robot matcher — fit, cost model, and vendors.',
  );
}
