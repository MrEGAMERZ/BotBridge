# Shared Bot / Multi-User Agent Session — Startup Research Brief

**For:** Mohammad Rehan (MR.E GAMERZ), CS student, Bangalore  
**Subject:** Product that connects bots from two different users so they collaboratively work on the *same* live bot / shared agent session  
**Date:** 27 Sep 2026 (Asia/Calcutta)  
**Status:** Research brief (not a business plan). Estimates labeled. Prefer 2024–2026 public sources.

---

## Executive snapshot

**The gap is real.** Today’s coding agents and personal desktop assistants (Cursor, Claude Code/Cowork, Grok Bot–style multi-agent desktops) are overwhelmingly **single-player**. Team products from OpenAI, Anthropic, Dust, and Cursor share *org context, agents-as-artifacts, or Slack channels*—not two separately logged-in personal bots co-owning one live session with shared tools/memory across account boundaries.

**Closest analogues (2026):** GitHub Next’s **Ace** (research prototype: multiplayer prompting + shared microVM), YC **Dock** (multiplayer agent workspace, humans+agents), **Claude Tag** (one Claude per Slack channel, multiplayer *within one Team org*), OpenAI **Workspace Agents** (shared agents inside Business/Enterprise workspace), **Dust Pods**, **Ceven**, Liveblocks (realtime collab infra including agents-in-rooms).

**Recommended path:** Open-source an **MCP + WebSocket pairing bridge** (protocol + client SDKs) under **Apache-2.0**, ship a thin **hosted relay** for pairing rooms, monetize **hosted pairing + team seats + enterprise SSO** later. Do **not** depend on unofficial Grok Bot/Cursor plugin APIs as the only product surface.

**Money:** Yes, *conditionally*—after distribution. Year-1 revenue for a solo student is likely **$0–$5k conservative / ~$20–80k base / $150k+ optimistic** (illustrative; not forecasts). Infra comps (Liveblocks, Dust seats) support freemium + usage; India build costs are low; price globally in USD.

---

## 1. Market & analogous products

### 1.1 What “collaborative AI” means today (taxonomy)

| Pattern | What is shared | Cross-account? | True live co-ownership of one agent session? | Examples |
|---|---|---|---|---|
| **Shared org workspace** | Billing, connectors, admin, sometimes shared agents | Same org only | Partial (shared agent *definition*; sessions often still personal) | ChatGPT Business/Enterprise Workspace Agents; Claude Team; Cursor Teams |
| **Channel multiplayer** | One agent identity in a Slack/channel; all members see thread | Same Slack/workspace | Yes *inside that channel*, not across personal desktop bots | Claude Tag (Jun 2026) |
| **Shared agent artifact** | Instructions, files, connectors; multiplayer *editing* of the agent | Same workspace | No (not one live session across two personal hosts) | OpenAI Workspace Agents multiplayer editing |
| **Multi-agent (same user)** | Multiple agents orchestrated for one operator | N/A | No | Magentic-One/AutoGen, CrewAI, LangGraph, Dock’s “team of agents” |
| **Template export/import** | Bot config copied | Cross-user | No (fork, not shared live state) | Grok Bot template export (user-stated closest feature) |
| **True shared live session** | Transcript + memory + (scoped) tools + optional shared computer | **Cross-user by design** | **Yes — this is the gap** | Ace (prototype), parts of Dock/Ceven; **no dominant cross-host personal-bot bridge** |

### 1.2 Major vendor team features (2025–2026)

**OpenAI — Workspace Agents (GA announcement 22 Apr 2026)**  
- Shared agents for Business / Enterprise / Edu; run in cloud; usable in ChatGPT and Slack.  
- Multiplayer *editing* of agent config (owner invites workspace members with chat vs edit).  
- Enterprise RBAC, Compliance API, tool/action controls.  
- Free until 6 May 2026, then credit-based pricing.  
- **Not:** two personal ChatGPT accounts outside one workspace co-owning a live personal-desktop bot session.  
- Source: https://openai.com/index/introducing-workspace-agents-in-chatgpt/ (22 Apr 2026); Help Center multiplayer editing article.

