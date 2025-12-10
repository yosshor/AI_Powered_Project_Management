import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, { projectId }) => {
    if (!projectId) return [];

    return await ctx.db
      .query("tasks")
      .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
      .collect();
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    status: v.optional(
      v.union(
        v.literal("TODO"),
        v.literal("IN_PROGRESS"),
        v.literal("DONE")
      )
    ),
  },
  handler: async (ctx, { projectId, title, status }) => {
    return await ctx.db.insert("tasks", {
      projectId,
      title,
      status: status ?? "TODO",
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("TODO"),
      v.literal("IN_PROGRESS"),
      v.literal("DONE")
    ),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

