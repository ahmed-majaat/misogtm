# Oneshot Feature Harness

This repo uses a lightweight feature harness inspired by SAFe Agentic Workflow
and small composable engineering skills. The goal is to let an agent build a
feature end to end in one run while preserving alignment, validation, and review
evidence.

## Design Principles

- Keep the process small enough to run in one agent turn.
- Treat acceptance criteria as the contract, not a ceremony.
- Build vertical slices that reach user-visible GTM behavior.
- Run quality/security gates before calling work done.
- Preserve user changes in the worktree.
- For Convex code, read `convex/_generated/ai/guidelines.md` first.

## Roles

| Role | Responsibility | Can Collapse? |
| --- | --- | --- |
| Feature Intake | Clarify goal, assumptions, acceptance criteria, and validation plan. | Yes, into implementer for clear requests. |
| Implementer | Build one vertical slice at a time and collect evidence. | Yes. |
| QAS Gate | Review behavior, tests, UX states, and regression risk. | Prefer independent review. |
| Security Gate | Review auth, data ownership, secrets, env, and exposure risk. | Prefer independent review for auth/data changes. |

If independent subagents are unavailable, the implementer must run a separate
findings-first review pass and label the residual self-review risk.

## Trigger Phrases

Use the harness when the user says things like:

- "build this feature end to end"
- "oneshot feature"
- "AFK agent implementation"
- "create the feature with gates"
- "turn this issue/PRD into implementation"

## Run Sequence

1. Inspect worktree and local instructions.
2. Read product context and relevant source files.
3. Produce or infer the feature contract.
4. Implement the tracer bullet vertical slice.
5. Add remaining acceptance criteria one slice at a time.
6. Run targeted validation while building.
7. Run repo-level validation before done.
8. Run quality/security gate.
9. Report evidence and risks.

## Feature Contract

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

## Default Validation

Use the harness helper:

```bash
scripts/oneshot-feature-check.sh --quick
scripts/oneshot-feature-check.sh --full
```

`--quick` runs typecheck and lint. `--full` runs typecheck, lint, and build.
Add targeted tests or manual browser checks for the feature's actual behavior.

## Stop-the-Line Conditions

Pause for the user when:

- Product behavior cannot be inferred safely.
- Auth, authorization, billing, secrets, production data, or destructive
  migrations are involved and unclear.
- Validation is blocked and the risk is not bounded.
- The implementation would require reverting unrelated local changes.
- The request has become an architecture rewrite rather than a feature slice.

## Evidence Template

```markdown
## Feature Evidence

Contract:
- Goal:
- Acceptance criteria:
- Assumptions:

Implementation:
- Frontend:
- Convex:
- Docs/config:

Validation:
- Targeted:
- Typecheck:
- Lint:
- Build:
- Manual demo:

Gate:
- Outcome:
- Findings:
- Residual risk:
```
