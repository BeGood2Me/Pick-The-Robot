import { NextResponse } from 'next/server';
import { recordVendorClick } from '@/lib/vendor/vendorStore';
import { getVendorBySlug } from '@/lib/matching/vendors';

export async function POST(request: Request) {
  let vendorSlug = '';
  let context: string | undefined;
  try {
    const body = (await request.json()) as { vendorSlug?: string; context?: string };
    vendorSlug = (body.vendorSlug ?? '').trim();
    context = body.context;
  } catch {
    return NextResponse.json({ error: 'validation_failed' }, { status: 400 });
  }

  if (!vendorSlug || !getVendorBySlug(vendorSlug)) {
    return NextResponse.json({ error: 'unknown_vendor' }, { status: 404 });
  }

  await recordVendorClick(vendorSlug, context);
  return NextResponse.json({ ok: true });
}
