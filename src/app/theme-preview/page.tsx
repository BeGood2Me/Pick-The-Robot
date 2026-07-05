import type { Metadata } from 'next';
import { ThemePreviewShowcase } from '@/components/theme/ThemePreviewShowcase';

export const metadata: Metadata = {
  title: 'Theme preview',
  robots: { index: false, follow: false },
};

export default function ThemePreviewPage() {
  return (
    <div className="container-page py-8 sm:py-10">
      <header className="mb-8 max-w-3xl">
        <p className="text-sm font-medium text-accent">Design comparison</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Theme options</h1>
        <p className="mt-2 text-ink-muted">
          Three directions using the same layout and components. Compare header, match results, category
          cards, and vendor listings. This page is not indexed — for your review only.
        </p>
      </header>

      <section className="mb-10 rounded-xl border border-surface-border bg-surface p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-ink">Quick reference</h2>
        <dl className="mt-3 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-semibold text-ink">Current</dt>
            <dd className="mt-1 text-ink-muted">
              White header, rounded cards, soft shadows, blue-tinted match hero. Standard SaaS buying tool.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Enterprise</dt>
            <dd className="mt-1 text-ink-muted">
              Dark navy header bar, flat square panels, left-border recommendation, divided category list,
              outline CTAs. Minimal color.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Distinctive</dt>
            <dd className="mt-1 text-ink-muted">
              Warm stone background, gradient match frame, pill buttons, each category gets its own color
              block and icon badge.
            </dd>
          </div>
        </dl>
      </section>

      <ThemePreviewShowcase />
    </div>
  );
}
