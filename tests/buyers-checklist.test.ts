import { describe, it, expect } from 'vitest';
import {
  CLEANING_BUYERS_CHECKLIST,
  CLEANING_CHECKLIST_COMPARISON_SLUG,
  CLEANING_VENDOR_FIRST_CALL_QUESTIONS,
} from '../src/lib/content/cleaning-buyers-checklist';
import { COMPARISONS } from '../src/lib/content/comparisons';

describe('cleaning buyers checklist', () => {
  it('has ten steps and vendor questions', () => {
    expect(CLEANING_BUYERS_CHECKLIST).toHaveLength(10);
    expect(CLEANING_VENDOR_FIRST_CALL_QUESTIONS.length).toBeGreaterThanOrEqual(10);
  });

  it('is published on the cleaning vs staff comparison page', () => {
    const page = COMPARISONS[CLEANING_CHECKLIST_COMPARISON_SLUG];
    expect(page.h1.toLowerCase()).toContain('checklist');
    expect(page.relatedLinks.some((link) => link.href.includes('cleaning-robot-cost'))).toBe(true);
  });
});
