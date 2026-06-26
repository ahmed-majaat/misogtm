---
name: feature-gate-review
description:
  Independent quality and security gate for feature work. Use before calling a
  feature done, after implementation, before PRs, or when SAFe-style QAS/SecEng
  review is needed for a one-shot agent workflow.
---

# Feature Gate Review

Review the implemented feature as a gate owner, not as the implementer. Lead
with blockers and evidence. Do not rewrite the feature unless the user asks for
fixes; identify what must change for the gate to pass.

## Inputs

Gather:

- The feature contract or acceptance criteria.
- The git diff and changed files.
- Validation commands already run and their output summary.
- Relevant context docs. For Convex changes, confirm
  `convex/_generated/ai/guidelines.md` was read before implementation.

## Findings First

Report findings before summary. Use severity labels:

- P0: security/data loss/production-breaking blocker.
- P1: required behavior broken or high-risk regression.
- P2: meaningful bug, missing validation, or maintainability risk.
- P3: polish, documentation, or minor follow-up.

Each finding needs a file and line when possible, the failing behavior, and the
minimal fix direction.

## Quality Gate

Check:

- Acceptance criteria map to implemented behavior.
- The first vertical slice reaches observable user value.
- Tests or validation prove behavior through public interfaces where practical.
- UI states cover loading, empty, error, and success when relevant.
- Convex queries/mutations use indexes, validators, auth, and generated APIs
  according to the local Convex guidelines.
- No broad refactor is mixed into the feature without a clear reason.
- Final evidence lists commands run and any skipped checks.

## Security Gate

Check:

- No secrets, tokens, or production env values were committed.
- Authenticated and unauthorized paths are explicit.
- User-controlled data is validated before writes.
- Backend functions do not trust client-provided ownership or role claims.
- Public dev exposure is not introduced. Keep Vite local-only unless explicitly
  requested.
- New dependencies, remote calls, file uploads, or webhooks have bounded risk.

## Outcome

Use one of:

- PASS: No blocking findings and validation evidence is sufficient.
- PASS WITH RISKS: No blocker, but named residual risks remain.
- BLOCKED: One or more P0/P1 findings or missing required validation.

If no issues are found, say so plainly and name any test gaps or residual risk.
