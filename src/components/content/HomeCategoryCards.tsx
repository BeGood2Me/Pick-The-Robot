import Link from 'next/link';
import { CATEGORY_GUIDE_LINKS } from '@/lib/content/navigation';

/** Compact guide links — kept separate from the matcher category picker. */
export function HomeCategoryGuideLinks() {
  return (
    <section
      className="rounded-lg border border-surface-border bg-surface-soft px-4 py-5 text-sm"
      aria-label="Category education"
    >
      <h2 className="font-semibold text-ink">Still researching?</h2>
      <p className="mt-1 text-ink-muted">
        Read robot types, vendors, and FAQs before you run the matcher.
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {CATEGORY_GUIDE_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="font-medium text-accent hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
