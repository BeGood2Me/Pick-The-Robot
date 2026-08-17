import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/seo/metadata';
import { isVendorLoginEmailConfigured, sendVendorLoginEmail } from '@/lib/email/sendVendorLoginEmail';
import { createLoginToken, getVendorAccountByEmail } from '@/lib/vendor/vendorStore';

export async function POST(request: Request) {
  let email = '';
  try {
    const body = (await request.json()) as { email?: string };
    email = (body.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'validation_failed' }, { status: 400 });
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'A valid email is required.' },
      { status: 400 },
    );
  }

  const account = await getVendorAccountByEmail(email);
  const responseBody: { ok: true; loginUrl?: string } = { ok: true };

  if (account) {
    const token = await createLoginToken(email);
    const loginUrl = `${BASE_URL.replace(/\/$/, '')}/api/vendor/auth/verify?token=${encodeURIComponent(token)}`;

    if (isVendorLoginEmailConfigured()) {
      try {
        await sendVendorLoginEmail({ to: email, loginUrl });
      } catch (err) {
        console.error('vendor login email failed', err);
      }
    } else if (process.env.NODE_ENV !== 'production') {
      responseBody.loginUrl = loginUrl;
    } else {
      console.error(
        'BREVO_API_KEY is not configured — vendor login email was not sent. Run scripts/brevo-setup.mjs',
      );
    }
  }

  return NextResponse.json(responseBody);
}
