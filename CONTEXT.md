# Miso GTM

Miso GTM is a go-to-market operating system for coordinating product-related market initiatives, livrables, decisions, channels, tasks, and launch activity.

## Language

**Initiative**:
An effort go-to-market tied to a product change, campaign, launch, repositioning, or market expansion, with a responsable GTM, channels, livrables, decisions, and progress.
_Avoid_: Launch, Campaign, Project

**Type d'initiative**:
The classification of an initiative's nature, such as product launch, product update, positioning, market expansion, GTM program, or event.
_Avoid_: Kind, Category, Campaign Type

**Audience cible**:
The priority group an initiative is meant to reach, such as mid-market customers, enterprise accounts, developers, a region, or partners.
_Avoid_: Segment, Market Segment, Persona

**Canal métier**:
A configurable distribution or activation point attached to exactly one métier, such as LinkedIn for Marketing, sales enablement for Ventes, training webinar for Formation, or release notes for Produit.
_Avoid_: Medium, Platform, Asset, Global Channel

**Livrable GTM**:
A tangible output produced to support an initiative, such as a document, presentation, video, LinkedIn post, page, email, guide, sales support, or updated training material. A livrable GTM can have zero, one, or many canaux métier.
_Avoid_: Content, Task, Activity

**Responsable de livrable**:
The person accountable for producing or delivering a specific livrable GTM, regardless of which team they belong to. This can be different from the responsable métier for the same business area.
_Avoid_: Owner, Assignee, Responsable métier

**Approbateur**:
A person identified as an approver for a livrable GTM or initiative. At first, this role is informational and does not control validation or completion workflow.
_Avoid_: Validator, Reviewer, Sign-off Owner

**Statut de livrable**:
The completion state of a livrable GTM. Initial values are À faire, En cours, En validation, and Terminé. En validation means the livrable is ready for review, approval, or verification, without requiring a formal approval workflow at first. The responsable de livrable can mark a livrable as Terminé.
_Avoid_: Publication Status, Task Status

**Tâche GTM**:
Work to be performed to produce, validate, publish, or otherwise advance a livrable GTM or initiative.
_Avoid_: Deliverable, Activity, Decision

**Statut de tâche**:
The working state of a tâche GTM. Initial values are À faire, En cours, Bloquée, and Terminée.
_Avoid_: Deliverable Status, Health

**Tâche liée à un livrable**:
A tâche GTM associated with producing, validating, or publishing a specific livrable GTM.
_Avoid_: Subtask, Deliverable

**Tâche d'initiative**:
A tâche GTM associated directly with an initiative rather than a specific livrable GTM.
_Avoid_: General Task, Project Task

**Asset**:
A file or resource attached to support a livrable GTM or initiative, such as an image, video file, PDF, screenshot, logo, or one-pager.
_Avoid_: Deliverable, Message, Channel

**Décision**:
A recorded choice that affects an initiative's direction, timing, message, pricing, channel, or scope.
_Avoid_: Note, Comment, Update

**Activité**:
A timestamped operational event that records what happened on an initiative without necessarily representing a decision.
_Avoid_: Decision, Task, Action Item

**Responsable GTM**:
The single person accountable for the overall go-to-market execution of an initiative.
_Avoid_: Owner, Assignee, Team

**Responsable métier**:
A person accountable for a specific business area involved in an initiative, such as product, operations, marketing, sales, or training. An initiative only needs responsables métier for the métiers involved.
_Avoid_: Functional Owner, Contributor, Stakeholder

**Rôle métier**:
The business area represented by a responsable métier. The initial roles are Produit, Opérations, Marketing, Ventes, and Formation.
_Avoid_: Function, Department, Team

**Métier impliqué**:
A métier involved in an initiative because it has an assigned responsable métier, a canal métier in use, a livrable GTM, or a tâche GTM.
_Avoid_: Selected Department, Participating Team

**Santé GTM**:
The health signal that indicates whether an initiative is progressing as expected. Initial values are On Track, At Risk, and Off Track.
_Avoid_: Status, Stage, Progress, Risk

**Modification de la Santé GTM**:
The act of changing an initiative's Santé GTM. At first, only the Responsable GTM can make this change.
_Avoid_: Automatic Health Update, Team Health Update

**Signal d'alerte**:
A visible warning that something may affect an initiative without automatically changing its Santé GTM.
_Avoid_: Automatic Status, Risk

**Étape GTM**:
The lifecycle step that indicates where an initiative is in its go-to-market cycle. The initial static list is Idée, Planification, Préparation, En lancement, Lancé, and Archivé. The list may evolve at the product level, but users cannot customize it at first.
_Avoid_: Status, Health, Risk

**Date de mise en production**:
The date when the product or IT team makes the capability available in production, regardless of whether it is visible or activated for the target audience.
_Avoid_: Launch Date, GTM Date, Release Date

**Date de début GTM**:
The date when go-to-market activation starts for an audience cible, including a first customer, first segment, first communication, sales enablement, campaign, or progressive rollout.
_Avoid_: Launch Date, Due Date, Release Date

**Date de fin GTM**:
The date when an initiative leaves project-mode GTM execution and moves into normal operations, adoption tracking, support, or optimization.
_Avoid_: Deadline, Done Date, Close Date

**Mode de déploiement**:
The way an initiative is exposed to its audience cible. Initial values are Tout d'un coup, Progressif, Pilote, and Interne seulement.
_Avoid_: Rollout Date, Launch Type, Deployment Date

**Progression GTM**:
The calculated completion percentage of an initiative based on completed livrables GTM, not completed tasks.
_Avoid_: Manual Progress, Status, Health
