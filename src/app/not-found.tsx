import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import {
  CATEGORY_GUIDE_LINKS,
  COMPARISON_LINKS,
  HOME_MATCHER_RESET_HREF,
  VENDORS_INDEX_HREF,
} from '@/lib/content/navigation';

export default function NotFound() {
  return (
    <div className="container-page py-16 sm:py-20">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-lg text-ink-muted">
        That URL does not exist or may have moved. Head back to the matcher or browse our guides.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href={HOME_MATCHER_RESET_HREF}>Get your robot match</ButtonLink>
        <ButtonLink href={VENDORS_INDEX_HREF} variant="secondary">
          Browse vendors
        </ButtonLink>
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-ink">Guides</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {CATEGORY_GUIDE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-accent hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">Comparisons</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {COMPARISON_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-accent hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
