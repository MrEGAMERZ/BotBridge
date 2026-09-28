#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs";
import path from "node:path";

// Path to our shared memory and message store
const STATE_FILE = path.join(process.cwd(), "shared_state.json");

// Initialize state file if it doesn't exist
function initDB() {
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(
      STATE_FILE,
      JSON.stringify({ messages: [], memory: {} }, null, 2)
    );
  }
}

// Read the database safely
function readDB() {
  try {
    const data = fs.readFileSync(STATE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { messages: [], memory: {} };
  }
}

// Write to the database safely
function writeDB(data: any) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
}

const server = new Server(
  {
    name: "BotBridge-Pairing-Server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "send_message",
        description: "Send a message to the shared room for other agents to read. Use this to ask questions or give updates.",
        inputSchema: {
          type: "object",
          properties: {
            sender: { type: "string", description: "Your agent name (e.g., 'Agent A' or 'Grok Bot User 1')" },
            message: { type: "string", description: "The message to send" },
          },
          required: ["sender", "message"],
        },
      },
      {
        name: "read_room",
        description: "Read recent messages in the shared room to see what other agents have said. Poll this to check for updates.",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Number of messages to retrieve (default 10)" },
          },
        },
      },
      {
        name: "set_shared_memory",
        description: "Save information to the shared mutual memory (Key-Value store). Use this to store project context.",
        inputSchema: {
          type: "object",
          properties: {
            key: { type: "string", description: "Memory key (e.g., 'project_goal', 'current_phase')" },
            value: { type: "string", description: "Memory value" },
          },
          required: ["key", "value"],
        },
      },
      {
        name: "get_shared_memory",
        description: "Retrieve information from the shared mutual memory.",
        inputSchema: {
          type: "object",
          properties: {
            key: { type: "string", description: "Memory key" },
          },
          required: ["key"],
        },
      },
    ],
  };
});

// Handle Tool Executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const db = readDB();

  try {
    if (name === "send_message") {
      const { sender, message } = args as { sender: string; message: string };
      db.messages.push({
        sender,
        message,
        timestamp: new Date().toISOString(),
      });
      writeDB(db);
      return {
        content: [{ type: "text", text: `Message sent to room.` }],
      };
    }

    if (name === "read_room") {
      const limit = (args as any)?.limit || 10;
      const recent = db.messages.slice(-limit);
      
      let responseText = "--- Room Messages ---\n";
      if (recent.length === 0) responseText += "Room is currently empty.\n";
      
      recent.forEach((msg: any) => {
        responseText += `[${msg.timestamp}] ${msg.sender}: ${msg.message}\n`;
      });
      
      return {
        content: [{ type: "text", text: responseText }],
      };
    }

    if (name === "set_shared_memory") {
      const { key, value } = args as { key: string; value: string };
      db.memory[key] = value;
      writeDB(db);
      return {
        content: [{ type: "text", text: `Successfully saved '${key}' to shared memory.` }],
      };
    }

    if (name === "get_shared_memory") {
      const { key } = args as { key: string };
      const val = db.memory[key];
      if (val === undefined) {
        return {
          content: [{ type: "text", text: `Key '${key}' not found in shared memory.` }],
        };
      }
      return {
        content: [{ type: "text", text: val }],
      };
    }

    throw new Error(`Tool not found: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error executing tool: ${error.message}` }],
      isError: true,
    };
  }
});

// Start Server
async function main() {
  initDB();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("BotBridge Pairing Server is running on stdio!");
}

main().catch(console.error);
