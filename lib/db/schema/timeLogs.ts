import {
  pgTable,
  uuid,
  timestamp,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";
import { tasks } from "./tasks";

// We define the time_logs table to handle real-time tracking sessions.
export const timeLogs = pgTable(
  "time_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Links the time log to the user for data isolation.
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Links the time log to the specific task.
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),

    // Records exactly when the user clicked 'Start'.
    startTime: timestamp("start_time", { withTimezone: true })
      .defaultNow()
      .notNull(),

    // Nullable. If this is null, it means the timer is currently running.
    endTime: timestamp("end_time", { withTimezone: true }),

    // Calculated and stored when the timer stops.
    durationSeconds: integer("duration_seconds").default(0).notNull(),
  },
  (table) => {
    return {
      // A unique index that only applies when endTime is NULL.
      // This strictly prevents a user from having more than one active timer at a time.
      activeTimerIndex: uniqueIndex("active_timer_idx")
        .on(table.userId)
        .where(sql`${table.endTime} IS NULL`),
    };
  },
);
