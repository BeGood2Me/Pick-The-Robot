#!/usr/bin/env node
/**
 * Smoke-test public remote MCP (Streamable HTTP, no auth by default).
 *
 * Usage:
 *   node scripts/smoke-mcp-http.mjs
 *   node scripts/smoke-mcp-http.mjs --url http://127.0.0.1:3005/api/mcp
 *
 * Env:
 *   MCP_SMOKE_URL — override endpoint (default https://picktherobot.com/api/mcp)
 */
import { randomUUID } from 'node:crypto';

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i === -1 || !process.argv[i + 1]) return fallback;
  return process.argv[i + 1];
}

const url = arg('--url', process.env.MCP_SMOKE_URL || 'https://picktherobot.com/api/mcp');

const headersBase = {
  Accept: 'application/json, text/event-stream',
  'Content-Type': 'application/json',
  'MCP-Protocol-Version': '2025-03-26',
};

async function post(body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: headersBase,
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
  console.log(`MCP smoke (public, no Authorization) → ${url}`);

  const init = await post({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'smoke-mcp-http', version: '1.0.0' },
    },
  });
  assert(init.status === 200, `initialize failed: ${init.status} ${JSON.stringify(init.json)}`);
  assert(init.json?.result?.serverInfo?.name === 'picktherobot', 'unexpected serverInfo');
  console.log('  initialize → 200 (picktherobot)');

  const tools = await post({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
  assert(tools.status === 200, `tools/list failed: ${tools.status} ${JSON.stringify(tools.json)}`);
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

  const bands = await post({
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'get_price_bands',
      arguments: {},
      _meta: { progressToken: randomUUID() },
    },
  });
  assert(bands.status === 200, `get_price_bands failed: ${bands.status}`);
  assert(!bands.json?.result?.isError, `get_price_bands error: ${JSON.stringify(bands.json)}`);
  console.log('  tools/call get_price_bands → ok');

  console.log('MCP smoke passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
