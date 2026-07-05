'use client';

import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS } from '@/lib/forms';
import { CategoryIcon } from '@/components/brand/CategoryIcon';
import { trackCategoryChanged, type RobotCategory } from '@/lib/matching';
import { cn } from '@/lib/utils';

const CATEGORIES: RobotCategory[] = ['warehouse', 'cleaning', 'restaurant'];

export function CategorySelector({
  selected,
  onSelect,
}: {
  selected: RobotCategory | null;
  onSelect: (category: RobotCategory) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Robot category">
      {CATEGORIES.map((category) => {
        const active = selected === category;
        return (
          <button
            key={category}
            type="button"
            aria-pressed={active}
            onClick={() => {
              onSelect(category);
              trackCategoryChanged(category);
            }}
            className={cn(
              'w-full cursor-pointer rounded-xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              active
                ? 'border-accent bg-accent-soft ring-1 ring-accent/20'
                : 'border-surface-border bg-surface hover:border-accent/30 hover:bg-accent-soft/30',
            )}
          >
            <CategoryIcon category={category} className="mb-2 text-accent" />
            <span className="block font-semibold text-ink">{CATEGORY_LABELS[category]}</span>
            <span className="mt-1 block text-sm text-ink-muted">{CATEGORY_DESCRIPTIONS[category]}</span>
            <span className="mt-3 block text-sm font-semibold text-accent">
              {active ? 'Continue →' : 'Start matching →'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
