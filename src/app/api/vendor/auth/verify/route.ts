import { NextResponse } from 'next/server';
import { FOR_VENDORS_LOGIN_PATH, FOR_VENDORS_PORTAL_PATH } from '@/lib/content/for-vendors';
import {
  consumeLoginToken,
  getVendorAccountByEmail,
} from '@/lib/vendor/vendorStore';
import {
  createVendorSessionToken,
  vendorSessionCookieName,
  vendorSessionCookieOptions,
} from '@/lib/vendor/session';

function loginRedirect(request: Request, error: string) {
  const loginUrl = new URL(FOR_VENDORS_LOGIN_PATH, request.url);
  loginUrl.searchParams.set('error', error);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const portalUrl = new URL(FOR_VENDORS_PORTAL_PATH, url.origin);

  if (!token) {
    return loginRedirect(request, 'missing_token');
  }

  const email = await consumeLoginToken(token);
  if (!email) {
    return loginRedirect(request, 'invalid_token');
  }

  const account = await getVendorAccountByEmail(email);
  if (!account) {
    return loginRedirect(request, 'no_account');
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
