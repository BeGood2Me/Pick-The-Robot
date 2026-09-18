# PickTheRobot MCP server

Stdio MCP server that exposes the same **rules-based matcher**, vendor catalog, price bands, and comparison guides as [picktherobot.com](https://picktherobot.com) — for use in **Grok Bot**, Cursor, Claude Desktop, and other MCP clients.

## Tools

| Tool | Purpose |
|------|---------|
| `get_matcher_fields` | Required inputs per category (`warehouse`, `cleaning`, `restaurant`) |
| `run_match` | Full matcher run → scores, vendors, `shareUrl` |
| `list_vendors` | Vendor catalog by category (optional region) |
| `get_vendor` | Single vendor by slug |
| `get_price_bands` | Indicative USD bands from site guides |
| `list_comparisons` | Comparison / decision page index |
| `get_comparison` | Full comparison content by slug |

## Resources

- `picktherobot://methodology` — scoring weights and limits
- `picktherobot://llms.txt` — public `llms.txt` summary

## Run locally

From the repo root (after `npm install`):

```bash
npm run mcp
```

Uses the in-repo matching engine (no paid API key required).

### Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://picktherobot.com` | Base URL for share links and vendor URLs |
| `PICKTHEROBOT_MCP_TIER` | `pro` | Match payload detail: `pro` or `starter` |
| `PICKTHEROBOT_MCP_REQUIRE_AUTH` | _(unset)_ | **Optional / admin-only.** Set to `1` to require Bearer auth (private mode). Default production is **public** — no token. |
| `PICKTHEROBOT_MCP_HTTP_TOKEN` | _(unset)_ | Used only when `PICKTHEROBOT_MCP_REQUIRE_AUTH=1`. |

## Remote HTTPS MCP (public)

Endpoint (same rules-based matcher as stdio — **not** the paid `/api/v1` X-API-Key API):

| | |
|--|--|
| **URL** | `https://picktherobot.com/api/mcp` |
| **Transport** | Streamable HTTP (JSON responses) |
| **Auth** | **None** (public, like the website matcher) |
| **Discovery** | `https://picktherobot.com/.well-known/mcp/server-card.json` |

Abuse controls (no client secret): per-IP rate limit (~60 req/min) and max body size (~256 KB).

### Connect (Grok Bot / Cursor / curl)

No Bearer token. Point the client at the URL above.

```bash
# Public smoke (no Authorization header)
node scripts/smoke-mcp-http.mjs

# Or curl initialize
curl.exe -s -X POST https://picktherobot.com/api/mcp ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json, text/event-stream" ^
  -H "MCP-Protocol-Version: 2025-03-26" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{\"protocolVersion\":\"2025-03-26\",\"capabilities\":{},\"clientInfo\":{\"name\":\"curl\",\"version\":\"0\"}}}"
```

### Optional private mode (admin only)

Default production must stay public. To lock a non-prod or private deploy:

1. Set `PICKTHEROBOT_MCP_REQUIRE_AUTH=1`
2. Set `PICKTHEROBOT_MCP_HTTP_TOKEN=<secret>`
3. Clients send `Authorization: Bearer <secret>`

## Grok Bot / Grok CLI (local stdio)

Grok discovers MCP from this repo automatically when you work in the project:

| File | Purpose |
|------|---------|
| `.mcp.json` | Project MCP manifest (Grok, some other clients) |
| `.cursor/mcp.json` | Cursor + Grok compat import |
| `.grok/config.toml` | Native Grok project MCP config |

The server is registered as **`picktherobot`**.

1. Open a terminal **in this repository** (so `node_modules` exists).
2. Run `npm install` if you have not already.
3. In Grok: run **`grok inspect`** — you should see `picktherobot` listed.
4. If it fails: **`grok mcp doctor picktherobot`** (stderr is also logged under `~/.grok/logs/mcp/` on first connect).

Manual add (from repo root):

```bash
grok mcp add picktherobot -- node scripts/mcp-entry.mjs
```

First launch can take up to ~90s while `tsx` warms up; project config sets `startup_timeout_sec = 90`.

For local Streamable HTTP without deploying:

```bash
npm run mcp:http
grok mcp add --transport http picktherobot http://127.0.0.1:3928/mcp
```

## Cursor configuration

Project `.cursor/mcp.json` is already committed. Reload MCP in Cursor settings if needed.

Legacy manual config (optional):

```json
{
  "mcpServers": {
    "picktherobot": {
      "command": "node",
      "args": ["scripts/mcp-entry.mjs"]
    }
  }
}
```

On Windows, run from the repo root so `scripts/mcp-entry.mjs` resolves.

## Notes

- Match output is **informational** — not a quote or deployment guarantee.
- Sponsored vendors receive a small boost only when already relevant (see methodology resource).
- This server does not call the hosted `/api/v1/match` HTTP API; it imports `src/lib/matching` directly so results stay in sync with the website wizard.
