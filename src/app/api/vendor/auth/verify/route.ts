import { NextResponse } from 'next/server';
import { FOR_VENDORS_PATH } from '@/lib/content/for-vendors';
import {
  consumeLoginToken,
  getVendorAccountByEmail,
} from '@/lib/vendor/vendorStore';
import {
  createVendorSessionToken,
  vendorSessionCookieName,
  vendorSessionCookieOptions,
} from '@/lib/vendor/session';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const portalUrl = new URL(`${FOR_VENDORS_PATH}/portal`, url.origin);

  if (!token) {
    portalUrl.searchParams.set('error', 'missing_token');
    return NextResponse.redirect(portalUrl);
  }

  const email = await consumeLoginToken(token);
  if (!email) {
    portalUrl.searchParams.set('error', 'invalid_token');
    return NextResponse.redirect(portalUrl);
  }

  const account = await getVendorAccountByEmail(email);
  if (!account) {
    portalUrl.searchParams.set('error', 'no_account');
    return NextResponse.redirect(portalUrl);
  }

  const sessionToken = createVendorSessionToken({
    accountId: account.id,
    email: account.email,
    vendorSlug: account.vendorSlug,
  });

  const response = NextResponse.redirect(portalUrl);
  response.cookies.set(vendorSessionCookieName(), sessionToken, vendorSessionCookieOptions());
  return response;
}