**Anthropic — Claude Team + Claude Tag (23 Jun 2026)**  
- Team plan: Standard **$25/mo** or **$20/mo annual**; Premium **$125/mo** or **$100/mo annual**; min 2 members (US list prices).  
- Claude Tag: `@Claude` in Slack; **one Claude per channel**, multiplayer, ambient/async; admin-scoped tools/memories per channel identity.  
- **Closest UX metaphor** to “shared bot in a room,” but locked to Claude Team/Enterprise + Slack, not bridging Cursor ↔ Grok Bot ↔ personal assistants.  
- Source: https://www.anthropic.com/news/introducing-claude-tag ; https://support.claude.com/en/articles/9266767-what-is-the-team-plan

**Cursor — Teams**  
- Standard **$40/user/mo**, Premium **$120/user/mo**; shared team marketplace (rules/skills), Bugbot, cloud agents with *shared team context*, SSO.  
- Community feature requests (2026) still ask for **shared live chat sessions** and **shared live agent memory**—current product shares transcripts (forkable) more than co-owned live sessions.  
- Sources: https://cursor.com/docs/account/teams/pricing.md ; forum threads e.g. https://forum.cursor.com/t/teams-share-same-chat-sessions-to-work-collaborate/161432

**Dust.tt**  
- Explicit “Multiplayer AI”; **Pods** = collaborative workspaces with shared context; MCP connectors; seats Free / Pro **24€/mo annual** / Max **120€/mo annual** (Business).  
- Same-product multiplayer, not cross-host bot bridging.  
- Source: https://dust.tt/home/pricing ; https://dust.tt/

**Ceven**  
- “Multiplayer AI” workspace: team + agents same conversation; admin-connected tools; company brain.  
- Source: https://ceven.io/

**Dock (YC S26 launch ~Sep 2026)**  
- Multiplayer agent workspace: humans + specialized agents share workspace; agents message each other; cloud or local runtime.  
- Closer to *platform* than *bridge between existing personal bots*.  
- Source: https://www.ycombinator.com/launches/Th4-dock-s26-a-multiplayer-agent-workspace-that-gives-you-a-team-of-proactive-agents-that-feel-like-colleagues-instead-of-chat-boxes

**GitHub Next — Ace (early 2026 research)**  
- Maggie Appleton: “at this point, in early 2026, all coding agents are designed as single player experiences.”  
- Ace: multiplayer chat sessions + shared cloud microVM + multiplayer prompting + collaborative plans.  
- Technical preview / research—not a shipping commodity product as of talk (~Apr 2026 tending).  
- Source: https://maggieappleton.com/zero-alignment

**Notion AI**  
- Strong doc multiplayer + AI; Custom/team agents for automation—not personal-bot co-ownership across accounts. (Treat as adjacent collab UX, not direct competitor.)

### 1.3 Realtime collab infrastructure (build-on layer)

| Product | Role | Pricing signal (public) | Fit for shared-bot |
|---|---|---|---|
| **Liveblocks** | Managed rooms, presence, CRDT/Yjs, comments; explicitly meters “people **or agents**” in rooms | Free; Pro **$30/mo**; Team from **$600/mo**; collab minutes **$0.002**/user-minute when 2+ present | Excellent for transcript/presence sync; not an agent host |
| **PartyKit** (Cloudflare) | Edge WebSocket + Durable Objects; bring-your-own CRDT | Cloudflare usage; ~**$1–20/mo** at small/mid scale in third-party 2026 comps | Good for custom pairing protocol at low cost |
| **Yjs + Hocuspocus** | OSS CRDT + WS server | Self-host | Protocol-friendly for shared memory docs |

Sources: https://liveblocks.io/pricing.md ; https://www.duskolicanin.com/blog/real-time-saas-supabase-vs-liveblocks-vs-partykit-2026 ; Liveblocks Yjs blog.

