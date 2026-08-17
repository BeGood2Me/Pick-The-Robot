import { COMPARISON_LINKS, HOME_MATCHER_RESET_HREF } from '@/lib/content/navigation';

const MATCHER_PAGE_PATHS = new Set<string>([
  '/',
  '/results',
  ...COMPARISON_LINKS.map((link) => link.href),
]);

/** CTA href that keeps users on the current page's matcher when one exists. */
export function getMatcherCtaHref(pathname: string): string {
  if (pathname === '/') return '#matcher';
  if (MATCHER_PAGE_PATHS.has(pathname)) {
    return `${pathname}#matcher`;
  }
  return HOME_MATCHER_RESET_HREF;
}
