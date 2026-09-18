import { afterEach, describe, expect, it } from 'vitest';
import { MCP_HTTP_TOKEN_ENV, mcpHttpAuthFailure } from '../src/lib/mcp/handleMcpHttpRequest';

const ENV_KEY = MCP_HTTP_TOKEN_ENV;

afterEach(() => {
  delete process.env[ENV_KEY];
});

function req(auth?: string) {
  return new Request('https://picktherobot.com/api/mcp', {
    method: 'POST',
    headers: auth ? { Authorization: auth } : {},
  });
}

describe('mcpHttpAuthFailure', () => {
  it('returns 503 mcp_http_disabled when host token is unset', async () => {
    delete process.env[ENV_KEY];
    const res = mcpHttpAuthFailure(req('Bearer anything'));
    expect(res).not.toBeNull();
    expect(res!.status).toBe(503);
    const body = await res!.json();
    expect(body.error).toBe('mcp_http_disabled');
    expect(String(body.message)).toContain(ENV_KEY);
  });

  it('returns 401 when Authorization is missing', async () => {
    process.env[ENV_KEY] = 'secret-token';
    const res = mcpHttpAuthFailure(req());
    expect(res!.status).toBe(401);
    const body = await res!.json();
    expect(body.error).toBe('unauthorized');
  });

  it('returns 401 when Bearer token is wrong', async () => {
    process.env[ENV_KEY] = 'secret-token';
    const res = mcpHttpAuthFailure(req('Bearer wrong'));
    expect(res!.status).toBe(401);
  });

  it('allows the request when Bearer token matches', () => {
    process.env[ENV_KEY] = 'secret-token';
    expect(mcpHttpAuthFailure(req('Bearer secret-token'))).toBeNull();
  });
});
