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
              'group w-full cursor-pointer rounded-xl border p-4 text-left shadow-sm transition-[border-color,background-color,box-shadow,color] duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              active
                ? 'border-accent bg-accent text-white shadow-card ring-1 ring-accent/30'
                : 'border-surface-border bg-surface hover:border-accent hover:bg-accent hover:text-white hover:shadow-card',
            )}
          >
            <CategoryIcon
              category={category}
              className={cn(
                'mb-2 text-accent transition-colors duration-150',
                !active && 'group-hover:text-white',
                active && 'text-white',
              )}
            />
            <span className="block font-semibold">{CATEGORY_LABELS[category]}</span>
            <span
              className={cn(
                'mt-1 block text-sm transition-colors duration-150',
                active ? 'text-white/85' : 'text-ink-muted group-hover:text-white/85',
              )}
            >
              {CATEGORY_DESCRIPTIONS[category]}
            </span>
            <span
              className={cn(
                'mt-3 block text-sm font-semibold transition-colors duration-150',
                active ? 'text-white' : 'text-accent group-hover:text-white',
              )}
            >
              {active ? 'Continue →' : 'Start matching →'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
