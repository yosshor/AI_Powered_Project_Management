import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { name, description }) => {
    const id = await ctx.db.insert("projects", { name, description });
    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);

    // Cascade delete tasks that belong to this project
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_projectId", (q) => q.eq("projectId", id))
      .collect();

    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }
  },
});

