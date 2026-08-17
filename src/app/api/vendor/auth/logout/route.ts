import { NextResponse } from 'next/server';
import { vendorSessionCookieName } from '@/lib/vendor/session';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(vendorSessionCookieName(), '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
