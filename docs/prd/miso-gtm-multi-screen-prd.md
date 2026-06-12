# Miso GTM Multi-Screen Product Requirements

## Problem Statement

Go-to-market work around product initiatives is currently fragmented across documents, task trackers, calendars, and informal follow-ups. Teams need one operating system to understand what is being brought to market, who is accountable, which métiers are involved, what tangible livrables are expected, where tasks are blocked, and whether the initiative is healthy.

The current prototype proves the Launch Matrix direction, but Miso GTM now needs multiple product screens that reflect the agreed domain language and support the real workflow around initiatives, livrables, tasks, canaux métier, decisions, activities, and GTM configuration.

## Solution

Build Miso GTM as a multi-screen SaaS workspace centered on the Matrice GTM. The Matrice GTM remains the primary command surface, while supporting screens let users manage initiative details, livrables, tasks, canaux métier, decisions, activities, and GTM settings.

The product uses the domain glossary as the source of language. Core concepts include Initiative, Responsable GTM, Responsable métier, Livrable GTM, Responsable de livrable, Approbateur, Tâche GTM, Canal métier, Santé GTM, Étape GTM, Date de mise en production, Date de début GTM, Date de fin GTM, Mode de déploiement, Signal d’alerte, Décision, and Activité.

## User Stories

1. As a Responsable GTM, I want to see all initiatives in a Matrice GTM, so that I can understand the overall state of go-to-market execution.
2. As a Responsable GTM, I want to filter initiatives by Santé GTM, so that I can focus on initiatives that are At Risk or Off Track.
3. As a Responsable GTM, I want to search initiatives by name, audience cible, responsable, canal métier, or livrable, so that I can find the work I need quickly.
4. As a Responsable GTM, I want to see each initiative’s Étape GTM, so that I know where it sits in the GTM lifecycle.
5. As a Responsable GTM, I want to see Date de mise en production, Date de début GTM, and Date de fin GTM separately, so that I can distinguish product readiness from market activation.
6. As a Responsable GTM, I want to see the Mode de déploiement, so that I understand whether the initiative is all-at-once, progressive, pilot, or internal-only.
7. As a Responsable GTM, I want to see Progression GTM calculated from completed livrables, so that progress is grounded in tangible outputs.
8. As a Responsable GTM, I want to change the Santé GTM of an initiative, so that the global health reflects my accountable judgment.
9. As a Responsable GTM, I want blocked tasks to create a Signal d’alerte without automatically changing Santé GTM, so that I can judge whether the issue affects the initiative globally.
10. As a Responsable GTM, I want to assign Responsables métiers only for métiers involved in an initiative, so that the initiative stays lightweight.
11. As a Responsable GTM, I want to see which métiers are involved in an initiative, so that I understand the cross-functional footprint.
12. As a Responsable GTM, I want to open an initiative detail screen, so that I can manage all GTM context for one initiative.
13. As a Responsable GTM, I want to create an initiative with type, audience cible, dates, stage, health, rollout mode, and owner, so that the initiative starts with the right structure.
14. As a Responsable GTM, I want to archive an initiative, so that completed or inactive work leaves the active matrix.
15. As a Responsable métier, I want to see all initiatives where my métier is involved, so that I can focus on my area of responsibility.
16. As a Responsable métier, I want to see livrables and tasks tied to my métier, so that I can coordinate work inside my function.
17. As a Responsable métier, I want canaux métier grouped by métier, so that each team can plan distribution in its own language.
18. As a Responsable métier, I want to know whether my métier has a responsable assigned for an initiative, so that accountability is explicit.
19. As a Responsable de livrable, I want to see all livrables assigned to me, so that I can deliver my tangible outputs.
20. As a Responsable de livrable, I want to update a livrable status from À faire to En cours, En validation, or Terminé, so that its state is visible.
21. As a Responsable de livrable, I want to mark a livrable as Terminé, so that it contributes to Progression GTM.
22. As a Responsable de livrable, I want to associate a livrable with zero, one, or many canaux métier, so that internal and external outputs are represented correctly.
23. As a Responsable de livrable, I want to add an Approbateur as informational context, so that reviewers are visible without enforcing a formal workflow.
24. As a contributor, I want to create a Tâche GTM under an initiative, so that operational work not tied to a specific livrable is tracked.
25. As a contributor, I want to create a Tâche liée à un livrable, so that the work needed to produce a livrable is visible.
26. As a contributor, I want to mark a task as À faire, En cours, Bloquée, or Terminée, so that the team understands the working state.
27. As a contributor, I want a blocked task to create a visible Signal d’alerte, so that the Responsable GTM can react.
28. As a contributor, I want task completion not to inflate Progression GTM, so that progress remains based on tangible livrables.
29. As a team member, I want to record a Décision, so that important choices around timing, scope, message, pricing, or channels are preserved.
30. As a team member, I want to see Activités for an initiative, so that I can understand what changed recently.
31. As a team member, I want Décisions to be distinct from Activités, so that formal choices do not get buried in operational history.
32. As an administrator, I want to configure canaux métier per métier, so that each function uses its real activation points.
33. As an administrator, I want Étapes GTM to remain product-defined at first, so that the workflow stays consistent across the product.
34. As an administrator, I want the initial métiers to include Produit, Opérations, Marketing, Ventes, and Formation, so that common GTM teams are represented.
35. As an administrator, I want a Canal métier to belong to exactly one métier, so that responsibility and reporting remain clear.
36. As a new user, I want the app to work in demo mode without Convex configured, so that I can inspect the product experience quickly.
37. As a product builder, I want the demo mode and authenticated dashboard to share the same UI surface, so that design iteration does not diverge.

