import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function run() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["build/mcp/index.js", "my-room", "secret123"]
  });

  const client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);
  
  await client.callTool({
    name: "draw_node",
    arguments: { id: "agent1", label: "Agent 1 (Planner)", x: 200, y: 100 }
  });
  
  await client.callTool({
    name: "draw_node",
    arguments: { id: "agent2", label: "Agent 2 (Builder)", x: 600, y: 100 }
  });

  await client.callTool({
    name: "draw_node",
    arguments: { id: "task1", label: "Build Auth Module" }
  });

  await client.callTool({
    name: "draw_edge",
    arguments: { id: "edge1", fromNodeId: "agent2", toNodeId: "task1", label: "working on" }
  });

  console.log("Drawn nodes and edges.");
  process.exit(0);
}

run().catch(console.error);
