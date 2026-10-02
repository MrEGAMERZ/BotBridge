import { onConnect } from "y-partykit";
import type * as Party from "partykit/server";

export default class BotBridgeServer implements Party.Server {
  private locks = new Map<string, { agentId: string; expiresAt: number }>();

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    const url = new URL(ctx.request.url);
    const secret = url.searchParams.get("secret");
    
    // Auth gate (MVP: secret must exist)
    if (!secret) {
      conn.send(JSON.stringify({ type: "error", message: "Missing room secret" }));
      conn.close(4001, "Missing room secret");
      return;
    }

    // Forward to y-partykit to handle CRDT sync
    onConnect(conn, this.room, {
      persist: false // In-memory for MVP
    });
  }

  onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    // Handle JSON messages (for locks)
    if (typeof message === "string") {
      try {
        const data = JSON.parse(message);
        const now = Date.now();
        
        if (data.type === "acquire_lock") {
          const { resource, agentId } = data;
          const currentLock = this.locks.get(resource);
          
          if (currentLock && currentLock.expiresAt > now && currentLock.agentId !== agentId) {
            sender.send(JSON.stringify({ type: "lock_result", resource, success: false }));
          } else {
            // Grant lock for 30s
            this.locks.set(resource, { agentId, expiresAt: now + 30000 });
            sender.send(JSON.stringify({ type: "lock_result", resource, success: true }));
          }
        }
      } catch (e) {
        // Ignore parse errors, let y-partykit handle binary yjs messages
      }
    }
  }
}
