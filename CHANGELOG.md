# Changelog

All notable changes to BotBridge will be documented in this file.

## [1.0.1] - 2026-10-04
### Added
- **PartyKit Server**: Real-time WebSocket server utilizing Yjs for conflict-free replicated data (CRDT) memory syncing.
- **Local MCP Wrapper**: Exposes `draw_node`, `draw_edge`, `acquire_lock`, and `read_canvas` tools to local agents over standard `stdio`.
- **React Visual Canvas**: A Vite-powered React frontend using `tldraw` and `dagre` to auto-layout and visualize the agents' shared memory in real-time.
- **Distributed Locking**: Agents can securely acquire 30-second TTL locks on resources to prevent race conditions during execution.
