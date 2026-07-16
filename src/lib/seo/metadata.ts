import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/content/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picktherobot.com';

export interface SiteMetadataOptions {
  title: string;
  description: string;
  path?: string;
  /** Set for shareable / thin pages that should not be indexed. */
  noIndex?: boolean;
  /** Override default /opengraph-image for this page. */
  ogImage?: string;
  /** Open Graph type — use `article` for blog posts. */
  ogType?: 'website' | 'article';
  /** Article metadata for Open Graph when ogType is article. */
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
}

function fullTitle(title: string): string {
  if (title.includes(SITE_NAME)) return title;
  return `${title} | ${SITE_NAME}`;
}

export function siteMetadata({
  title,
  description,
  path = '',
  noIndex = false,
  ogImage = '/opengraph-image',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  authors,
  keywords,
}: SiteMetadataOptions): Metadata {
  const url = `${BASE_URL}${path}`;
  const isAbsoluteTitle = title.includes(SITE_NAME);
  const ogTitle = fullTitle(title);
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;

  return {
    title: isAbsoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
    ...(keywords?.length ? { keywords: keywords.join(', ') } : {}),
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: ogType,
      locale: 'en_US',
      ...(ogType === 'article' && publishedTime ? { publishedTime } : {}),
      ...(ogType === 'article' && modifiedTime ? { modifiedTime } : {}),
      ...(ogType === 'article' && authors?.length ? { authors } : {}),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [imageUrl],
    },
  };
}

export { BASE_URL };
