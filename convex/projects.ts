import { mutation, query } from "@cvx/_generated/server";
import { auth } from "@cvx/auth";
import { projectStatusValidator } from "@cvx/schema";
import { v } from "convex/values";

export const listProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("createdBy", (q) => q.eq("createdBy", userId))
      .collect();

    return projects.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }

    const project = await ctx.db.get(args.projectId);
    if (!project || project.createdBy !== userId) {
      return null;
    }

    return project;
  },
});

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    status: projectStatusValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();

    return await ctx.db.insert("projects", {
      ...args,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    });
  },
});

export const updateProjectStatus = mutation({
  args: {
    projectId: v.id("projects"),
    status: projectStatusValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project || project.createdBy !== userId) {
      throw new Error("Project not found");
    }

    await ctx.db.patch(args.projectId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});