### 1.4 MCP ecosystem: what it can / cannot do for cross-user bridging

**What MCP is:** Anthropic-originated **agent ↔ tool/data** protocol (resources, tools, prompts). Complements Google/Linux Foundation **A2A** for **agent ↔ agent**.

**What MCP is not:**  
- Not a multi-user session / co-ownership protocol for two human operators’ personal bots.  
- Not a credential vault or OAuth broker between two end-users by itself (though OAuth/ID-JAG patterns exist for *enterprise* MCP auth).  
- Mid-2026 direction: more **stateless** MCP; session state pushed to application layer.

**What you *can* build with MCP:**  
- An MCP server that exposes tools like `join_shared_room`, `post_message`, `read_shared_memory`, `request_tool_proxy`—both bots connect as MCP clients to **your** bridge.  
- Multi-tenant MCP patterns (tenant/user/invocation identity on every call)—see Microsoft workshop docs and vendor blogs on isolation.  
- Enterprise-managed auth extensions (ID-JAG / Cross-App Access, EMA stabilized ~Jun 2026 per WorkOS)—useful later for SSO, not MVP consumer pairing.

**Existing “collaboration” MCP servers:** Mostly tools *for* collaboration apps (Slack, Linear, Notion)—not “pair my bot with yours.” Gap remains.

**A2A (Agent2Agent):** Apache-2.0 open standard for opaque agent-to-agent task delegation; explicitly complementary to MCP; **not** an interactive multi-human messaging app. Useful later if two *agents* negotiate tasks; human co-prompting still needs a room/session layer you design.  
Sources: https://a2a-protocol.org/latest/ ; MCP registry about docs; WorkOS ID-JAG blog; Microsoft OpenAIWorkshop multi-tenant MCP security notes.

### 1.5 Open-source agent frameworks: multi-agent vs multi-user

| Project | Multi-agent (same operator) | True multi-user live session | Notes |
|---|---|---|---|
| **AutoGen / Magentic-One** | Yes (orchestrator + specialists) | No (research multi-agent system) | https://microsoft.github.io/autogen/ |
| **CrewAI** | Yes (roles/crews) | No | Role teams ≠ two humans’ bots |
| **LangGraph** | Yes (graph/state) | App must add multi-tenancy | Checkpointing helps session design |
| **OpenHands** | Coding agent | SaaS orgs / SSO exist; enterprise multi-tenant | Org product ≠ personal bot bridge |
| **Continue.dev** | Coding assistant | Acquired by Cursor (~Jun 2026 acqui-hire; standalone wind-down)—cautionary tale for host dependency |
| **LibreChat / Open WebUI** | Multi-user *UI* + auth | Multi-user chat apps, not cross-bot co-ownership of desktop agent boxes |
| **Dust** | Multiplayer product (closed+API) | Same workspace | Commercial |
| **MACP / Society Protocol experiments** | Agent coordination kernels | Research | Coordination ≠ consumer pairing UX |

**Key distinction for GTM messaging:** Almost everything marketed “multi-agent” still means **one user’s fleet**. Your wedge is **multi-human, cross-account, same live session**—closer to Ace/Claude Tag than to CrewAI.

### 1.6 Gap analysis — what this product uniquely fills

1. **Cross-host, cross-account live co-ownership** of a personal assistant/agent session (Grok Bot ↔ Grok Bot, or Grok Bot ↔ Cursor-like host via MCP), not “both of you buy Team seats on the same vendor.”  
2. **Protocol/bridge**, not another all-in-one agent workspace (Dock/Dust/Ceven already compete there with funding).  
3. **Scoped sharing** (transcript + optional memory + optional tool proxy) with **no credential dump by default**—Team accounts often overshare org connectors.  
4. **Student / indie / OSS maintainer** pairs who will not buy Claude Team + Slack admin setup for a weekend project.  
5. **Open standard** opportunity adjacent to MCP/A2A: “Shared Agent Session” / pairing rooms—hosts may ignore it, but MCP listing + HN can create pull.

