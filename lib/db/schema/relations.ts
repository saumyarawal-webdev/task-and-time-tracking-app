import { relations } from "drizzle-orm";
import { users } from "./users";
import { tasks } from "./tasks";
import { timeLogs } from "./timeLogs";

// We tell Drizzle that one User can have many Tasks and many Time Logs.
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  timeLogs: many(timeLogs),
}));

// We tell Drizzle that one Task belongs to exactly one User, but can have many Time Logs.
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  timeLogs: many(timeLogs),
}));

// We tell Drizzle that one Time Log belongs to exactly one User and exactly one Task.
export const timeLogsRelations = relations(timeLogs, ({ one }) => ({
  user: one(users, {
    fields: [timeLogs.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [timeLogs.taskId],
    references: [tasks.id],
  }),
}));
