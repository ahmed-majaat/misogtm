import { mutation, query, type MutationCtx } from "@cvx/_generated/server";
import { type Doc, type Id } from "@cvx/_generated/dataModel";
import { auth } from "@cvx/auth";
import {
  BusinessRole,
  GtmHealth,
  GtmStage,
  RolloutMode,
  businessRoleValidator,
  deliverableStatusValidator,
  gtmHealthValidator,
  gtmStageValidator,
  rolloutModeValidator,
  taskStatusValidator,
} from "@cvx/schema";
import { v } from "convex/values";

type DemoInitiative = {
  name: string;
  initiativeType: string;
  targetAudience: string;
  gtmHealth: GtmHealth;
  gtmStage: GtmStage;
  rolloutMode: RolloutMode;
  gtmOwnerName: string;
  productionDate?: number;
  gtmStartDate: number;
  gtmEndDate?: number;
  goal: string;
  businessRoles: BusinessRole[];
  channelNames: string[];
  deliverablesDone: number;
  deliverablesTotal: number;
};

const demoInitiatives: DemoInitiative[] = [
  {
    name: "Fonctionnalité paiement automatique",
    initiativeType: "Product Launch",
    targetAudience: "Mid-Market",
    gtmHealth: "on_track",
    gtmStage: "preparation",
    rolloutMode: "progressive",
    gtmOwnerName: "Sarah Chen",
    productionDate: Date.UTC(2026, 4, 28),
    gtmStartDate: Date.UTC(2026, 5, 4),
    gtmEndDate: Date.UTC(2026, 6, 1),
    goal: "Enable customers to adopt automatic payments safely.",
    businessRoles: ["product", "marketing", "training", "sales"],
    channelNames: ["Release notes", "LinkedIn", "Formation client", "Sales enablement"],
    deliverablesDone: 7,
    deliverablesTotal: 10,
  },
  {
    name: "Analytics 2.0",
    initiativeType: "Product Update",
    targetAudience: "Enterprise",
    gtmHealth: "on_track",
    gtmStage: "launching",
    rolloutMode: "all_at_once",
    gtmOwnerName: "David Lee",
    productionDate: Date.UTC(2026, 5, 4),
    gtmStartDate: Date.UTC(2026, 5, 4),
    goal: "Increase adoption of advanced reporting.",
    businessRoles: ["product", "marketing", "sales"],
    channelNames: ["Docs produit", "Infolettre", "Deck commercial"],
    deliverablesDone: 6,
    deliverablesTotal: 9,
  },
  {
    name: "Refonte tarification",
    initiativeType: "Positioning",
    targetAudience: "All Segments",
    gtmHealth: "at_risk",
    gtmStage: "planning",
    rolloutMode: "progressive",
    gtmOwnerName: "Maya Patel",
    productionDate: Date.UTC(2026, 5, 11),
    gtmStartDate: Date.UTC(2026, 5, 18),
    goal: "Clarify packaging before the next sales cycle.",
    businessRoles: ["marketing", "sales", "operations"],
    channelNames: ["Page web", "Sales enablement", "FAQ opérations"],
    deliverablesDone: 3,
    deliverablesTotal: 8,
  },
  {
    name: "Expansion EMEA",
    initiativeType: "Market Expansion",
    targetAudience: "EMEA",
    gtmHealth: "off_track",
    gtmStage: "preparation",
    rolloutMode: "pilot",
    gtmOwnerName: "Lukas Meyer",
    productionDate: Date.UTC(2026, 5, 18),
    gtmStartDate: Date.UTC(2026, 6, 2),
    goal: "Localize the core narrative for priority regions.",
    businessRoles: ["marketing", "sales", "operations"],
    channelNames: ["Landing page", "Outbound", "Support readiness"],
    deliverablesDone: 2,
    deliverablesTotal: 9,
  },
  {
    name: "Mise à jour formation onboarding",
    initiativeType: "GTM Program",
    targetAudience: "New Customers",
    gtmHealth: "on_track",
    gtmStage: "preparation",
    rolloutMode: "internal_only",
    gtmOwnerName: "Anne Morgan",
    gtmStartDate: Date.UTC(2026, 5, 20),
    goal: "Update onboarding material for customer-facing teams.",
    businessRoles: ["training", "sales"],
    channelNames: ["Formation client", "Guide d'onboarding"],
    deliverablesDone: 4,
    deliverablesTotal: 5,
  },
];

