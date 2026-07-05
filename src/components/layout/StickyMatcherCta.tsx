'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function StickyMatcherCta({ href = '#matcher' }: { href?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 320);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4 md:hidden">
      <Link
        href={href}
        className="pointer-events-auto block w-full rounded-xl bg-accent px-4 py-3 text-center text-sm font-semibold text-white shadow-lg"
      >
        Get your match
      </Link>
    </div>
  );
}
