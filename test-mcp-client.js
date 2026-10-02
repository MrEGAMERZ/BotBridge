import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function run() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["build/mcp/index.js", "room1", "secret123"]
  });

  const client = new Client({
    name: "test-client",
    version: "1.0.0"
  }, {
    capabilities: {}
  });

  await client.connect(transport);
  
  // Call tool to draw a node
  const res1 = await client.callTool({
    name: "draw_node",
    arguments: {
      id: "node_1",
      label: "My First Node",
      x: 100,
      y: 200,
      details: "Test node"
    }
  });
  console.log("Draw Node 1:", res1.content);

  // Read canvas
  const res2 = await client.callTool({
    name: "read_canvas",
    arguments: {}
  });
  console.log("Canvas:", res2.content);

  // Acquire lock
  console.log("Acquiring lock...");
  const res3 = await client.callTool({
    name: "acquire_lock",
    arguments: { resource: "node_1" }
  });
  console.log("Lock:", res3.content);

  process.exit(0);
}

run().catch(console.error);
