import { NextResponse } from 'next/server';
import { getVendorSession } from '@/lib/vendor/auth-server';
import { upsertVendorProfile } from '@/lib/vendor/vendorStore';
import { isHttpsUrl } from '@/lib/vendors/validateUrls';

export async function PATCH(request: Request) {
  const session = await getVendorSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let logoUrl: string | null | undefined;
  let affiliateUrl: string | null | undefined;
  try {
    const body = (await request.json()) as { logoUrl?: string | null; affiliateUrl?: string | null };
    logoUrl = body.logoUrl;
    affiliateUrl = body.affiliateUrl;
  } catch {
    return NextResponse.json({ error: 'validation_failed' }, { status: 400 });
  }

  if (logoUrl && !isHttpsUrl(logoUrl)) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'logoUrl must be an https URL.' },
      { status: 400 },
    );
  }
  if (affiliateUrl && !isHttpsUrl(affiliateUrl)) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'affiliateUrl must be an https URL.' },
      { status: 400 },
    );
  }

  const profile = await upsertVendorProfile(session.vendorSlug, { logoUrl, affiliateUrl });
  return NextResponse.json({ profile });
}
