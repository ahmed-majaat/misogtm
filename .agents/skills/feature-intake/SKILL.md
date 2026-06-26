---
name: feature-intake
description:
  Compact feature intake and spec creation for this repo. Use when a feature
  request needs sharpening into acceptance criteria, vertical slices,
  assumptions, domain language, validation evidence, or a build-ready contract.
---

# Feature Intake

Turn a rough request into a build-ready feature contract. Keep the process
small enough for oneshot implementation while preserving the decisions an agent
needs to avoid building the wrong thing.

## Intake Rules

- Read `CONTEXT-MAP.md` and `CONTEXT.md` before naming domain concepts.
- Use the repo's GTM vocabulary exactly: Initiative, Livrable GTM, Tache GTM,
  Canal metier, Decision, Activite, Sante GTM, and related terms.
- Read relevant PRDs under `docs/prd/` when the feature touches product
  behavior already described there.
- For Convex work, read `convex/_generated/ai/guidelines.md` before proposing
  implementation details.
- Ask at most three questions, and only when the answer blocks a safe build.
  Otherwise write assumptions and proceed.

## Contract Template

```markdown
## Goal
One paragraph describing the outcome.

## User-visible behavior
- As a [user], I can [action] so that [benefit].

## In scope
- The smallest vertical slice that proves the behavior.

## Out of scope
- Explicitly excluded adjacent ideas.

## Assumptions
- Decisions made because the user did not need to be interrupted.

## Acceptance criteria
- [ ] User can [action] -> [result].
- [ ] When [condition], system [response].
- [ ] Invalid or empty states show [feedback].

## Surfaces touched
- Frontend:
- Convex:
- Env/config:
- Docs:

## Validation plan
- Targeted:
- Repo-level:
- Manual demo:

## Gate risks
- Quality:
- Security:
- Data:
```

## Vertical Slice Planning

Prefer one tracer bullet first:

1. Identify the observable behavior.
2. Find the existing UI, route, Convex function, or data model seam closest to
   that behavior.
3. Add or adapt the smallest test/validation path that proves the behavior.
4. Implement only enough to make that path work.
5. Repeat for remaining criteria.

Do not plan by technical layers alone, such as "schema first, then all backend,
then all UI." Keep each slice tied to a user-visible result.

## Acceptance Criteria Quality

Good criteria are testable and specific:

- User can create an Initiative with required fields and sees it immediately in
  the Matrice GTM.
- A Livrable GTM without a responsable de livrable shows a visible warning
  without changing Sante GTM.
- An unauthenticated visitor is redirected away from the project workspace.

Weak criteria need tightening:

- "Make it better."
- "Improve the dashboard."
- "Add backend support."

## Output

Return the feature contract and a short implementation order. Do not create a
large PRD unless the user explicitly asks for one.
