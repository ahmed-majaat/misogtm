import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "~/convex/_generated/api";
import type { Doc } from "~/convex/_generated/dataModel";
import siteConfig from "~/site.config";
import { demoInitiatives } from "@/demo-data";
import {
  GtmMatrix,
  type BusinessRole,
  type GtmMatrixInitiative,
} from "@/gtm-matrix";

export const Route = createFileRoute("/")({
  component: MisoWorkspace,
  beforeLoad: () => ({
    title: `${siteConfig.siteTitle} - Matrice GTM`,
  }),
});

function MisoWorkspace() {
  const { data: initiatives } = useQuery(convexQuery(api.gtm.listInitiatives, {}));
  const { mutate: seedDemo, isPending: isSeeding } = useMutation({
    mutationFn: useConvexMutation(api.gtm.seedDemoInitiatives),
  });

  const mapped = (initiatives as ConvexInitiative[] | undefined)?.map(mapInitiative) ?? [];
  const displayInitiatives = mapped.length > 0 ? mapped : demoInitiatives;

  return (
    <GtmMatrix
      initiatives={displayInitiatives}
      showSeedButton={mapped.length === 0}
      isSeeding={isSeeding}
      onSeedDemo={() => seedDemo({})}
    />
  );
}

type ConvexInitiative = Doc<"initiatives"> & {
  businessChannels: Array<Doc<"businessChannels">>;
  businessOwners: Array<Doc<"initiativeBusinessOwners">>;
  deliverables: Array<Doc<"deliverables">>;
  tasks: Array<Doc<"gtmTasks">>;
  decisions: Array<Doc<"decisions">>;
  activities: Array<Doc<"activities">>;
};

function mapInitiative(initiative: ConvexInitiative): GtmMatrixInitiative {
  return {
    name: initiative.name,
    initiativeType: initiative.initiativeType,
    targetAudience: initiative.targetAudience,
    health: healthLabel(initiative.gtmHealth),
    stage: stageLabel(initiative.gtmStage),
    rolloutMode: rolloutModeLabel(initiative.rolloutMode),
    gtmOwner: initiative.gtmOwnerName,
    productionDate: formatDate(initiative.productionDate),
    gtmStartDate: formatDate(initiative.gtmStartDate) ?? "Non definie",
    gtmEndDate: formatDate(initiative.gtmEndDate),
    goal: initiative.goal ?? "Objectif GTM a definir.",
    archived: initiative.gtmStage === "archived",
    businessChannels: initiative.businessChannels.map((channel) => channel.name),
    businessOwners: initiative.businessOwners.map((owner) => ({
      businessRole: roleLabel(owner.businessRole),
      owner: owner.ownerName,
    })),
    deliverables: initiative.deliverables.map((deliverable) => ({
      title: deliverable.title,
      status: deliverableStatusLabel(deliverable.status),
      businessRole: roleLabel(deliverable.businessRole),
      responsible: deliverable.responsibleName,
      approver: deliverable.approverName,
      channels: initiative.businessChannels
        .filter((channel) => deliverable.channelIds.includes(channel._id))
        .map((channel) => channel.name),
      dueDate: formatDate(deliverable.dueDate),
    })),
    tasks: initiative.tasks.map((task) => {
      const deliverable = task.deliverableId
        ? initiative.deliverables.find((item) => item._id === task.deliverableId)
        : undefined;

      return {
        title: task.title,
        status: taskStatusLabel(task.status),
        businessRole: task.businessRole ? roleLabel(task.businessRole) : undefined,
        owner: task.ownerName,
        deliverableTitle: deliverable?.title,
      };
    }),
    decisions: initiative.decisions.map((decision) => ({
      title: decision.title,
      summary: decision.summary,
      decidedAt: formatDate(decision.decidedAt) ?? "Date inconnue",
    })),
    activities: initiative.activities.map((activity) => ({
      action: activity.action,
      actor: "Miso GTM",
      createdAt: formatDate(activity.createdAt) ?? "Date inconnue",
    })),
  };
}

function healthLabel(value: "on_track" | "at_risk" | "off_track") {
  const labels = {
    on_track: "On Track",
    at_risk: "At Risk",
    off_track: "Off Track",
  } as const;
  return labels[value];
}

function stageLabel(value: "idea" | "planning" | "preparation" | "launching" | "launched" | "archived") {
  const labels = {
    idea: "Idee",
    planning: "Planification",
    preparation: "Preparation",
    launching: "En lancement",
    launched: "Lance",
    archived: "Archive",
  };
  return labels[value];
}

function rolloutModeLabel(value: "all_at_once" | "progressive" | "pilot" | "internal_only") {
  const labels = {
    all_at_once: "Tout d'un coup",
    progressive: "Progressif",
    pilot: "Pilote",
    internal_only: "Interne seulement",
  };
  return labels[value];
}

function roleLabel(value: "product" | "operations" | "marketing" | "sales" | "training"): BusinessRole {
  const labels = {
    product: "Produit",
    operations: "Operations",
    marketing: "Marketing",
    sales: "Ventes",
    training: "Formation",
  } as const;
  return labels[value];
}

function deliverableStatusLabel(value: "todo" | "in_progress" | "in_review" | "done") {
  const labels = {
    todo: "A faire",
    in_progress: "En cours",
    in_review: "En validation",
    done: "Termine",
  } as const;
  return labels[value];
}

function taskStatusLabel(value: "todo" | "in_progress" | "blocked" | "done") {
  const labels = {
    todo: "A faire",
    in_progress: "En cours",
    blocked: "Bloquee",
    done: "Terminee",
  } as const;
  return labels[value];
}

function formatDate(value?: number) {
  if (!value) {
    return undefined;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}
