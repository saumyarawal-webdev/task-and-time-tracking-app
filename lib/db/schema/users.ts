import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

// We define the users table to handle authentication and isolate data.
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(), // Auto-generates a secure, unique ID
  email: text("email").notNull().unique(), // Indexed automatically because it's unique
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