**What is *not* unique anymore:** “AI for teams,” shared GPTs/agents inside one SaaS, Slack @agent, multi-agent orchestration.

---

## 2. Product definition

### 2.1 Core value proposition (one sentence)

**Pair two independently owned AI bots into one live shared session—shared transcript and scoped memory/tools—without merging accounts or exporting a dead template.**

### 2.2 Primary personas & jobs-to-be-done

1. **Two founders / indie hackers (remote)**  
   - JTBD: Co-steer one coding/ops agent with shared project context without sharing login passwords or copy-pasting chats.  
2. **CS student project teams (Bangalore & global)**  
   - JTBD: Three classmates work with one agent on a shared assignment repo/box without everyone paying Team seats.  
3. **OSS maintainer + contributor**  
   - JTBD: Invite a contributor’s bot into a scoped room (issues + repo read) for a debugging session; revoke after.

Secondary (later): agency pair-programming with clients; teacher + student tutoring bot.

### 2.3 Architecture options

#### A) Hosted relay / pairing room *(recommended MVP)*

- Flow: User A creates room → invite link / code → User B’s bot joins via MCP or thin client → WebSocket room syncs events (messages, memory patches, tool-request tickets).  
- Pros: Works across hosts that can run an MCP client; ships in weeks; clear hosted monetization.  
- Cons: You operate infra; trust/trust-center burden; ToS of hosts still apply to each client.

#### B) MCP bridge server both bots connect to

- Same as A, packaged primarily as **MCP server** (stdio/SSE/HTTP).  
- Pros: Natural distribution via MCP registry; fits Grok Bot / Cursor-like tool model.  
- Cons: MCP alone doesn’t define multi-user UX; you still need room protocol + auth.

#### C) Protocol extension / open standard (WebSocket + CRDT)

- Spec: room IDs, CRDT doc for shared memory, event types, capability scopes, invite tokens.  
- Implement reference server (PartyKit/Cloudflare DO or Yjs+Hocuspocus).  
- Pros: Moat-as-standard; others can self-host; harder for one host to kill.  
- Cons: Spec work slow; adoption chicken-egg; solo student must keep MVP tiny.

#### D) Plugin inside Grok Bot / Cursor-like hosts

- Pros: Best UX if APIs exist.  
- Cons: **Highest platform risk** (Continue.dev acqui-hire/shutdown pattern); APIs may be private; ToS; competing feature.

**Recommendation:** **A + B first** (hosted MCP pairing room), design events so **C** can graduate to a public spec in months 4–9. Treat **D** as optional adapter, never the sole path.

### 2.4 What gets shared (MVP scopes)

| Capability | MVP default | Notes |
|---|---|---|
| Chat transcript / prompts | **Shared** | Append-only log + presence (“who is typing/prompting”) |
| Short-term session memory | **Opt-in shared** | CRDT or last-write with attribution |
| Long-term personal memory | **Not shared** | Keep local unless explicitly exported |
| Tools | **Proxy with approval** | Bot A requests; Bot B’s user approves per-call or allowlist |
| Credentials / OAuth tokens | **Never shared** | Tools run in owner’s tenant; results returned as redacted artifacts |
| Computer / box / microVM | **Out of scope MVP** | Ace-class; huge blast radius |
| Routines / schedules | **Out of scope MVP** | Easy to abuse cross-account |

### 2.5 Security model (non-negotiable)

- **Invite tokens:** short-lived, single-room, rotatable; optional password.  
- **Scopes:** `transcript`, `memory.read`, `memory.write`, `tools.ask`, `tools.allow:<name>`.  
- **No credential sharing by default.** Tool execution stays with the credential owner; bridge only carries intents + sanitized results.  
- **Audit log:** who prompted, who approved which tool, join/leave. Exportable.  
- **E2E option (phase 2):** encrypt room payloads with shared room key (invite carries key); relay sees ciphertext only—harder with tool proxy (server may need to coordinate). Start with TLS + server-side encryption at rest.  
- **Abuse:** rate limits, room size caps (MVP: 2 users), malware/tool-exfil warnings in UX.  
- Align with emerging MCP multi-tenant identity (tenant, user/agent, invocation id) for later enterprise.

