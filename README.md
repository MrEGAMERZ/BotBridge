# 🌉 BotBridge

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-success.svg)](https://github.com/modelcontextprotocol)
[![Powered by PartyKit](https://img.shields.io/badge/Powered_by-PartyKit-FF479B.svg)](https://partykit.io)

**BotBridge** is an open-source Model Context Protocol (MCP) bridge that allows multiple independently owned AI agents (Cursor, Claude Code, Antigravity, Grok) to collaborate in a shared memory space without chaotic code overwriting.

## 🎭 The Vision: An AI Orchestra
When you run multiple local AI agents, they typically work in isolated silos. If two agents try to write to the same file, they overwrite each other. 

BotBridge turns you into the conductor of an AI orchestra. By giving agents a **shared spatial CRDT memory** (via Yjs) and **distributed locking**, bots can coordinate their plans visually *before* they act. Cursor can plan the architecture, Claude can write the backend, and Antigravity can build the UI—all seamlessly coordinating through a single WebSockets bridge.

## 🏗 Architecture

```text
  [Local Agent (Cursor)]           [Local Agent (Claude Code)]
             |                                |
         (stdio / JSON-RPC)              (stdio / JSON-RPC)
             |                                |
  [MCP Translation Wrapper]        [MCP Translation Wrapper]
             |                                |
             +--------------+-----------------+
                            |
                 [PartyKit Server (Yjs)]
                 (Shared Memory & Locks)
                            |
                [React + tldraw Frontend]
               (Visual Spatial Observer Canvas)
```

1. **PartyKit Server:** A hosted WebSocket server holding the shared Yjs CRDT memory and authoritative locks.
2. **Local MCP Wrapper:** Bridges your agents to the PartyKit room. Translates standard MCP tools (`draw_node`, `acquire_lock`) into real-time Yjs CRDT updates.
3. **Spatial Canvas:** A React frontend using `tldraw` and `dagre` (auto-layout) so humans can visually watch the bots construct their plans in real time.

## 🚀 Getting Started

### 1. Install & Start the PartyKit Server
Clone the repository and start the centralized state server:
```bash
git clone https://github.com/MrEGAMERZ/BotBridge.git
cd BotBridge
npm install
npm run dev
```
*The server will run on `localhost:1999`.*

### 2. Connect Your Agents
Configure your local AI tools (Cursor, Claude, etc.) to use the local MCP wrapper. Point them to the same room (`my-room`) and secret.

**Example Cursor Configuration (`mcpServers`):**
```json
{
  "botbridge": {
    "command": "node",
    "args": ["/absolute/path/to/BotBridge/build/mcp/index.js", "my-room", "secret123"]
  }
}
```

### 3. Launch the Spatial Canvas
To watch the agents collaborate in real-time, start the React visualizer:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. When agents use the `draw_node` or `draw_edge` tools, you'll see the shapes appear instantly on the canvas.

## 🛠 Available MCP Tools
When connected, agents gain access to the following tools:
- `draw_node(id, label, [x, y], [details])`: Drop a thought, task, or schema onto the shared canvas.
- `draw_edge(id, fromNodeId, toNodeId, label)`: Connect two nodes together.
- `read_canvas()`: Read the instantaneous merged state of the entire shared CRDT memory.
- `acquire_lock(resource)`: Secure a 30-second distributed lock on a resource (e.g., a file or a task) to prevent other agents from touching it.

## 🤝 Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for details on our development workflow.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
