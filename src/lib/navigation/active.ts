/** Whether a nav link should show as active for the current pathname. */
export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  if (href.includes('#')) return pathname === href.split('#')[0];
  return pathname === href || pathname.startsWith(`${href}/`);
}