### 2.6 Non-goals for MVP

- Replacing Dust/Dock/ChatGPT Team as full company AI OS.  
- Shared cloud VMs / full desktop co-control.  
- Marketplace of public “always-on” agent rooms (moderation nightmare).  
- Supporting 10+ participants (Slack/Claude Tag territory).  
- Fine-tuning models or selling LLM tokens.  
- Unofficial reverse-engineering of closed host internals.

### 2.7 90-day build plan (solo / student, Bangalore)

**Days 1–14 — Spec & spike**  
- Write 2-page protocol: events, scopes, invite flow.  
- Spike: Cloudflare Worker/Durable Object or PartyKit room + minimal MCP server exposing `create_room`, `join_room`, `send`, `history`.  
- Two local mock “bots” (Python/TS CLI) proving sync.

**Days 15–35 — MVP**  
- Auth: magic link or GitHub OAuth for room owners.  
- Web dashboard: create room, copy invite, live transcript view, scope toggles, audit log.  
- MCP server publishable locally; docs for wiring into MCP-capable hosts.  
- Security defaults: 2 seats, 24h room TTL, no tools until allowlist.

**Days 36–60 — Dogfood & distribution**  
- Use with a real classmate/cofounder daily.  
- 3-minute demo video; README; Discord; submit MCP registry listing when ready.  
- HN “Show HN” + relevant Discord/Slack communities (MCP, AI agents).  
- Collect 20 design-partner signups (waitlist).

**Days 61–90 — Harden or kill**  
- Tool-proxy approval UX; retention controls; basic metrics.  
- Decide: open-core hosted free tier vs pure OSS self-host.  
- If &lt;5 weekly active paired rooms after sincere distribution → pivot (see kill criteria).

**Rough cost (estimates):** Cloudflare/free tiers + domain ≈ **$0–30/mo**; student living Bangalore often cited **~₹13k–27k/mo** personal burn—keep infra near zero.

---

## 3. Open source strategy

### 3.1 License recommendation

**Primary recommendation: Apache-2.0** for protocol, MCP server, and reference clients.

| License | Pros | Cons | Verdict for this product |
|---|---|---|---|
| **Apache-2.0** | Patent grant; industry default for protocols (A2A is Apache-2.0); easy corp adoption | Weak copyleft vs cloud clones | **Best default** |
| **MIT** | Max simplicity | No patent grant | Acceptable for tiny libs |
| **AGPL** | Forces SaaS source share | Scares enterprises & some hosts | Avoid for *protocol* adoption |
| **BSL / Fair Source** | Delays hyperscaler freeloading | Not OSI “open source”; weaker community signal for standards play | Optional for *hosted control plane* only |

Rationale: You want **hosts and MCP clients to integrate**. Protocols win with permissive licenses (MCP ecosystem, A2A). Monetize **operations, compliance, and convenience**, not withholding the wire format.

### 3.2 Open-core split

**Open-source:**  
- Protocol spec + schemas  
- Reference MCP bridge  
- Self-host docker-compose (SQLite/Postgres)  
- Client SDKs (TS/Python)  
- Basic audit log export  

**Proprietary / paid cloud:**  
- Hosted multi-tenant relay with SLA  
- SSO/SAML, SCIM, SOC2 packet (later)  
- Longer retention, more participants, org policies  
- Managed tool-policy templates & SIEM webhooks  
- Priority support  

Avoid “open washing”: core pairing must work well self-hosted or community will reject you.

### 3.3 Community playbook

