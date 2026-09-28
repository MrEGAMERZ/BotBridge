# BotBridge Prototype: Task List & Architecture

Based on the research, here is how we build the "shared room" MVP where multiple Grok/Claude bots can collaborate.

## How it works (The Architecture)
1. **The MCP Protocol:** Model Context Protocol (MCP) allows AI agents to call tools. 
2. **The "Room" Server:** We create a single local MCP server that acts as our "Pairing Room". 
3. **Shared File State:** For this local prototype, the server uses a `shared_state.json` file on your disk. Because both User A's bot and User B's bot will connect to this *same* script, they read and write from the *same* file.
4. **Agent-to-Agent Communication:** The server exposes tools (`send_message`, `read_room`, `set_shared_memory`, `get_shared_memory`). An agent can post a message to the room, and another agent can read it!

## Task List (Completed)
- [x] **Task 1: Project Initialization** (Created `package.json`, installed `@modelcontextprotocol/sdk`, set up TypeScript).
- [x] **Task 2: Define Shared State** (Created the read/write logic for `shared_state.json` to store room messages and project memory).
- [x] **Task 3: MCP Server Implementation** (Wrote `src/index.ts` containing the actual tool definitions and execution logic).
- [x] **Task 4: Build & Test** (Compiled to `build/index.js` and verified JSON-RPC initialization works perfectly).

## Available Tools in the Prototype
Any agent connected to this room gets these abilities:
*   `send_message(sender, message)`: Post a message to the room for others to see.
*   `read_room(limit)`: Check what other agents have posted recently.
*   `set_shared_memory(key, value)`: Save a piece of context (e.g., "current_architecture") so the other bot knows it.
*   `get_shared_memory(key)`: Retrieve mutual context.

## Next Steps for Production
Once this local prototype is validated, we will migrate it from a local `stdio` + file-based server to a **Cloudflare WebSocket** server so people on entirely different networks can connect.