export const listInitiatives = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const initiatives = await ctx.db
      .query("initiatives")
      .withIndex("createdBy", (q) => q.eq("createdBy", userId))
      .collect();

    return await Promise.all(
      initiatives.map(async (initiative) => {
        const [businessOwners, deliverables, tasks, decisions, activities] = await Promise.all([
          ctx.db
            .query("initiativeBusinessOwners")
            .withIndex("initiativeId", (q) => q.eq("initiativeId", initiative._id))
            .collect(),
          ctx.db
            .query("deliverables")
            .withIndex("initiativeId", (q) => q.eq("initiativeId", initiative._id))
            .collect(),
          ctx.db
            .query("gtmTasks")
            .withIndex("initiativeId", (q) => q.eq("initiativeId", initiative._id))
            .collect(),
          ctx.db
            .query("decisions")
            .withIndex("initiativeId", (q) => q.eq("initiativeId", initiative._id))
            .collect(),
          ctx.db
            .query("activities")
            .withIndex("initiativeId", (q) => q.eq("initiativeId", initiative._id))
            .collect(),
        ]);

        const channelIds = Array.from(
          new Set(deliverables.flatMap((deliverable) => deliverable.channelIds ?? [])),
        );
        const channels = (
          await Promise.all(channelIds.map((channelId) => ctx.db.get(channelId)))
        ).filter((channel) => channel !== null);

        return toInitiativeReadModel({
          initiative,
          businessOwners,
          deliverables,
          tasks,
          decisions,
          activities,
          channels,
        });
      }),
    );
  },
});

export const createInitiative = mutation({
  args: {
    name: v.string(),
    initiativeType: v.string(),
    targetAudience: v.string(),
    gtmHealth: gtmHealthValidator,
    gtmStage: gtmStageValidator,
    rolloutMode: rolloutModeValidator,
    gtmOwnerName: v.string(),
    productionDate: v.optional(v.number()),
    gtmStartDate: v.number(),
    gtmEndDate: v.optional(v.number()),
    goal: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("initiatives", {
      ...args,
      createdBy: userId,
    });
  },
});

export const addBusinessOwner = mutation({
  args: {
    initiativeId: v.id("initiatives"),
    businessRole: businessRoleValidator,
    ownerName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("initiativeBusinessOwners", args);
  },
});

export const listBusinessChannels = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("businessChannels")
      .withIndex("createdBy", (q) => q.eq("createdBy", userId))
      .collect();
  },
});

export const createBusinessChannel = mutation({
  args: {
    name: v.string(),
    businessRole: businessRoleValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("businessChannels", {
      ...args,
      createdBy: userId,
    });
  },
});

