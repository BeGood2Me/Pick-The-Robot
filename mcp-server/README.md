# PickTheRobot MCP server

Stdio MCP server that exposes the same **rules-based matcher**, vendor catalog, price bands, and comparison guides as [picktherobot.com](https://picktherobot.com) — for use in Cursor, Claude Desktop, and other MCP clients.

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

From the repo root:

```bash
npm run mcp
```

Uses the in-repo matching engine (no paid API key required).

### Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://picktherobot.com` | Base URL for share links and vendor URLs |
| `PICKTHEROBOT_MCP_TIER` | `pro` | Match payload detail: `pro` or `starter` |

## Cursor configuration

Add to your MCP settings (user or project), with `cwd` set to this repository:

```json
{
  "mcpServers": {
    "picktherobot": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "C:/Users/seand/Desktop/Projects/Pick The Robot"
    }
  }
}
```

On Windows, use forward slashes or escaped backslashes in `cwd`.

## Notes

- Match output is **informational** — not a quote or deployment guarantee.
- Sponsored vendors receive a small boost only when already relevant (see methodology resource).
- This server does not call the hosted `/api/v1/match` HTTP API; it imports `src/lib/matching` directly so results stay in sync with the website wizard.
