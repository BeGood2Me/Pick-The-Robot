import { afterEach, describe, expect, it } from 'vitest';
import {
  MCP_HTTP_TOKEN_ENV,
  MCP_REQUIRE_AUTH_ENV,
  mcpHttpGate,
  resetMcpRateLimitForTests,
} from '../src/lib/mcp/handleMcpHttpRequest';

afterEach(() => {
  delete process.env[MCP_HTTP_TOKEN_ENV];
  delete process.env[MCP_REQUIRE_AUTH_ENV];
  resetMcpRateLimitForTests();
});

function req(init?: RequestInit) {
  return new Request('https://picktherobot.com/api/mcp', {
    method: 'POST',
    ...init,
  });
}

describe('mcpHttpGate (public by default)', () => {
  it('allows requests with no Authorization header', () => {
    expect(mcpHttpGate(req())).toBeNull();
  });

  it('rejects oversized Content-Length', async () => {
    const res = mcpHttpGate(
      req({ headers: { 'Content-Length': String(300_000) } }),
    );
    expect(res!.status).toBe(413);
    const body = await res!.json();
    expect(body.error).toBe('payload_too_large');
  });

  it('rate-limits after too many requests from one IP', () => {
    let blocked: Response | null = null;
    for (let i = 0; i < 70; i++) {
      blocked = mcpHttpGate(req({ headers: { 'x-forwarded-for': '203.0.113.9' } }));
      if (blocked) break;
    }
    expect(blocked?.status).toBe(429);
  });

  it('requires Bearer only when PICKTHEROBOT_MCP_REQUIRE_AUTH=1', async () => {
    process.env[MCP_REQUIRE_AUTH_ENV] = '1';
    process.env[MCP_HTTP_TOKEN_ENV] = 'secret-token';

    const denied = mcpHttpGate(req());
    expect(denied!.status).toBe(401);

    const ok = mcpHttpGate(
      req({ headers: { Authorization: 'Bearer secret-token' } }),
    );
    expect(ok).toBeNull();
  });
});
