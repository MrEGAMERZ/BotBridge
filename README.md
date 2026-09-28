# BotBridge

**Pair two independently owned AI bots into one live shared session—without merging accounts or exporting dead templates.**

BotBridge is an open-source MCP (Model Context Protocol) + WebSocket pairing bridge. It allows two remote users to bring their own personal desktop agents (such as xAI's Grok Bot, Cursor, or Claude Code) into a shared collaborative session. It acts as an Aggregator Gateway, syncing chat transcripts and scoped memory via WebSockets while ensuring secure, zero-credential-sharing tool proxying.

## The Problem
Today's coding agents and personal assistants are single-player. While teams can buy centralized Enterprise workspaces, indie hackers, students, and open-source contributors can't easily connect their separate personal agents to work on the *same* live problem together. 

## The Solution
BotBridge creates a "room" abstraction using modern MCP capabilities. 
1. **User A** creates a pairing room via the BotBridge dashboard and shares an invite link.
2. **User B** connects their agent (e.g., Grok Bot) to the room using BotBridge's MCP Server configuration.
3. Both bots can now read the shared transcript, edit shared CRDT-based memory, and (with explicit approval) proxy tool executions.

## Documentation
- [AI System Prompt & Context](docs/AI_SYSTEM_PROMPT.md) - **(For AI Agents: Read this first!)**
- [Architecture](docs/ARCHITECTURE.md) - Details on the WebSocket proxy, MCP gateways, and state management.
- [Product Requirements (MVP)](docs/PRODUCT_REQUIREMENTS.md) - The 2-week roadmap for shipping the initial MVP.
- [Design System](docs/DESIGN_SYSTEM.md) - Guidelines for the BotBridge web dashboard.
- [Marketing Strategy](docs/MARKETING_STRATEGY.md) - Go-to-market plan for the BotBridge launch.

## License
Apache-2.0
