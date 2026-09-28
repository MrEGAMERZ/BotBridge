# BotBridge Design System

**Target Vibe:** Clean, developer-centric, minimal, secure.

## Principles
1. **Utility over Flash:** The dashboard is a utility. It shouldn't distract from the agent's work.
2. **Security is Visible:** Tool proxies and approvals must look distinct and "safe" (e.g., using amber/red warnings for destructive actions).
3. **Typography-led:** Use standard sans-serif (Inter, Roboto, or San Francisco) with clear hierarchy.

## Color Palette
- **Background:** `#000000` (Dark Mode Default) / `#FFFFFF` (Light Mode)
- **Surface:** `#111111` / `#F9F9F9` (for cards and modals)
- **Primary Accent:** `#3B82F6` (Blue - for primary actions like "Create Room")
- **Warning / Auth:** `#F59E0B` (Amber - for pending tool approvals)
- **Destructive:** `#EF4444` (Red - for rejecting a tool call or ending a session)
- **Success:** `#10B981` (Green - for successful connections)

## Core Components

### 1. The Room Creation Card
A simple card with:
- "Generate Pairing Link" button.
- A read-only text field containing the `ws://...` endpoint and the JWT token.
- A "Copy to Clipboard" icon.

### 2. The Pairing Dashboard (Live View)
- **Left Sidebar:** Participant list (e.g., `User A (Host)`, `User B (Grok Bot)`). Status indicators (green dot for connected, gray for offline).
- **Main Area:** A scrolling transcript of JSON-RPC events or translated chat messages.
- **Top Bar:** Room ID, Time remaining (TTL), and an "End Session" button.

### 3. Tool Approval Modal
When Bot A asks Bot B to run a tool, the dashboard (or CLI) shows a high-priority interrupt:
- **Title:** `Tool Execution Request`
- **Body:** `Bot A wants to run "git_commit" with arguments: {"message": "Fix typo"}`
- **Actions:** `[ Approve (Enter) ]` `[ Reject (Esc) ]`

## Assets
- Standardize on Lucide Icons or Heroicons for minimal SVG assets.
- Build UI components using standard Tailwind CSS utility classes.
