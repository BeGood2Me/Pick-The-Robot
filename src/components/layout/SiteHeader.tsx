'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { isNavLinkActive } from '@/lib/navigation/active';
import {
  COMPARISON_LINKS,
  HEADER_NAV_LINKS,
  HOME_MATCHER_RESET_HREF,
  NAV_LINKS,
  SITE_NAME,
} from '@/lib/content/navigation';
import { getMatcherCtaHref } from '@/lib/navigation/matcher';
import { cn } from '@/lib/utils';

function navLinkClass(pathname: string, href: string) {
  return cn(
    'whitespace-nowrap hover:text-ink',
    isNavLinkActive(pathname, href) && 'text-ink underline decoration-accent underline-offset-4',
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const matcherCtaHref = getMatcherCtaHref(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLElement>(null);
  useFocusTrap(menuOpen, mobileNavRef);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className="border-b border-surface-border bg-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link
          href={HOME_MATCHER_RESET_HREF}
          className="relative z-10 flex shrink-0 items-center gap-2.5 text-lg font-bold text-ink"
        >
          <Logo />
          <span className="hidden sm:inline">{SITE_NAME}</span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-x-5 text-sm font-medium text-ink-muted lg:flex"
        >
          {HEADER_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass(pathname, link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ButtonLink href={matcherCtaHref} variant="primary" className="hidden text-sm sm:inline-flex">
            Get match
          </ButtonLink>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-surface-border p-2 text-ink lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? 'Close' : 'Menu'}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              {menuOpen ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          ref={mobileNavRef}
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-surface-border bg-surface lg:hidden"
        >
          <ul className="container-page flex flex-col gap-1 py-3 text-sm font-medium">
            {HEADER_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'block rounded-lg px-3 py-2 hover:bg-surface-soft',
                    isNavLinkActive(pathname, link.href) && 'bg-accent-soft text-accent',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="px-3 pt-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Guides
            </li>
            {NAV_LINKS.filter((link) => !HEADER_NAV_LINKS.some((h) => h.href === link.href)).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'block rounded-lg px-3 py-2 hover:bg-surface-soft',
                    isNavLinkActive(pathname, link.href) && 'bg-accent-soft text-accent',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {COMPARISON_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'block rounded-lg px-3 py-2 hover:bg-surface-soft',
                    isNavLinkActive(pathname, link.href) && 'bg-accent-soft text-accent',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <ButtonLink href={matcherCtaHref} variant="primary" className="w-full">
                Get match
              </ButtonLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
