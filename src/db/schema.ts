import { sql } from "drizzle-orm";
import {
  integer,
  text,
  jsonb,
  pgTable,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const Users = pgTable("Users", {
  KindeID: text("KindeID").primaryKey(),
  Username: text("Username").notNull(),
  Email: text("Email").notNull().unique(),
  Credits: integer("Credits").notNull(),
  SlackAccessToken: text("SlackAccessToken"),
  AsanaRefreshToken: text("AsanaRefreshToken"),
  GitHubAccessToken: text("GitHubAccessToken"),
  Workflows: text("Workflows")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
});

export const Workflows = pgTable("Workflows", {
  WorkflowName: text("WorkflowName").primaryKey(),
  PublicName: text("PublicName"),
  GitHubNode: jsonb("GitHubNode")
    .notNull()
    .default(sql`'{}'::jsonb`),
  Nodes: jsonb("Nodes")
    .array()
    .notNull()
    .default(sql`ARRAY[]::jsonb[]`),
  Edges: jsonb("Edges")
    .array()
    .notNull()
    .default(sql`ARRAY[]::jsonb[]`),
  Published: boolean("Published").notNull().default(false),
  Public: boolean("Public").notNull().default(false),
  HookID: text("HookID"),
});

export const Logs = pgTable("Logs", {
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .primaryKey(),
  LogMessage: text("LogMessage").notNull(),
  WorkflowName: text("WorkflowName").notNull(),
  Success: boolean("Success"),
});
