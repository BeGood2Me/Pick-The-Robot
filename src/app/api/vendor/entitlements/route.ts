import { NextResponse } from 'next/server';
import { getVendorEntitlements } from '@/lib/vendor/vendorStore';

export async function GET() {
  const entitlements = await getVendorEntitlements();
  return NextResponse.json(entitlements, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
