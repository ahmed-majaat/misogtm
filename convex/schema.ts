import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v, Infer } from "convex/values";

export const gtmHealthValidator = v.union(
  v.literal("on_track"),
  v.literal("at_risk"),
  v.literal("off_track"),
);
export type GtmHealth = Infer<typeof gtmHealthValidator>;

export const gtmStageValidator = v.union(
  v.literal("idea"),
  v.literal("planning"),
  v.literal("preparation"),
  v.literal("launching"),
  v.literal("launched"),
  v.literal("archived"),
);
export type GtmStage = Infer<typeof gtmStageValidator>;

export const businessRoleValidator = v.union(
  v.literal("product"),
  v.literal("operations"),
  v.literal("marketing"),
  v.literal("sales"),
  v.literal("training"),
);
export type BusinessRole = Infer<typeof businessRoleValidator>;

export const rolloutModeValidator = v.union(
  v.literal("all_at_once"),
  v.literal("progressive"),
  v.literal("pilot"),
  v.literal("internal_only"),
);
export type RolloutMode = Infer<typeof rolloutModeValidator>;

export const deliverableStatusValidator = v.union(
  v.literal("todo"),
  v.literal("in_progress"),
  v.literal("in_review"),
  v.literal("done"),
);
export type DeliverableStatus = Infer<typeof deliverableStatusValidator>;

export const taskStatusValidator = v.union(
  v.literal("todo"),
  v.literal("in_progress"),
  v.literal("blocked"),
  v.literal("done"),
);
export type TaskStatus = Infer<typeof taskStatusValidator>;

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),
  initiatives: defineTable({
    name: v.string(),
    initiativeType: v.string(),
    targetAudience: v.string(),
    gtmHealth: gtmHealthValidator,
    gtmStage: gtmStageValidator,
    rolloutMode: rolloutModeValidator,
    gtmOwnerName: v.string(),
    gtmOwnerId: v.optional(v.id("users")),
    productionDate: v.optional(v.number()),
    gtmStartDate: v.number(),
    gtmEndDate: v.optional(v.number()),
    goal: v.optional(v.string()),
    createdBy: v.id("users"),
  })
    .index("gtmHealth", ["gtmHealth"])
    .index("gtmStage", ["gtmStage"])
    .index("createdBy", ["createdBy"])
    .index("gtmOwnerId", ["gtmOwnerId"])
    .index("gtmStartDate", ["gtmStartDate"]),
  businessChannels: defineTable({
    name: v.string(),
    businessRole: businessRoleValidator,
    createdBy: v.id("users"),
  })
    .index("businessRole", ["businessRole"])
    .index("createdBy", ["createdBy"]),
  initiativeBusinessOwners: defineTable({
    initiativeId: v.id("initiatives"),
    businessRole: businessRoleValidator,
    ownerName: v.string(),
    ownerId: v.optional(v.id("users")),
  })
    .index("initiativeId", ["initiativeId"])
    .index("businessRole", ["businessRole"]),
  deliverables: defineTable({
    initiativeId: v.id("initiatives"),
    title: v.string(),
    status: deliverableStatusValidator,
    businessRole: businessRoleValidator,
    responsibleName: v.string(),
    responsibleId: v.optional(v.id("users")),
    approverName: v.optional(v.string()),
    channelIds: v.array(v.id("businessChannels")),
    dueDate: v.optional(v.number()),
  })
    .index("initiativeId", ["initiativeId"])
    .index("status", ["status"])
    .index("businessRole", ["businessRole"])
    .index("responsibleId", ["responsibleId"]),
  gtmTasks: defineTable({
    initiativeId: v.id("initiatives"),
    deliverableId: v.optional(v.id("deliverables")),
    title: v.string(),
    status: taskStatusValidator,
    businessRole: v.optional(businessRoleValidator),
    ownerName: v.optional(v.string()),
    ownerId: v.optional(v.id("users")),
  })
    .index("initiativeId", ["initiativeId"])
    .index("deliverableId", ["deliverableId"])
    .index("status", ["status"]),
  decisions: defineTable({
    initiativeId: v.id("initiatives"),
    title: v.string(),
    summary: v.string(),
    ownerId: v.optional(v.id("users")),
    decidedAt: v.number(),
  })
    .index("initiativeId", ["initiativeId"])
    .index("decidedAt", ["decidedAt"]),
  activities: defineTable({
    initiativeId: v.id("initiatives"),
    actorId: v.optional(v.id("users")),
    action: v.string(),
    createdAt: v.number(),
  })
    .index("initiativeId", ["initiativeId"])
    .index("createdAt", ["createdAt"]),
});

export default schema;
