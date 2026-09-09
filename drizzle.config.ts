import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// This loads your .env.local file so the Drizzle CLI can read the DATABASE_URL
config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
