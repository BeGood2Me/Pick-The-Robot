import { timingSafeEqual } from 'node:crypto';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createPickTheRobotMcpServer } from '@/lib/mcp/createPickTheRobotMcpServer';

/** Optional lock-down token. Ignored unless PICKTHEROBOT_MCP_REQUIRE_AUTH=1. */
export const MCP_HTTP_TOKEN_ENV = 'PICKTHEROBOT_MCP_HTTP_TOKEN';
/** When set to "1", require Bearer matching PICKTHEROBOT_MCP_HTTP_TOKEN (admin/private only). */
export const MCP_REQUIRE_AUTH_ENV = 'PICKTHEROBOT_MCP_REQUIRE_AUTH';

const MAX_BODY_BYTES = 256_000;
const MCP_RPM = 60;

type MinuteBucket = { count: number; windowStartMs: number };
const minuteBuckets = new Map<string, MinuteBucket>();

function bearerMatches(authHeader: string, token: string): boolean {
  const expected = `Bearer ${token}`;
  const provided = authHeader.trim();
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'anonymous';
}

function consumeMcpRateLimit(ip: string, now = Date.now()): {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
} {
  const windowStartMs = Math.floor(now / 60_000) * 60_000;
  const resetAt = Math.floor((windowStartMs + 60_000) / 1000);
  const key = `mcp:${ip}`;
  const existing = minuteBuckets.get(key);

  if (!existing || existing.windowStartMs !== windowStartMs) {
    minuteBuckets.set(key, { count: 1, windowStartMs });
    return { allowed: true, limit: MCP_RPM, remaining: MCP_RPM - 1, resetAt };
  }

  if (existing.count >= MCP_RPM) {
    return { allowed: false, limit: MCP_RPM, remaining: 0, resetAt };
  }

  existing.count += 1;
  return { allowed: true, limit: MCP_RPM, remaining: MCP_RPM - existing.count, resetAt };
}

/** Reset in-memory MCP rate buckets (tests only). */
export function resetMcpRateLimitForTests(): void {
  minuteBuckets.clear();
}

/**
 * Public remote MCP gate (default: no auth).
 * - Optional private mode: PICKTHEROBOT_MCP_REQUIRE_AUTH=1 + PICKTHEROBOT_MCP_HTTP_TOKEN
 * - Payload size + per-IP rate limit (no shared client secret)
 */
export function mcpHttpGate(request: Request): Response | null {
  const requireAuth = process.env[MCP_REQUIRE_AUTH_ENV]?.trim() === '1';
  if (requireAuth) {
    const token = process.env[MCP_HTTP_TOKEN_ENV]?.trim();
    if (!token) {
      return Response.json(
        {
          error: 'mcp_auth_misconfigured',
          message: `${MCP_REQUIRE_AUTH_ENV}=1 but ${MCP_HTTP_TOKEN_ENV} is unset.`,
        },
        { status: 503 },
      );
    }
    const auth = request.headers.get('authorization') ?? '';
    if (!bearerMatches(auth, token)) {
      return Response.json(
        {
          error: 'unauthorized',
          message: 'Missing or invalid Authorization: Bearer <token>.',
        },
        { status: 401 },
      );
    }
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const size = Number(contentLength);
    if (Number.isFinite(size) && size > MAX_BODY_BYTES) {
      return Response.json(
        {
          error: 'payload_too_large',
          message: `Request body must be at most ${MAX_BODY_BYTES} bytes.`,
        },
        { status: 413 },
      );
    }
  }

  const rate = consumeMcpRateLimit(clientIp(request));
  if (!rate.allowed) {
    const retryAfter = String(Math.max(1, rate.resetAt - Math.floor(Date.now() / 1000)));
    return Response.json(
      {
        error: 'rate_limit_exceeded',
        message: 'Too many MCP requests. Retry after the rate limit window resets.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter,
          'X-RateLimit-Limit': String(rate.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rate.resetAt),
        },
      },
    );
  }

  return null;
}

/** @deprecated Use mcpHttpGate — public by default. */
export function mcpHttpAuthFailure(request: Request): Response | null {
  return mcpHttpGate(request);
}

/** Stateless Streamable HTTP handler (JSON responses — safer on Vercel serverless). */
export async function handleMcpHttpRequest(request: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  const server = createPickTheRobotMcpServer();
  await server.connect(transport);

  try {
    return await transport.handleRequest(request);
  } finally {
    await transport.close().catch(() => undefined);
    await server.close().catch(() => undefined);
  }
}