## Implementation Decisions

- Build the product around these screens: Matrice GTM, Détail Initiative, Livrables, Tâches, Canaux métiers, Décisions & Activités, and Paramètres GTM.
- Keep Matrice GTM as the first authenticated dashboard surface and as the local demo surface when Convex is not configured.
- Use the domain glossary vocabulary in UI labels and backend model names where practical.
- Replace generic fields such as status, risk, owner, date, content, and channel with Santé GTM, Responsable GTM, dates GTM, Livrables GTM, and Canaux métier.
- Keep Santé GTM separate from Étape GTM.
- Keep Risk out of the canonical model at first. A blocked task creates a Signal d’alerte instead of an automatic health update.
- Model three dates separately: Date de mise en production, Date de début GTM, and Date de fin GTM.
- Model Mode de déploiement as a product-defined enum with initial values Tout d’un coup, Progressif, Pilote, and Interne seulement.
- Keep Étapes GTM product-defined at first, not user-configurable.
- Model canaux métier as configurable by workspace and attached to exactly one métier.
- Keep the initial métiers as Produit, Opérations, Marketing, Ventes, and Formation.
- Model Responsable GTM as a single accountable person for the initiative.
- Model Responsables métiers as optional per métier involved in an initiative.
- Infer Métier impliqué from assigned responsables métiers, canaux métier, livrables, or tâches.
- Model Responsable de livrable separately from Responsable métier.
- Allow Responsable de livrable to be different from Responsable métier.
- Model Approbateur as informational at first; it does not control validation or completion.
- Model Livrable GTM as the broad tangible output concept. Do not use Contenu as the primary canonical concept.
- Model Tâche GTM separately from Livrable GTM. A task may be attached directly to an initiative or to a livrable.
- Calculate Progression GTM from completed livrables, not tasks.
- Use Convex queries and mutations for initiative listing, creation, demo seeding, livrables, tasks, business owners, and canaux métier.
- Reuse a shared matrix component between demo mode and authenticated mode to reduce UI drift.

## Testing Decisions

- Tests should focus on externally visible behavior and domain outcomes, not component internals.
- The highest-value seam is the Convex API layer because it protects the domain model and multi-screen behavior.
- Test that creating an initiative stores the correct GTM fields: type, audience cible, Santé GTM, Étape GTM, dates GTM, Mode de déploiement, and Responsable GTM.
- Test that Progression GTM is calculated from completed livrables and ignores completed tasks.
- Test that blocked tasks create a Signal d’alerte but do not automatically change Santé GTM.
- Test that canaux métier are scoped to one métier.
- Test that a livrable can have zero, one, or many canaux métier.
- Test that a Responsable de livrable can be different from a Responsable métier.
- Test that Approbateur is informational and does not block completion.
- Test Matrice GTM at the UI seam: search, filter by Santé GTM, select initiative, and inspect details.
- Test Détail Initiative at the route/screen seam once the screen exists: dates, responsibilities, livrables, tasks, decisions, activities.
- Test Livrables screen behavior: create, edit status, assign responsable de livrable, attach canaux métier.
- Test Tâches screen behavior: create initiative-level and livrable-level tasks, update status, display blocked alerts.
- Test Paramètres GTM behavior: configure canaux métier by métier and verify Étapes GTM are not user-configurable.
- Existing prior art: the current shared GtmMatrix component and Convex `gtm` functions provide the first seam for matrix rendering and domain data.

## Out of Scope

- User-configurable Étapes GTM.
- Formal approval workflow for Approbateur.
- Automatic Santé GTM changes based on blocked tasks.
- Full notification system.
- Asset file upload and storage beyond the domain placeholder.
- Billing changes.
- Advanced reporting and analytics.
- Role-based permissions beyond the initial domain ownership rules.
- Import/export workflows.
- Integrations with external tools such as Jira, Linear, HubSpot, Salesforce, Slack, or Google Drive.

## Further Notes

- The existing prototype already includes the first Matrice GTM surface and a Convex-backed schema direction.
- The next implementation phase should prioritize one full vertical slice: create an initiative, add livrables, compute Progression GTM, and render it in Matrice GTM and Détail Initiative.
- The issue tracker is not configured in this workspace, so this PRD is stored in the project documentation and should be published to the selected tracker with the `ready-for-agent` label once available.
