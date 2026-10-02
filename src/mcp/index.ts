import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as Y from "yjs";
import YProviderPkg from "y-partykit/provider";
const YProvider = (YProviderPkg as any).default || YProviderPkg;
import PartySocket from "partysocket";

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: node build/mcp/index.js <room> <secret> [host] [agentId]");
  process.exit(1);
}

const room = args[0];
const secret = args[1];
const host = args[2] || "localhost:1999";
const agentId = args[3] || "agent-" + Math.random().toString(36).substring(7);

// Initialize Yjs Document and Provider
const doc = new Y.Doc();
const provider = new YProvider(host, room, doc, {
  connect: false,
  params: { secret }
});
provider.connect();

const nodesMap = doc.getMap("nodes");
const edgesMap = doc.getMap("edges");

// PartySocket for custom non-CRDT messages (e.g. locks)
const socket = new PartySocket({
  host,
  room,
  query: { secret }
});

const server = new Server({
  name: "botbridge-mcp",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "draw_node",
        description: "Draw a new node on the spatial canvas (shared memory).",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            label: { type: "string" },
            x: { type: "number", description: "Optional x coordinate" },
            y: { type: "number", description: "Optional y coordinate" },
            details: { type: "string", description: "Extended information or schema" }
          },
          required: ["id", "label"]
        }
      },
      {
        name: "draw_edge",
        description: "Draw a connection between two nodes.",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string" },
            fromNodeId: { type: "string" },
            toNodeId: { type: "string" },
            label: { type: "string" }
          },
          required: ["id", "fromNodeId", "toNodeId"]
        }
      },
      {
        name: "acquire_lock",
        description: "Acquire a distributed lock for a specific resource.",
        inputSchema: {
          type: "object",
          properties: {
            resource: { type: "string" }
          },
          required: ["resource"]
        }
      },
      {
        name: "read_canvas",
        description: "Read the current state of all nodes and edges on the canvas.",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "draw_node") {
    const { id, label, x, y, details } = request.params.arguments as any;
    nodesMap.set(id, { label, x, y, details, agentId });
    return { content: [{ type: "text", text: `Node ${id} drawn successfully.` }] };
  }
  
  if (request.params.name === "draw_edge") {
    const { id, fromNodeId, toNodeId, label } = request.params.arguments as any;
    edgesMap.set(id, { fromNodeId, toNodeId, label, agentId });
    return { content: [{ type: "text", text: `Edge ${id} drawn successfully.` }] };
  }

  if (request.params.name === "read_canvas") {
    const nodes: Record<string, any> = {};
    const edges: Record<string, any> = {};
    for (const [k, v] of nodesMap.entries()) nodes[k] = v;
    for (const [k, v] of edgesMap.entries()) edges[k] = v;
    
    return { content: [{ type: "text", text: JSON.stringify({ nodes, edges }, null, 2) }] };
  }

  if (request.params.name === "acquire_lock") {
    const { resource } = request.params.arguments as any;
    return new Promise((resolve) => {
      const handler = (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === "lock_result" && data.resource === resource) {
            socket.removeEventListener("message", handler);
            resolve({
              content: [{ 
                type: "text", 
                text: data.success ? `Lock acquired for ${resource}` : `Failed to acquire lock for ${resource}`
              }],
              isError: !data.success
            });
          }
        } catch (err) {}
      };
      socket.addEventListener("message", handler);
      socket.send(JSON.stringify({ type: "acquire_lock", resource, agentId }));
      
      // Timeout
      setTimeout(() => {
        socket.removeEventListener("message", handler);
        resolve({
          content: [{ type: "text", text: `Timeout waiting for lock on ${resource}` }],
          isError: true
        });
      }, 5000);
    });
  }

  throw new Error(`Tool not found: ${request.params.name}`);
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("BotBridge MCP Server running on stdio");
}

run().catch(console.error);