1. GitHub: excellent README, architecture diagram, threat model, “what we never sync.”  
2. Demo video ≤3 min (two terminals, one room).  
3. Discord for design partners.  
4. Show HN + r/LocalLLaMA / MCP forums (timing: mid-week US morning).  
5. MCP registry listing + cookbook “pair two agents.”  
6. Write “Single-player agents are a bug” essay citing Ace (Appleton) + Claude Tag—position as infrastructure, not another chat UI.  
7. University clubs in Bangalore (IIIT-B, IISc, PES, RVCE)—hack night using the bridge.

### 3.4 Dependency / platform risks

- **Host API changes** or first-party “shared session” features (Cursor, Anthropic, OpenAI, xAI) can shrink the wedge.  
- **Continue.dev → Cursor** shows OSS AI DX tools can be absorbed.  
- Mitigation: standard + self-host; multi-host adapters; don’t bet brand solely on “Grok Bot plugin.”

---

## 4. Monetization (honest)

### 4.1 Can you earn money?

**Yes, with conditions:**  
1. Clear painful use case (pair programming / student teams) with retention.  
2. Hosted convenience beats self-host for non-devs.  
3. You survive long enough for distribution (OSS) before billing.  
4. You do **not** compete head-on with Dust/Dock on “company AI OS” without capital.

**No / not yet if:** you only have a novelty demo, no weekly paired rooms, or you burn trust with credential sharing.

### 4.2 Models that fit OSS + collab infra

| Model | Fit | Notes |
|---|---|---|
| Hosted pairing (freemium) | Strong | Free: 2 users, short retention; Paid: retention, seats, SSO |
| Usage-based relay | Strong | Analogous to Liveblocks collab minutes |
| Team seats | Medium | Dust/Claude/ChatGPT comps $20–40/user/mo |
| Enterprise SSO/compliance | Strong late | Liveblocks Team from $600/mo shows willingness for SSO/SOC2 |
| Marketplace of rooms | Weak early | Trust/moderation cost |
| Support contracts | Medium | Self-host enterprises |
| Selling LLM tokens | Weak | Race to bottom; not your wedge |

### 4.3 Pricing analogues (public)

- Claude Team: **$20–25** Standard / **$100–125** Premium per member/mo (US).  
- Cursor Teams: **$40** / **$120** per user/mo.  
- Dust Business seats: Free / **24€** / **120€** per seat/mo (annual Pro/Max).  
- Liveblocks: Free; Pro **$30**; Team from **$600**; **$0.002** per collab user-minute.  

**Illustrative starter price for your hosted product:**  
- Free: 1 room, 2 participants, 24h history, transcript-only.  
- Pro: **$12–20/user/mo** or **$25/room/mo** — undercut Team suites; you’re bridging, not replacing Claude.  
- Team: **$99–299/mo** flat for orgs (SSO later).  
*(Estimates—validate with design partners.)*

### 4.4 Year-1 revenue scenarios (illustrative, not forecasts)

Assumptions: solo founder; OSS + hosted; global USD pricing; part-time student constraints.

| Scenario | What would have to be true | Illustrative ARR |
|---|---|---|
| **Conservative** | Cool GitHub stars; &lt;20 paying rooms; mostly free users | **$0–5k** |
| **Base** | 100–300 Pro seats or ~150 paid rooms; some indie teams | **~$20–80k** |
| **Optimistic** | Breakout HN + MCP default; 1–2k paying seats or early B2B pilots | **~$150–400k** |

Grounding: Liveblocks-style infra can monetize before huge headcount; Cal.com-style open-core stories cite ~$100k ARR first year for *strong* OSS distribution (not typical). Most student projects earn $0 in year 1—plan psychologically for that.

### 4.5 When NOT to monetize yet

- Before 50+ weekly active paired sessions or clear waitlist conversion.  
- Before security story is crisp (one viral “shared bot leaked AWS keys” kills you).  
- If charging would block the MCP/standard adoption flywheel—prefer usage caps over feature cripple.

### 4.6 India / Bangalore angle

