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
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
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
