import { describe, expect, it } from 'vitest';
import { CATEGORY_CONTENT } from '@/lib/content/categories';
import { GUIDE_PAGES } from '@/lib/content/guides';
import {
  CLEANING_PRICE_BANDS,
  RESTAURANT_PRICE_BANDS,
  WAREHOUSE_PRICE_BANDS,
} from '@/lib/content/price-bands';
import { getCostBand } from '@/lib/content/pseo';
import { getBlogPostBySlug } from '@/lib/content/blog';

describe('price band consistency', () => {
  it('aligns warehouse hub ranges with shared bands', () => {
    const items = CATEGORY_CONTENT.warehouse.priceRanges.items;
    expect(items[0]?.range).toBe(WAREHOUSE_PRICE_BANDS.amrPurchase);
    expect(items[1]?.range).toBe(WAREHOUSE_PRICE_BANDS.amrRaas);
    expect(items[2]?.range).toBe(WAREHOUSE_PRICE_BANDS.agvVehiclePurchase);
    expect(items[3]?.range).toBe(WAREHOUSE_PRICE_BANDS.palletMoverPurchase);
  });

  it('aligns cleaning hub ranges with shared bands', () => {
    const items = CATEGORY_CONTENT.cleaning.priceRanges.items;
    expect(items[0]?.range).toBe(CLEANING_PRICE_BANDS.compactVacuumPurchase);
    expect(items[1]?.range).toBe(CLEANING_PRICE_BANDS.midScrubberPurchase);
    expect(items[2]?.range).toBe(CLEANING_PRICE_BANDS.compactRaas);
    expect(items[3]?.range).toBe(CLEANING_PRICE_BANDS.largeScrubberRaas);
  });

  it('aligns restaurant hub ranges with shared bands', () => {
    const items = CATEGORY_CONTENT.restaurant.priceRanges.items;
    expect(items[0]?.range).toBe(RESTAURANT_PRICE_BANDS.servingLeaseRaas);
    expect(items[1]?.range).toBe(RESTAURANT_PRICE_BANDS.servingPurchase);
    expect(items[2]?.range).toBe(RESTAURANT_PRICE_BANDS.kitchenAutomationPurchase);
  });

  it('matches warehouse guide and 2026 blog meta', () => {
    const guide = GUIDE_PAGES['warehouse-robot-cost'];
    const post = getBlogPostBySlug('warehouse-robot-cost-2026');
    expect(guide.sections[0]?.bullets?.[0]).toContain('150,000');
    expect(guide.sections[1]?.bullets?.[0]).toContain('8,000');
    expect(post?.metaDescription).toContain('$150k');
    expect(post?.metaDescription).toContain('$8k');
    expect(post?.canonicalPath).toBe('/warehouse-robot-cost');
  });

  it('matches cleaning guide and 2026 blog compact range', () => {
    const guide = GUIDE_PAGES['cleaning-robot-cost'];
    const post = getBlogPostBySlug('cleaning-robot-cost-2026');
    expect(guide.sections[0]?.bullets?.[0]).toContain('15,000');
    expect(post?.sections[0]?.bullets?.[0]).toContain('15,000');
    expect(post?.metaDescription).toContain('$800');
    expect(post?.metaDescription).not.toContain('$600');
  });

  it('uses dollar purchase range on serving cost article', () => {
    const post = getBlogPostBySlug('restaurant-serving-robot-cost');
    const body = JSON.stringify(post);
    expect(body).toContain('$15,000–$40,000');
    expect(body).not.toContain('mid five figures');
    expect(post?.canonicalPath).toBe('/restaurant-robot-cost');
  });

  it('aligns pSEO AMR band with shared warehouse bands', () => {
    const band = getCostBand('amr');
    expect(band?.purchaseBand).toContain('150,000');
    expect(band?.monthlyBand).toContain('8,000');
  });

  it('aligns pSEO office cleaner band with shared cleaning bands', () => {
    const band = getCostBand('office_cleaner');
    expect(band?.purchaseBand).toContain('40,000');
    expect(band?.monthlyBand).toContain('800');
  });

  it('documents AGV vehicle vs infrastructure in pSEO', () => {
    const band = getCostBand('agv');
    expect(band?.purchaseBand).toContain('75,000');
    expect(band?.purchaseBand).toContain('200,000');
  });

  it('aligns raas-pricing warehouse section with shared AMR RaaS band', () => {
    const guide = GUIDE_PAGES['raas-pricing'];
    const bullets = guide.sections[0]?.bullets?.join(' ') ?? '';
    expect(bullets).toContain('2,000–$8,000');
  });

  it('exposes restaurant cost guide with shared serving bands', () => {
    const guide = GUIDE_PAGES['restaurant-robot-cost'];
    const bullets = guide.sections[0]?.bullets?.join(' ') ?? '';
    expect(bullets).toContain(RESTAURANT_PRICE_BANDS.servingPurchase);
    expect(bullets).toContain(RESTAURANT_PRICE_BANDS.servingLeaseRaas);
  });
});
