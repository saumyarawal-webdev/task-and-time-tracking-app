import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// 1. Ensure the environment variable is loaded
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in environment variables");
}

// 2. Create a serverless SQL connection using Neon's HTTP driver
const sql = neon(process.env.DATABASE_URL);

// 3. Initialize Drizzle ORM and pass in our entire enterprise schema
// This gives us complete end-to-end type safety anywhere we import 'db'
export const db = drizzle(sql, { schema });
