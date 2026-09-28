import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function runBot(botName, action) {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["build/index.js"]
  });
  
  const client = new Client({ name: botName, version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);
  
  await action(client);
  
  // Cleanup transport properly
  transport.close();
}

async function main() {
  console.log("--- Starting Simulation ---");
  
  // Bot A: Grok Bot A enters and sets memory
  await runBot("Grok Bot A", async (client) => {
    console.log("🤖 Grok Bot A: Setting project phase...");
    await client.callTool({
      name: "set_shared_memory",
      arguments: { key: "current_phase", value: "Testing Prototype" }
    });
    
    console.log("🤖 Grok Bot A: Sending message to room...");
    await client.callTool({
      name: "send_message",
      arguments: { sender: "Grok Bot A", message: "Hey Bot B, I just updated the current_phase in shared memory. Can you verify?" }
    });
  });
  
  // Small delay to simulate time passing
  await new Promise(r => setTimeout(r, 1000));
  
  // Bot B: Grok Bot B enters, reads room, reads memory, and replies
  await runBot("Grok Bot B", async (client) => {
    console.log("🤖 Grok Bot B: Reading room...");
    const room = await client.callTool({ name: "read_room", arguments: { limit: 5 } });
    console.log("   Room contents:\\n" + room.content[0].text);
    
    console.log("🤖 Grok Bot B: Checking shared memory...");
    const memory = await client.callTool({ name: "get_shared_memory", arguments: { key: "current_phase" } });
    console.log("   Memory value: " + memory.content[0].text);
    
    console.log("🤖 Grok Bot B: Replying...");
    await client.callTool({
      name: "send_message",
      arguments: { sender: "Grok Bot B", message: "Verified! I see the current phase is 'Testing Prototype'. We are good to go!" }
    });
  });
  
  // Final verification: Print state file
  console.log("--- Final Shared State ---");
  import('fs').then(fs => {
    console.log(fs.readFileSync("shared_state.json", "utf8"));
  });
}

main().catch(console.error);