- **Build costs:** Keep MVP on Cloudflare free/low tiers; estimate **$0–50/mo** infra early.  
- **Price in USD** globally; purchasing power for Indian students → generous free tier, charge US/EU teams.  
- **Payments:** Stripe India historically invite-only / higher effective FX+GST friction for some founders; many Indian SaaS use **Razorpay International**, Lemon Squeezy, Paddle, or US entity later—verify current eligibility (2026 landscape still fragmented per public guides). Budget **~3–7%+** all-in payment friction as planning estimate.  
- **Compliance basics:** Privacy policy, DPA on request, don’t store OAuth tokens, log retention settings, export/delete room data (DPDP Act awareness for Indian users). Not legal advice—use a template + student legal clinic / CA when charging.

---

## 5. Competitive moat & go-to-market

### 5.1 Beachhead (pick one and own it)

**Best beachhead:** *Two remote builders with separate AI coding assistants who already paste chats into Discord.*  

Why: acute pain, low procurement, demoable in 60 seconds, won’t wait for Claude Tag enterprise setup.

Then expand: student hackathon teams → OSS maintainer office hours → small agencies.

### 5.2 Differentiation vs “just share a Team account” or “export template”

| Workaround | Failure mode | Your fix |
|---|---|---|
| Shared ChatGPT/Claude Team login | ToS risk, no attribution, credential blast radius | Per-user auth + scopes + audit |
| Export bot template | Diverging copies; no live co-steering | Live session sync |
| Slack + Claude Tag | Requires Team/Enterprise + Slack admin; vendor lock | Cross-host MCP bridge; works for indies |
| Ace/Dock | New full workspace migration | Bring-your-own existing bots |

### 5.3 Distribution channels

1. MCP registry + docs SEO (“pair two MCP agents”)  
2. Show HN / Launch YC-style threads  
3. Content: Ace/Claude Tag commentary → “open pairing layer”  
4. University Discord/WhatsApp (Bangalore)  
5. Integrations READMEs for Cursor/Continue-like hosts, Claude Desktop MCP, Grok Bot MCP  
6. Design-partner program: 10 teams free Pro for feedback/logo  

### 5.4 Moat realism

Early moat is **distribution + trust + protocol adoption**, not ML. Long-term moat:  
- Default open session protocol  
- Audit/compliance pack enterprises need  
- Hub of host adapters  

Expect giants to ship “shared session” *inside* their walls—your survival is **cross-wall bridging** + OSS gravity.

---

## 6. Risks & kill criteria

### 6.1 Legal / ToS

- Connecting bots may violate host ToS if it automates accounts, shares sessions against policy, or bypasses team SKUs.  
- **Mitigation:** Users authenticate themselves; you sync *user-authorized* tool results; no password sharing; publish compliance posture; consult ToS per host before adapters.  
- Not legal advice.

### 6.2 Trust / security

- Shared tools = shared blast radius (email send, code push, payments).  
- One incident dominates HN narrative.  
- **Mitigation:** approvals, allowlists, redaction, short TTLs, never sync secrets.

### 6.3 Chicken-egg

- Need both users on compatible clients.  
- **Mitigation:** CLI mock bots + browser transcript participant (“human join without bot”) so one side can be web-only.

### 6.4 Competition / platform

- Claude Tag, Workspace Agents, Ace→product, Dock, Dust Pods.  
- Hosts ship native multiplayer prompting.

### 6.5 Clear signals to pivot or kill

**Kill or hard pivot if (after earnest 90 days):**  
- &lt;5 weekly active paired rooms despite distribution pushes.  
- Users only want shared *documents*, not shared *agents* → become Liveblocks-thin wrapper (bad).  
- Hosts ban MCP bridge pattern.  
- You cannot explain security model in one paragraph users trust.

**Pivot options:**  
1. Self-host-only OSS toolkit (reputation, job signal) without startup.  
2. Narrow vertical: “paired grading bot for CS labs” (university sales).  
3. Become a **policy/audit layer** for multi-user agents inside one vendor (enterprise).  
4. Contribute to A2A/MCP standards; don’t form a company.

---

## 7. Recommended path (synthesis)

