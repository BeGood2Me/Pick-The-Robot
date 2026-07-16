import type { MetadataRoute } from 'next';
import { getAllBlogPillars, getAllBlogPosts } from '@/lib/content/blog';
import { COMPARISONS } from '@/lib/content/comparisons';
import { GUIDE_PAGES } from '@/lib/content/guides';
import { VENDORS } from '@/lib/matching/vendors';
import { BASE_URL } from '@/lib/seo/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/blog',
    '/about',
    '/vendors',
    '/for-vendors',
    '/warehouse-robots',
    '/cleaning-robots',
    '/restaurant-robots',
    '/robot-leasing-vs-buying',
    '/robotics-as-a-service',
    '/privacy',
    '/terms',
    ...Object.keys(COMPARISONS).map((slug) => `/${slug}`),
    ...Object.keys(GUIDE_PAGES).map((slug) => `/${slug}`),
  ];

  const blogPosts = getAllBlogPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  const blogPillars = getAllBlogPillars().map((pillar) => ({
    url: `${BASE_URL}/blog/topics/${pillar.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : path === '/blog' ? 0.85 : path === '/vendors' ? 0.7 : 0.8,
    })),
    ...blogPillars,
    ...blogPosts,
    ...VENDORS.map((v) => ({
      url: `${BASE_URL}/vendors/${v.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
