import type { GtmMatrixInitiative } from "@/gtm-matrix";

export const demoInitiatives: GtmMatrixInitiative[] = [
  {
    name: "Fonctionnalite paiement automatique",
    initiativeType: "Product Launch",
    targetAudience: "Mid-Market",
    health: "On Track",
    stage: "Preparation",
    rolloutMode: "Progressif",
    gtmOwner: "Sarah Chen",
    productionDate: "May 28, 2026",
    gtmStartDate: "Jun 4, 2026",
    gtmEndDate: "Jul 1, 2026",
    goal: "Enable customers to adopt automatic payments safely.",
    businessChannels: ["Release notes", "LinkedIn", "Formation client", "Sales enablement"],
    businessOwners: [
      { businessRole: "Produit", owner: "Nora Product" },
      { businessRole: "Marketing", owner: "Mila Marketing" },
      { businessRole: "Ventes", owner: "Victor Sales" },
      { businessRole: "Formation", owner: "Felix Training" },
    ],
    deliverables: [
      deliverable("Narratif lancement", "Termine", "Marketing", "Sarah Chen", ["LinkedIn"], "Maya Patel"),
      deliverable("Release notes", "Termine", "Produit", "Nora Product", ["Release notes"]),
      deliverable("Deck commercial", "Termine", "Ventes", "Victor Sales", ["Sales enablement"], "Sarah Chen"),
      deliverable("FAQ support", "Termine", "Operations", "Olivia Ops", [], "Nora Product"),
      deliverable("Formation client", "Termine", "Formation", "Felix Training", ["Formation client"]),
      deliverable("Guide objections", "Termine", "Ventes", "Victor Sales", ["Sales enablement"]),
      deliverable("Plan email clients", "Termine", "Marketing", "Mila Marketing", ["LinkedIn"]),
      deliverable("Tableau adoption", "En cours", "Produit", "Nora Product", []),
      deliverable("Script CSM", "En validation", "Operations", "Olivia Ops", []),
      deliverable("Page aide", "A faire", "Formation", "Felix Training", ["Formation client"]),
    ],
    tasks: [
      task("Confirmer wording legal", "Terminee", "Produit", "Nora Product", "Release notes"),
      task("Verifier ciblage CRM", "En cours", "Marketing", "Mila Marketing", "Plan email clients"),
      task("Reviser sequence enablement", "A faire", "Ventes", "Victor Sales", "Deck commercial"),
    ],
    decisions: [
      decision("Positionnement", "Message principal valide: controler les paiements sans friction.", "May 24, 2026"),
      decision("Deploiement", "Activation progressive par cohortes clients.", "May 27, 2026"),
    ],
    activities: [
      activity("Sarah Chen", "Sante GTM confirmee On Track", "Jun 1, 2026"),
      activity("Mila Marketing", "Plan email clients passe en cours", "Jun 2, 2026"),
    ],
  },
  {
    name: "Analytics 2.0",
    initiativeType: "Product Update",
    targetAudience: "Enterprise",
    health: "On Track",
    stage: "En lancement",
    rolloutMode: "Tout d'un coup",
    gtmOwner: "David Lee",
    productionDate: "Jun 4, 2026",
    gtmStartDate: "Jun 4, 2026",
    goal: "Increase adoption of advanced reporting.",
    businessChannels: ["Docs produit", "Infolettre", "Deck commercial"],
    businessOwners: [
      { businessRole: "Produit", owner: "David Lee" },
      { businessRole: "Marketing", owner: "Maya Patel" },
      { businessRole: "Ventes", owner: "Victor Sales" },
    ],
    deliverables: [
      deliverable("Docs produit", "Termine", "Produit", "David Lee", ["Docs produit"]),
      deliverable("Narratif analytics", "Termine", "Marketing", "Maya Patel", ["Infolettre"]),
      deliverable("Deck commercial", "Termine", "Ventes", "Victor Sales", ["Deck commercial"]),
      deliverable("Demo script", "Termine", "Ventes", "Victor Sales", ["Deck commercial"]),
      deliverable("Guide admin", "Termine", "Produit", "David Lee", ["Docs produit"]),
      deliverable("Email annonce", "Termine", "Marketing", "Maya Patel", ["Infolettre"]),
      deliverable("FAQ reporting", "En cours", "Produit", "David Lee", ["Docs produit"]),
      deliverable("Battlecard", "En validation", "Ventes", "Victor Sales", ["Deck commercial"]),
      deliverable("Post lancement", "A faire", "Marketing", "Maya Patel", ["Infolettre"]),
    ],
    tasks: [
      task("Synchroniser captures produit", "Terminee", "Produit", "David Lee", "Docs produit"),
      task("Valider liste clients beta", "En cours", "Ventes", "Victor Sales"),
    ],
    decisions: [
      decision("Audience", "Lancement concentre sur les comptes Enterprise actifs.", "Jun 1, 2026"),
      decision("Canaux", "Docs produit et deck commercial prioritaires.", "Jun 2, 2026"),
    ],
    activities: [
      activity("David Lee", "FAQ reporting creee", "Jun 4, 2026"),
      activity("Victor Sales", "Battlecard envoyee en validation", "Jun 5, 2026"),
    ],
  },
  {
    name: "Refonte tarification",
    initiativeType: "Positioning",
    targetAudience: "All Segments",
    health: "At Risk",
    stage: "Planification",
    rolloutMode: "Progressif",
    gtmOwner: "Maya Patel",
    productionDate: "Jun 11, 2026",
    gtmStartDate: "Jun 18, 2026",
    goal: "Clarify packaging before the next sales cycle.",
    businessChannels: ["Page web", "Sales enablement", "FAQ operations"],
    businessOwners: [
      { businessRole: "Marketing", owner: "Maya Patel" },
      { businessRole: "Ventes", owner: "Victor Sales" },
      { businessRole: "Operations", owner: "Olivia Ops" },
    ],
    deliverables: [
      deliverable("Message pricing", "Termine", "Marketing", "Maya Patel", ["Page web"]),
      deliverable("FAQ operations", "Termine", "Operations", "Olivia Ops", ["FAQ operations"]),
      deliverable("Deck commercial", "Termine", "Ventes", "Victor Sales", ["Sales enablement"]),
      deliverable("Page web", "En cours", "Marketing", "Maya Patel", ["Page web"]),
      deliverable("Script migration", "En validation", "Operations", "Olivia Ops", ["FAQ operations"]),
      deliverable("Guide objections", "A faire", "Ventes", "Victor Sales", ["Sales enablement"]),
      deliverable("Annonce client", "A faire", "Marketing", "Maya Patel", ["Page web"]),
      deliverable("Plan formation interne", "A faire", "Formation", "Felix Training", []),
    ],
    tasks: [
      task("Confirmer grille de prix", "Bloquee", "Operations", "Olivia Ops", "Script migration"),
      task("Aligner promesses site", "En cours", "Marketing", "Maya Patel", "Page web"),
      task("Preparer objections discount", "A faire", "Ventes", "Victor Sales", "Guide objections"),
    ],
    decisions: [
      decision("Sante GTM", "At Risk maintenu par Maya, malgre une seule tache bloquee.", "Jun 8, 2026"),
      decision("Scope", "Pas de workflow d'approbation formel pour cette phase.", "Jun 9, 2026"),
    ],
    activities: [
      activity("Olivia Ops", "Tache grille de prix marquee bloquee", "Jun 10, 2026"),
      activity("Maya Patel", "Page web passee en cours", "Jun 10, 2026"),
    ],
  },
  {
    name: "Expansion EMEA",
    initiativeType: "Market Expansion",
    targetAudience: "EMEA",
    health: "Off Track",
    stage: "Preparation",
    rolloutMode: "Pilote",
    gtmOwner: "Lukas Meyer",
    productionDate: "Jun 18, 2026",
    gtmStartDate: "Jul 2, 2026",
    goal: "Localize the core narrative for priority regions.",
    businessChannels: ["Landing page", "Outbound", "Support readiness"],
    businessOwners: [
      { businessRole: "Marketing", owner: "Lukas Meyer" },
      { businessRole: "Ventes", owner: "Victor Sales" },
      { businessRole: "Operations", owner: "Olivia Ops" },
    ],
    deliverables: [
      deliverable("Landing page", "Termine", "Marketing", "Lukas Meyer", ["Landing page"]),
      deliverable("Sequence outbound", "Termine", "Ventes", "Victor Sales", ["Outbound"]),
      deliverable("Support readiness", "En cours", "Operations", "Olivia Ops", ["Support readiness"]),
      deliverable("Traduction message", "En cours", "Marketing", "Lukas Meyer", ["Landing page"]),
      deliverable("Liste comptes pilotes", "A faire", "Ventes", "Victor Sales", ["Outbound"]),
      deliverable("FAQ locale", "A faire", "Operations", "Olivia Ops", ["Support readiness"]),
      deliverable("Pack formation", "A faire", "Formation", "Felix Training", []),
      deliverable("Cadence pilote", "A faire", "Operations", "Olivia Ops", []),
      deliverable("Rapport learnings", "A faire", "Marketing", "Lukas Meyer", []),
    ],
    tasks: [
      task("Obtenir validation juridique", "Bloquee", "Operations", "Olivia Ops", "FAQ locale"),
      task("Verifier traduction allemande", "Bloquee", "Marketing", "Lukas Meyer", "Traduction message"),
      task("Nettoyer comptes pilotes", "En cours", "Ventes", "Victor Sales", "Liste comptes pilotes"),
    ],
    decisions: [
      decision("Pilote", "Limiter le deploiement aux trois pays prioritaires.", "Jun 7, 2026"),
      decision("Sante GTM", "Off Track car deux dependances bloquent la readiness.", "Jun 9, 2026"),
    ],
    activities: [
      activity("Olivia Ops", "Validation juridique bloquee", "Jun 10, 2026"),
      activity("Lukas Meyer", "Traduction allemande bloquee", "Jun 10, 2026"),
    ],
  },
  {
    name: "Mise a jour formation onboarding",
    initiativeType: "GTM Program",
    targetAudience: "New Customers",
    health: "On Track",
    stage: "Preparation",
    rolloutMode: "Interne seulement",
    gtmOwner: "Anne Morgan",
    gtmStartDate: "Jun 20, 2026",
    goal: "Update onboarding material for customer-facing teams.",
    businessChannels: ["Formation client", "Guide d'onboarding"],
    businessOwners: [
      { businessRole: "Formation", owner: "Anne Morgan" },
      { businessRole: "Ventes", owner: "Victor Sales" },
    ],
    deliverables: [
      deliverable("Formation client", "Termine", "Formation", "Anne Morgan", ["Formation client"]),
      deliverable("Guide d'onboarding", "Termine", "Formation", "Anne Morgan", ["Guide d'onboarding"]),
      deliverable("Checklist CSM", "Termine", "Ventes", "Victor Sales", []),
      deliverable("Video interne", "Termine", "Formation", "Anne Morgan", ["Formation client"]),
      deliverable("Quiz readiness", "En cours", "Formation", "Anne Morgan", []),
    ],
    tasks: [
      task("Importer captures ecran", "Terminee", "Formation", "Anne Morgan", "Video interne"),
      task("Relire quiz readiness", "En cours", "Ventes", "Victor Sales", "Quiz readiness"),
    ],
    decisions: [
      decision("Mode", "Interne seulement pour cette phase.", "Jun 3, 2026"),
      decision("Approbateur", "Approbateur visible en contexte, sans bloquer la completion.", "Jun 4, 2026"),
    ],
    activities: [
      activity("Anne Morgan", "Video interne terminee", "Jun 6, 2026"),
      activity("Victor Sales", "Quiz readiness en cours", "Jun 7, 2026"),
    ],
  },
];

function deliverable(
  title: string,
  status: GtmMatrixInitiative["deliverables"][number]["status"],
  businessRole: GtmMatrixInitiative["deliverables"][number]["businessRole"],
  responsible: string,
  channels: string[],
  approver?: string,
) {
  return { title, status, businessRole, responsible, channels, approver };
}

function task(
  title: string,
  status: GtmMatrixInitiative["tasks"][number]["status"],
  businessRole: GtmMatrixInitiative["tasks"][number]["businessRole"],
  owner: string,
  deliverableTitle?: string,
) {
  return { title, status, businessRole, owner, deliverableTitle };
}

function decision(title: string, summary: string, decidedAt: string) {
  return { title, summary, decidedAt };
}

function activity(actor: string, action: string, createdAt: string) {
  return { actor, action, createdAt };
}
