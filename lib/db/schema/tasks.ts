import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Defining a PostgreSQL Enum ensures the database strictly accepts only these three values.
export const statusEnum = pgEnum("status", [
  "pending",
  "in_progress",
  "completed",
]);

// We define the tasks table with AI tracking and user isolation.
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),

  // This foreign key strictly links a task to an owner.
  // onDelete: 'cascade' means if a user is deleted, all their tasks get deleted cleanly.
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Nullable field to store exactly what the user typed before AI processing.
  rawInput: text("raw_input"),

  // The final title (manual or AI generated).
  title: text("title").notNull(),

  // Nullable detailed breakdown.
  description: text("description"),

  // Default status is 'pending' when a new task is created.
  status: statusEnum("status").default("pending").notNull(),

  // A boolean flag to help Suntek.ai reviewers clearly see where AI was utilized.
  isAiGenerated: boolean("is_ai_generated").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
