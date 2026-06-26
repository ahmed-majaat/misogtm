---
name: oneshot-feature
description:
  End-to-end feature creation harness for this repo. Use when the user asks for
  a one-shot feature build, AFK/agentic implementation, complete feature
  delivery, or wants SAFe-style roles and gates combined with small
  Matt Pocock-style skills.
---

# Oneshot Feature

Run a complete feature pass without turning the process into a heavyweight
framework. Optimize for a thin feature contract, one vertical slice at a time,
observable behavior, validation evidence, and an explicit quality/security gate.

## Source Pattern

This repo adapts two ideas:

- SAW: clear roles, stop-the-line gates, evidence before done.
- Matt Pocock skills: small composable workflows, alignment before code, TDD at
  useful seams, and review after implementation.

Use the local runbook at `docs/agents/oneshot-feature-harness.md` as the
authoritative project harness reference.

## Workflow

1. Inspect the worktree before editing. Do not overwrite unrelated local
   changes.
2. Read `CONTEXT-MAP.md`, `CONTEXT.md`, and the relevant source files. For
   Convex code, read `convex/_generated/ai/guidelines.md` before touching any
   `convex/` file.
3. Create a compact feature contract. If the request is underspecified, use the
   `feature-intake` skill. In oneshot mode, ask only for blocking decisions;
   otherwise make explicit assumptions.
4. Plan a vertical slice that reaches observable user value first. Avoid a
   horizontal pass that edits schema, backend, frontend, and tests in bulk
   before any behavior is proven.
5. Implement one slice at a time. Prefer behavior tests through public
   interfaces where the repo already has test seams. Do not add speculative
   features.
6. Run targeted checks while building. At minimum run typecheck and lint before
   completion; use `scripts/oneshot-feature-check.sh --quick` if available.
7. Run a gate review. Use `feature-gate-review` with an independent subagent if
   one is available. If not, perform a separate findings-first pass and label
   any residual self-review risk.
8. Finish with evidence: changed surfaces, assumptions, validation commands,
   gate outcome, and remaining risks.

## Stop-the-Line Conditions

Stop and ask the user before proceeding when any of these are true:

- Acceptance criteria cannot be inferred without changing product meaning.
- Auth, authorization, secrets, billing, production data, or irreversible data
  migration behavior is unclear.
- The feature would require destructive git operations or reverting user work.
- Required validation cannot run and the risk is not safely bounded.
- The requested scope expands into broad architecture cleanup unrelated to the
  feature.

If a stop-the-line condition is not present, continue with the smallest
reasonable assumption and record it in the final evidence.

## Feature Contract Shape

Keep the contract short:

```markdown
## Goal
## User-visible behavior
## In scope
## Out of scope
## Assumptions
## Acceptance criteria
## Surfaces touched
## Validation plan
## Gate risks
```

## Validation Defaults

Use these checks unless the feature is docs-only or a narrower command is more
appropriate:

```bash
scripts/oneshot-feature-check.sh --quick
scripts/oneshot-feature-check.sh --full
```

For Convex changes, also run or explain the closest Convex validation available
in the repo. If generated Convex files are stale, regenerate them with the
project's normal Convex workflow rather than hand-editing generated files.

## Final Evidence

Report:

- Feature contract summary.
- Files or surfaces changed.
- Checks run and results.
- Gate outcome: PASS, PASS WITH RISKS, or BLOCKED.
- Any assumptions that should become a ticket, ADR, or follow-up.
