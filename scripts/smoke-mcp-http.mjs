#!/usr/bin/env node
/**
 * Smoke-test remote MCP (Streamable HTTP + Bearer auth).
 *
 * Usage:
 *   node scripts/smoke-mcp-http.mjs
 *   node scripts/smoke-mcp-http.mjs --url https://picktherobot.com/api/mcp --token "$PICKTHEROBOT_MCP_HTTP_TOKEN"
 *
 * Env:
 *   PICKTHEROBOT_MCP_HTTP_TOKEN — Bearer token (required for success path)
 *   MCP_SMOKE_URL — override endpoint (default production)
 */
import { randomUUID } from 'node:crypto';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i === -1 || !process.argv[i + 1]) return fallback;
  return process.argv[i + 1];
}

const url = arg('--url', process.env.MCP_SMOKE_URL || 'https://picktherobot.com/api/mcp');
const token = arg('--token', process.env.PICKTHEROBOT_MCP_HTTP_TOKEN || '');

const headersBase = {
  Accept: 'application/json, text/event-stream',
  'Content-Type': 'application/json',
  'MCP-Protocol-Version': '2025-03-26',
};

async function post(body, withAuth) {
  const headers = { ...headersBase };
  if (withAuth) {
    if (!token) throw new Error('Missing --token or PICKTHEROBOT_MCP_HTTP_TOKEN');
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  console.log(`MCP smoke → ${url}`);

  // 1) No auth — expect 401 (if enabled) or 503 (if token unset on host)
  const noAuth = await post(
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'smoke', version: '0' } } },
    false,
  );
  assert(
    noAuth.status === 401 || noAuth.status === 503,
    `Expected 401/503 without auth, got ${noAuth.status}: ${JSON.stringify(noAuth.json)}`,
  );
  console.log(`  no auth → ${noAuth.status} (${noAuth.json.error || 'ok'})`);

  if (!token) {
    console.log('  skip authenticated checks (set PICKTHEROBOT_MCP_HTTP_TOKEN or --token)');
    if (noAuth.status === 503) {
      console.log('  host has no PICKTHEROBOT_MCP_HTTP_TOKEN — set it on Vercel and redeploy');
      process.exit(2);
    }
    process.exit(0);
  }

  // 2) Wrong token → 401
  const bad = await fetch(url, {
    method: 'POST',
    headers: {
      ...headersBase,
      Authorization: 'Bearer wrong-token',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'smoke', version: '0' },
      },
    }),
  });
  assert(bad.status === 401, `Expected 401 for wrong token, got ${bad.status}`);
  console.log('  wrong token → 401');

  // 3) Initialize
  const init = await post(
    {
      jsonrpc: '2.0',
      id: 3,
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'smoke-mcp-http', version: '1.0.0' },
      },
    },
    true,
  );
  assert(init.status === 200, `initialize failed: ${init.status} ${JSON.stringify(init.json)}`);
  assert(init.json?.result?.serverInfo?.name === 'picktherobot', 'unexpected serverInfo');
  console.log('  initialize → 200 (picktherobot)');

  // 4) tools/list (stateless — send as fresh request with auth)
  const tools = await post({ jsonrpc: '2.0', id: 4, method: 'tools/list', params: {} }, true);
  assert(tools.status === 200, `tools/list failed: ${tools.status}`);
  const names = (tools.json?.result?.tools || []).map((t) => t.name);
  for (const required of [
    'get_matcher_fields',
    'run_match',
    'list_vendors',
    'get_vendor',
    'get_price_bands',
    'list_comparisons',
    'get_comparison',
  ]) {
    assert(names.includes(required), `missing tool ${required}; got ${names.join(',')}`);
  }
  console.log(`  tools/list → ${names.length} tools`);

  // 5) Sample tool call
  const bands = await post(
    {
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: { name: 'get_price_bands', arguments: {}, _meta: { progressToken: randomUUID() } },
    },
    true,
  );
  assert(bands.status === 200, `get_price_bands failed: ${bands.status}`);
  assert(!bands.json?.result?.isError, `get_price_bands error: ${JSON.stringify(bands.json)}`);
  console.log('  tools/call get_price_bands → ok');

  console.log('MCP smoke passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
