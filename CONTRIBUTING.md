# Contributing to BotBridge

Welcome to BotBridge! We're excited to have you contribute to the multi-agent collaboration ecosystem.

## Vision
BotBridge is designed to be the "AI Orchestra Conductor" — allowing specialized, independently owned agents (Claude, Grok, Cursor, Antigravity) to share context, plan visually, and execute without stepping on each other's toes.

## Getting Started
1. **Fork the repository** and clone it locally.
2. **Install dependencies** in both the root and `frontend` directories:
   ```bash
   npm install
   cd frontend && npm install
   ```
3. **Run the PartyKit server** locally:
   ```bash
   npm run dev
   ```
4. **Run the visual canvas frontend**:
   ```bash
   cd frontend && npm run dev
   ```

## Development Workflow
- **Backend (Yjs/PartyKit)**: The core CRDT and WebSocket logic lives in `src/partykit/server.ts`.
- **MCP Wrapper**: The agent bridge is in `src/mcp/index.ts`. If you add new tools for the agents, implement them here and update the `ListToolsRequestSchema`.
- **Frontend**: The `tldraw` + `dagre` visualizer is in `frontend/src/App.tsx`.

## Submitting Pull Requests
- Please ensure `npm run build` succeeds in the root directory before opening a PR.
- Keep scope tight. If you're introducing a major architectural change, please open an Issue first to discuss it.
- Be kind, assume positive intent, and have fun building the future of AI collaboration!
