import { SITE_NAME } from '@/lib/content/navigation';
import type { Vendor } from '@/lib/matching/types';
import { ROBOT_TYPE_LABELS } from '@/lib/matching/explain-labels';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picktherobot.com';

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    description:
      'Business robot buying guide and matcher for warehouse, cleaning, and restaurant operators.',
    logo: `${BASE_URL}/apple-icon`,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description:
      'Compare warehouse, cleaning, and restaurant robots by fit, cost model, and deployment.',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}

export interface ArticleAuthor {
  name: string;
  type?: 'Person' | 'Organization';
  jobTitle?: string;
  organization?: string;
  url?: string;
  sameAs?: string[];
}

export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
  author,
}: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  author?: ArticleAuthor;
}) {
  const authorEntity = author
    ? author.type === 'Organization'
      ? {
          '@type': 'Organization' as const,
          name: author.name,
          ...(author.url ? { url: author.url } : {}),
          ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
        }
      : {
          '@type': 'Person' as const,
          name: author.name,
          ...(author.jobTitle ? { jobTitle: author.jobTitle } : {}),
          ...(author.organization
            ? {
                worksFor: {
                  '@type': 'Organization',
                  name: author.organization,
                  url: BASE_URL,
                },
              }
            : {}),
          ...(author.url ? { url: author.url } : {}),
          ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
        }
    : {
        '@type': 'Organization' as const,
        name: SITE_NAME,
        url: BASE_URL,
      };

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${BASE_URL}${path}`,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    author: authorEntity,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/apple-icon`,
      },
    },
    mainEntityOfPage: `${BASE_URL}${path}`,
  };
}

export function vendorOrganizationJsonLd(vendor: Vendor) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://picktherobot.com';
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: vendor.name,
    description: vendor.shortDescription,
    url: vendor.outboundUrl,
    areaServed: vendor.regions,
    knowsAbout: vendor.robotTypes.map((t) => ROBOT_TYPE_LABELS[t]),
    parentOrganization: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
    mainEntityOfPage: `${BASE_URL}/vendors/${vendor.slug}`,
    sameAs: [vendor.outboundUrl],
  };

  if (vendor.sponsored && vendor.logoUrl) {
    const logo = vendor.logoUrl.startsWith('http')
      ? vendor.logoUrl
      : `${baseUrl}${vendor.logoUrl}`;
    data.logo = logo;
    data.image = logo;
  }

  return data;
}
