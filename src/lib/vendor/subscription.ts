import { getVendorAccountBySlug, getVendorSubscriptionsForAccount } from '@/lib/vendor/vendorStore';

export async function vendorHasActiveVerified(slug: string): Promise<boolean> {
  const account = await getVendorAccountBySlug(slug);
  if (!account) return false;
  const subs = await getVendorSubscriptionsForAccount(account.id);
  return subs.some((s) => s.tier === 'verified' && s.status === 'active');
}

export async function vendorHasActiveSponsored(slug: string): Promise<boolean> {
  const account = await getVendorAccountBySlug(slug);
  if (!account) return false;
  const subs = await getVendorSubscriptionsForAccount(account.id);
  return subs.some((s) => s.tier === 'sponsored' && s.status === 'active');
}
