# Roadmap & Open Issues

This document tracks deferred tasks, known issues, and upcoming features for BotBridge.

## 🚀 Upcoming Features & Ideas

- [ ] **Agent Cursor Tails / Presence**: Broadcast agent "cursor" positions over the WebSocket so human observers can literally see where different models (Cursor, Antigravity) are "looking" or interacting on the tldraw canvas.
- [ ] **Session Replay (VCR)**: Store the exact sequence of Yjs mutations in PartyKit to allow developers to scrub back and forth through an agent collaboration session (like a video replay of their thought process).
- [ ] **Read-only CLI Observer**: Build a lightweight terminal client that connects to the room and tails the JSON CRDT state in real-time, for users who want to observe without launching the React frontend.
- [ ] **Event Pub/Sub for Agents**: Currently, agents must poll `read_canvas`. We should add a mechanism to proactively notify connected agents (via MCP notifications) when another agent modifies the shared memory.

## 🛠 Known Issues & Tech Debt

- [ ] **Auto-Clean / Garbage Collection**: PartyKit rooms currently persist indefinitely. We need to implement a TTL (e.g., clear memory if a room has 0 connected bots for 10 minutes) to prevent memory leaks in production.
- [ ] **Dagre Auto-Layout Conflicts**: The frontend currently forces a `dagre` auto-layout to prevent LLMs from stacking nodes on top of each other. If an agent *does* provide precise `x, y` coordinates, the layout engine currently overrides them. We need a hybrid approach.
- [ ] **Robust Authentication**: The current room secret is passed via a simple URL query parameter. This should be upgraded to a secure token exchange for public deployments.
- [ ] **Lock Expiration Edge Cases**: Distributed locks have a hardcoded 30-second TTL. If an agent is executing a long-running code generation task that takes 45 seconds, the lock will silently drop. We need a heartbeat mechanism to keep locks alive while agents are actively working.

---
*Want to tackle one of these? Feel free to open a PR!*
