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
| `PICKTHEROBOT_MCP_HTTP_TOKEN` | _(unset)_ | **Required for remote HTTPS MCP.** Bearer secret for `POST https://picktherobot.com/api/mcp`. If unset, the route returns `503 mcp_http_disabled`. |

## Remote HTTPS MCP (Grok Bot / Cursor connectors)

Endpoint (same rules-based matcher as stdio — **not** the paid `/api/v1` X-API-Key API):

| | |
|--|--|
| **URL** | `https://picktherobot.com/api/mcp` |
| **Transport** | Streamable HTTP (JSON responses) |
| **Auth** | `Authorization: Bearer <PICKTHEROBOT_MCP_HTTP_TOKEN>` |
| **Discovery** | `https://picktherobot.com/.well-known/mcp/server-card.json` |

### Enable on Vercel

1. Generate a secret: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
2. Add it for Production (and Preview if you want):  
   `npx vercel env add PICKTHEROBOT_MCP_HTTP_TOKEN production`  
   (paste the secret when prompted, or pipe it in)
3. **Redeploy** Production so the new env var is live.
4. In Grok Bot / grok.com connectors: URL above + Bearer token header.
5. Smoke test:

```bash
# Expect 401 without token (or 503 if host token still unset)
curl.exe -s -o - -w "\n%{http_code}\n" -X POST https://picktherobot.com/api/mcp ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json, text/event-stream" ^
  -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{\"protocolVersion\":\"2025-03-26\",\"capabilities\":{},\"clientInfo\":{\"name\":\"curl\",\"version\":\"0\"}}}"

# Expect 200 with valid token
set PICKTHEROBOT_MCP_HTTP_TOKEN=your-secret-here
node scripts/smoke-mcp-http.mjs
```

Without a valid Bearer token the endpoint stays closed (401). Without the env var on the host it stays disabled (503).

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
