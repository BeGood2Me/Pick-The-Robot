import { NextResponse } from 'next/server';
import { resolveApiBaseUrl } from '@/lib/api/baseUrl';
import { buildOpenApiDocument } from '@/lib/api/openapi';

export async function GET(request: Request) {
  const document = buildOpenApiDocument(resolveApiBaseUrl(request));
  return NextResponse.json(document, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
