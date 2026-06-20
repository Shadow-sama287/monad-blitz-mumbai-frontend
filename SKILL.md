---
name: code-review-for-hackathon
description: >-
  Review code against this project's AGENTS.md spec during a time-boxed hackathon
  build. Use this skill whenever a build phase is marked complete, whenever an
  error or bug is being debugged, whenever code is claimed to work or match
  expected behavior, or before integrating one teammate's piece with another's.
  Trigger this whenever the user says things like "phase done", "check this",
  "does this match the spec", "is this ready to merge", "I'm getting an error",
  or pastes a stack trace or error message, even if they don't explicitly ask for
  a review. This skill is scope-defensive — it actively checks for and flags any
  feature creep beyond AGENTS.md, not just bugs.
---


# Code Review for Hackathon

A fast, scope-defensive review skill for time-boxed hackathon builds. It checks code
against the project's own AGENTS.md spec rather than general best practices, because
in a 5-hour build the biggest risk isn't bad code style — it's scope creep, broken
integration contracts, and non-deterministic behavior that will fail unpredictably
on stage.

This skill assumes an `AGENTS.md` file exists in the project (at the repo root, or
provided by the user) and treats it as the ground truth. If no AGENTS.md is found,
say so immediately and ask for it or for the relevant section before reviewing —
do not review against generic assumptions about what the project "should" do.

## When to use this (trigger aggressively)

- A teammate says a phase/task is "done," "complete," or "ready"
- Code is being debugged after an error, exception, or failed transaction
- Someone asks "does this work," "is this correct," "does this match," or similar
- Right before two pieces of code are about to be integrated (frontend↔backend,
  backend↔chain layer)
- Any time a new function, endpoint, or UI component is written and the user pastes
  it in, even without an explicit "review this" ask

Do not wait to be asked explicitly with the word "review." Time pressure means
people will paste code and say "ok next" — that's still a trigger.

## What this skill is NOT for

- General code style/refactoring requests with no spec to check against
- Post-hackathon cleanup or production-hardening (different priorities entirely)
- Reviewing code in a project that has no AGENTS.md or equivalent spec — fall back
  to asking what the expected behavior is first

## The Review Process

Run through these checks in order. Stop and report as soon as something in Tier 1
fails — don't bother polishing commentary on Tier 3 issues if the code is out of
scope or breaks the integration contract, since those points are about to be moot
anyway once it's fixed.

### Tier 1 — Scope guardrails (check first, always)

Compare the code against the project's explicit cut list (in this project's
AGENTS.md, Section 6). Ask:

- Does this introduce any agent, node, endpoint, or feature not in the spec?
  (e.g., a guild system, a 5th agent, an auto-mitosis trigger — anything cut)
- Does this call the blockchain/contract directly from a layer that shouldn't
  (e.g., frontend calling chain RPC directly instead of going through the backend)?
- Is there scope creep dressed up as a "quick addition" — something that wasn't
  asked for but seemed natural to add while writing this code?

If yes to any of these: **flag it first, before anything else**, and ask whether
it's an intentional spec change or accidental creep. In a hackathon, accidental
scope creep is the single most common way teams run out of time.

### Tier 2 — Contract correctness (the integration boundary)

Check the code against the exact API contract in AGENTS.md Section 9 (or whatever
section defines request/response shapes):

- Does this endpoint/function accept exactly the fields specified, in the right
  shape (field names, types, nesting)? Flag any drift, even small (e.g.
  `txHash` vs `tx_hash`, `reputationPenalty` vs `penalty`).
- Does the response match the documented shape exactly? A frontend built against
  mock data will silently break if a real response shape differs.
- For chain-layer functions: does it return what the layer above expects
  (`{ tokenId, txHash }`-style shapes), not raw provider/SDK objects?

This is the highest-value check in a multi-person hackathon build, because
mismatches here are invisible until integration time, when they're most expensive
to debug.

### Tier 3 — Determinism and demo reliability

Time-boxed live demos fail from unpredictability, not from inelegant code. Check:

- Is anything that should be deterministic (e.g., the Court/judge verdict logic)
  actually deterministic? Flag any live LLM call, random number, or external API
  dependency sitting in a path that's supposed to behave the same way every time
  during the demo run.
- Are there unhandled promise rejections / missing try-catch around any network or
  contract call that fires during the live demo? A single uncaught error here can
  kill the whole run on stage.
- Is there a hardcoded fallback or cached value available if a live network call
  (RPC, faucet, LLM API) is slow or fails? Not required everywhere, but flag where
  it's missing on a critical-path call (e.g., the happy-path job→feedback flow).
- For frontend state: is the state transition driven by a single clear variable
  (per AGENTS.md's "state-driven, not animation-driven" guidance), or has it grown
  ad hoc conditional branches that would be hard to debug live?

### Tier 4 — Functional correctness against the stated behavior

Only after Tiers 1–3 are clean, check the actual logic:

- Walk through the specific scenario in AGENTS.md (e.g., "flawed output contains
  `CRITICAL_ERROR` → judge rules guilty → reputation drops by 15") and confirm the
  code actually produces that outcome for that exact input.
- If this is bug-fixing (triggered by an error/stack trace), identify the root
  cause, not just the symptom — but stay inside the time budget; if a deeper fix
  would eat significant time, say so explicitly and offer the cheapest correct
  workaround as an alternative, flagged as a workaround.

### Tier 5 — Minor notes (optional, only if time clearly allows)

Naming, comments, minor duplication. Mention briefly at the end if relevant, never
as the headline of the review, and never if Tier 1–4 found anything substantive —
don't bury an integration-breaking issue under style notes.

## Output Format

Keep it scannable. Use this structure:

```
SCOPE CHECK: [clean | flagged — explain]
CONTRACT CHECK: [clean | drift found — explain exact mismatch]
DEMO RELIABILITY: [clean | risk found — explain]
FUNCTIONAL CHECK: [matches spec | doesn't match — explain the gap]

[If everything is clean:] This matches AGENTS.md. Safe to integrate / move to next phase.

[If something failed:] Fix needed before proceeding: <specific, actionable fix>
```

Do not write a long prose review. This is meant to be read in seconds between
build steps, not studied. If there's nothing wrong, say so briefly and stop —
don't manufacture nitpicks to seem thorough.

## Tone

Direct and fast, like a teammate doing a 30-second sanity check, not a formal code
review. The goal is confidence to keep moving, or a clear stop sign — never a vague
"looks mostly fine but consider..." that leaves the person unsure whether they can
proceed.
