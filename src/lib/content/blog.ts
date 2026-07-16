import fs from 'node:fs';
import path from 'node:path';
import type { BlogBrandProfile, BlogPillarJson, BlogPostJson, BlogRegistry } from '@/lib/content/blog-types';

const DATA_ROOT = path.join(process.cwd(), 'src/data/blog');
const POSTS_DIR = path.join(DATA_ROOT, 'posts');
const PILLARS_DIR = path.join(DATA_ROOT, 'pillars');
const REGISTRY_PATH = path.join(DATA_ROOT, '.generated', 'registry.json');
const BRAND_PATH = path.join(DATA_ROOT, 'brand.json');

let brandCache: BlogBrandProfile | null = null;

export function getBlogBrand(): BlogBrandProfile {
  if (!brandCache) {
    brandCache = JSON.parse(fs.readFileSync(BRAND_PATH, 'utf8')) as BlogBrandProfile;
  }
  return brandCache;
}

export function resolvePostBrand(post: BlogPostJson): BlogBrandProfile {
  return { ...getBlogBrand(), ...post.brand };
}

export function withResolvedBrand(post: BlogPostJson): BlogPostJson & { brand: BlogBrandProfile } {
  return { ...post, brand: resolvePostBrand(post) };
}

function readJsonFiles<T>(dir: string): T[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => {
      const raw = fs.readFileSync(path.join(dir, name), 'utf8');
      return JSON.parse(raw) as T;
    });
}

function loadPosts(): BlogPostJson[] {
  return readJsonFiles<BlogPostJson>(POSTS_DIR).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function loadPostsWithBrand(): (BlogPostJson & { brand: BlogBrandProfile })[] {
  return loadPosts().map(withResolvedBrand);
}

function loadPillars(): BlogPillarJson[] {
  return readJsonFiles<BlogPillarJson>(PILLARS_DIR);
}

let postsCache: (BlogPostJson & { brand: BlogBrandProfile })[] | null = null;
let pillarsCache: BlogPillarJson[] | null = null;

export function getAllBlogPosts(): (BlogPostJson & { brand: BlogBrandProfile })[] {
  if (!postsCache) postsCache = loadPostsWithBrand();
  return postsCache;
}

export function getBlogPostBySlug(
  slug: string,
): (BlogPostJson & { brand: BlogBrandProfile }) | undefined {
  return getAllBlogPosts().find((post) => post.slug === slug);
}

export function getAllBlogPillars(): BlogPillarJson[] {
  if (!pillarsCache) pillarsCache = loadPillars();
  return pillarsCache;
}

export function getBlogPillarBySlug(slug: string): BlogPillarJson | undefined {
  return getAllBlogPillars().find((pillar) => pillar.slug === slug);
}

export function getPostsForPillar(
  pillarSlug: string,
): (BlogPostJson & { brand: BlogBrandProfile })[] {
  return getAllBlogPosts().filter((post) => post.pillarSlug === pillarSlug);
}

export function getRelatedPosts(
  post: BlogPostJson,
): (BlogPostJson & { brand: BlogBrandProfile })[] {
  return post.relatedPostSlugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter((p): p is BlogPostJson & { brand: BlogBrandProfile } => p !== undefined);
}

export function blogPostPath(slug: string): string {
  return `/blog/${slug}`;
}

export function blogPillarPath(slug: string): string {
  return `/blog/topics/${slug}`;
}

export const BLOG_INDEX_PATH = '/blog';

export function readBlogRegistry(): BlogRegistry | null {
  if (!fs.existsSync(REGISTRY_PATH)) return null;
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8')) as BlogRegistry;
}

/** Clear module cache — used after generator runs in dev/tests. */
export function resetBlogCache(): void {
  postsCache = null;
  pillarsCache = null;
  brandCache = null;
}
