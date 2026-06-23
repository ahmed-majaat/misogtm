# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repo root. Read each context relevant to the topic.
- **`CONTEXT.md`** at the repo root for product-wide domain language.
- **`docs/adr/`** for system-wide decisions, when present.
- **Context-scoped docs** under frontend and Convex folders, when present.

If any of these files don't exist, proceed silently. Don't flag their absence; don't suggest creating them upfront. Producer skills create them lazily when terms or decisions get resolved.

## File structure

This repo is treated as multi-context:

```text
/
|-- CONTEXT-MAP.md
|-- CONTEXT.md
|-- docs/adr/
|-- src/
|   `-- docs/adr/
`-- convex/
    `-- docs/adr/
```

## Use the glossary's vocabulary

When output names a domain concept, use the term as defined in the relevant context. Don't drift to synonyms the glossary explicitly avoids.

If the concept needed is not in the glossary yet, either reconsider the language or note the gap for a documentation-producing skill.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007, but worth reopening because..._
