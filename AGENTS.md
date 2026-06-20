# AGENTS.md — Agent Court: On-Chain Audit Dispute Demo (Monad / ERC-8004)

This file is the single source of truth for the project. Every teammate (and every AI
tool we use, including Antigravity) should read this before writing code. If anything
in a tool's output contradicts this file, this file wins.

---

## 1. The One-Sentence Pitch

Two AI agents transact on Monad using real ERC-8004 identities and reputation. A
client agent hires a service agent to audit a smart contract; if the work is bad,
the dispute goes to an on-chain Judge whose verdict is written permanently to the
real Monad Reputation Registry — and if the service agent performs well enough, it
reproduces, spawning a new independent on-chain agent live in front of the judges.

---

## 2. Time Budget & Team

- **Total time:** 5 hours
- **Team:** 3 people, all full-stack, **zero prior web3 experience**
- **Person 1:** Chain layer (contracts, wallets, registration, feedback)
- **Person 2:** Backend / agent logic (job execution, court verdict, mitosis trigger)
- **Person 3:** Frontend (Antigravity-built canvas UI)
  No automated treasury monitoring, no auto-triggered mitosis, no real x402 payment
  protocol, no on-chain Validation Registry (it isn't live on Monad yet anyway). All of
  these are explicitly cut — see Section 6.

---

## 3. The Scenario: Smart Contract Audit Pipeline

We hardcode a single, narrow, dramatic scenario. Do not generalize it. Do not build
a marketplace. Three agents, one job type, one dispute path, one mitosis event.

### Agent A — "Protocol Deployer" (Client)

- Role: needs an external agent to audit and optimize a newly written smart contract.
- Treasury (cosmetic, displayed only): starts at 10 MON.
- Wallet: pre-funded testnet wallet, registered **before** the live demo.

### Agent B — "AuditBot-v1" (Service Provider)

- Skills: `["Solidity-Static-Analysis", "Gas-Optimization", "Vulnerability-Patching"]`
- Mock endpoint: `/agent/audit-bot`
- Starting reputation: 90 (framed as "3 past successful audits on-chain")
- Wallet: pre-funded testnet wallet, registered before the live demo.
- This is the agent that performs the job, gets disputed, and undergoes mitosis.

### Agent \* — "Judge_LLM_Oracle" (Arbitrator)

- Role: evaluates the job output if a dispute is raised.
- Trusted to write final, binding feedback directly to the Monad Reputation Registry.
- Wallet: pre-funded testnet wallet, registered before the live demo.

### Agent B1 — Child of B (only exists after Mitosis is triggered)

- Spawned live during the demo via the manual mitosis trigger.
- Card includes `"parent": "agent-b"`.
- Reuses the exact same registration function as A/B/Judge — nothing new at the
  contract level, just a new wallet + new agent card.

### The two task outputs (hardcoded, not AI-generated under demo pressure)

- **Happy output:** a clean text summary of gas savings with a success flag.
- **Flawed output:** a string containing an explicit `CRITICAL_ERROR` marker or
  obviously broken syntax. This is the deterministic trigger for the dispute path —
  never let an LLM decide live whether output is "bad enough" to dispute. The judge
  logic should treat the literal presence of `CRITICAL_ERROR` as guilty, full stop.

---

## 4. What Is Real vs Simulated (be upfront about this with judges)

| Piece                                      | Status                                                        |
| ------------------------------------------ | ------------------------------------------------------------- |
| Agent identities (A, B, Judge, B1)         | **Real** — minted on Identity Registry                        |
| Reputation feedback (happy path + verdict) | **Real** — written to Reputation Registry                     |
| Payment for the job                        | Simulated as a plain MON transfer, or purely cosmetic number  |
| The audit work itself                      | Simulated — two static hardcoded outputs (see Section 3)      |
| Court verdict logic                        | Simulated in backend (deterministic rule on `CRITICAL_ERROR`) |
| Mitosis trigger                            | Simulated — manual button, not auto-threshold                 |
| Mitosis execution (B1 registration)        | **Real** — real Identity Registry tx                          |
| Mitosis treasury split                     | Cosmetic only unless time remains for a real transfer         |
| Validation Registry                        | Not used — not live on Monad yet                              |

The rule of thumb: identity and reputation are always real on-chain transactions.
Everything else is simplified so the team can ship in 5 hours.

---

## 5. Contract Addresses (Monad Testnet)

- Identity Registry: `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- Reputation Registry: `0x8004BAa17C55a88189AE136b182e5fdA19dE9b63`
- Validation Registry: not live — do not use
  Get exact RPC URL, chain ID, and faucet from the official Monad docs at build time —
  do not hardcode stale values into this file.

---

## 6. Explicit Cut List (do not build these, do not suggest them mid-build)

- ❌ Guild formation, guild clustering animation, "best guild wins the contract"
- ❌ More than 2 working agents + 1 judge in the live data model
- ❌ Automated mitosis triggering on a treasury/reputation threshold
- ❌ Real x402 payment protocol integration
- ❌ On-chain Validation Registry usage
- ❌ Any live, non-deterministic LLM judging during the actual demo run
- ❌ Physics-based / force-directed canvas layout (D3.js, Vis.js, or similar)
  If an idea isn't in Sections 3–5, it's future work — say so in the pitch, don't build it.

---

## 7. Build Phases

### Phase 1 — Setup (0:00–0:30, all three together)

- Fund 4 testnet wallets (A, B, Judge, B1-reserved) from the Monad faucet.
- Agree on the exact JSON shape of an agent card and the API contract (Section 9).
- Confirm the two hardcoded task outputs (happy + flawed).

### Phase 2 — Parallel build (0:30–3:00)

- Person 1 builds and tests chain functions in isolation against testnet.
- Person 2 builds job/feedback/dispute/mitosis logic against mocked chain responses.
- Person 3 builds the canvas UI against the API contract using mock data, no live
  backend dependency yet.

### Phase 3 — Integration (3:00–4:00)

- Wire frontend → backend → chain layer together.
- Pre-register Agent A, Agent B, and Judge for real (do this once, off-demo-clock).
- Run the happy path end to end, live, on testnet.

### Phase 4 — Dispute + Mitosis wiring (4:00–4:30)

- Get the dispute → verdict → reputation-drop flow working live.
- Get the manual mitosis trigger → B1 registration → canvas split animation working.

### Phase 5 — Rehearsal (4:30–5:00)

- Run the full demo sequence 2–3 times start to finish.
- Fix only what's broken. Do not add scope in the last 30 minutes.

---

## 8. Demo Day Run Order

1. Agents A, B, Judge already registered (off-clock, before judges arrive).
2. Live: happy path — job → feedback → B's reputation ticks up on screen.
3. Live: dispute path — job (flawed output) → auto-escalate to court → verdict →
   B's reputation visibly drops, real tx link shown.
4. Live: manual mitosis trigger — B1 appears, splits visually from B, B's info card
   now lists B1 as a child.
5. Close with: "Here's what we'd build next — guilds, automatic mitosis thresholds,
   real x402 payments." Naming the cuts signals maturity, not a shortfall.

---

## 9. API Contract (the integration boundary — do not deviate)

Frontend **never** calls the chain directly. Always: Frontend → Backend (Person 2) →
Chain layer (Person 1) → Monad testnet.

### `GET /agents`

Returns the current agent list for the canvas.

```json
[
  {
    "id": "agent-a",
    "type": "client",
    "name": "Protocol Deployer",
    "reputation": 100,
    "wallet": "0x1A2b...3c4D",
    "children": []
  },
  {
    "id": "agent-b",
    "type": "service",
    "name": "AuditBot-v1",
    "reputation": 90,
    "wallet": "0x5E6f...7g8H",
    "children": []
  },
  {
    "id": "judge",
    "type": "arbitrator",
    "name": "Judge_LLM_Oracle",
    "reputation": 100,
    "wallet": "0x9I0j...1k2L",
    "children": []
  }
]
```

### `POST /job`

```json
{ "input": "text to summarize", "simulateBadDelivery": false }
```

Response includes `jobId` and the output text (clean or flawed). Triggers the
A → B pulse animation on success.

### `POST /feedback`

Fires only on the happy path.

```json
{ "jobId": "job-123", "rating": 5, "comment": "Good work" }
```

Writes real feedback to the Reputation Registry. UI flashes Node B green, increments
its on-screen reputation, prints the tx link.

### `POST /dispute`

Fires automatically when the job output is flawed, or via manual "Escalate to Court."

```json
{ "jobId": "job-123", "input": "original input", "output": "bad" }
```

Response:

```json
{ "verdict": "GUILTY", "reputationPenalty": -15, "txHash": "0x..." }
```

UI: Node B turns red, dashed court zone appears, line strikes to Judge node, B's
reputation drops on screen after the response returns.

### `POST /mitosis`

Manual trigger only. Empty body.

```json
{}
```

Response:

```json
{ "childId": "agent-b1", "parentId": "agent-b", "txHash": "0x..." }
```

UI: Node B glows, Node B1 scales up from 0→1 next to B, a line draws from B to B1,
B's info card updates its `children` array.

---

## 10. Guardrails for AI Tools (Antigravity, Gemini, or anything else used mid-build)

- Do not introduce new agents, new endpoints, or new contract calls beyond Section 9.
- Do not suggest physics-based layout libraries — fixed absolute-position nodes only.
- Do not make the dispute/verdict logic non-deterministic for the live demo run.
- Do not propose "while we're at it" features (guilds, marketplaces, multi-task
  pipelines). If asked to extend scope, push back and point to Section 6.
- Keep all on-chain calls server-side (Person 1 / Person 2's backend). The frontend
  only ever talks to the backend API in Section 9.
- If a contract call fails during testing, the priority is a reliable retry/cached
  fallback for the live demo — not a deeper fix mid-build unless time clearly allows.
