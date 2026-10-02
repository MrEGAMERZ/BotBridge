# BotBridge

A local MCP wrapper and real-time PartyKit server that allows multiple independently owned AI agents (Cursor, Claude Code, Antigravity) to collaborate in a shared memory space without chaotic code overwriting.

## The Architecture
1. **PartyKit Server:** Hosts the shared Yjs CRDT memory and authoritative locks over WebSockets.
2. **Local MCP Wrapper:** Bridges agents to the PartyKit server. Agents call standard MCP tools (`draw_node`, `acquire_lock`), which the wrapper translates into real-time CRDT updates.

## Getting Started

### 1. Start the PartyKit Server
```bash
npm run dev
```

### 2. Connect your Agent to the MCP Wrapper
Configure your local agent (e.g. Cursor or Claude) to connect to the MCP server:
```json
{
  "mcpServers": {
    "botbridge": {
      "command": "node",
      "args": ["build/mcp/index.js", "my-room", "secret123"]
    }
  }
}
```