1. **Product:** Hosted **MCP pairing rooms** (architecture A+B) with transcript sync + scoped memory + tool approvals; design toward open session protocol (C).  
2. **OSS:** Apache-2.0 core; open-core hosted SSO/retention later.  
3. **Money:** Delay billing until retention; then freemium hosted + usage; USD list prices; India free-tier heavy.  
4. **GTM:** Beachhead = two indie builders; Show HN + MCP registry; Bangalore student teams as design partners.  
5. **Mindset:** You’re selling **coordination infrastructure**, not “another multi-agent framework.”

---

## Sources

### Primary product / vendor
- OpenAI — Introducing workspace agents (22 Apr 2026): https://openai.com/index/introducing-workspace-agents-in-chatgpt/  
- OpenAI Help — Workspace agents multiplayer editing: https://help.openai.com/en/articles/20001143-chatgpt-workspace-agents-for-enterprise-and-business  
- Anthropic — Introducing Claude Tag (23 Jun 2026): https://www.anthropic.com/news/introducing-claude-tag  
- Anthropic — Claude Team plan: https://support.claude.com/en/articles/9266767-what-is-the-team-plan  
- Cursor — Team pricing docs: https://cursor.com/docs/account/teams/pricing.md  
- Cursor forum — shared chat sessions request: https://forum.cursor.com/t/teams-share-same-chat-sessions-to-work-collaborate/161432  
- Dust pricing: https://dust.tt/home/pricing  
- Dust home: https://dust.tt/  
- Ceven: https://ceven.io/  
- Dock YC launch: https://www.ycombinator.com/launches/Th4-dock-s26-a-multiplayer-agent-workspace-that-gives-you-a-team-of-proactive-agents-that-feel-like-colleagues-instead-of-chat-boxes  

### Research / prototypes
- Maggie Appleton — Ace / collaborative AI engineering: https://maggieappleton.com/zero-alignment  
- Magentic-One (Microsoft): https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/  
- AutoGen Magentic-One docs: https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/magentic-one.html  

### Protocols & MCP
- A2A Protocol: https://a2a-protocol.org/latest/  
- MCP Registry about: https://github.com/modelcontextprotocol/registry/blob/main/docs/modelcontextprotocol-io/about.mdx  
- WorkOS — MCP enterprise managed authorization / ID-JAG: https://workos.com/blog/mcp-enterprise-managed-authorization-id-jag  
- Microsoft — Multi-tenant MCP security notes: https://github.com/microsoft/OpenAIWorkshop/blob/main/mcp/MULTI_TENANT_MCP_SECURITY.md  
- Safeguard — MCP multi-tenant isolation: https://safeguard.sh/resources/blog/mcp-server-multi-tenant-isolation  

### Realtime infra
- Liveblocks pricing: https://liveblocks.io/pricing.md  
- Liveblocks Yjs: https://liveblocks.io/blog/introducing-liveblocks-yjs  
- PartyKit vs Liveblocks comps (2026): https://www.duskolicanin.com/blog/real-time-saas-supabase-vs-liveblocks-vs-partykit-2026  
- PkgPulse Liveblocks vs PartyKit vs Hocuspocus: https://www.pkgpulse.com/guides/liveblocks-vs-partykit-vs-hocuspocus-realtime-2026  

### OSS / business model context
- Promise Legal — OSS licensing for startups: https://promise.legal/startup-legal-guide/ip/open-source  
- OSSAlt — Open core vs source available 2026: https://ossalt.com/guides/open-core-vs-source-available-business-models-2026  
- n8n — Multi-agent frameworks overview: https://blog.n8n.io/multi-agent-systems/  

### India / payments (verify before relying)
- Guides on Stripe India / Razorpay international friction (2026 blog landscape): e.g. https://www.cashfree.com/blog/indian-saas-global-payments-guide/ ; https://www.xflowpay.com/blog/stripe-transaction-fees  

---

*End of brief. Numbers marked estimate/illustrative are not audited forecasts. Re-check vendor pricing pages before any pitch deck.*
