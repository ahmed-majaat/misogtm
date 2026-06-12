# Miso GTM

Miso GTM is a go-to-market operating system for product initiatives.

The current build is centered on the Matrice GTM: initiatives, livrables GTM, taches GTM, canaux metiers, decisions, activities, responsibilities, dates, and GTM health.

## Project Shape

This directory is the project root. The parent folder is only a container.

Key source areas:

- `src/gtm-matrix.tsx` - the current GTM workspace surface.
- `src/demo-data.ts` - local demo initiatives used when Convex has no data.
- `convex/gtm.ts` - Convex queries and mutations for GTM data.
- `convex/schema.ts` - canonical GTM tables and validators.
- `CONTEXT.md` - product language glossary.
- `docs/prd/miso-gtm-multi-screen-prd.md` - current product requirements.

## Commands

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
```

When `VITE_CONVEX_URL` is missing, the app runs in demo mode. When Convex is configured, the same Matrice GTM surface reads from `api.gtm.listInitiatives` and can seed demo initiatives.

## Current Direction

The next cleanup target is to deepen the GTM workspace module: keep one small interface for the workspace, and move screen state, labels, selectors, table rows, and local mutations behind that interface.
