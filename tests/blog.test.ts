import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  getAllBlogPosts,
  getAllBlogPillars,
  getBlogPostBySlug,
  getPostsForPillar,
  getRelatedPosts,
} from '../src/lib/content/blog';
import {
  VENDOR_FIRST_CALL_QUESTIONS,
  WAREHOUSE_BUYERS_CHECKLIST,
  WAREHOUSE_ROBOT_POST_SLUG,
} from '../src/lib/content/warehouse-buyers-checklist';

describe('blog content', () => {
  it('loads posts and pillars from JSON', () => {
    expect(getAllBlogPosts().length).toBeGreaterThanOrEqual(7);
    expect(getAllBlogPillars().length).toBeGreaterThanOrEqual(4);
  });

  it('has unique post slugs', () => {
    const slugs = getAllBlogPosts().map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('resolves related posts within the cluster', () => {
    const post = getBlogPostBySlug('warehouse-robot-cost-2026');
    expect(post).toBeDefined();
    const related = getRelatedPosts(post!);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((r) => r.pillarSlug === post!.pillarSlug)).toBe(true);
  });

  it('lists pillar posts that exist', () => {
    const pillar = getAllBlogPillars().find((p) => p.slug === 'warehouse-automation');
    expect(pillar).toBeDefined();
    const posts = getPostsForPillar('warehouse-automation');
    expect(posts.length).toBe(pillar!.postSlugs.length);
  });

  it('has a generated registry after blog:generate', () => {
    const registryPath = path.join(process.cwd(), 'src/data/blog/.generated/registry.json');
    if (!fs.existsSync(registryPath)) {
      return;
    }
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    expect(registry.posts.length).toBe(getAllBlogPosts().length);
  });

  it('warehouse buyer checklist has ten steps and vendor questions', () => {
    expect(WAREHOUSE_BUYERS_CHECKLIST).toHaveLength(10);
    expect(VENDOR_FIRST_CALL_QUESTIONS.length).toBeGreaterThanOrEqual(10);
    const post = getBlogPostBySlug(WAREHOUSE_ROBOT_POST_SLUG);
    expect(post?.h1).toContain('checklist');
  });
});
