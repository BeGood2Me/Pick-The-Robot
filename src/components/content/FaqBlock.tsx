'use client';

import { useState } from 'react';
import type { FaqItem } from '@/lib/seo/schema';

export function FaqBlock({
  items,
  title = 'FAQ',
  defaultOpen = 0,
}: {
  items: FaqItem[];
  title?: string;
  defaultOpen?: number | null;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <section className="card">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 divide-y divide-surface-border">
        {items.map((item, i) => {
          const expanded = open === i;
          return (
            <div key={item.question} className="py-3">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 text-left font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : i)}
              >
                <span>{item.question}</span>
                <span aria-hidden className="text-ink-faint">
                  {expanded ? '−' : '+'}
                </span>
              </button>
              {expanded && <p className="mt-2 text-sm text-ink-muted">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
