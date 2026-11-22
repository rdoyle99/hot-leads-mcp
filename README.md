# Hot Leads MCP

Daily B2B companies with a verifiable public reason to buy this week — connected directly to Claude, ChatGPT, Claude Code, Cursor, Windsurf, or any Model Context Protocol (MCP) client via **hosted Streamable HTTP** or **local `stdio` (`npx` / Docker)**.

- **Website & Live Dashboard**: [https://hotleadsmcp.com](https://hotleadsmcp.com)
- **Free Live Previews (No Login)**: [Funding Feed](https://hotleadsmcp.com/free/funding) · [Upcoming Trade Show Exhibitors](https://hotleadsmcp.com/free/exhibiting) · [New Execs](https://hotleadsmcp.com/free/new-exec) · [Launches](https://hotleadsmcp.com/free/launch)
- **Remote Streamable HTTP Endpoint**: `https://hotleadsmcp.com/mcp`

---

## Signals Included (Updated Daily at 6:00 AM ET)

1. **`funding` (SEC EDGAR Form D & Press Raises)**: Operating companies filing fresh SEC Form D equity raises (pooled investment funds, SPVs, and real estate trusts filtered out) plus press-announced startup rounds.
2. **`exhibiting` (Upcoming US Trade Show Exhibitors)**: Companies exhibiting at 120+ upcoming US conferences and trade shows in the next 7 to 45 days, with booth numbers and event start dates.
3. **`new_exec` (Executive Appointments)**: Newly hired C-suite and VP decision-makers from PR Newswire, GlobeNewswire, and Business Wire.
4. **`launch` (Product Launches)**: Fresh B2B software and product launches with named founders and makers.

Every row includes the company name, domain, industry, location, named decision-maker, title, MillionVerifier-checked email (`valid` vs `catch_all`), trigger summary, suggested first line, and direct public `source_url`.

---

## Tools

| Tool | Read-Only | Description |
| --- | --- | --- |
| `search_leads` | Yes | Filter leads by `signal` (`all`, `funding`, `new_exec`, `launch`, `exhibiting`), `query` keywords, `location` (city or state), `since` (`YYYY-MM-DD`), and `limit` (max 500). |
| `feed_info` | Yes | Return when the Hot Leads feed was last updated and live row counts by signal. |

---

## Quick Setup

### Option A: Hosted Streamable HTTP (Zero Install)

**Claude Code CLI**:
```bash
claude mcp add --transport http hotleads "https://hotleadsmcp.com/mcp?key=YOUR_KEY"
```

**Cursor / Windsurf / Claude Desktop (`mcp.json`)**:
```json
{
  "mcpServers": {
    "hotleads": {
      "url": "https://hotleadsmcp.com/mcp?key=YOUR_KEY"
    }
  }
}
```

### Option B: Local `stdio` Bridge (`npx` or Docker)

Zero npm dependencies (uses Node 18+ built-in `fetch` and `readline`):

```json
{
  "mcpServers": {
    "hotleads": {
      "command": "npx",
      "args": ["-y", "github:rdoyle99/hot-leads-mcp"],
      "env": {
        "HOTLEADS_API_KEY": "YOUR_KEY"
      }
    }
  }
}
```

**Docker**:
```bash
docker build -t hot-leads-mcp .
docker run -i --rm -e HOTLEADS_API_KEY=YOUR_KEY hot-leads-mcp
```

---

## License

MIT — see [LICENSE](./LICENSE).
