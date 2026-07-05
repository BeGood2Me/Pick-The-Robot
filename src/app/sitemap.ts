import type { MetadataRoute } from 'next';
import { COMPARISONS } from '@/lib/content/comparisons';
import { CATEGORY_ROUTES } from '@/lib/content/navigation';
import { VENDORS } from '@/lib/matching/vendors';
import { BASE_URL } from '@/lib/seo/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/vendors',
    '/warehouse-robots',
    '/cleaning-robots',
    '/restaurant-robots',
    '/robot-leasing-vs-buying',
    '/robotics-as-a-service',
    '/privacy',
    '/terms',
    ...Object.keys(COMPARISONS).map((slug) => `/${slug}`),
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : path === '/vendors' ? 0.7 : 0.8,
    })),
    ...VENDORS.map((v) => ({
      url: `${BASE_URL}/vendors/${v.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
