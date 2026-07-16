/**
 * Validates blog JSON sources and writes a build registry.
 * Run before build: npm run blog:generate
 *
 * JSON source of truth:
 *   src/data/blog/posts/*.json
 *   src/data/blog/pillars/*.json
 *
 * Next.js renders pages from these files at build time via src/lib/content/blog.ts
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'src/data/blog/posts');
const PILLARS_DIR = path.join(ROOT, 'src/data/blog/pillars');
const OUT_DIR = path.join(ROOT, 'src/data/blog/.generated');
const REGISTRY_PATH = path.join(OUT_DIR, 'registry.json');

const REQUIRED_POST_FIELDS = [
  'slug',
  'pillarSlug',
  'primaryKeyword',
  'title',
  'h1',
  'metaDescription',
  'intro',
  'publishedAt',
  'sections',
  'faqs',
  'relatedPostSlugs',
  'relatedLinks',
];

const REQUIRED_PILLAR_FIELDS = [
  'slug',
  'title',
  'h1',
  'metaDescription',
  'intro',
  'summarySections',
  'postSlugs',
  'faqs',
  'relatedLinks',
];

function readJsonDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => {
      const filePath = path.join(dir, name);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      return { filePath, data };
    });
}

function assertFields(obj, fields, label) {
  for (const field of fields) {
    if (obj[field] === undefined || obj[field] === null) {
      throw new Error(`${label}: missing required field "${field}"`);
    }
  }
}

function main() {
  const posts = readJsonDir(POSTS_DIR);
  const pillars = readJsonDir(PILLARS_DIR);

  if (posts.length === 0) {
    throw new Error('No blog posts found in src/data/blog/posts/');
  }
  if (pillars.length === 0) {
    throw new Error('No blog pillars found in src/data/blog/pillars/');
  }

  const postSlugs = new Set();
  const pillarSlugs = new Set();

  for (const { filePath, data } of posts) {
    assertFields(data, REQUIRED_POST_FIELDS, filePath);
    if (postSlugs.has(data.slug)) {
      throw new Error(`Duplicate post slug: ${data.slug}`);
    }
    postSlugs.add(data.slug);
    if (data.metaDescription.length > 165) {
      console.warn(`  ⚠ ${data.slug}: metaDescription is ${data.metaDescription.length} chars (aim ≤160)`);
    }
  }

  for (const { filePath, data } of pillars) {
    assertFields(data, REQUIRED_PILLAR_FIELDS, filePath);
    if (pillarSlugs.has(data.slug)) {
      throw new Error(`Duplicate pillar slug: ${data.slug}`);
    }
    pillarSlugs.add(data.slug);
  }

  const postBySlug = Object.fromEntries(posts.map(({ data }) => [data.slug, data]));
  const pillarBySlug = Object.fromEntries(pillars.map(({ data }) => [data.slug, data]));

  for (const { data: post } of posts) {
    if (!pillarBySlug[post.pillarSlug]) {
      throw new Error(`Post "${post.slug}" references unknown pillar "${post.pillarSlug}"`);
    }
    for (const related of post.relatedPostSlugs) {
      if (!postBySlug[related]) {
        throw new Error(`Post "${post.slug}" references unknown related post "${related}"`);
      }
    }
  }

  for (const { data: pillar } of pillars) {
    for (const slug of pillar.postSlugs) {
      if (!postBySlug[slug]) {
        throw new Error(`Pillar "${pillar.slug}" lists unknown post "${slug}"`);
      }
      if (postBySlug[slug].pillarSlug !== pillar.slug) {
        console.warn(
          `  ⚠ Pillar "${pillar.slug}" lists post "${slug}" whose pillarSlug is "${postBySlug[slug].pillarSlug}"`,
        );
      }
    }
  }

  const registry = {
    generatedAt: new Date().toISOString(),
    posts: posts
      .map(({ data }) => ({
        slug: data.slug,
        pillarSlug: data.pillarSlug,
        publishedAt: data.publishedAt,
        title: data.title,
        path: `/blog/${data.slug}`,
      }))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    pillars: pillars.map(({ data }) => ({
      slug: data.slug,
      title: data.title,
      postCount: data.postSlugs.length,
      path: `/blog/topics/${data.slug}`,
    })),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify(registry, null, 2)}\n`);

  console.log(`Blog generator OK`);
  console.log(`  ${posts.length} posts → /blog/[slug]`);
  console.log(`  ${pillars.length} pillars → /blog/topics/[slug]`);
  console.log(`  Registry: ${path.relative(ROOT, REGISTRY_PATH)}`);
}

main();
