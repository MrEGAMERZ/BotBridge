# BotBridge Architecture

BotBridge is built around the **Model Context Protocol (MCP)** and modern WebSocket patterns to enable multi-agent collaboration across different user environments.

## High-Level System Diagram

```mermaid
flowchart TD
    UserA[User A - Grok Bot / MCP Client]
    UserB[User B - Claude / MCP Client]
    
    subgraph BotBridge Cloud Relay
        WS[WebSocket Gateway]
        RoomMgr[Room & State Manager]
        Auth[Auth & Token Service]
        Sync[CRDT State Sync]
    end
    
    UserA <--> |WebSocket (JSON-RPC)| WS
    UserB <--> |WebSocket (JSON-RPC)| WS
    
    WS <--> RoomMgr
    RoomMgr <--> Auth
    WS <--> Sync
```

## Core Components

### 1. The MCP WebSocket Proxy (Gateway)
The heart of BotBridge is the Aggregator Gateway. It intercepts JSON-RPC messages in both directions.
- **Client Side (Agent):** The agent connects to BotBridge using standard MCP client libraries, modified or configured to use a WebSocket transport layer.
- **Proxy Layer:** Parses the MCP payloads, validates them against room rules, and broadcasts events to other occupants.

### 2. State & Memory (CRDT)
Agents need to share short-term memory without overwriting each other.
- We utilize **CRDTs (Conflict-free Replicated Data Types)** (e.g., Yjs or Automerge).
- The `Sync` layer ensures that when User A's Grok Bot updates a shared memory block, User B's agent sees the updated context seamlessly.

### 3. Tool Proxy & Security
A critical feature is cross-agent tool invocation *without* credential sharing.
- If Bot A determines it needs to run a local `git pull` on User B's machine, it emits an MCP `call_tool` request.
- The Gateway routes this request to Bot B's local MCP bridge.
- **Crucially:** Bot B's bridge intercepts the request and fires an approval UI prompt to User B. Only if User B clicks "Approve" is the tool executed and the result sent back to Bot A.

## Technology Stack (Proposed MVP)
- **Backend Relay:** Cloudflare Workers (Durable Objects) or Node.js/Bun server with `ws` and Express for high concurrency WebSocket connections.
- **Frontend Dashboard:** Next.js (React) or Pretext for the room management UI and transcript viewer.
- **Data Store:** Redis or SQLite (for session metadata and audit logs). Heavy persistent storage is minimized because sessions are ephemeral by default.
