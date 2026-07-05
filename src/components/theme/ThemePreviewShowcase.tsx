'use client';

import { useState } from 'react';
import { CategoryIcon } from '@/components/brand/CategoryIcon';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ScoreMeter } from '@/components/matching/ScoreMeter';
import type { RobotCategory } from '@/lib/matching';
import { cn } from '@/lib/utils';

export type ThemeId = 'current' | 'enterprise' | 'distinctive';

const THEMES: { id: ThemeId; label: string; tagline: string; traits: string }[] = [
  {
    id: 'current',
    label: 'Current',
    tagline: 'Friendly SaaS',
    traits: 'Rounded cards · soft shadows · blue highlights',
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    tagline: 'Procurement portal',
    traits: 'Dark header · flat panels · color only on actions',
  },
  {
    id: 'distinctive',
    label: 'Distinctive',
    tagline: 'Category-forward',
    traits: 'Warm stone bg · colored category blocks · editorial type',
  },
];

const CATEGORY_CARDS: { category: RobotCategory; title: string; desc: string }[] = [
  { category: 'warehouse', title: 'Warehouse', desc: 'AMR, AGV, picking, pallets' },
  { category: 'cleaning', title: 'Cleaning', desc: 'Offices, retail, industrial' },
  { category: 'restaurant', title: 'Restaurant', desc: 'Serving, bussing, kitchen' },
];

const DISTINCTIVE_CATEGORY: Record<
  RobotCategory,
  { border: string; bg: string; iconBg: string; iconText: string }
> = {
  warehouse: {
    border: 'border-l-category-warehouse',
    bg: 'bg-[var(--color-category-warehouse-soft)]',
    iconBg: 'bg-category-warehouse',
    iconText: 'text-white',
  },
  cleaning: {
    border: 'border-l-category-cleaning',
    bg: 'bg-[var(--color-category-cleaning-soft)]',
    iconBg: 'bg-category-cleaning',
    iconText: 'text-white',
  },
  restaurant: {
    border: 'border-l-category-restaurant',
    bg: 'bg-[var(--color-category-restaurant-soft)]',
    iconBg: 'bg-category-restaurant',
    iconText: 'text-white',
  },
};

function ThemedLogo({ square }: { square?: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect width="28" height="28" rx={square ? 4 : 6} fill="var(--color-accent)" />
      <circle cx="10" cy="11" r="2" fill="white" />
      <circle cx="18" cy="11" r="2" fill="white" />
      <path d="M9 17h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <rect x="12" y="4" width="4" height="3" rx="1" fill="white" opacity="0.9" />
    </svg>
  );
}