export const createDeliverable = mutation({
  args: {
    initiativeId: v.id("initiatives"),
    title: v.string(),
    status: deliverableStatusValidator,
    businessRole: businessRoleValidator,
    responsibleName: v.string(),
    approverName: v.optional(v.string()),
    channelIds: v.array(v.id("businessChannels")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await assertOwnsInitiative(ctx, args.initiativeId, userId);
    await assertChannelsBelongToUser(ctx, args.channelIds, userId);

    return await ctx.db.insert("deliverables", args);
  },
});

export const updateDeliverableStatus = mutation({
  args: {
    deliverableId: v.id("deliverables"),
    status: deliverableStatusValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const deliverable = await ctx.db.get(args.deliverableId);
    if (!deliverable) {
      throw new Error("Deliverable not found");
    }
    await assertOwnsInitiative(ctx, deliverable.initiativeId, userId);

    await ctx.db.patch(args.deliverableId, { status: args.status });
  },
});

export const createTask = mutation({
  args: {
    initiativeId: v.id("initiatives"),
    deliverableId: v.optional(v.id("deliverables")),
    title: v.string(),
    status: taskStatusValidator,
    businessRole: v.optional(businessRoleValidator),
    ownerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await assertOwnsInitiative(ctx, args.initiativeId, userId);
    if (args.deliverableId) {
      const deliverable = await ctx.db.get(args.deliverableId);
      if (!deliverable || deliverable.initiativeId !== args.initiativeId) {
        throw new Error("Deliverable must belong to the initiative");
      }
    }

    const taskId = await ctx.db.insert("gtmTasks", args);
    if (args.status === "blocked") {
      await ctx.db.insert("activities", {
        initiativeId: args.initiativeId,
        action: `Signal d'alerte cree pour la tache bloquee: ${args.title}`,
        createdAt: Date.now(),
      });
    }

    return taskId;
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("gtmTasks"),
    status: taskStatusValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    await assertOwnsInitiative(ctx, task.initiativeId, userId);

    await ctx.db.patch(args.taskId, { status: args.status });
    if (args.status === "blocked") {
      await ctx.db.insert("activities", {
        initiativeId: task.initiativeId,
        action: `Signal d'alerte cree pour la tache bloquee: ${task.title}`,
        createdAt: Date.now(),
      });
    }
  },
});

export const recordDecision = mutation({
  args: {
    initiativeId: v.id("initiatives"),
    title: v.string(),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await assertOwnsInitiative(ctx, args.initiativeId, userId);

    return await ctx.db.insert("decisions", {
      ...args,
      ownerId: userId,
      decidedAt: Date.now(),
    });
  },
});

export const seedDemoInitiatives = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("initiatives")
      .withIndex("createdBy", (q) => q.eq("createdBy", userId))
      .first();

    if (existing) {
      return { inserted: 0 };
    }

    for (const initiative of demoInitiatives) {
      const initiativeId = await ctx.db.insert("initiatives", {
        name: initiative.name,
        initiativeType: initiative.initiativeType,
        targetAudience: initiative.targetAudience,
        gtmHealth: initiative.gtmHealth,
        gtmStage: initiative.gtmStage,
        rolloutMode: initiative.rolloutMode,
        gtmOwnerName: initiative.gtmOwnerName,
        productionDate: initiative.productionDate,
        gtmStartDate: initiative.gtmStartDate,
        gtmEndDate: initiative.gtmEndDate,
        goal: initiative.goal,
        createdBy: userId,
      });

      for (const businessRole of initiative.businessRoles) {
        await ctx.db.insert("initiativeBusinessOwners", {
          initiativeId,
          businessRole,
          ownerName: `${businessRoleLabel(businessRole)} Lead`,
        });
      }

      const channelIds = [];
      for (const channelName of initiative.channelNames) {
        channelIds.push(
          await ctx.db.insert("businessChannels", {
            name: channelName,
            businessRole: initiative.businessRoles[0],
            createdBy: userId,
          }),
        );
      }

      for (let index = 0; index < initiative.deliverablesTotal; index += 1) {
        await ctx.db.insert("deliverables", {
          initiativeId,
          title: `Livrable GTM ${index + 1}`,
          status: index < initiative.deliverablesDone ? "done" : "in_progress",
          businessRole: initiative.businessRoles[index % initiative.businessRoles.length],
          responsibleName: initiative.gtmOwnerName,
          channelIds: channelIds.slice(0, 1),
        });
      }

      await ctx.db.insert("gtmTasks", {
        initiativeId,
        title: "Valider les dependances GTM",
        status: initiative.gtmHealth === "off_track" ? "blocked" : "in_progress",
        businessRole: initiative.businessRoles[0],
        ownerName: initiative.gtmOwnerName,
      });

      await ctx.db.insert("decisions", {
        initiativeId,
        title: "Mode de deploiement",
        summary: rolloutModeLabel(initiative.rolloutMode),
        decidedAt: Date.now(),
      });

      await ctx.db.insert("activities", {
        initiativeId,
        action: "Initiative GTM de demonstration creee",
        createdAt: Date.now(),
      });
    }

    return { inserted: demoInitiatives.length };
  },
});

function businessRoleLabel(role: BusinessRole) {
  const labels: Record<BusinessRole, "Produit" | "Operations" | "Marketing" | "Ventes" | "Formation"> = {
    product: "Produit",
    operations: "Operations",
    marketing: "Marketing",
    sales: "Ventes",
    training: "Formation",
  };
  return labels[role];
}

function rolloutModeLabel(mode: RolloutMode) {
  const labels: Record<RolloutMode, string> = {
    all_at_once: "Tout d'un coup",
    progressive: "Progressif",
    pilot: "Pilote",
    internal_only: "Interne seulement",
  };
  return labels[mode];
}

type InitiativeReadModelInput = {
  initiative: Doc<"initiatives">;
  businessOwners: Array<Doc<"initiativeBusinessOwners">>;
  deliverables: Array<Doc<"deliverables">>;
  tasks: Array<Doc<"gtmTasks">>;
  decisions: Array<Doc<"decisions">>;
  activities: Array<Doc<"activities">>;
  channels: Array<Doc<"businessChannels">>;
};

