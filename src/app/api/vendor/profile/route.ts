import { NextResponse } from 'next/server';
import { getVendorSession } from '@/lib/vendor/auth-server';
import { isAllowedVendorLogoUrl } from '@/lib/vendor/logoUpload';
import { vendorHasActiveVerified } from '@/lib/vendor/subscription';
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

  if (logoUrl && !isAllowedVendorLogoUrl(logoUrl)) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'logoUrl must be an uploaded logo or https URL.' },
      { status: 400 },
    );
  }
  if (affiliateUrl) {
    const verified = await vendorHasActiveVerified(session.vendorSlug);
    if (!verified) {
      return NextResponse.json(
        {
          error: 'subscription_required',
          message: 'An active Verified partner subscription is required to set a tracked outbound link.',
        },
        { status: 403 },
      );
    }
    if (!isHttpsUrl(affiliateUrl)) {
      return NextResponse.json(
        { error: 'validation_failed', message: 'Tracked outbound link must be an https URL.' },
        { status: 400 },
      );
    }
  }

  const profile = await upsertVendorProfile(session.vendorSlug, { logoUrl, affiliateUrl });
  return NextResponse.json({ profile });
}
