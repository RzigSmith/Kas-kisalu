import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Exemple de définition de tables avec drizzle
// À adapter selon votre schéma réel
import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    date_inscriptions: timestamp("date_inscriptions", { withTimezone: false }),
    role: text("role"),
    password: text("password").notNull(),
  },
  { schema: "kaskisalu" }
);

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    sector: text("sector").notNull(),
    description: text("description").notNull(),
    photos: jsonb("photos").default([]),
  },
  { schema: "kaskisalu" }
);