function toInitiativeReadModel({
  initiative,
  businessOwners,
  deliverables,
  tasks,
  decisions,
  activities,
  channels,
}: InitiativeReadModelInput) {
  return omitUndefinedProperties({
    name: initiative.name,
    initiativeType: initiative.initiativeType,
    targetAudience: initiative.targetAudience,
    health: healthLabel(initiative.gtmHealth),
    stage: stageLabel(initiative.gtmStage),
    rolloutMode: rolloutModeLabel(initiative.rolloutMode),
    businessChannels: channels.map((channel) => channel.name),
    businessOwners: businessOwners.map((owner) => ({
      businessRole: businessRoleLabel(owner.businessRole),
      owner: owner.ownerName,
    })),
    deliverables: deliverables.map((deliverable) =>
      omitUndefinedProperties({
        title: deliverable.title,
        status: deliverableStatusLabel(deliverable.status),
        businessRole: businessRoleLabel(deliverable.businessRole),
        responsible: deliverable.responsibleName,
        approver: deliverable.approverName,
        channels: channels
          .filter((channel) => (deliverable.channelIds ?? []).includes(channel._id))
          .map((channel) => channel.name),
        dueDate: formatDate(deliverable.dueDate),
      }),
    ),
    tasks: tasks.map((task) => {
      const deliverable = task.deliverableId
        ? deliverables.find((item) => item._id === task.deliverableId)
        : undefined;

      return omitUndefinedProperties({
        title: task.title,
        status: taskStatusLabel(task.status),
        businessRole: task.businessRole ? businessRoleLabel(task.businessRole) : undefined,
        owner: task.ownerName,
        deliverableTitle: deliverable?.title,
      });
    }),
    decisions: [...decisions]
      .sort((a, b) => b.decidedAt - a.decidedAt)
      .map((decision) => ({
        title: decision.title,
        summary: decision.summary,
        decidedAt: formatDate(decision.decidedAt) ?? "Date inconnue",
      })),
    activities: [...activities]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((activity) => ({
        action: activity.action,
        actor: "Miso GTM",
        createdAt: formatDate(activity.createdAt) ?? "Date inconnue",
      })),
    gtmOwner: initiative.gtmOwnerName,
    productionDate: formatDate(initiative.productionDate),
    gtmStartDate: formatDate(initiative.gtmStartDate) ?? "Non definie",
    gtmEndDate: formatDate(initiative.gtmEndDate),
    goal: initiative.goal ?? "Objectif GTM a definir.",
    archived: initiative.gtmStage === "archived",
  });
}

function healthLabel(value: GtmHealth) {
  const labels: Record<GtmHealth, "On Track" | "At Risk" | "Off Track"> = {
    on_track: "On Track",
    at_risk: "At Risk",
    off_track: "Off Track",
  };
  return labels[value];
}

function stageLabel(value: GtmStage) {
  const labels: Record<GtmStage, string> = {
    idea: "Idee",
    planning: "Planification",
    preparation: "Preparation",
    launching: "En lancement",
    launched: "Lance",
    archived: "Archive",
  };
  return labels[value];
}

function deliverableStatusLabel(value: Doc<"deliverables">["status"]) {
  const labels: Record<Doc<"deliverables">["status"], "A faire" | "En cours" | "En validation" | "Termine"> = {
    todo: "A faire",
    in_progress: "En cours",
    in_review: "En validation",
    done: "Termine",
  };
  return labels[value];
}

function taskStatusLabel(value: Doc<"gtmTasks">["status"]) {
  const labels: Record<Doc<"gtmTasks">["status"], "A faire" | "En cours" | "Bloquee" | "Terminee"> = {
    todo: "A faire",
    in_progress: "En cours",
    blocked: "Bloquee",
    done: "Terminee",
  };
  return labels[value];
}

function formatDate(value?: number) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

function omitUndefinedProperties<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, propertyValue]) => propertyValue !== undefined),
  ) as {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K];
  } & Partial<T>;
}

async function assertOwnsInitiative(
  ctx: MutationCtx,
  initiativeId: Id<"initiatives">,
  userId: string,
) {
  const initiative = await ctx.db.get(initiativeId);
  if (!initiative || initiative.createdBy !== userId) {
    throw new Error("Initiative not found");
  }
}

async function assertChannelsBelongToUser(
  ctx: MutationCtx,
  channelIds: Array<Id<"businessChannels">>,
  userId: string,
) {
  const channels = await Promise.all(channelIds.map((channelId) => ctx.db.get(channelId)));
  if (channels.some((channel) => !channel || channel.createdBy !== userId)) {
    throw new Error("Channel not found");
  }
}
