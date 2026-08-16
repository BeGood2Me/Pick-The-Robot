import Link from 'next/link';
import { RESTAURANT_BUYERS_CHECKLIST_PATH } from '@/lib/content/restaurant-buyers-checklist';

export function RestaurantChecklistPromo() {
  return (
    <section id="restaurant-buyers-checklist" className="mt-10 scroll-mt-24 card border-accent/30 bg-accent-soft/10">
      <h2 className="text-xl font-semibold text-ink">Restaurant robot buyer&apos;s checklist</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-muted">
        Ten steps, a quick decision tree, and first-call vendor questions — formatted for operators
        before serving or bussing robot demos.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={RESTAURANT_BUYERS_CHECKLIST_PATH}
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-accent/20 transition hover:bg-accent-hover"
        >
          Open full checklist
        </Link>
        <Link
          href={RESTAURANT_BUYERS_CHECKLIST_PATH}
          className="inline-flex items-center justify-center rounded-md border border-surface-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/40 hover:bg-accent-soft/40"
        >
          Print checklist
        </Link>
      </div>
      <p className="mt-3 text-xs text-ink-faint">
        Tip: open the full checklist, then use Print — the layout is optimized for a one-page PDF.
      </p>
    </section>
  );
}
