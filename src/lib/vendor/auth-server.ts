import { cookies } from 'next/headers';
import {
  parseVendorSessionToken,
  vendorSessionCookieName,
  type VendorSessionPayload,
} from '@/lib/vendor/session';
import { getVendorPortalSummary } from '@/lib/vendor/vendorStore';
import type { VendorPortalSummary } from '@/lib/vendor/types';

export async function getVendorSession(): Promise<VendorSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(vendorSessionCookieName())?.value;
  return parseVendorSessionToken(token);
}

export async function getVendorPortalForSession(): Promise<VendorPortalSummary | null> {
  const session = await getVendorSession();
  if (!session) return null;
  return getVendorPortalSummary(session.accountId);
}
