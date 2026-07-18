import type { RobotCategory } from '@/lib/matching';

export interface BlogBrandProfile {
  name: string;
  tagline?: string;
  bio: string;
  editorialDisclaimer?: string;
  sameAs?: string[];
}

export interface BlogSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogRelatedLink {
  href: string;
  label: string;
}

export interface BlogPostJson {
  slug: string;
  pillarSlug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  publishedAt: string;
  updatedAt?: string;
  /** Optional overrides — defaults from src/data/blog/brand.json */
  brand?: Partial<BlogBrandProfile>;
  matcherCategory?: RobotCategory;
  sections: BlogSection[];
  faqs: BlogFaq[];
  /** Slugs of other blog posts for in-cluster cross-linking. */
  relatedPostSlugs: string[];
  relatedLinks: BlogRelatedLink[];
}

export interface BlogPillarJson {
  slug: string;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  summarySections: BlogSection[];
  postSlugs: string[];
  faqs: BlogFaq[];
  relatedLinks: BlogRelatedLink[];
}

export interface BlogRegistry {
  generatedAt: string;
  posts: { slug: string; pillarSlug: string; publishedAt: string; title: string }[];
  pillars: { slug: string; title: string; postCount: number }[];
}
