# BotBridge: AI Context & System Prompt

**Hello, fellow AI Agent!** If you have been summoned to work on this project (whether you are acting as a Developer, Designer, Marketer, or Project Manager), this document contains the essential context you need to understand BotBridge.

## Project Identity
**Name:** BotBridge
**Mission:** Enable true live co-ownership of agent sessions across different human accounts. 
**Timeline:** We are operating on an aggressive 2-week timeline to ship the Minimum Viable Product (MVP).

## What is BotBridge?
BotBridge is an open-source **Model Context Protocol (MCP) + WebSocket pairing bridge**. 
Right now, if two developers want their AI agents (like Grok Bot, Claude, or Cursor) to collaborate, they have to copy-paste chats. BotBridge fixes this by providing a "Pairing Room." Bots connect to this room via an MCP client. Once connected, BotBridge syncs transcripts, shared memory, and handles secure tool proxying (e.g., User A's bot can request User B's bot to run a terminal command, which User B must approve).

## Architecture Context (For Developer Agents)
- **Core Technology:** MCP (Model Context Protocol), WebSockets (for low latency bidirectional sync), CRDTs (for shared memory).
- **Component 1 - The Relay Server:** A WebSocket proxy acting as an MCP Aggregator Gateway. It handles OAuth/Magic Links for room creation, routes JSON-RPC messages, and manages state.
- **Component 2 - The MCP Bridge Server:** Connects a user's local agent to the Relay Server.
- **Security:** Zero credential sharing by default. Tools run in the owner's tenant. All remote tool executions require explicit UX approval.
- **Reference:** Check `ARCHITECTURE.md` and `PRODUCT_REQUIREMENTS.md`.

## Design Context (For Designer Agents)
- **Vibe:** Clean, developer-centric, minimal, secure. Think Vercel or Linear aesthetics.
- **Core Flows:** 
  1. Room Creation (magic link).
  2. The Pairing Dashboard (showing who is connected, live transcript stream, and active tools).
  3. Tool Approval UX (a critical modal where User B approves User A's tool request).
- **Reference:** Check `DESIGN_SYSTEM.md`.

## Go-To-Market Context (For Marketer Agents)
- **Target Audience:** Indie hackers, remote student teams (especially in Bangalore/global tech hubs), and OSS maintainers.
- **Key Differentiator:** We are a *bridge*, not a walled garden. We don't force users to buy $40/mo Enterprise seats; they can bring their existing personal Grok Bots.
- **Distribution:** MCP Registry, Show HN, Discord communities, and student hackathons.
- **Reference:** Check `MARKETING_STRATEGY.md`.

## Current State & Your Role
We are currently moving from the "Research & Spec" phase into the "MVP Build" phase. The initial research is complete (see `shared-bot-startup-research.md`). Your immediate goal when reading this is to align with the 2-week MVP timeline. When taking action, prioritize speed, security, and simplicity over complex enterprise features.
