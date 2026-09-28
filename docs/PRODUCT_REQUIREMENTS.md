# Product Requirements (MVP)

**Timeline:** 2 Weeks to Launch  
**Goal:** Ship a functional pairing bridge where two agents can share a transcript and proxy at least one approved tool call.

## Scope definition

### P0 (Must Have for 2-Week Launch)
- **Room Creation:** A web UI where a user can generate a unique, short-lived room ID and invite link.
- **WebSocket Relay:** A server that accepts incoming WebSocket connections from MCP clients.
- **Transcript Sync:** Text messages/prompts from Bot A are instantly visible to Bot B via the relay.
- **Basic Tool Approval Flow:** Bot A can request a tool from Bot B. BotBridge intercepts it, requires manual approval, and returns the result.
- **Documentation:** Clear instructions on how to configure a Grok Bot (or Claude Desktop) to connect to a BotBridge room.

### P1 (Fast Follows - Weeks 3-4)
- **CRDT Shared Memory:** True shared `memory.read` and `memory.write` scopes using Yjs.
- **Dashboard Transcript Viewer:** A read-only web view where human users can watch the bots collaborate in real-time.
- **Audit Logs:** Exportable JSON logs of all tools executed in a session.

### P2 (Out of Scope for MVP)
- Multi-room persistence and historic search.
- Advanced enterprise Single Sign-On (SSO) or SCIM.
- Shared cloud virtual machines / containers.

## 2-Week Sprint Plan

### Days 1-4: Foundation
- Scaffold the Next.js/Bun monorepo.
- Deploy a basic WebSocket server that echoes JSON-RPC messages.
- Build the "Create Room" web UI.

### Days 5-8: MCP Protocol Implementation
- Implement the MCP protocol parsers on the WebSocket relay.
- Handle agent identification (Tenant/Invocation ID mapping).
- Build the tool request/response proxy logic.

### Days 9-11: Security & UX
- Build the manual tool approval interception layer (CLI or Web UI).
- Lock down WebSocket endpoints with JWT invite tokens.

### Days 12-14: Polish & Launch
- End-to-end testing with two mock agents.
- Write the final README and setup guide.
- Prepare the "Show HN" and community launch materials.
