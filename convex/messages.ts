import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, { projectId }) => {
    if (!projectId) return [];

    return await ctx.db
      .query("messages")
      .withIndex("by_projectId", (q) => q.eq("projectId", projectId))
      .collect();
  },
});

export const send = mutation({
  args: {
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("model")),
    text: v.string(),
    isError: v.optional(v.boolean()),
  },
  handler: async (ctx, { projectId, role, text, isError }) => {
    return await ctx.db.insert("messages", { projectId, role, text, isError });
  },
});

