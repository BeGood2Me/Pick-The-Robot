import { describe, it, expect } from 'vitest';
import {
  CLEANING_BUYERS_CHECKLIST,
  CLEANING_BUYERS_CHECKLIST_PATH,
  CLEANING_CHECKLIST_COMPARISON_SLUG,
  CLEANING_VENDOR_FIRST_CALL_QUESTIONS,
} from '../src/lib/content/cleaning-buyers-checklist';
import {
  WAREHOUSE_BUYERS_CHECKLIST,
  WAREHOUSE_BUYERS_CHECKLIST_PATH,
  WAREHOUSE_CHECKLIST_COMPARISON_SLUG,
  WAREHOUSE_VENDOR_FIRST_CALL_QUESTIONS,
} from '../src/lib/content/warehouse-buyers-checklist';
import {
  RESTAURANT_BUYERS_CHECKLIST,
  RESTAURANT_BUYERS_CHECKLIST_PATH,
  RESTAURANT_CHECKLIST_COMPARISON_SLUG,
  RESTAURANT_VENDOR_FIRST_CALL_QUESTIONS,
} from '../src/lib/content/restaurant-buyers-checklist';
import { METHODOLOGY_PATH } from '../src/lib/content/methodology';
import { COMPARISONS } from '../src/lib/content/comparisons';

describe('cleaning buyers checklist', () => {
  it('has ten steps and vendor questions', () => {
    expect(CLEANING_BUYERS_CHECKLIST).toHaveLength(10);
    expect(CLEANING_VENDOR_FIRST_CALL_QUESTIONS.length).toBeGreaterThanOrEqual(10);
  });

  it('has a standalone linkable resource page', () => {
    expect(CLEANING_BUYERS_CHECKLIST_PATH).toBe(
      '/resources/commercial-cleaning-robot-buyer-checklist',
    );
  });

  it('is linked from the cleaning vs staff comparison page', () => {
    const page = COMPARISONS[CLEANING_CHECKLIST_COMPARISON_SLUG];
    expect(page.h1.toLowerCase()).toContain('cleaning robot vs cleaning staff');
    expect(page.intro.toLowerCase()).toContain('checklist');
    expect(
      page.relatedLinks.some((link) => link.href === CLEANING_BUYERS_CHECKLIST_PATH),
    ).toBe(true);
    expect(page.relatedLinks.some((link) => link.href.includes('cleaning-robot-cost'))).toBe(true);
  });
});

describe('warehouse buyers checklist', () => {
  it('has ten steps and vendor questions', () => {
    expect(WAREHOUSE_BUYERS_CHECKLIST).toHaveLength(10);
    expect(WAREHOUSE_VENDOR_FIRST_CALL_QUESTIONS.length).toBeGreaterThanOrEqual(10);
  });

  it('has a standalone linkable resource page', () => {
    expect(WAREHOUSE_BUYERS_CHECKLIST_PATH).toBe('/resources/warehouse-robot-buyer-checklist');
  });

  it('is linked from the amr vs agv comparison page', () => {
    const page = COMPARISONS[WAREHOUSE_CHECKLIST_COMPARISON_SLUG];
    expect(page.h1.toLowerCase()).toContain('amr vs agv');
    expect(page.intro.toLowerCase()).toContain('checklist');
    expect(
      page.relatedLinks.some((link) => link.href === WAREHOUSE_BUYERS_CHECKLIST_PATH),
    ).toBe(true);
  });
});

describe('methodology page', () => {
  it('has a public path', () => {
    expect(METHODOLOGY_PATH).toBe('/methodology');
  });
});

describe('restaurant buyers checklist', () => {
  it('has ten steps and vendor questions', () => {
    expect(RESTAURANT_BUYERS_CHECKLIST).toHaveLength(10);
    expect(RESTAURANT_VENDOR_FIRST_CALL_QUESTIONS.length).toBeGreaterThanOrEqual(10);
  });

  it('has a standalone linkable resource page', () => {
    expect(RESTAURANT_BUYERS_CHECKLIST_PATH).toBe('/resources/restaurant-robot-buyer-checklist');
  });

  it('is linked from the food runner vs staff comparison page', () => {
    const page = COMPARISONS[RESTAURANT_CHECKLIST_COMPARISON_SLUG];
    expect(page.h1.toLowerCase()).toContain('food runner');
    expect(page.intro.toLowerCase()).toContain('checklist');
    expect(
      page.relatedLinks.some((link) => link.href === RESTAURANT_BUYERS_CHECKLIST_PATH),
    ).toBe(true);
  });
});
