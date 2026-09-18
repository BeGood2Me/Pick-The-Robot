import { NextResponse } from 'next/server';
import { getVendorSession } from '@/lib/vendor/auth-server';
import {
  detectVendorLogoMime,
  VENDOR_LOGO_MAX_BYTES,
  VENDOR_LOGO_MIME_TYPES,
} from '@/lib/vendor/logoUpload';
import { storeVendorLogo } from '@/lib/vendor/storeVendorLogo';
import { vendorHasActiveVerified } from '@/lib/vendor/subscription';
import { upsertVendorProfile } from '@/lib/vendor/vendorStore';

export async function POST(request: Request) {
  const session = await getVendorSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const verified = await vendorHasActiveVerified(session.vendorSlug);
  if (!verified) {
    return NextResponse.json(
      {
        error: 'subscription_required',
        message: 'An active Verified partner subscription is required to upload a logo.',
      },
      { status: 403 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'validation_failed', message: 'Invalid form data.' }, { status: 400 });
  }

  const file = formData.get('logo');
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'Choose a logo file to upload.' },
      { status: 400 },
    );
  }

  if (file.size === 0) {
    return NextResponse.json({ error: 'validation_failed', message: 'Logo file is empty.' }, { status: 400 });
  }

  if (file.size > VENDOR_LOGO_MAX_BYTES) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'Logo must be 2 MB or smaller.' },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detectedMime = detectVendorLogoMime(buffer);
  if (!detectedMime) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        message: 'Logo must be a PNG, JPEG, or WebP image.',
      },
      { status: 400 },
    );
  }

  if (file.type && file.type in VENDOR_LOGO_MIME_TYPES && file.type !== detectedMime) {
    return NextResponse.json(
      { error: 'validation_failed', message: 'Logo file type does not match its contents.' },
      { status: 400 },
    );
  }

  try {
    const logoUrl = await storeVendorLogo(session.vendorSlug, buffer, detectedMime);
    const profile = await upsertVendorProfile(session.vendorSlug, { logoUrl });
    return NextResponse.json({ logoUrl: profile.logoUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Logo upload failed.';
    return NextResponse.json({ error: 'upload_failed', message }, { status: 500 });
  }
}
