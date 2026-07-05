import { CATEGORY_ROUTES, COMPARISON_LINKS } from '@/lib/content/navigation';

const MATCHER_PAGE_PATHS = new Set<string>([
  '/',
  '/results',
  ...Object.values(CATEGORY_ROUTES),
  ...COMPARISON_LINKS.map((link) => link.href),
]);

/** CTA href that keeps users on the current page's matcher when one exists. */
export function getMatcherCtaHref(pathname: string): string {
  if (MATCHER_PAGE_PATHS.has(pathname)) {
    return pathname === '/' ? '#matcher' : `${pathname}#matcher`;
  }
  return '/#matcher';
}
