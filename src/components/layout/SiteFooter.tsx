import Link from 'next/link';
import { getAllBlogPillars } from '@/lib/content/blog';
import {
  CATEGORY_GUIDE_LINKS,
  COMPARISON_LINKS,
  DECISION_LINKS,
  GUIDE_LINKS,
  HOME_MATCHER_RESET_HREF,
  SITE_NAME,
  VENDORS_INDEX_HREF,
} from '@/lib/content/navigation';

export function SiteFooter() {
  const blogPillars = getAllBlogPillars();

  return (
    <footer className="mt-16 border-t border-surface-border bg-surface">
      <div className="container-page py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="max-w-[16rem] shrink-0">
            <p className="font-semibold text-ink">{SITE_NAME}</p>
            <p className="mt-2 text-sm text-ink-muted">
              A buyer-side robot selection tool for warehouse, cleaning, and restaurant operators.
            </p>
            <p className="mt-3">
              <Link href={HOME_MATCHER_RESET_HREF} className="text-sm font-medium text-accent hover:underline">
                Run the matcher
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:items-start sm:gap-x-12 sm:gap-y-8">
            <div className="shrink-0">
              <p className="text-sm font-semibold text-ink">Still researching?</p>
              <p className="mt-1 text-xs text-ink-muted">Robot types, vendors, and FAQs</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                <li>
                  <Link href={VENDORS_INDEX_HREF} className="hover:text-ink">
                    All vendors
                  </Link>
                </li>
                {CATEGORY_GUIDE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0">
              <p className="text-sm font-semibold text-ink">Comparisons</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                {COMPARISON_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0">
              <p className="text-sm font-semibold text-ink">Acquisition guides</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                {DECISION_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0">
              <p className="text-sm font-semibold text-ink">Cost &amp; pricing</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                {GUIDE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0">
              <p className="text-sm font-semibold text-ink">Blog topics</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                <li>
                  <Link href="/blog" className="hover:text-ink">
                    All articles
                  </Link>
                </li>
                {blogPillars.map((pillar) => (
                  <li key={pillar.slug}>
                    <Link href={`/blog/topics/${pillar.slug}`} className="hover:text-ink">
                      {pillar.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0">
              <p className="text-sm font-semibold text-ink">For vendors</p>
              <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                <li>
                  <Link href="/for-vendors" className="hover:text-ink">
                    List your robot
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-surface-border py-4 text-center text-xs text-ink-faint">
        <p>Recommendations are informational. Verify pricing and fit with vendors directly.</p>
        <p className="mt-2">
          <Link href="/about" className="hover:text-ink-muted">
            About
          </Link>
          {' · '}
          <Link href="/privacy" className="hover:text-ink-muted">
            Privacy
          </Link>
          {' · '}
          <Link href="/terms" className="hover:text-ink-muted">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  );
}
