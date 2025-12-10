import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.string(),
  }),

  tasks: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    status: v.union(
      v.literal("TODO"),
      v.literal("IN_PROGRESS"),
      v.literal("DONE")
    ),
  }).index("by_projectId", ["projectId"]),

  messages: defineTable({
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("model")),
    text: v.string(),
    isError: v.optional(v.boolean()),
  }).index("by_projectId", ["projectId"]),
});