function ThemePanel({
  themeId,
  label,
  tagline,
  traits,
}: {
  themeId: ThemeId;
  label: string;
  tagline: string;
  traits: string;
}) {
  const isCurrent = themeId === 'current';
  const isEnterprise = themeId === 'enterprise';
  const isDistinctive = themeId === 'distinctive';

  const cardClass = cn(
    'border border-surface-border bg-surface p-4',
    isCurrent && 'rounded-xl shadow-card',
    isEnterprise && 'rounded-md shadow-none',
    isDistinctive && 'rounded-2xl shadow-card',
  );

  const heroClass = cn(
    cardClass,
    isCurrent && 'border-2 border-accent/40 bg-accent-soft/25',
    isEnterprise && 'border-l-4 border-l-accent border-y-surface-border border-r-surface-border bg-surface',
    isDistinctive &&
      'border-0 bg-gradient-to-br from-category-warehouse via-accent to-category-restaurant p-[1px]',
  );

  const heroInnerClass = cn(
    isDistinctive && 'rounded-[calc(1rem-1px)] bg-surface p-4',
    !isDistinctive && 'contents',
  );

  const heroTitleClass = cn(
    'mt-1 font-semibold text-ink',
    isCurrent && 'font-display text-xl',
    isEnterprise && 'text-lg tracking-tight',
    isDistinctive && 'font-display text-2xl',
  );

  const pageTitleClass = cn(
    'font-semibold leading-tight text-ink',
    isCurrent && 'font-display text-xl',
    isEnterprise && 'text-lg uppercase tracking-wide',
    isDistinctive && 'font-display text-2xl',
  );

  const primaryBtnClass = cn(
    isEnterprise && 'rounded-md uppercase tracking-wide',
    isDistinctive && 'rounded-full px-5',
  );

  const secondaryBtnClass = cn(
    isEnterprise && 'rounded-md border-2 bg-transparent',
    isDistinctive && 'rounded-full px-5',
  );

  return (
    <div
      data-theme={themeId}
      className={cn(
        'overflow-hidden border border-surface-border shadow-card',
        isCurrent && 'rounded-2xl bg-surface-soft',
        isEnterprise && 'rounded-lg bg-surface-soft shadow-none',
        isDistinctive && 'rounded-3xl bg-surface-soft',
      )}
    >
      <div className="border-b border-surface-border bg-surface px-4 py-3">
        <h2 className="text-base font-semibold text-ink">{label}</h2>
        <p className="text-xs font-medium text-accent">{tagline}</p>
        <p className="mt-0.5 text-xs text-ink-muted">{traits}</p>
      </div>

      <div className="space-y-5 p-4">
        {/* Header — structurally different per theme */}
        {isEnterprise ? (
          <div className="rounded-md bg-accent px-4 py-3 text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold">
                <ThemedLogo square />
                <span>PickTheRobot</span>
              </div>
              <span className="rounded-md border border-white/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
                Get match
              </span>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'border border-surface-border bg-surface px-4 py-3',
              isCurrent && 'rounded-xl',
              isDistinctive && 'rounded-2xl border-surface-border/80',
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-ink">
                <ThemedLogo />
                <span>PickTheRobot</span>
              </div>
              <Button
                variant="primary"
                className={cn('pointer-events-none px-3 py-1.5 text-xs', primaryBtnClass)}
              >
                Get match
              </Button>
            </div>
          </div>
        )}

        <div>
          <h3 className={pageTitleClass}>Pick the right robot for your business</h3>
          <p
            className={cn(
              'mt-1.5 text-sm text-ink-muted',
              isEnterprise && 'max-w-prose text-[13px] leading-relaxed',
              isDistinctive && 'text-base leading-relaxed',
            )}
          >
            Compare warehouse, cleaning, and restaurant robots by fit and cost model.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" className={cn('pointer-events-none', primaryBtnClass)}>
            Start matcher
          </Button>
          <Button variant="secondary" className={cn('pointer-events-none', secondaryBtnClass)}>
            Browse guides
          </Button>
        </div>

        {/* Match hero */}
        <section className={heroClass}>
          <div className={heroInnerClass}>
            <p
              className={cn(
                'text-sm font-medium',
                isCurrent && 'text-accent',
                isEnterprise && 'text-xs font-semibold uppercase tracking-widest text-ink-muted',
                isDistinctive && 'text-accent',
              )}
            >
              {isEnterprise ? 'Recommendation' : 'Your best match'}
            </p>
            <h4 className={heroTitleClass}>Autonomous mobile robot (AMR)</h4>
            <p className="mt-1 text-sm text-ink-muted">Lease / RaaS · 87% overall fit</p>
            <div className={cn('mt-4', isEnterprise && '[&_[role=progressbar]]:h-1.5')}>
              <ScoreMeter label="Overall fit" value={87} />
            </div>
          </div>
        </section>

        {/* Categories — very different layouts */}
        <div>
          <p
            className={cn(
              'mb-2 text-xs font-semibold text-ink-faint',
              isEnterprise && 'uppercase tracking-widest',
              isDistinctive && 'font-display text-sm text-ink-muted',
              isCurrent && 'uppercase tracking-wide',
            )}
          >
            Categories
          </p>

          {isEnterprise ? (
            <div className="divide-y divide-surface-border rounded-md border border-surface-border bg-surface">
              {CATEGORY_CARDS.map(({ category, title, desc }) => (
                <div key={category} className="flex gap-3 px-4 py-3 text-sm">
                  <CategoryIcon category={category} className="mt-0.5 shrink-0 text-ink-faint" />
                  <span>
                    <span className="font-semibold text-ink">{title}</span>
                    <span className="mt-0.5 block text-ink-muted">{desc}</span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-2">
              {CATEGORY_CARDS.map(({ category, title, desc }) => {
                const d = DISTINCTIVE_CATEGORY[category];
                return (
                  <div
                    key={category}
                    className={cn(
                      'flex gap-3 px-4 py-3 text-sm transition-colors',
                      isCurrent &&
                        'rounded-lg border border-surface-border bg-surface hover:border-accent/40 hover:bg-accent-soft/30',
                      isDistinctive &&
                        cn('rounded-xl border border-surface-border border-l-4', d.border, d.bg),
                    )}
                  >
                    {isDistinctive ? (
                      <span
                        className={cn(
                          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                          d.iconBg,
                        )}
                      >
                        <CategoryIcon category={category} className={cn('h-5 w-5', d.iconText)} />
                      </span>
                    ) : (
                      <CategoryIcon category={category} className="mt-0.5 shrink-0 text-accent" />
                    )}
                    <span>
                      <span className="font-semibold text-ink">{title}</span>
                      <span className="mt-0.5 block text-ink-muted">{desc}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Vendor card */}
        <article className={cardClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex gap-3">
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center text-sm font-bold text-white',
                  isEnterprise ? 'rounded-sm bg-ink' : 'rounded-lg',
                )}
                style={isEnterprise ? undefined : { backgroundColor: 'var(--color-accent)' }}
              >
                LR
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-semibold text-ink">Locus Robotics</h4>
                  <Badge variant={isEnterprise ? 'default' : 'accent'}>84% match</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  Collaborative AMRs for e-commerce and retail fulfillment.
                </p>
              </div>
            </div>
            {isEnterprise ? (
              <span className="shrink-0 border border-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
                Visit vendor
              </span>
            ) : (
              <ButtonLink
                href="#"
                variant="primary"
                className={cn('pointer-events-none shrink-0 text-xs', primaryBtnClass)}
              >
                Visit vendor
              </ButtonLink>
            )}
          </div>
        </article>

        <div className="flex flex-wrap gap-2">
          <Badge variant={isEnterprise ? 'default' : 'accent'}>Recommended</Badge>
          <Badge variant="confidence">Moderate confidence</Badge>
          <Badge variant="default">Rules-based</Badge>
        </div>
      </div>
    </div>
  );
}

export function ThemePreviewShowcase() {
  const [active, setActive] = useState<ThemeId>('current');
  const [layout, setLayout] = useState<'grid' | 'focus'>('grid');
  const activeTheme = THEMES.find((t) => t.id === active)!;

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        Look past the accent color: compare <strong className="text-ink">header style</strong>,{' '}
        <strong className="text-ink">card shape</strong>, <strong className="text-ink">category layout</strong>, and{' '}
        <strong className="text-ink">how much color</strong> is used overall.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 lg:hidden">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => setActive(theme.id)}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm font-medium transition-colors',
                active === theme.id
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-surface-border bg-surface text-ink-muted hover:text-ink',
              )}
            >
              {theme.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <span className="text-sm text-ink-muted">Desktop view:</span>
          <button
            type="button"
            onClick={() => setLayout('grid')}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm',
              layout === 'grid'
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-surface-border text-ink-muted hover:text-ink',
            )}
          >
            All three
          </button>
          <button
            type="button"
            onClick={() => setLayout('focus')}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm',
              layout === 'focus'
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-surface-border text-ink-muted hover:text-ink',
            )}
          >
            Focus one
          </button>
        </div>
      </div>

      {layout === 'grid' && (
        <div className="hidden gap-4 lg:grid lg:grid-cols-3">
          {THEMES.map((theme) => (
            <ThemePanel key={theme.id} {...theme} themeId={theme.id} />
          ))}
        </div>
      )}

      {layout === 'focus' && (
        <div className="hidden space-y-4 lg:block">
          <div className="flex flex-wrap gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActive(theme.id)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm font-medium',
                  active === theme.id
                    ? 'border-accent bg-accent-soft text-accent'
                    : 'border-surface-border text-ink-muted hover:text-ink',
                )}
              >
                {theme.label}
              </button>
            ))}
          </div>
          <ThemePanel {...activeTheme} themeId={activeTheme.id} />
        </div>
      )}

      <div className={layout === 'grid' ? 'lg:hidden' : ''}>
        <ThemePanel {...activeTheme} themeId={activeTheme.id} />
      </div>
    </div>
  );
}
