# Miso GTM Convex Modules

This directory contains the backend modules for the GTM workspace.

- `schema.ts` defines the GTM data model.
- `gtm.ts` exposes initiative, livrable GTM, tache GTM, canal metier, decision, and activity functions.
- `auth.ts`, `http.ts`, and `otp/` keep the account adapter available.
- `_generated/` is Convex-generated support code.

Billing, plans, subscriptions, and Stripe webhooks are intentionally absent from the active backend. They are out of scope for the current Miso GTM build.
